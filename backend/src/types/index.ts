// Tipos globais do backend Madson Motors ERP

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'diretor' | 'gerente' | 'operador' | 'visualizador';
  departamento_id?: string;
  ativo: boolean;
  ultimo_login?: string;
  created_at: string;
  updated_at: string;
}

export interface ConselheiroPresidencial {
  id: string;
  nome: string;
  cargo: string;
  nacionalidade: string;
  membro_permanente: boolean;
  poder_deliberativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Departamento {
  id: string;
  nome: string;
  sigla: string;
  descricao?: string;
  diretor_id?: string;
  orcamento_usd?: number;
  total_funcionarios: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface SalaReuniao {
  id: string;
  numero: number;
  nome: string;
  capacidade: number;
  descricao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  departamento_id?: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
  expires_in: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
