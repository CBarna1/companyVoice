import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { voteLimiter } from '../middleware/rateLimit';
import { validateRequest } from '../validators';
import { voteSchema } from '../validators/schemas';
import * as votesController from '../controllers/votesController';

const router = Router();

router.post('/:id/vote', authMiddleware, voteLimiter, validateRequest(voteSchema), votesController.votePost);

export default router;
