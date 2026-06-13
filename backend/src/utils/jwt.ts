import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { JWTPayload } from '../types';
import logger from './logger';

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  try {
    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };
    const token = jwt.sign(payload, env.JWT_SECRET, options);
    return token;
  } catch (error) {
    logger.error('Erro ao gerar token JWT:', error);
    throw error;
  }
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded as JWTPayload;
  } catch (error) {
    logger.error('Erro ao verificar token JWT:', error);
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token);
    return decoded as JWTPayload;
  } catch (error) {
    logger.error('Erro ao decodificar token JWT:', error);
    return null;
  }
}
