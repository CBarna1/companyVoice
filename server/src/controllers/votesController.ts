import { Response } from 'express';
import { Vote, Post } from '../models';
import { AuthRequest } from '../middleware/auth';
import { VoteInput } from '../validators/schemas';
import { awardXP, XPRewards } from '../services/xpService';

export const votePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { direction } = req.body as VoteInput;

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      where: { user_id: req.user.id, post_id: Number(id) },
    });

    if (existingVote) {
      if (existingVote.direction === direction) {
        // Remove vote if same direction
        await existingVote.destroy();

        if (direction === 'up') {
          await post.update({ upvotes: Math.max(0, post.upvotes - 1) });
        } else {
          await post.update({ downvotes: Math.max(0, post.downvotes - 1) });
        }
      } else {
        // Change vote direction
        await existingVote.update({ direction });

        if (direction === 'up') {
          await post.update({
            upvotes: post.upvotes + 1,
            downvotes: Math.max(0, post.downvotes - 1),
          });
        } else {
          await post.update({
            upvotes: Math.max(0, post.upvotes - 1),
            downvotes: post.downvotes + 1,
          });
        }
      }

      return res.json({ message: 'Vote changed', upvotes: post.upvotes, downvotes: post.downvotes });
    }

    // Create new vote
    await Vote.create({
      user_id: req.user.id,
      post_id: Number(id),
      direction,
    });

    if (direction === 'up') {
      await post.update({ upvotes: post.upvotes + 1 });

      // Award XP to post author if exists
      if (post.user_id) {
        await awardXP(post.user_id, XPRewards.RECEIVE_UPVOTE, 'Received an upvote');
      }
    } else {
      await post.update({ downvotes: post.downvotes + 1 });
    }

    res.status(201).json({ message: 'Vote recorded', upvotes: post.upvotes, downvotes: post.downvotes });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
};
