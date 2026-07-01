import { Response } from 'express';
import { User, Post } from '../models';
import { AuthRequest } from '../middleware/auth';
import sequelize from '../config/database';

export const getTopContributors = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20 } = req.query;

    const topContributors = await User.findAll({
      where: { role: 'employee' },
      attributes: ['id', 'name', 'xp', 'tier'],
      order: [['xp', 'DESC']],
      limit: Number(limit),
    });

    const formattedContributors = topContributors.map((user: any, index: number) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      xp: user.xp,
      tier: user.tier,
    }));

    res.json(formattedContributors);
  } catch (error) {
    console.error('Get top contributors error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

export const getTopSolvers = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20 } = req.query;

    const topSolvers = await sequelize.query(`
      SELECT u.id, u.name, u.tier, COUNT(p.id) as resolved_solutions
      FROM users u
      LEFT JOIN posts p ON u.id = p.user_id AND p.type = 'solution' AND p.status = 'resolved'
      WHERE u.role = 'employee'
      GROUP BY u.id, u.name, u.tier
      ORDER BY resolved_solutions DESC
      LIMIT :limit
    `, {
      replacements: { limit: Number(limit) },
      type: sequelize.QueryTypes.SELECT,
    });

    const formattedSolvers = (topSolvers as any[]).map((user: any, index: number) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      tier: user.tier,
      resolved_solutions: parseInt(user.resolved_solutions) || 0,
    }));

    res.json(formattedSolvers);
  } catch (error) {
    console.error('Get top solvers error:', error);
    res.status(500).json({ error: 'Failed to fetch top solvers' });
  }
};
