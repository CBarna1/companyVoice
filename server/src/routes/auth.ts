import { Router } from 'express';
import { authLimiter } from '../middleware/rateLimit';
import { validateRequest } from '../validators';
import { loginSchema, registerSchema } from '../validators/schemas';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), authController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
