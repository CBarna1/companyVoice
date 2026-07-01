import { Post, User, Vote, Comment, SolutionLink } from '../models';
import { json2csv } from 'json2csv';

interface PostRecord {
  id: number;
  author: string;
  type: string;
  title: string;
  department: string;
  status: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  xp_awarded: number;
  created_at: string;
}

export const exportPostsToCSV = async (): Promise<string> => {
  const posts = await Post.findAll({
    include: [
      {
        model: User,
        attributes: ['name', 'email'],
      },
    ],
  });

  const records: PostRecord[] = [];

  for (const post of posts) {
    const commentCount = await Comment.count({ where: { post_id: post.id } });
    const author = post.user_id ? ((post.User as any)?.name || 'N/A') : 'Anonymous';

    records.push({
      id: post.id,
      author,
      type: post.type,
      title: post.title,
      department: post.department,
      status: post.status,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      comments: commentCount,
      xp_awarded: post.xp_awarded,
      created_at: post.created_at?.toISOString() || '',
    });
  }

  try {
    const csv = json2csv({ data: records });
    return csv;
  } catch (error) {
    throw new Error('Failed to generate CSV');
  }
};

export const getAdminStats = async () => {
  const [totalPosts, totalChallenges, totalSolutions, activeUsers] = await Promise.all([
    Post.count(),
    Post.count({ where: { type: 'challenge' } }),
    Post.count({ where: { type: 'solution' } }),
    User.count({ where: { role: 'employee' } }),
  ]);

  return {
    totalPosts,
    totalChallenges,
    totalSolutions,
    activeUsers,
  };
};
