import { Response } from 'express';
import { Post, User, Setting } from '../models';
import { AuthRequest } from '../middleware/auth';
import { exportPostsToCSV, getAdminStats } from '../services/adminService';
import { SettingsInput } from '../validators/schemas';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const settings = await Setting.findAll();
    const settingsObj = Object.fromEntries(settings.map((s: any) => [s.key, s.value]));

    res.json(settingsObj);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { anonymity_enabled } = req.body as SettingsInput;

    if (anonymity_enabled !== undefined) {
      const setting = await Setting.findOne({ where: { key: 'anonymity_enabled' } });
      if (setting) {
        await setting.update({ value: String(anonymity_enabled) });
      } else {
        await Setting.create({
          key: 'anonymity_enabled',
          value: String(anonymity_enabled),
        });
      }
    }

    res.json({ message: 'Settings updated' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

export const getAllPosts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { page = 1, limit = 50 } = req.query;
    const offset = ((Number(page) || 1) - 1) * (Number(limit) || 50);

    const posts = await Post.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
      offset,
      limit: Number(limit),
    });

    const formattedPosts = posts.rows.map((post: any) => ({
      id: post.id,
      author: post.user ? `${post.user.name} (${post.user.email})` : 'Anonymous',
      type: post.type,
      title: post.title,
      department: post.department,
      status: post.status,
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      created_at: post.created_at,
    }));

    res.json({
      data: formattedPosts,
      total: posts.count,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const exportPosts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const csv = await exportPostsToCSV();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="posts-export.csv"');
    res.send(csv);
  } catch (error) {
    console.error('Export posts error:', error);
    res.status(500).json({ error: 'Failed to export posts' });
  }
};
