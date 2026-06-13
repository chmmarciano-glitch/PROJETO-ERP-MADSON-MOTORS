import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { validate, loginSchema, registerSchema } from '../utils/validators';
import { LoginInput, RegisterInput } from '../utils/validators';
import logger from '../utils/logger';

export class AuthController {
  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response) {
    try {
      // Validar entrada
      const validation = validate<LoginInput>(loginSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validação falhou',
          message: validation.error,
        });
      }

      const { email, password } = validation.data!;

      // Fazer login
      const authResponse = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        data: authResponse,
        message: 'Login realizado com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao fazer login:', error);
      res.status(401).json({
        success: false,
        error: error.message || 'Falha na autenticação',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response) {
    try {
      // Validar entrada
      const validation = validate<RegisterInput>(registerSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validação falhou',
          message: validation.error,
        });
      }

      const { email, password, full_name, role } = validation.data!;

      // Registrar usuário
      const user = await AuthService.register(email, password, full_name, role);

      res.status(201).json({
        success: true,
        data: user,
        message: 'Usuário registrado com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao registrar usuário:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Falha ao registrar',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/auth/me
   */
  static async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado',
        });
      }

      const user = await AuthService.getUserById(req.user.userId);

      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao obter dados do usuário:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao obter dados',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/auth/logout
   */
  static async logout(req: Request, res: Response) {
    try {
      logger.info(`✅ Logout realizado para user: ${req.user?.email}`);
      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao fazer logout:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao fazer logout',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
