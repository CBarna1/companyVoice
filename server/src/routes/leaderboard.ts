import { Router } from 'express';
import { optionalAuthMiddleware } from '../middleware/auth';
import * as leaderboardController from '../controllers/leaderboardController';

const router = Router();

router.get('/contributors', optionalAuthMiddleware, leaderboardController.getTopContributors);
router.get('/solvers', optionalAuthMiddleware, leaderboardController.getTopSolvers);

export default router;
