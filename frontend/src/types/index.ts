// Tipos de Autenticação
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'conselheiro' | 'gerente' | 'usuario';
  departamento_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Tipos de Conselho Presidencial
export interface Conselheiro {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  nacionalidade: string;
  data_nascimento: string;
  cpf: string;
  status: 'ativo' | 'inativo' | 'afastado';
  departamento_id: string;
  created_at: string;
  updated_at: string;
}

export interface ConselheirCreateRequest {
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  nacionalidade: string;
  data_nascimento: string;
  cpf: string;
  status: 'ativo' | 'inativo' | 'afastado';
  departamento_id: string;
}

export interface ConselheirUpdateRequest {
  nome?: string;
  cargo?: string;
  email?: string;
  telefone?: string;
  nacionalidade?: string;
  data_nascimento?: string;
  cpf?: string;
  status?: 'ativo' | 'inativo' | 'afastado';
  departamento_id?: string;
}

export interface ConselhoState {
  conselheiros: Conselheiro[];
  selectedConselheiro: Conselheiro | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

// Tipos de Departamentos
export interface Departamento {
  id: string;
  nome: string;
  descricao: string;
  gerente_id: string;
  localizacao: string;
  status: 'ativo' | 'inativo';
  budget: number;
  created_at: string;
  updated_at: string;
}

export interface DepartamentoCreateRequest {
  nome: string;
  descricao: string;
  gerente_id: string;
  localizacao: string;
  status: 'ativo' | 'inativo';
  budget: number;
}

export interface DepartamentoUpdateRequest {
  nome?: string;
  descricao?: string;
  gerente_id?: string;
  localizacao?: string;
  status?: 'ativo' | 'inativo';
  budget?: number;
}

export interface DepartamentoState {
  departamentos: Departamento[];
  selectedDepartamento: Departamento | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

// Tipos de Resposta da API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  timestamp: string;
}

// Tipos de Formulário
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  message: string | null;
}

// Tipos de Notificação
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Tipos de Dashboard
export interface DashboardStats {
  totalConselheiros: number;
  totalDepartamentos: number;
  activeConselheiros: number;
  activeDepartamentos: number;
  recentConselheiros: Conselheiro[];
  recentDepartamentos: Departamento[];
}

// Tipos de Filtros
export interface FilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Tipos de Sessão
export interface SessionData {
  user: User;
  token: string;
  expiresAt: number;
  lastActivity: number;
}
