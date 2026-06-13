import { Request, Response } from 'express';
import { ConselhoService } from '../services/conselho.service';
import { validate, conselheirSchema, updateConselheirSchema } from '../utils/validators';
import { ConselheirInput } from '../utils/validators';
import logger from '../utils/logger';

export class ConselhoController {
  /**
   * GET /api/conselho
   */
  static async listar(req: Request, res: Response) {
    try {
      const conselheiros = await ConselhoService.obterTodos();

      res.status(200).json({
        success: true,
        data: conselheiros,
        count: conselheiros.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao listar conselheiros:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao listar',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/conselho/:id
   */
  static async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const conselheiro = await ConselhoService.obterPorId(id);

      res.status(200).json({
        success: true,
        data: conselheiro,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao buscar conselheiro:', error);
      res.status(404).json({
        success: false,
        error: 'Conselheiro não encontrado',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/conselho
   */
  static async criar(req: Request, res: Response) {
    try {
      // Validar entrada
      const validation = validate<ConselheirInput>(conselheirSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validação falhou',
          message: validation.error,
        });
      }

      const conselheiro = await ConselhoService.criar(validation.data!);

      res.status(201).json({
        success: true,
        data: conselheiro,
        message: 'Conselheiro criado com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao criar conselheiro:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao criar',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /api/conselho/:id
   */
  static async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };

      // Validar entrada
      const validation = validate(updateConselheirSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validação falhou',
          message: validation.error,
        });
      }

      const conselheiro = await ConselhoService.atualizar(id, validation.data as any);

      res.status(200).json({
        success: true,
        data: conselheiro,
        message: 'Conselheiro atualizado com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao atualizar conselheiro:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao atualizar',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * DELETE /api/conselho/:id
   */
  static async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      await ConselhoService.deletar(id);

      res.status(200).json({
        success: true,
        message: 'Conselheiro deletado com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao deletar conselheiro:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao deletar',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/conselho/votacoes/:sessaoId
   */
  static async obterVotacoes(req: Request, res: Response) {
    try {
      const { sessaoId } = req.params as { sessaoId: string };
      const votos = await ConselhoService.obterVotacoes(sessaoId);

      res.status(200).json({
        success: true,
        data: votos,
        count: votos.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao obter votações:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao obter votações',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
