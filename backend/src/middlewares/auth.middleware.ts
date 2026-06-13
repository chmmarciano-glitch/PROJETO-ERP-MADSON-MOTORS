import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { JWTPayload } from '../types';
import logger from '../utils/logger';

// Estender tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`🔒 Token ausente em ${req.method} ${req.path}`);
      return res.status(401).json({
        error: 'Token de autenticação não fornecido',
        code: 'NO_TOKEN',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const payload = verifyToken(token);

    if (!payload) {
      logger.warn(`🔒 Token inválido em ${req.method} ${req.path}`);
      return res.status(401).json({
        error: 'Token inválido ou expirado',
        code: 'INVALID_TOKEN',
      });
    }

    // Adicionar usuário ao request
    req.user = payload;

    logger.debug(`✅ Token verificado para user: ${payload.email}`);
    next();
  } catch (error) {
    logger.error('Erro ao verificar token:', error);
    res.status(500).json({
      error: 'Erro ao processar autenticação',
    });
  }
}

export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`🔒 Acesso negado para role ${req.user.role} em ${req.path}`);
      return res.status(403).json({
        error: 'Permissão insuficiente para acessar este recurso',
        code: 'INSUFFICIENT_PERMISSIONS',
        required_roles: allowedRoles,
        user_role: req.user.role,
      });
    }

    next();
  };
}
