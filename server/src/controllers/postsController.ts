import { Response } from 'express';
import { Post, PostTag, User, Comment, Vote, Setting, SolutionLink } from '../models';
import { AuthRequest } from '../middleware/auth';
import { PostInput, StatusUpdateInput } from '../validators/schemas';
import { awardXP, getXPForPostType, XPRewards } from '../services/xpService';
import { Op } from 'sequelize';

export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { type, department, status, tag, page = 1, limit = 20 } = req.query;
    const offset = ((Number(page) || 1) - 1) * (Number(limit) || 20);

    const whereClause: any = {};
    if (type && type !== 'all') whereClause.type = type;
    if (department) whereClause.department = department;
    if (status) whereClause.status = status;

    let posts = await Post.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'tier'],
        },
        {
          model: PostTag,
          as: 'tags',
          attributes: ['tag'],
        },
      ],
      order: [['created_at', 'DESC']],
      offset,
      limit: Number(limit),
    });

    // Filter by tag if provided
    if (tag) {
      posts.rows = posts.rows.filter((post) =>
        (post.tags || []).some((t: any) => t.tag === tag)
      );
      posts.count = posts.rows.length;
    }

    // Mask anonymous posts
    const settings = await Setting.findOne({ where: { key: 'anonymity_enabled' } });
    const anonymityEnabled = settings?.value === 'true';

    const formattedPosts = posts.rows.map((post: any) => ({
      id: post.id,
      author: post.is_anonymous && !anonymityEnabled && req.user?.role !== 'admin'
        ? { name: 'Anonymous', tier: null }
        : post.user,
      type: post.type,
      title: post.title,
      body: post.body,
      department: post.department,
      status: post.status,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      xp_awarded: post.xp_awarded,
      tags: (post.tags || []).map((t: any) => t.tag),
      created_at: post.created_at,
    }));

    res.json({
      data: formattedPosts,
      total: posts.count,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const getPost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'tier'],
        },
        {
          model: PostTag,
          attributes: ['tag'],
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'body', 'is_anonymous', 'created_at'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Mask anonymous posts
    const settings = await Setting.findOne({ where: { key: 'anonymity_enabled' } });
    const anonymityEnabled = settings?.value === 'true';

    const formattedPost = {
      id: post.id,
      author: post.is_anonymous && anonymityEnabled
        ? null
        : post.is_anonymous && !anonymityEnabled && req.user?.role !== 'admin'
          ? { name: 'Anonymous', tier: null }
          : post.user,
      type: post.type,
      title: post.title,
      body: post.body,
      department: post.department,
      status: post.status,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      xp_awarded: post.xp_awarded,
      tags: (post.tags || []).map((t: any) => t.tag),
      comments: (post.comments || []).map((c: any) => ({
        id: c.id,
        author: c.is_anonymous ? 'Anonymous' : c.user?.name,
        body: c.body,
        created_at: c.created_at,
      })),
      created_at: post.created_at,
    };

    res.json(formattedPost);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { type, title, body, department, tags, is_anonymous, solution_links } =
      req.body as PostInput;

    const settings = await Setting.findOne({ where: { key: 'anonymity_enabled' } });
    const anonymityEnabled = settings?.value === 'true';

    // If anonymity is globally disabled, set is_anonymous to false
    const finalIsAnonymous = anonymityEnabled && is_anonymous;

    const post = await Post.create({
      user_id: finalIsAnonymous ? null : req.user.id,
      type,
      title,
      body,
      department,
      is_anonymous: finalIsAnonymous,
      status: 'open',
      xp_awarded: getXPForPostType(type),
    });

    // Add tags
    if (tags && tags.length > 0) {
      await Promise.all(tags.map((tag) => PostTag.create({ post_id: post.id, tag })));
    }

    // Add solution links
    if (solution_links && solution_links.length > 0) {
      await Promise.all(
        solution_links.map((challengeId) =>
          SolutionLink.create({
            challenge_post_id: challengeId,
            solution_post_id: post.id,
          })
        )
      );
    }

    // Award XP to user
    await awardXP(req.user.id, getXPForPostType(type), `Post created (${type})`);

    res.status(201).json({
      id: post.id,
      type,
      title,
      body,
      department,
      xp_awarded: post.xp_awarded,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const updatePostStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { status } = req.body as StatusUpdateInput;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await post.update({ status });

    // Award bonus XP if solution is marked as resolved
    if (status === 'resolved' && post.user_id) {
      await awardXP(post.user_id, XPRewards.RESOLVED_SOLUTION, 'Solution marked as resolved');
      await post.update({ xp_awarded: post.xp_awarded + XPRewards.RESOLVED_SOLUTION });
    }

    res.json({ message: 'Post status updated', status });
  } catch (error) {
    console.error('Update post status error:', error);
    res.status(500).json({ error: 'Failed to update post status' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await PostTag.destroy({ where: { post_id: id } });
    await Vote.destroy({ where: { post_id: id } });
    await Comment.destroy({ where: { post_id: id } });
    await SolutionLink.destroy({
      where: {
        [Op.or]: [{ challenge_post_id: id }, { solution_post_id: id }],
      },
    });
    await post.destroy();

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
