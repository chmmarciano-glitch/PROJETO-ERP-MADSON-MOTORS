import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * POST /api/auth/login
 * Fazer login com email e senha
 * Body: { email, password }
 * Response: { access_token, user }
 */
router.post('/login', (req: Request, res: Response) => {
  AuthController.login(req, res);
});

/**
 * POST /api/auth/register
 * Registrar novo usuário
 * Body: { email, password, full_name, role? }
 * Response: { user }
 */
router.post('/register', (req: Request, res: Response) => {
  AuthController.register(req, res);
});

/**
 * GET /api/auth/me
 * Obter dados do usuário autenticado
 * Header: Authorization: Bearer token
 * Response: { user }
 */
router.get('/me', authMiddleware, (req: Request, res: Response) => {
  AuthController.getMe(req, res);
});

/**
 * POST /api/auth/logout
 * Fazer logout
 * Header: Authorization: Bearer token
 * Response: { message }
 */
router.post('/logout', authMiddleware, (req: Request, res: Response) => {
  AuthController.logout(req, res);
});

export default router;
