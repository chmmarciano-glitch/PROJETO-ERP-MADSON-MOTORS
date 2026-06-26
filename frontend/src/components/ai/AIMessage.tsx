// ============================================================
// MADSON MOTORS DO BRASIL S.A. — SISTEMA ERP
// Componente AIMessage — Exibição de Mensagem de IA
// Fase 4 — AI Integration: Claude + Gemini
// Araras, Estado de Araras — Janeiro de 1952
// ============================================================

import React from 'react';
import { Brain, Zap, User } from 'lucide-react';
import { AIMessage as AIMessageType } from '../../store/slices/ai';

interface AIMessageProps {
  message: AIMessageType;
}

const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isClaude = message.provider === 'claude';

  const formatTimestamp = (timestamp: string): string => {
    try {
      return new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '--:--';
    }
  };

  const formatContent = (content: string): string[] => {
    return content.split('\n').filter((line) => line !== undefined);
  };

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}
    >
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser
            ? 'bg-yellow-600'
            : isClaude
            ? 'bg-yellow-500/20 border border-yellow-600'
            : 'bg-blue-500/20 border border-blue-600'
          }
        `}
      >
        {isUser ? (
          <User size={16} className="text-black" />
        ) : isClaude ? (
          <Brain size={16} className="text-yellow-400" />
        ) : (
          <Zap size={16} className="text-blue-400" />
        )}
      </div>

      {/* Balão da mensagem */}
      <div
        className={`
          max-w-[75%] flex flex-col gap-1
          ${isUser ? 'items-end' : 'items-start'}
        `}
      >
        {/* Header da mensagem */}
        <div
          className={`
            flex items-center gap-2 text-xs
            ${isUser ? 'flex-row-reverse' : 'flex-row'}
          `}
        >
          <span className="font-bold text-yellow-500 uppercase tracking-wide">
            {isUser
              ? 'Operador'
              : isClaude
              ? 'Claude — Motor Analítico'
              : 'Gemini — Executor Operacional'}
          </span>
          <span className="text-gray-600">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>

        {/* Conteúdo da mensagem */}
        <div
          className={`
            px-4 py-3 rounded-lg text-sm leading-relaxed
            ${isUser
              ? 'bg-yellow-600 text-black font-medium rounded-tr-none'
              : isClaude
              ? 'bg-gray-900 border border-yellow-600/40 text-gray-100 rounded-tl-none'
              : 'bg-gray-900 border border-blue-600/40 text-gray-100 rounded-tl-none'
            }
          `}
        >
          {formatContent(message.content).map((line, index) => (
            <React.Fragment key={index}>
              {line === '' ? (
                <br />
              ) : (
                <span
                  className={
                    line.startsWith('RELATÓRIO') ||
                    line.startsWith('BOLETIM') ||
                    line.startsWith('══') ||
                    line.startsWith('──')
                      ? 'block font-bold text-yellow-400 mt-1'
                      : 'block'
                  }
                >
                  {line}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Badge do provedor */}
        {!isUser && (
          <span
            className={`
              text-xs px-2 py-0.5 rounded-full font-bold
              ${isClaude
                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-600/30'
                : 'bg-blue-500/10 text-blue-400 border border-blue-600/30'
              }
            `}
          >
            {isClaude ? '🧠 Claude' : '⚡ Gemini'}
          </span>
        )}
      </div>
    </div>
  );
};

export default AIMessage;
