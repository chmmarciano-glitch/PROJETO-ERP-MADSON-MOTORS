// ============================================================
// MADSON MOTORS DO BRASIL S.A. — SISTEMA ERP
// Componente AISelector — Seletor de Provedor de IA
// Fase 4 — AI Integration: Claude + Gemini
// Araras, Estado de Araras — Janeiro de 1952
// ============================================================

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Brain, Zap } from 'lucide-react';
import { RootState, AppDispatch } from '../../store/store';
import { setActiveProvider, clearMessages, AIProvider } from '../../store/slices/ai';

const AISelector: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeProvider, isLoading } = useSelector(
    (state: RootState) => state.ai
  );

  const handleProviderChange = (provider: AIProvider) => {
    if (provider === activeProvider || isLoading) return;
    dispatch(setActiveProvider(provider));
    dispatch(clearMessages());
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-black border border-yellow-600 rounded-lg">
      {/* Título */}
      <div className="text-center">
        <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest">
          Motor de Inteligência
        </p>
        <p className="text-white text-xs mt-1 opacity-60">
          Selecione o provedor de IA ativo
        </p>
      </div>

      {/* Botões de seleção */}
      <div className="flex gap-2">
        {/* Claude — Motor Analítico */}
        <button
          onClick={() => handleProviderChange('claude')}
          disabled={isLoading}
          className={`
            flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2
            transition-all duration-200 cursor-pointer
            ${activeProvider === 'claude'
              ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
              : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-yellow-700 hover:text-yellow-600'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Brain
            size={22}
            className={activeProvider === 'claude' ? 'text-yellow-400' : 'text-gray-500'}
          />
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wide">Claude</p>
            <p className="text-xs opacity-70 mt-0.5">Motor Analítico</p>
          </div>
          {activeProvider === 'claude' && (
            <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">
              ATIVO
            </span>
          )}
        </button>

        {/* Gemini — Executor Operacional */}
        <button
          onClick={() => handleProviderChange('gemini')}
          disabled={isLoading}
          className={`
            flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2
            transition-all duration-200 cursor-pointer
            ${activeProvider === 'gemini'
              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
              : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-blue-700 hover:text-blue-600'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Zap
            size={22}
            className={activeProvider === 'gemini' ? 'text-blue-400' : 'text-gray-500'}
          />
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wide">Gemini</p>
            <p className="text-xs opacity-70 mt-0.5">Executor Operacional</p>
          </div>
          {activeProvider === 'gemini' && (
            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
              ATIVO
            </span>
          )}
        </button>
      </div>

      {/* Descrição do provedor ativo */}
      <div className="text-center p-2 bg-gray-900 rounded border border-gray-800">
        {activeProvider === 'claude' ? (
          <p className="text-yellow-400 text-xs leading-relaxed">
            <span className="font-bold">Claude (Anthropic)</span>
            <br />
            Análises estratégicas e relatórios executivos
            <br />
            para o Presidente José Marciano
          </p>
        ) : (
          <p className="text-blue-400 text-xs leading-relaxed">
            <span className="font-bold">Gemini (Google)</span>
            <br />
            Processamento operacional e métricas
            <br />
            da Unidade Mandaqui — Araras
          </p>
        )}
      </div>
    </div>
  );
};

export default AISelector;
