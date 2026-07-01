import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { validateRequest } from '../validators';
import { settingsSchema } from '../validators/schemas';
import * as adminController from '../controllers/adminController';

const router = Router();

router.get('/stats', authMiddleware, adminMiddleware, adminController.getStats);
router.get('/settings', authMiddleware, adminMiddleware, adminController.getSettings);
router.patch('/settings', authMiddleware, adminMiddleware, validateRequest(settingsSchema), adminController.updateSettings);
router.get('/posts', authMiddleware, adminMiddleware, adminController.getAllPosts);
router.get('/export', authMiddleware, adminMiddleware, adminController.exportPosts);

export default router;
