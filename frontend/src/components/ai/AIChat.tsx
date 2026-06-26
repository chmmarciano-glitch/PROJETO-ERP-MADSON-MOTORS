// ============================================================
// MADSON MOTORS DO BRASIL S.A. — SISTEMA ERP
// Componente AIChat — Interface Principal de Chat com IA
// Fase 4 — AI Integration: Claude + Gemini
// Araras, Estado de Araras — Janeiro de 1952
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Send,
  Trash2,
  Loader2,
  Bot,
  AlertCircle,
  FileText,
  BarChart2,
} from 'lucide-react';
import { RootState, AppDispatch } from '../../store/store';
import {
  sendMessage,
  addUserMessage,
  clearMessages,
  clearError,
  generateReport,
  requestAnalysis,
} from '../../store/slices/ai';
import AISelector from './AISelector';
import AIMessage from './AIMessage';

const AIChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    messages,
    sessionId,
    activeProvider,
    isLoading,
    isGeneratingReport,
    isAnalyzing,
    error,
  } = useSelector((state: RootState) => state.ai);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focar input ao montar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Limpar erro automaticamente após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const isBusy = isLoading || isGeneratingReport || isAnalyzing;

  // ── Enviar mensagem ────────────────────────────────────────
  const handleSendMessage = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isBusy) return;

    // Adicionar mensagem do usuário imediatamente na UI
    dispatch(addUserMessage({ content: trimmed, provider: activeProvider }));
    setInputValue('');

    // Enviar para a API
    dispatch(
      sendMessage({
        message: trimmed,
        provider: activeProvider,
        sessionId: sessionId || undefined,
      })
    );
  };

  // ── Enter para enviar (Shift+Enter para nova linha) ────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ── Gerar Relatório Executivo ──────────────────────────────
  const handleGenerateReport = () => {
    if (isBusy) return;
    dispatch(
      generateReport({
        reportType: 'executivo',
        period: 'Janeiro de 1952',
        provider: 'claude',
      })
    ).then((result) => {
      if (result.payload && typeof result.payload === 'object') {
        const payload = result.payload as { data?: { report?: string } };
        if (payload.data?.report) {
          dispatch(
            addUserMessage({
              content: '📋 Relatório Executivo gerado automaticamente.',
              provider: 'claude',
            })
          );
          dispatch(
            sendMessage({
              message: `Por favor, apresente este relatório executivo ao Presidente:\n\n${payload.data.report}`,
              provider: 'claude',
              sessionId: sessionId || undefined,
            })
          );
        }
      }
    });
  };

  // ── Solicitar Análise Geral ────────────────────────────────
  const handleRequestAnalysis = () => {
    if (isBusy) return;
    dispatch(
      requestAnalysis({
        data: {
          empresa: 'Madson Motors do Brasil S.A.',
          periodo: 'Janeiro de 1952',
          sede: 'Araras, Estado de Araras',
          conselho: '11 conselheiros ativos',
          departamentos: '9 departamentos operacionais',
          unidade: 'Mandaqui — 3 linhas de produção',
        },
        analysisType: 'geral',
      })
    ).then((result) => {
      if (result.payload && typeof result.payload === 'object') {
        const payload = result.payload as { data?: { analysis?: string } };
        if (payload.data?.analysis) {
          dispatch(
            addUserMessage({
              content: '📊 Análise corporativa geral solicitada.',
              provider: 'claude',
            })
          );
          dispatch(
            sendMessage({
              message: `Apresente esta análise corporativa:\n\n${payload.data.analysis}`,
              provider: 'claude',
              sessionId: sessionId || undefined,
            })
          );
        }
      }
    });
  };

  // ── Limpar conversa ────────────────────────────────────────
  const handleClearMessages = () => {
    if (isBusy) return;
    dispatch(clearMessages());
  };

  return (
    <div className="flex flex-col h-full bg-black text-white">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4
                      border-b border-yellow-600/40 bg-black">
        <div className="flex items-center gap-3">
          <Bot size={22} className="text-yellow-500" />
          <div>
            <h2 className="text-white font-bold text-base tracking-wide">
              Central de Inteligência Artificial
            </h2>
            <p className="text-yellow-500 text-xs opacity-80">
              Madson Motors ERP — Janeiro de 1952
            </p>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="flex items-center gap-2">
          {/* Gerar Relatório */}
          <button
            onClick={handleGenerateReport}
            disabled={isBusy}
            title="Gerar Relatório Executivo"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                       border border-yellow-600/50 text-yellow-500
                       rounded hover:bg-yellow-600/10 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileText size={13} />
            Relatório
          </button>

          {/* Análise Geral */}
          <button
            onClick={handleRequestAnalysis}
            disabled={isBusy}
            title="Análise Corporativa Geral"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                       border border-yellow-600/50 text-yellow-500
                       rounded hover:bg-yellow-600/10 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <BarChart2 size={13} />
            Análise
          </button>

          {/* Limpar conversa */}
          <button
            onClick={handleClearMessages}
            disabled={isBusy || messages.length === 0}
            title="Limpar conversa"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                       border border-red-800/50 text-red-500
                       rounded hover:bg-red-900/10 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={13} />
            Limpar
          </button>
        </div>
      </div>

      {/* ── Corpo principal ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Painel esquerdo — Seletor de provedor */}
        <div className="w-64 flex-shrink-0 p-4 border-r border-yellow-600/20
                        bg-gray-950 overflow-y-auto">
          <AISelector />

          {/* Info da sessão */}
          {sessionId && (
            <div className="mt-4 p-3 bg-black border border-gray-800 rounded-lg">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">
                Sessão Ativa
              </p>
              <p className="text-gray-600 text-xs font-mono break-all">
                {sessionId.substring(0, 18)}...
              </p>
              <p className="text-gray-600 text-xs mt-1">
                {messages.length} mensagem(ns)
              </p>
            </div>
          )}

          {/* Sugestões de perguntas */}
          <div className="mt-4">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-2">
              Sugestões
            </p>
            {[
              'Qual o status do Conselho Presidencial?',
              'Analise os departamentos operacionais.',
              'Gere um boletim da produção de hoje.',
              'Qual a situação financeira em Janeiro?',
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isBusy) setInputValue(suggestion);
                  inputRef.current?.focus();
                }}
                disabled={isBusy}
                className="w-full text-left text-xs text-gray-400 hover:text-yellow-400
                           py-2 px-3 mb-1 rounded border border-gray-800
                           hover:border-yellow-600/40 hover:bg-yellow-600/5
                           transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Painel direito — Área de chat */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {messages.length === 0 ? (
              /* Estado vazio */
              <div className="flex flex-col items-center justify-center
                              h-full text-center gap-4 opacity-60">
                <Bot size={48} className="text-yellow-600" />
                <div>
                  <p className="text-yellow-500 font-bold text-lg">
                    Central de Inteligência ERP
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Madson Motors do Brasil S.A.
                  </p>
                  <p className="text-gray-600 text-xs mt-3 max-w-sm">
                    Selecione o motor de inteligência ao lado e inicie
                    uma consulta. Claude para análises estratégicas,
                    Gemini para dados operacionais.
                  </p>
                </div>
              </div>
            ) : (
              /* Lista de mensagens */
              <>
                {messages.map((message) => (
                  <AIMessage key={message.id} message={message} />
                ))}

                {/* Indicador de carregamento */}
                {isBusy && (
                  <div className="flex items-center gap-3 py-2 px-4">
                    <Loader2
                      size={18}
                      className="text-yellow-500 animate-spin"
                    />
                    <span className="text-yellow-500 text-sm">
                      {isGeneratingReport
                        ? 'Gerando relatório executivo...'
                        : isAnalyzing
                        ? 'Processando análise corporativa...'
                        : activeProvider === 'claude'
                        ? 'Motor Analítico processando...'
                        : 'Executor Operacional processando...'}
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Alerta de erro */}
          {error && (
            <div className="mx-6 mb-2 flex items-center gap-2 px-4 py-3
                            bg-red-950 border border-red-700 rounded-lg">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* ── Input de mensagem ──────────────────────────── */}
          <div className="p-4 border-t border-yellow-600/20 bg-gray-950">
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isBusy}
                placeholder={
                  activeProvider === 'claude'
                    ? 'Consulta ao Motor Analítico (Claude)...'
                    : 'Consulta ao Executor Operacional (Gemini)...'
                }
                rows={2}
                className="flex-1 bg-black border border-yellow-600/40 text-white
                           placeholder-gray-600 rounded-lg px-4 py-3 text-sm
                           resize-none focus:outline-none focus:border-yellow-500
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              />
              <button
                onClick={handleSendMessage}
                disabled={isBusy || !inputValue.trim()}
                className="flex items-center justify-center w-12 h-12
                           bg-yellow-600 hover:bg-yellow-500 text-black
                           rounded-lg transition-colors font-bold
                           disabled:opacity-40 disabled:cursor-not-allowed
                           flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <p className="text-gray-700 text-xs mt-2 text-center">
              Enter para enviar · Shift+Enter para nova linha ·
              Sistema ERP — Araras, Janeiro de 1952
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
