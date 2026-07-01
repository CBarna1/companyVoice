import { Response } from 'express';
import { Comment, Post, User, Setting } from '../models';
import { AuthRequest } from '../middleware/auth';
import { CommentInput } from '../validators/schemas';
import { awardXP, XPRewards } from '../services/xpService';

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = await Comment.findAll({
      where: { post_id: Number(id) },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const settings = await Setting.findOne({ where: { key: 'anonymity_enabled' } });
    const anonymityEnabled = settings?.value === 'true';

    const formattedComments = comments.map((comment: any) => ({
      id: comment.id,
      author:
        comment.is_anonymous && anonymityEnabled
          ? null
          : comment.is_anonymous && !anonymityEnabled && req.user?.role !== 'admin'
            ? 'Anonymous'
            : comment.user?.name,
      body: comment.body,
      created_at: comment.created_at,
    }));

    res.json(formattedComments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { body, is_anonymous } = req.body as CommentInput;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const settings = await Setting.findOne({ where: { key: 'anonymity_enabled' } });
    const anonymityEnabled = settings?.value === 'true';

    const finalIsAnonymous = anonymityEnabled && is_anonymous;

    const comment = await Comment.create({
      post_id: Number(id),
      user_id: finalIsAnonymous ? null : req.user?.id || null,
      body,
      is_anonymous: finalIsAnonymous,
    });

    // Award XP to commenter if authenticated
    if (req.user) {
      await awardXP(req.user.id, XPRewards.COMMENT, 'Comment posted');
    }

    res.status(201).json({
      id: comment.id,
      author: finalIsAnonymous ? 'Anonymous' : req.user?.id,
      body,
      created_at: comment.created_at,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};
