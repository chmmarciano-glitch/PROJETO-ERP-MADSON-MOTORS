import { z } from 'zod';

// ==========================================
// SCHEMAS DE VALIDAÇÃO COM ZOD
// ==========================================

// Auth
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  role: z.enum(['admin', 'diretor', 'gerente', 'operador', 'visualizador']).optional(),
});

// Conselho Presidencial
export const conselheirSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cargo: z.string().min(3, 'Cargo deve ter no mínimo 3 caracteres'),
  nacionalidade: z.string().optional(),
  membro_permanente: z.boolean().optional(),
  poder_deliberativo: z.boolean().optional(),
});

export const updateConselheirSchema = conselheirSchema.partial();

// Departamento
export const departamentoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  sigla: z.string().min(2).max(10, 'Sigla deve ter entre 2 e 10 caracteres'),
  descricao: z.string().optional(),
  diretor_id: z.string().uuid().optional(),
  orcamento_usd: z.number().positive().optional(),
  total_funcionarios: z.number().int().nonnegative().optional(),
});

export const updateDepartamentoSchema = departamentoSchema.partial();

// Sala de Reunião
export const salaReuniaoSchema = z.object({
  numero: z.number().int().positive(),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  capacidade: z.number().int().positive(),
  descricao: z.string().optional(),
});

export const updateSalaReuniaoSchema = salaReuniaoSchema.partial();

// Mensagem Chat
export const mensagemSchema = z.object({
  conteudo: z.string().min(1).max(2000, 'Mensagem não pode exceder 2000 caracteres'),
  sessao_chat_id: z.string().uuid('ID da sessão inválido'),
  tipo: z.enum(['mensagem', 'votacao', 'aviso']).optional(),
  prioridade: z.enum(['baixa', 'media', 'alta']).optional(),
});

export const updateMensagemSchema = z.object({
  conteudo: z.string().min(1).max(2000),
});

// Votação
export const votoSchema = z.object({
  decisao_id: z.string().uuid('ID da decisão inválido'),
  voto: z.enum(['favoravel', 'contrario', 'abstem'], {
    error: 'Voto deve ser: favoravel, contrario ou abstem'
  }),
  justificativa: z.string().optional(),
});

// Tipos para uso nos controllers
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ConselheirInput = z.infer<typeof conselheirSchema>;
export type DepartamentoInput = z.infer<typeof departamentoSchema>;
export type SalaReuniaoInput = z.infer<typeof salaReuniaoSchema>;
export type MensagemInput = z.infer<typeof mensagemSchema>;
export type VotoInput = z.infer<typeof votoSchema>;

// Função auxiliar para validação
export function validate<T>(schema: z.ZodSchema, data: unknown): { success: boolean; data?: T; error?: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Erro de validação' };
    }
    return { success: false, error: 'Erro desconhecido na validação' };
  }
}
