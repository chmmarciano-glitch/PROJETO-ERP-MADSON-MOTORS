// ============================================================
// MADSON MOTORS DO BRASIL S.A. — SISTEMA ERP
// AI Service — Frontend
// Fase 4 — AI Integration: Claude + Gemini
// Araras, Estado de Araras — Janeiro de 1952
// ============================================================

import axios from 'axios';

// ── Tipos ────────────────────────────────────────────────────

export type AIProvider = 'claude' | 'gemini';

export interface AIChatPayload {
  message: string;
  provider: AIProvider;
  sessionId?: string;
  context?: string;
}

export interface AIAnalyzePayload {
  data: Record<string, unknown>;
  analysisType: 'conselho' | 'departamentos' | 'geral';
}

export interface AIReportPayload {
  reportType: 'executivo' | 'operacional' | 'financeiro';
  period?: string;
  provider?: AIProvider;
}

export interface AIChatResult {
  messageId: string;
  sessionId: string;
  provider: AIProvider;
  response: string;
  timestamp: string;
  requestType: string;
}

export interface AIAnalyzeResult {
  analysis: string;
  provider: AIProvider;
  timestamp: string;
  analysisType: string;
}

export interface AIReportResult {
  report: string;
  reportType: string;
  provider: AIProvider;
  generatedAt: string;
}

export interface AIHistoryMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider: AIProvider;
  timestamp: string;
  requestType: string;
}

export interface AIHistoryResult {
  sessionId: string;
  messages: AIHistoryMessage[];
  totalMessages: number;
  createdAt: string;
  updatedAt: string;
}

// ── Configuração Base ────────────────────────────────────────

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/api\/?$/,
  ''
);
const JWT_TOKEN_KEY = import.meta.env.VITE_JWT_TOKEN_KEY || 'madson_motors_jwt_token';

const getAuthHeaders = () => {
  const token = localStorage.getItem(JWT_TOKEN_KEY);
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ════════════════════════════════════════════════════════════
// sendChatMessage — Envia mensagem para Claude ou Gemini
// ════════════════════════════════════════════════════════════
export const sendChatMessage = async (
  payload: AIChatPayload
): Promise<AIChatResult> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/ai/chat`,
      payload,
      { headers: getAuthHeaders() }
    );
    return response.data.data as AIChatResult;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || 'Erro ao enviar mensagem para a IA'
      );
    }
    throw new Error('Erro desconhecido ao contatar a IA');
  }
};

// ════════════════════════════════════════════════════════════
// requestStrategicAnalysis — Análise estratégica com Claude
// ════════════════════════════════════════════════════════════
export const requestStrategicAnalysis = async (
  payload: AIAnalyzePayload
): Promise<AIAnalyzeResult> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/ai/analyze`,
      payload,
      { headers: getAuthHeaders() }
    );
    return response.data.data as AIAnalyzeResult;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || 'Erro ao solicitar análise estratégica'
      );
    }
    throw new Error('Erro desconhecido na análise estratégica');
  }
};

// ════════════════════════════════════════════════════════════
// generateExecutiveReport — Gera relatório executivo
// ════════════════════════════════════════════════════════════
export const generateExecutiveReport = async (
  payload: AIReportPayload
): Promise<AIReportResult> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/ai/report`,
      payload,
      { headers: getAuthHeaders() }
    );
    return response.data.data as AIReportResult;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || 'Erro ao gerar relatório executivo'
      );
    }
    throw new Error('Erro desconhecido na geração de relatório');
  }
};

// ════════════════════════════════════════════════════════════
// fetchSessionHistory — Recupera histórico de sessão
// ════════════════════════════════════════════════════════════
export const fetchSessionHistory = async (
  sessionId: string
): Promise<AIHistoryResult> => {
  try {
    const response = await axios.get(
      `${API_URL}/api/ai/history/${sessionId}`,
      { headers: getAuthHeaders() }
    );
    return response.data.data as AIHistoryResult;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || 'Erro ao recuperar histórico'
      );
    }
    throw new Error('Erro desconhecido ao recuperar histórico');
  }
};

// ════════════════════════════════════════════════════════════
// deleteSessionHistory — Remove histórico de sessão
// ════════════════════════════════════════════════════════════
export const deleteSessionHistory = async (
  sessionId: string
): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/api/ai/history/${sessionId}`,
      { headers: getAuthHeaders() }
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || 'Erro ao remover histórico'
      );
    }
    throw new Error('Erro desconhecido ao remover histórico');
  }
};

// ════════════════════════════════════════════════════════════
// testAIConnection — Testa conectividade com os provedores
// ════════════════════════════════════════════════════════════
export const testAIConnection = async (
  provider: AIProvider
): Promise<boolean> => {
  try {
    const result = await sendChatMessage({
      message: 'Teste de conectividade — Central ERP Madson Motors.',
      provider,
    });
    return !!result.response;
  } catch {
    return false;
  }
};
