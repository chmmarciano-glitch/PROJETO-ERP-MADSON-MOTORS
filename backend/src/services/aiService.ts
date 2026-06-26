// ============================================================
// MADSON MOTORS DO BRASIL S.A. — SISTEMA ERP
// AI Service — Integração Claude + Gemini
// Fase 4 — AI Integration
// Araras, Estado de Araras — Janeiro de 1952
// ============================================================

import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import {
  AIProvider,
  AIMessage,
  AIConversationHistory,
  AIChatRequest,
  AIAnalyzeRequest,
  AIReportRequest,
  AIServiceConfig,
  ClaudeMessage,
  GeminiMessage,
} from '../types/ai';
import {
  buildChatPrompt,
  buildAnalysisPrompt,
  buildReportPrompt,
  CLAUDE_SYSTEM_PROMPT,
  GEMINI_SYSTEM_PROMPT,
} from '../prompts/madsonContext';

// ── Configuração do Serviço ──────────────────────────────────
const getConfig = (): AIServiceConfig => ({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2048'),
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
  historyMaxMessages: parseInt(process.env.AI_HISTORY_MAX_MESSAGES || '20'),
});

const isPlaceholderKey = (key: string): boolean => {
  const normalized = key.trim().toLowerCase();
  return (
    !normalized ||
    normalized.includes('placeholder') ||
    normalized.includes('por-enquanto') ||
    normalized.includes('sua_chave') ||
    normalized.includes('sua_') ||
    normalized.endsWith('_aqui')
  );
};

const buildDevelopmentAIResponse = (
  provider: AIProvider,
  requestType: 'chat' | 'analysis' | 'report',
  input: string
): string => {
  const engine =
    provider === 'claude'
      ? 'Claude — Motor Analítico'
      : 'Gemini — Executor Operacional';

  if (requestType === 'report') {
    return [
      'RELATÓRIO EXECUTIVO — MADSON MOTORS DO BRASIL S.A.',
      'Período: Janeiro de 1952',
      'Sede: Araras, Estado de Araras',
      'Presidente: José Marciano',
      '',
      'Síntese: a companhia mantém operação estável, com foco em disciplina industrial, liquidez em Cruzeiros (Cr$) e coordenação entre Conselho Presidencial e departamentos.',
      'Recomendação: preservar caixa, revisar metas da Unidade Mandaqui e consolidar indicadores de produção para deliberação executiva.',
      '',
      `Emitido por ${engine} em modo de desenvolvimento local.`,
    ].join('\n');
  }

  if (requestType === 'analysis') {
    return [
      'BOLETIM DE ANÁLISE CORPORATIVA',
      'Janeiro de 1952 — Araras',
      '',
      'A Madson Motors apresenta quadro operacional controlado. O Conselho Presidencial, sob José Marciano, deve priorizar margem em Cr$, cadência produtiva e integração entre os 9 departamentos operacionais.',
      'Ponto de atenção: a Unidade Mandaqui precisa manter as 3 linhas de produção sincronizadas com suprimentos e financeiro.',
      '',
      `Análise preparada por ${engine}.`,
    ].join('\n');
  }

  if (provider === 'gemini') {
    return [
      'BOLETIM OPERACIONAL — GEMINI',
      'Janeiro de 1952 — Unidade Mandaqui, Araras',
      '',
      `Solicitação recebida: ${input}`,
      'Status: produção em acompanhamento, métricas operacionais organizadas e prioridade para regularidade das linhas.',
      'Indicadores em Cr$: custos e consumo devem ser reportados ao financeiro para consolidação diária.',
      'Escalonamento: informar José Marciano em caso de desvio crítico.',
    ].join('\n');
  }

  return [
    'RELATÓRIO ANALÍTICO — CLAUDE',
    'Madson Motors do Brasil S.A. — Janeiro de 1952',
    'Araras, Estado de Araras',
    '',
    `Consulta recebida: ${input}`,
    'Status geral: a empresa opera de forma estável, com Conselho Presidencial ativo, departamentos em coordenação e foco em resultados medidos em Cruzeiros (Cr$).',
    'Recomendação ao Presidente José Marciano: manter governança semanal, acompanhar caixa e priorizar relatórios executivos de produção.',
  ].join('\n');
};

// ── Storage em memória para histórico de sessões ─────────────
const sessionStore = new Map<string, AIConversationHistory>();

// ── Cliente Claude (Anthropic) ───────────────────────────────
const getClaudeClient = (): Anthropic => {
  const config = getConfig();
  if (!config.anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY não configurada no .env');
  }
  return new Anthropic({ apiKey: config.anthropicApiKey });
};

// ── Cliente Gemini (Google) ──────────────────────────────────
const getGeminiClient = () => {
  const config = getConfig();
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY não configurada no .env');
  }
  return new GoogleGenerativeAI(config.geminiApiKey);
};

