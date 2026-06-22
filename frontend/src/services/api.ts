import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, ApiErrorResponse, LoginRequest, LoginResponse } from '../types';

// Configuração base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const JWT_TOKEN_KEY = import.meta.env.VITE_JWT_TOKEN_KEY || 'madson_motors_jwt_token';

// Criar instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// INTERCEPTOR DE REQUEST — Adiciona token JWT
// ═══════════════════════════════════════════════════════════════════════════

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(JWT_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log de desenvolvimento
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Request Error:', error.message);
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// INTERCEPTOR DE RESPONSE — Trata erros e respostas
// ═══════════════════════════════════════════════════════════════════════════

api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response: ${response.status} ${response.statusText}`);
    return response.data;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;

    // Tratamento específico para 401 (token expirado)
    if (statusCode === 401) {
      console.warn('[API] Token expirado ou inválido. Fazendo logout...');
      localStorage.removeItem(JWT_TOKEN_KEY);
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject({
        statusCode: 401,
        message: 'Sessão expirada. Faça login novamente.',
      });
    }

    // Tratamento específico para 403 (sem permissão)
    if (statusCode === 403) {
      console.warn('[API] Acesso negado (403)');
      return Promise.reject({
        statusCode: 403,
        message: 'Você não tem permissão para acessar este recurso.',
      });
    }

    // Tratamento específico para 404 (não encontrado)
    if (statusCode === 404) {
      console.warn('[API] Recurso não encontrado (404)');
      return Promise.reject({
        statusCode: 404,
        message: 'O recurso solicitado não foi encontrado.',
      });
    }

    // Tratamento específico para 500+ (erro do servidor)
    if (statusCode && statusCode >= 500) {
      console.error('[API] Erro do servidor (500+)');
      return Promise.reject({
        statusCode,
        message: 'Erro no servidor. Tente novamente mais tarde.',
      });
    }

    // Erro genérico
    console.error('[API] Error:', errorMessage);
    return Promise.reject({
      statusCode: statusCode || 0,
      message: errorMessage,
    });
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// MÉTODOS PÚBLICOS — Autenticação
// ═══════════════════════════════════════════════════════════════════════════

export const authService = {
  /**
   * Login do usuário
   * POST /api/auth/login
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<any, ApiResponse<LoginResponse>>('/auth/login', credentials);

    if (response.data) {
      const { token, user } = response.data;
      localStorage.setItem(JWT_TOKEN_KEY, token);
      localStorage.setItem('user', JSON.stringify(user));
      return response.data;
    }

    throw new Error('Resposta inválida do servidor');
  },

  /**
   * Logout do usuário
   */
  logout: (): void => {
    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem('user');
  },

  /**
   * Obter token armazenado
   */
  getToken: (): string | null => {
    return localStorage.getItem(JWT_TOKEN_KEY);
  },

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated: (): boolean => {
    return authService.getToken() !== null;
  },

  /**
   * Obter usuário atual do localStorage
   */
  getCurrentUser: () => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// MÉTODOS PÚBLICOS — Conselho Presidencial
// ═══════════════════════════════════════════════════════════════════════════

export const conselhoService = {
  /**
   * Listar todos os conselheiros
   * GET /api/conselho
   */
  listar: async (params?: Record<string, any>) => {
    const response = await api.get('/conselho', { params });
    return response;
  },

  /**
   * Obter conselheiro por ID
   * GET /api/conselho/:id
   */
  obterPorId: async (id: string) => {
    const response = await api.get(`/conselho/${id}`);
    return response;
  },

  /**
   * Criar novo conselheiro
   * POST /api/conselho
   */
  criar: async (data: any) => {
    const response = await api.post('/conselho', data);
    return response;
  },

  /**
   * Atualizar conselheiro
   * PUT /api/conselho/:id
   */
  atualizar: async (id: string, data: any) => {
    const response = await api.put(`/conselho/${id}`, data);
    return response;
  },

  /**
   * Deletar conselheiro
   * DELETE /api/conselho/:id
   */
  deletar: async (id: string) => {
    const response = await api.delete(`/conselho/${id}`);
    return response;
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// MÉTODOS PÚBLICOS — Departamentos
// ═══════════════════════════════════════════════════════════════════════════

export const departamentoService = {
  /**
   * Listar todos os departamentos
   * GET /api/departamentos
   */
  listar: async (params?: Record<string, any>) => {
    const response = await api.get('/departamentos', { params });
    return response;
  },

  /**
   * Obter departamento por ID
   * GET /api/departamentos/:id
   */
  obterPorId: async (id: string) => {
    const response = await api.get(`/departamentos/${id}`);
    return response;
  },

  /**
   * Criar novo departamento
   * POST /api/departamentos
   */
  criar: async (data: any) => {
    const response = await api.post('/departamentos', data);
    return response;
  },

  /**
   * Atualizar departamento
   * PUT /api/departamentos/:id
   */
  atualizar: async (id: string, data: any) => {
    const response = await api.put(`/departamentos/${id}`, data);
    return response;
  },

  /**
   * Deletar departamento
   * DELETE /api/departamentos/:id
   */
  deletar: async (id: string) => {
    const response = await api.delete(`/departamentos/${id}`);
    return response;
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT PADRÃO — Instância do Axios
// ═══════════════════════════════════════════════════════════════════════════

export default api;
