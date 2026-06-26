// ============================================================
// MADSON MOTORS DO BRASIL S.A. — SISTEMA ERP
// Rotas de IA — Claude + Gemini
// Fase 4 — AI Integration
// Araras, Estado de Araras — Janeiro de 1952
// ============================================================

import { Router } from 'express';
import {
  chat,
  analyze,
  report,
  history,
  deleteHistory,
} from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas as rotas de IA requerem autenticação JWT
router.use(authenticateToken);

// ── Endpoints de IA ──────────────────────────────────────────

// POST /api/ai/chat → Chat com Claude ou Gemini
router.post('/chat', chat);

// POST /api/ai/analyze → Análise estratégica com Claude
router.post('/analyze', analyze);

// POST /api/ai/report → Geração de relatório executivo
router.post('/report', report);

// GET /api/ai/history/:sessionId → Histórico de conversa
router.get('/history/:sessionId', history);

// DELETE /api/ai/history/:sessionId → Limpar sessão
router.delete('/history/:sessionId', deleteHistory);

export default router;
