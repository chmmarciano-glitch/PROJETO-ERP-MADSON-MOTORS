import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import logger from './utils/logger';
import { testSupabaseConnection } from './utils/supabase';

// Importar rotas
import authRoutes from './routes/auth.routes';
import conselhRoutes from './routes/conselho.routes';
import departamentosRoutes from './routes/departamentos.routes';
import aiRoutes from './routes/ai';

const app: Application = express();

// ==========================================
// MIDDLEWARE GLOBAL
// ==========================================

// Security
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const method = req.method;
  const path = req.path;
  const timestamp = new Date().toISOString();

  logger.info(`${timestamp} [${method}] ${path}`);
  next();
});

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '2.0.0',
  });
});

// ==========================================
// API ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/conselho', conselhRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/ai', aiRoutes);

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erro não tratado:', error);

  res.status(error.status || 500).json({
    error: error.message || 'Erro interno do servidor',
    status: error.status || 500,
  });
});

// ==========================================
// START SERVER
// ==========================================
export async function startServer() {
  try {
    // Testar conexão Supabase
    const supabaseOk = await testSupabaseConnection();
    if (!supabaseOk) {
      logger.warn('⚠️ Supabase não conectado, mas prosseguindo...');
    }

    // Iniciar servidor
    app.listen(env.PORT, () => {
      logger.info(`
        ╔══════════════════════════════════════════════════════════════╗
        ║     🚀 MADSON MOTORS ERP — BACKEND INICIADO COM SUCESSO     ║
        ║                                                              ║
        ║     Servidor: http://localhost:${env.PORT}                   ║
        ║     Ambiente: ${env.NODE_ENV}                                ║
        ║     Supabase: ${env.SUPABASE_URL}                            ║
        ║     Health: http://localhost:${env.PORT}/health             ║
        ║                                                              ║
        ║     GET  http://localhost:${env.PORT}/health               ║
        ║     POST http://localhost:${env.PORT}/api/auth/login       ║
        ║     POST http://localhost:${env.PORT}/api/ai/chat          ║
        ║     POST http://localhost:${env.PORT}/api/ai/analyze       ║
        ║     POST http://localhost:${env.PORT}/api/ai/report        ║
        ║     GET  http://localhost:${env.PORT}/api/ai/history/:id   ║
        ║     DEL  http://localhost:${env.PORT}/api/ai/history/:id   ║
        ║                                                              ║
        ╚══════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

export default app;
