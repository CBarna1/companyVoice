import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';
import { validateRequest } from '../validators';
import { postSchema, statusUpdateSchema } from '../validators/schemas';
import * as postsController from '../controllers/postsController';

const router = Router();

router.get('/', optionalAuthMiddleware, postsController.getPosts);
router.post('/', authMiddleware, validateRequest(postSchema), postsController.createPost);
router.get('/:id', optionalAuthMiddleware, postsController.getPost);
router.patch('/:id/status', authMiddleware, validateRequest(statusUpdateSchema), postsController.updatePostStatus);
router.delete('/:id', authMiddleware, postsController.deletePost);

export default router;
