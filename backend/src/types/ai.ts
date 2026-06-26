// ============================================================
// MADSON MOTORS DO BRASIL S.A. — SISTEMA ERP
// Tipos TypeScript — Módulo de Inteligência Artificial
// Fase 4 — AI Integration: Claude + Gemini
// Araras, Estado de Araras — Janeiro de 1952
// ============================================================

export type AIProvider = 'claude' | 'gemini';

export type AIMessageRole = 'user' | 'assistant' | 'system';

export type AIRequestType = 'chat' | 'analyze' | 'report';

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  provider: AIProvider;
  timestamp: string;
  requestType: AIRequestType;
}

export interface AIConversationHistory {
  sessionId: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIChatRequest {
  message: string;
  provider: AIProvider;
  sessionId?: string;
  context?: string;
}

export interface AIChatResponse {
  success: boolean;
  data: {
    messageId: string;
    sessionId: string;
    provider: AIProvider;
    response: string;
    timestamp: string;
    requestType: AIRequestType;
  };
}

export interface AIAnalyzeRequest {
  data: Record<string, unknown>;
  analysisType: 'conselho' | 'departamentos' | 'geral';
  provider?: AIProvider;
}

export interface AIAnalyzeResponse {
  success: boolean;
  data: {
    analysis: string;
    provider: AIProvider;
    timestamp: string;
    analysisType: string;
  };
}

export interface AIReportRequest {
  reportType: 'executivo' | 'operacional' | 'financeiro';
  period?: string;
  provider?: AIProvider;
}

export interface AIReportResponse {
  success: boolean;
  data: {
    report: string;
    reportType: string;
    provider: AIProvider;
    generatedAt: string;
  };
}

export interface AIHistoryResponse {
  success: boolean;
  data: {
    sessionId: string;
    messages: AIMessage[];
    totalMessages: number;
  };
}

export interface AIError {
  success: false;
  error: string;
  code: string;
  provider?: AIProvider;
}

export interface AIServiceConfig {
  anthropicApiKey: string;
  geminiApiKey: string;
  maxTokens: number;
  temperature: number;
  historyMaxMessages: number;
}

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
