import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, AppDispatch, RootState } from './store/store';
import { checkAuth } from './store/slices/auth';

// Layouts
import { MainLayout } from './components/layouts/MainLayout';
import { AuthLayout } from './components/layouts/AuthLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import AIPage from './pages/AIPage';

// Components
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ConselheirList } from './components/conselho/ConselheirList';
import { DepartamentoList } from './components/departamento/DepartamentoList';

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE INTERNO — Inicializa auth e define rotas
// ═══════════════════════════════════════════════════════════════════════════

const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    console.log('[App] Verificando autenticação salva...');
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
            <span className="text-black font-black text-2xl">MM</span>
          </div>
          <p className="text-yellow-500 font-semibold text-lg">
            Carregando sistema...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Madson Motors ERP — Fase 3
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ─────────────────────────────────────────────────────────────────
          ROTA RAIZ — Redireciona para dashboard ou login
      ───────────────────────────────────────────────────────────────── */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* ─────────────────────────────────────────────────────────────────
          ROTAS PÚBLICAS — Autenticação (sem sidebar/header)
      ───────────────────────────────────────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* ─────────────────────────────────────────────────────────────────
          ROTAS PROTEGIDAS — Requerem token JWT
      ───────────────────────────────────────────────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/conselho" element={<ConselheirList />} />
        <Route path="/departamentos" element={<DepartamentoList />} />
      </Route>

      {/* ─────────────────────────────────────────────────────────────────
          ROTA 404 — Página não encontrada
      ───────────────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL — Provider Redux + BrowserRouter
// ═══════════════════════════════════════════════════════════════════════════

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
