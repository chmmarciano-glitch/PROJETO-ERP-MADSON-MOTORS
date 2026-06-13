import { supabase } from '../utils/supabase';
import { ConselheiroPresidencial } from '../types';
import logger from '../utils/logger';

export class ConselhoService {
  /**
   * Obter todos os conselheiros
   */
  static async obterTodos(): Promise<ConselheiroPresidencial[]> {
    try {
      const { data: conselheiros, error } = await supabase
        .from('conselho_presidencial')
        .select('*')
        .order('cargo', { ascending: true });

      if (error) {
        throw error;
      }

      logger.info(`✅ Obtidos ${conselheiros?.length || 0} conselheiros`);
      return conselheiros || [];
    } catch (error) {
      logger.error('Erro ao obter conselheiros:', error);
      throw error;
    }
  }

  /**
   * Obter conselheiro por ID
   */
  static async obterPorId(id: string): Promise<ConselheiroPresidencial> {
    try {
      const { data: conselheiro, error } = await supabase
        .from('conselho_presidencial')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !conselheiro) {
        throw new Error('Conselheiro não encontrado');
      }

      return conselheiro;
    } catch (error) {
      logger.error('Erro ao obter conselheiro:', error);
      throw error;
    }
  }

  /**
   * Criar novo conselheiro
   */
  static async criar(dados: Partial<ConselheiroPresidencial>): Promise<ConselheiroPresidencial> {
    try {
      const { data: newConselheiro, error } = await supabase
        .from('conselho_presidencial')
        .insert([
          {
            nome: dados.nome,
            cargo: dados.cargo,
            nacionalidade: dados.nacionalidade || 'Brasileiro',
            membro_permanente: dados.membro_permanente || false,
            poder_deliberativo: dados.poder_deliberativo || true,
          }
        ])
        .select()
        .single();

      if (error || !newConselheiro) {
        throw new Error('Erro ao criar conselheiro');
      }

      logger.info(`✅ Novo conselheiro criado: ${dados.nome}`);
      return newConselheiro;
    } catch (error) {
      logger.error('Erro ao criar conselheiro:', error);
      throw error;
    }
  }

  /**
   * Atualizar conselheiro
   */
  static async atualizar(id: string, dados: Partial<ConselheiroPresidencial>): Promise<ConselheiroPresidencial> {
    try {
      const { data: updated, error } = await supabase
        .from('conselho_presidencial')
        .update(dados)
        .eq('id', id)
        .select()
        .single();

      if (error || !updated) {
        throw new Error('Erro ao atualizar conselheiro');
      }

      logger.info(`✅ Conselheiro atualizado: ${id}`);
      return updated;
    } catch (error) {
      logger.error('Erro ao atualizar conselheiro:', error);
      throw error;
    }
  }

  /**
   * Deletar conselheiro (soft delete)
   */
  static async deletar(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conselho_presidencial')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      logger.info(`✅ Conselheiro deletado: ${id}`);
      return true;
    } catch (error) {
      logger.error('Erro ao deletar conselheiro:', error);
      throw error;
    }
  }

  /**
   * Obter votações de uma sessão
   */
  static async obterVotacoes(sessaoId: string) {
    try {
      const { data: votos, error } = await supabase
        .from('votos_conselho')
        .select(`
          *,
          conselheiros_presidenciais(nome, cargo)
        `)
        .eq('sessao_chat_id', sessaoId);

      if (error) {
        throw error;
      }

      logger.info(`✅ Obtidos votos da sessão: ${sessaoId}`);
      return votos || [];
    } catch (error) {
      logger.error('Erro ao obter votações:', error);
      throw error;
    }
  }
}
