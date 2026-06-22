import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/auth';
import { AppDispatch, RootState } from '../store/store';
import { LoginRequest } from '../types';
import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // ═══════════════════════════════════════════════════════════════════════════
  // VALIDAÇÃO DE FORMULÁRIO
  // ═══════════════════════════════════════════════════════════════════════════

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    if (!formData.password) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      console.log('[LoginPage] Enviando credenciais...');
      await dispatch(login(formData)).unwrap();
      console.log('[LoginPage] Login bem-sucedido, redirecionando...');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('[LoginPage] Erro no login:', err);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      {/* Decoração de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>

      {/* Contêiner do formulário */}
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-yellow-500 border-opacity-20">
        {/* Brasão Madson Motors */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-black font-bold text-2xl">MM</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Madson Motors
        </h1>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Sistema de Controle Corporativo — Fase 3
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Erro geral */}
          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-200 font-medium">Erro na autenticação</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
              <span className="flex items-center gap-2">
                <Mail size={18} className="text-yellow-500" />
                Email
              </span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jose.marciano@madson.com"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 border transition-colors text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                validationErrors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:ring-yellow-500 focus:border-yellow-500'
              }`}
              disabled={isLoading}
            />
            {validationErrors.email && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Campo Senha */}
          <div>
            <label htmlFor="password" className="block text-gray-300 font-medium mb-2">
              <span className="flex items-center gap-2">
                <Lock size={18} className="text-yellow-500" />
                Senha
              </span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 border transition-colors text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                validationErrors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:ring-yellow-500 focus:border-yellow-500'
              }`}
              disabled={isLoading}
            />
            {validationErrors.password && (
              <p className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
            )}
          </div>

          {/* Botão de envio */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Autenticando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-500 text-xs text-center">
            Madson Motors do Brasil S.A. © 1929–2026
          </p>
          <p className="text-gray-600 text-xs text-center mt-2">
            Sistema ERP — Fase 3 Frontend
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
