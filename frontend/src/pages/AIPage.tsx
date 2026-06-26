// ============================================================
// MADSON MOTORS DO BRASIL S.A. — SISTEMA ERP
// AIPage — Página de Inteligência Artificial
// Fase 4 — AI Integration: Claude + Gemini
// Araras, Estado de Araras — Janeiro de 1952
// ============================================================

import React from 'react';
import AIChat from '../components/ai/AIChat';

const AIPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-black">
      <AIChat />
    </div>
  );
};

export default AIPage;
