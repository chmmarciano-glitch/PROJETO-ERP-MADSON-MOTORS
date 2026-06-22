import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useSelector(
    (state: RootState) => state.auth
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // VERIFICAÇÕES
  // ═══════════════════════════════════════════════════════════════════════════

  // Enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Não autenticado
  if (!isAuthenticated) {
    console.warn('[ProtectedRoute] Acesso negado: usuário não autenticado');
    return <Navigate to="/login" replace />;
  }

  // Verificar role se necessário
  if (requiredRole && user?.role !== requiredRole) {
    console.warn(
      `[ProtectedRoute] Acesso negado: role necessária "${requiredRole}", usuário tem "${user?.role}"`
    );
    return <Navigate to="/dashboard" replace />;
  }

  // Autenticado e com permissões
  console.log('[ProtectedRoute] Acesso permitido');
  return <>{children}</>;
};

export default ProtectedRoute;
