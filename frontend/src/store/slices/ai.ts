// ============================================================
// MADSON MOTORS DO BRASIL S.A. — SISTEMA ERP
// Redux Slice — Módulo de Inteligência Artificial
// Fase 4 — AI Integration: Claude + Gemini
// Araras, Estado de Araras — Janeiro de 1952
// ============================================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// ── Tipos locais do Slice ────────────────────────────────────

export type AIProvider = 'claude' | 'gemini';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider: AIProvider;
  timestamp: string;
}

export interface AIState {
  messages: AIMessage[];
  sessionId: string | null;
  activeProvider: AIProvider;
  isLoading: boolean;
  isAnalyzing: boolean;
  isGeneratingReport: boolean;
  error: string | null;
  lastAnalysis: string | null;
  lastReport: string | null;
}

// ── Estado Inicial ───────────────────────────────────────────

const initialState: AIState = {
  messages: [],
  sessionId: null,
  activeProvider: 'claude',
  isLoading: false,
  isAnalyzing: false,
  isGeneratingReport: false,
  error: null,
  lastAnalysis: null,
  lastReport: null,
};

// ── Base URL da API ──────────────────────────────────────────

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/api\/?$/,
  ''
);
const JWT_TOKEN_KEY = import.meta.env.VITE_JWT_TOKEN_KEY || 'madson_motors_jwt_token';

// ════════════════════════════════════════════════════════════
// THUNK — Enviar mensagem de chat
// ════════════════════════════════════════════════════════════
export const sendMessage = createAsyncThunk(
  'ai/sendMessage',
  async (
    payload: {
      message: string;
      provider: AIProvider;
      sessionId?: string;
      context?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      const response = await axios.post(
        `${API_URL}/api/ai/chat`,
        {
          message: payload.message,
          provider: payload.provider,
          sessionId: payload.sessionId,
          context: payload.context,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || 'Erro ao comunicar com a IA'
        );
      }
      return rejectWithValue('Erro desconhecido');
    }
  }
);

// ════════════════════════════════════════════════════════════
// THUNK — Solicitar análise estratégica
// ════════════════════════════════════════════════════════════
export const requestAnalysis = createAsyncThunk(
  'ai/requestAnalysis',
  async (
    payload: {
      data: Record<string, unknown>;
      analysisType: 'conselho' | 'departamentos' | 'geral';
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      const response = await axios.post(
        `${API_URL}/api/ai/analyze`,
        {
          data: payload.data,
          analysisType: payload.analysisType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || 'Erro na análise estratégica'
        );
      }
      return rejectWithValue('Erro desconhecido');
    }
  }
);

// ════════════════════════════════════════════════════════════
// THUNK — Gerar relatório executivo
// ════════════════════════════════════════════════════════════
export const generateReport = createAsyncThunk(
  'ai/generateReport',
  async (
    payload: {
      reportType: 'executivo' | 'operacional' | 'financeiro';
      period?: string;
      provider?: AIProvider;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      const response = await axios.post(
        `${API_URL}/api/ai/report`,
        {
          reportType: payload.reportType,
          period: payload.period,
          provider: payload.provider || 'claude',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || 'Erro ao gerar relatório'
        );
      }
      return rejectWithValue('Erro desconhecido');
    }
  }
);

// ════════════════════════════════════════════════════════════
// SLICE
// ════════════════════════════════════════════════════════════
const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    // Trocar provedor ativo
    setActiveProvider: (state, action: PayloadAction<AIProvider>) => {
      state.activeProvider = action.payload;
    },
    // Definir sessionId
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    // Adicionar mensagem do usuário localmente (antes da resposta)
    addUserMessage: (state, action: PayloadAction<{
      content: string;
      provider: AIProvider;
    }>) => {
      const message: AIMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: action.payload.content,
        provider: action.payload.provider,
        timestamp: new Date().toISOString(),
      };
      state.messages.push(message);
    },
    // Limpar conversa
    clearMessages: (state) => {
      state.messages = [];
      state.sessionId = null;
      state.error = null;
    },
    // Limpar erro
    clearError: (state) => {
      state.error = null;
    },
    // Limpar análise
    clearAnalysis: (state) => {
      state.lastAnalysis = null;
    },
    // Limpar relatório
    clearReport: (state) => {
      state.lastReport = null;
    },
  },
  extraReducers: (builder) => {
    // ── sendMessage ─────────────────────────────────────────
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { sessionId, provider, response, messageId, timestamp } =
          action.payload.data;

        // Atualizar sessionId se novo
        if (!state.sessionId) {
          state.sessionId = sessionId;
        }

        // Adicionar resposta da IA ao histórico
        const assistantMessage: AIMessage = {
          id: messageId,
          role: 'assistant',
          content: response,
          provider: provider as AIProvider,
          timestamp,
        };
        state.messages.push(assistantMessage);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ── requestAnalysis ─────────────────────────────────────
    builder
      .addCase(requestAnalysis.pending, (state) => {
        state.isAnalyzing = true;
        state.error = null;
        state.lastAnalysis = null;
      })
      .addCase(requestAnalysis.fulfilled, (state, action) => {
        state.isAnalyzing = false;
        state.lastAnalysis = action.payload.data.analysis;
      })
      .addCase(requestAnalysis.rejected, (state, action) => {
        state.isAnalyzing = false;
        state.error = action.payload as string;
      });

    // ── generateReport ──────────────────────────────────────
    builder
      .addCase(generateReport.pending, (state) => {
        state.isGeneratingReport = true;
        state.error = null;
        state.lastReport = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.isGeneratingReport = false;
        state.lastReport = action.payload.data.report;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.isGeneratingReport = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setActiveProvider,
  setSessionId,
  addUserMessage,
  clearMessages,
  clearError,
  clearAnalysis,
  clearReport,
} = aiSlice.actions;

export default aiSlice.reducer;
