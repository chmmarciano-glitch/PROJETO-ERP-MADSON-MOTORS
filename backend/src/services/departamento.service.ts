import { supabase } from '../utils/supabase';
import { Departamento } from '../types';
import logger from '../utils/logger';

export class DepartamentoService {
  /**
   * Obter todos os departamentos
   */
  static async obterTodos(): Promise<Departamento[]> {
    try {
      const { data: departamentos, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (error) {
        throw error;
      }

      logger.info(`✅ Obtidos ${departamentos?.length || 0} departamentos`);
      return departamentos || [];
    } catch (error) {
      logger.error('Erro ao obter departamentos:', error);
      throw error;
    }
  }

  /**
   * Obter departamento por ID
   */
  static async obterPorId(id: string): Promise<Departamento> {
    try {
      const { data: departamento, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !departamento) {
        throw new Error('Departamento não encontrado');
      }

      return departamento;
    } catch (error) {
      logger.error('Erro ao obter departamento:', error);
      throw error;
    }
  }

  /**
   * Criar novo departamento
   */
  static async criar(dados: Partial<Departamento>): Promise<Departamento> {
    try {
      const { data: newDept, error } = await supabase
        .from('departamentos')
        .insert([
          {
            nome: dados.nome,
            sigla: dados.sigla,
            descricao: dados.descricao || '',
            diretor_id: dados.diretor_id || null,
            orcamento_usd: dados.orcamento_usd || 0,
            total_funcionarios: dados.total_funcionarios || 0,
            ativo: true,
          }
        ])
        .select()
        .single();

      if (error || !newDept) {
        throw new Error('Erro ao criar departamento');
      }

      logger.info(`✅ Novo departamento criado: ${dados.nome}`);
      return newDept;
    } catch (error) {
      logger.error('Erro ao criar departamento:', error);
      throw error;
    }
  }

  /**
   * Atualizar departamento
   */
  static async atualizar(id: string, dados: Partial<Departamento>): Promise<Departamento> {
    try {
      const { data: updated, error } = await supabase
        .from('departamentos')
        .update(dados)
        .eq('id', id)
        .select()
        .single();

      if (error || !updated) {
        throw new Error('Erro ao atualizar departamento');
      }

      logger.info(`✅ Departamento atualizado: ${id}`);
      return updated;
    } catch (error) {
      logger.error('Erro ao atualizar departamento:', error);
      throw error;
    }
  }

  /**
   * Deletar departamento (soft delete)
   */
  static async deletar(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('departamentos')
        .update({ ativo: false })
        .eq('id', id);

      if (error) {
        throw error;
      }

      logger.info(`✅ Departamento deletado: ${id}`);
      return true;
    } catch (error) {
      logger.error('Erro ao deletar departamento:', error);
      throw error;
    }
  }
}