// ── Recuperar ou criar sessão ────────────────────────────────
const getOrCreateSession = (sessionId?: string): AIConversationHistory => {
  const id = sessionId || uuidv4();
  if (!sessionStore.has(id)) {
    const newSession: AIConversationHistory = {
      sessionId: id,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sessionStore.set(id, newSession);
  }
  return sessionStore.get(id)!;
};

// ── Adicionar mensagem à sessão ──────────────────────────────
const addMessageToSession = (
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  provider: AIProvider
): AIMessage => {
  const session = getOrCreateSession(sessionId);
  const config = getConfig();

  const message: AIMessage = {
    id: uuidv4(),
    role,
    content,
    provider,
    timestamp: new Date().toISOString(),
    requestType: 'chat',
  };

  session.messages.push(message);
  session.updatedAt = new Date().toISOString();

  // Limitar histórico ao máximo configurado
  if (session.messages.length > config.historyMaxMessages) {
    session.messages = session.messages.slice(-config.historyMaxMessages);
  }

  sessionStore.set(sessionId, session);
  return message;
};

// ── Formatar histórico para Claude ───────────────────────────
const formatHistoryForClaude = (messages: AIMessage[]): ClaudeMessage[] => {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
};

// ── Formatar histórico para Gemini ───────────────────────────
const formatHistoryForGemini = (messages: AIMessage[]): GeminiMessage[] => {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
};

// ════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL — Chat com Claude
// ════════════════════════════════════════════════════════════
export const chatWithClaude = async (request: AIChatRequest): Promise<string> => {
  const config = getConfig();
  if (isPlaceholderKey(config.anthropicApiKey)) {
    const session = getOrCreateSession(request.sessionId);
    addMessageToSession(session.sessionId, 'user', request.message, 'claude');
    const response = buildDevelopmentAIResponse('claude', 'chat', request.message);
    addMessageToSession(session.sessionId, 'assistant', response, 'claude');
    return response;
  }

  const client = getClaudeClient();
  const session = getOrCreateSession(request.sessionId);

  // Adicionar mensagem do usuário ao histórico
  addMessageToSession(session.sessionId, 'user', request.message, 'claude');

  // Montar histórico para a API
  const history = formatHistoryForClaude(
    session.messages.slice(0, -1) // Excluir a mensagem que acabou de ser adicionada
  );

  const prompt = buildChatPrompt(request.message, 'claude', request.context);

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: config.maxTokens,
      system: CLAUDE_SYSTEM_PROMPT,
      messages: [
        ...history,
        { role: 'user', content: request.message },
      ],
    });

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Adicionar resposta ao histórico
    addMessageToSession(session.sessionId, 'assistant', assistantMessage, 'claude');

    return assistantMessage;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Falha na comunicação com Claude API: ${errorMessage}`);
  }
};

// ════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL — Chat com Gemini
// ════════════════════════════════════════════════════════════
export const chatWithGemini = async (request: AIChatRequest): Promise<string> => {
  const config = getConfig();
  if (isPlaceholderKey(config.geminiApiKey)) {
    const session = getOrCreateSession(request.sessionId);
    addMessageToSession(session.sessionId, 'user', request.message, 'gemini');
    const response = buildDevelopmentAIResponse('gemini', 'chat', request.message);
    addMessageToSession(session.sessionId, 'assistant', response, 'gemini');
    return response;
  }

  const genAI = getGeminiClient();
  const session = getOrCreateSession(request.sessionId);

  // Adicionar mensagem do usuário ao histórico
  addMessageToSession(session.sessionId, 'user', request.message, 'gemini');

  // Histórico anterior (sem a última mensagem recém-adicionada)
  const previousMessages = session.messages.slice(0, -1);
  const history = formatHistoryForGemini(previousMessages);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: GEMINI_SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: config.maxTokens,
        temperature: config.temperature,
      },
    });

    const result = await chat.sendMessage(request.message);
    const assistantMessage = result.response.text();

    // Adicionar resposta ao histórico
    addMessageToSession(session.sessionId, 'assistant', assistantMessage, 'gemini');

    return assistantMessage;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Falha na comunicação com Gemini API: ${errorMessage}`);
  }
};

// ════════════════════════════════════════════════════════════
// FUNÇÃO — Análise de Dados com Claude
// ════════════════════════════════════════════════════════════
export const analyzeWithClaude = async (request: AIAnalyzeRequest): Promise<string> => {
  const config = getConfig();
  if (isPlaceholderKey(config.anthropicApiKey)) {
    return buildDevelopmentAIResponse(
      'claude',
      'analysis',
      JSON.stringify(request.data)
    );
  }

  const client = getClaudeClient();

  const prompt = buildAnalysisPrompt(request.analysisType, request.data);

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: config.maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Falha na análise com Claude API: ${errorMessage}`);
  }
};

// ════════════════════════════════════════════════════════════
// FUNÇÃO — Geração de Relatório
// ════════════════════════════════════════════════════════════
export const generateReport = async (request: AIReportRequest): Promise<string> => {
  const config = getConfig();
  const provider = request.provider || 'claude';
  const prompt = buildReportPrompt(request.reportType, request.period);
  const apiKey = provider === 'claude' ? config.anthropicApiKey : config.geminiApiKey;

  if (isPlaceholderKey(apiKey)) {
    return buildDevelopmentAIResponse(provider, 'report', prompt);
  }

  try {
    if (provider === 'claude') {
      const client = getClaudeClient();
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: config.maxTokens,
        messages: [{ role: 'user', content: prompt }],
      });
      return response.content[0].type === 'text' ? response.content[0].text : '';
    } else {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Falha na geração de relatório: ${errorMessage}`);
  }
};

// ════════════════════════════════════════════════════════════
// FUNÇÃO — Recuperar histórico de sessão
// ════════════════════════════════════════════════════════════
export const getSessionHistory = (sessionId: string): AIConversationHistory | null => {
  return sessionStore.get(sessionId) || null;
};

// ════════════════════════════════════════════════════════════
// FUNÇÃO — Listar todas as sessões ativas
// ════════════════════════════════════════════════════════════
export const listActiveSessions = (): string[] => {
  return Array.from(sessionStore.keys());
};

// ════════════════════════════════════════════════════════════
// FUNÇÃO — Limpar sessão
// ════════════════════════════════════════════════════════════
export const clearSession = (sessionId: string): boolean => {
  return sessionStore.delete(sessionId);
};
