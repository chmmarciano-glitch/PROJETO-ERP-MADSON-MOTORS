// ============================================================
// MADSON MOTORS DO BRASIL S.A. — SISTEMA ERP
// AI Controller — Endpoints de Inteligência Artificial
// Fase 4 — AI Integration: Claude + Gemini
// Araras, Estado de Araras — Janeiro de 1952
// ============================================================

import { Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  chatWithClaude,
  chatWithGemini,
  analyzeWithClaude,
  generateReport,
  getSessionHistory,
  clearSession,
} from '../services/aiService';
import {
  AIChatRequest,
  AIAnalyzeRequest,
  AIReportRequest,
  AIProvider,
} from '../types/ai';

// ── Schemas de Validação Zod ─────────────────────────────────

const chatSchema = z.object({
  message: z
    .string()
    .min(1, 'Mensagem não pode ser vazia')
    .max(4000, 'Mensagem muito longa (máx. 4000 caracteres)'),
  provider: z.enum(['claude', 'gemini']).default('claude'),
  sessionId: z.string().uuid().optional(),
  context: z.string().max(2000).optional(),
});

const analyzeSchema = z.object({
  data: z.record(z.string(), z.unknown()),
  analysisType: z.enum(['conselho', 'departamentos', 'geral']).default('geral'),
  provider: z.enum(['claude', 'gemini']).optional(),
});

const reportSchema = z.object({
  reportType: z.enum(['executivo', 'operacional', 'financeiro']).default('executivo'),
  period: z.string().max(100).optional(),
  provider: z.enum(['claude', 'gemini']).optional(),
});

// ════════════════════════════════════════════════════════════
// POST /api/ai/chat
// Chat com Claude ou Gemini
// ════════════════════════════════════════════════════════════
export const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = chatSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        code: 'VALIDATION_ERROR',
        details: validation.error.issues,
      });
      return;
    }

    const { message, provider, sessionId, context } = validation.data;
    const resolvedSessionId = sessionId || uuidv4();

    const request: AIChatRequest = {
      message,
      provider: provider as AIProvider,
      sessionId: resolvedSessionId,
      context,
    };

    let response: string;

    if (provider === 'claude') {
      response = await chatWithClaude(request);
    } else {
      response = await chatWithGemini(request);
    }

    res.status(200).json({
      success: true,
      data: {
        messageId: uuidv4(),
        sessionId: resolvedSessionId,
        provider,
        response,
        timestamp: new Date().toISOString(),
        requestType: 'chat',
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro interno do servidor';

    console.error('[AI Controller] Erro no chat:', errorMessage);

    res.status(500).json({
      success: false,
      error: errorMessage,
      code: 'AI_CHAT_ERROR',
    });
  }
};

// ════════════════════════════════════════════════════════════
// POST /api/ai/analyze
// Análise estratégica de dados com Claude
// ════════════════════════════════════════════════════════════
export const analyze = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = analyzeSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Dados inválidos para análise',
        code: 'VALIDATION_ERROR',
        details: validation.error.issues,
      });
      return;
    }

    const { data, analysisType } = validation.data;

    const request: AIAnalyzeRequest = {
      data,
      analysisType,
      provider: 'claude',
    };

    const analysis = await analyzeWithClaude(request);

    res.status(200).json({
      success: true,
      data: {
        analysis,
        provider: 'claude',
        timestamp: new Date().toISOString(),
        analysisType,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro interno do servidor';

    console.error('[AI Controller] Erro na análise:', errorMessage);

    res.status(500).json({
      success: false,
      error: errorMessage,
      code: 'AI_ANALYZE_ERROR',
    });
  }
};

// ════════════════════════════════════════════════════════════
// POST /api/ai/report
// Geração de relatório executivo
// ════════════════════════════════════════════════════════════
export const report = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = reportSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Dados inválidos para relatório',
        code: 'VALIDATION_ERROR',
        details: validation.error.issues,
      });
      return;
    }

    const { reportType, period, provider } = validation.data;

    const request: AIReportRequest = {
      reportType,
      period,
      provider: (provider as AIProvider) || 'claude',
    };

    const reportContent = await generateReport(request);

    res.status(200).json({
      success: true,
      data: {
        report: reportContent,
        reportType,
        provider: provider || 'claude',
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro interno do servidor';

    console.error('[AI Controller] Erro no relatório:', errorMessage);

    res.status(500).json({
      success: false,
      error: errorMessage,
      code: 'AI_REPORT_ERROR',
    });
  }
};

// ════════════════════════════════════════════════════════════
// GET /api/ai/history/:sessionId
// Recuperar histórico de conversa
// ════════════════════════════════════════════════════════════
export const history = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.params['sessionId'] as string;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        error: 'sessionId é obrigatório',
        code: 'MISSING_SESSION_ID',
      });
      return;
    }

    const sessionHistory = getSessionHistory(sessionId);

    if (!sessionHistory) {
      res.status(404).json({
        success: false,
        error: 'Sessão não encontrada',
        code: 'SESSION_NOT_FOUND',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        messages: sessionHistory.messages,
        totalMessages: sessionHistory.messages.length,
        createdAt: sessionHistory.createdAt,
        updatedAt: sessionHistory.updatedAt,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro interno do servidor';

    console.error('[AI Controller] Erro ao buscar histórico:', errorMessage);

    res.status(500).json({
      success: false,
      error: errorMessage,
      code: 'AI_HISTORY_ERROR',
    });
  }
};

// ════════════════════════════════════════════════════════════
// DELETE /api/ai/history/:sessionId
// Limpar histórico de sessão
// ════════════════════════════════════════════════════════════
export const deleteHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.params['sessionId'] as string;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        error: 'sessionId é obrigatório',
        code: 'MISSING_SESSION_ID',
      });
      return;
    }

    const deleted = clearSession(sessionId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Sessão não encontrada',
        code: 'SESSION_NOT_FOUND',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        message: 'Histórico de sessão removido com sucesso',
        deletedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro interno do servidor';

    console.error('[AI Controller] Erro ao deletar histórico:', errorMessage);

    res.status(500).json({
      success: false,
      error: errorMessage,
      code: 'AI_DELETE_ERROR',
    });
  }
};
