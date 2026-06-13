import { Request, Response } from 'express';
import { DepartamentoService } from '../services/departamento.service';
import { validate, departamentoSchema, updateDepartamentoSchema } from '../utils/validators';
import { DepartamentoInput } from '../utils/validators';
import logger from '../utils/logger';

export class DepartamentoController {
  /**
   * GET /api/departamentos
   */
  static async listar(req: Request, res: Response) {
    try {
      const departamentos = await DepartamentoService.obterTodos();

      res.status(200).json({
        success: true,
        data: departamentos,
        count: departamentos.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao listar departamentos:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao listar',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /api/departamentos/:id
   */
  static async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const departamento = await DepartamentoService.obterPorId(id);

      res.status(200).json({
        success: true,
        data: departamento,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao buscar departamento:', error);
      res.status(404).json({
        success: false,
        error: 'Departamento não encontrado',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /api/departamentos
   */
  static async criar(req: Request, res: Response) {
    try {
      // Validar entrada
      const validation = validate<DepartamentoInput>(departamentoSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validação falhou',
          message: validation.error,
        });
      }

      const departamento = await DepartamentoService.criar(validation.data!);

      res.status(201).json({
        success: true,
        data: departamento,
        message: 'Departamento criado com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao criar departamento:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao criar',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * PUT /api/departamentos/:id
   */
  static async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };

      // Validar entrada
      const validation = validate(updateDepartamentoSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validação falhou',
          message: validation.error,
        });
      }

      const departamento = await DepartamentoService.atualizar(id, validation.data as any);

      res.status(200).json({
        success: true,
        data: departamento,
        message: 'Departamento atualizado com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao atualizar departamento:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao atualizar',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * DELETE /api/departamentos/:id
   */
  static async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      await DepartamentoService.deletar(id);

      res.status(200).json({
        success: true,
        message: 'Departamento deletado com sucesso',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Erro ao deletar departamento:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erro ao deletar',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
