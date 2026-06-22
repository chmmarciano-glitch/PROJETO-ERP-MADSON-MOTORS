import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

console.log('═══════════════════════════════════════════════');
console.log('  MADSON MOTORS DO BRASIL S.A.');
console.log('  Sistema ERP — Fase 3 Frontend');
console.log('  React 18 + TypeScript + Redux + Tailwind');
console.log('  Araras, São Paulo — Janeiro de 1952');
console.log('═══════════════════════════════════════════════');

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    '[main.tsx] Elemento #root não encontrado no index.html. ' +
    'Verifique que o arquivo index.html contém <div id="root"></div>'
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
