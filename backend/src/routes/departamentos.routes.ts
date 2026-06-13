import { Router, Request, Response } from 'express';
import { DepartamentoController } from '../controllers/departamento.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * GET /api/departamentos
 * Listar todos os departamentos
 * Header: Authorization: Bearer token
 * Response: { data: [...], count }
 */
router.get('/', authMiddleware, (req: Request, res: Response) => {
  DepartamentoController.listar(req, res);
});

/**
 * GET /api/departamentos/:id
 * Obter departamento por ID
 * Header: Authorization: Bearer token
 * Response: { data: {...} }
 */
router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  DepartamentoController.buscarPorId(req, res);
});

/**
 * POST /api/departamentos
 * Criar novo departamento
 * Header: Authorization: Bearer token
 * Role: admin
 * Body: { nome, sigla, descricao?, diretor_id?, orcamento_usd?, total_funcionarios? }
 * Response: { data: {...} }
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  (req: Request, res: Response) => {
    DepartamentoController.criar(req, res);
  }
);

/**
 * PUT /api/departamentos/:id
 * Atualizar departamento
 * Header: Authorization: Bearer token
 * Role: admin, diretor
 * Body: { nome?, sigla?, descricao?, ... }
 * Response: { data: {...} }
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'diretor']),
  (req: Request, res: Response) => {
    DepartamentoController.atualizar(req, res);
  }
);

/**
 * DELETE /api/departamentos/:id
 * Deletar departamento
 * Header: Authorization: Bearer token
 * Role: admin
 * Response: { message }
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  (req: Request, res: Response) => {
    DepartamentoController.deletar(req, res);
  }
);

export default router;
