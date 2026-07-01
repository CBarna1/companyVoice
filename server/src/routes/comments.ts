import { Router } from 'express';
import { optionalAuthMiddleware } from '../middleware/auth';
import { validateRequest } from '../validators';
import { commentSchema } from '../validators/schemas';
import * as commentsController from '../controllers/commentsController';

const router = Router();

router.get('/:id/comments', optionalAuthMiddleware, commentsController.getComments);
router.post('/:id/comments', validateRequest(commentSchema), commentsController.addComment);

export default router;
