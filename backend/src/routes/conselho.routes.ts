import { Router, Request, Response } from 'express';
import { ConselhoController } from '../controllers/conselho.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * GET /api/conselho
 * Listar todos os conselheiros
 * Header: Authorization: Bearer token
 * Response: { data: [...], count }
 */
router.get('/', authMiddleware, (req: Request, res: Response) => {
  ConselhoController.listar(req, res);
});

/**
 * GET /api/conselho/:id
 * Obter conselheiro por ID
 * Header: Authorization: Bearer token
 * Response: { data: {...} }
 */
router.get('/:id', authMiddleware, (req: Request, res: Response) => {
  ConselhoController.buscarPorId(req, res);
});

/**
 * POST /api/conselho
 * Criar novo conselheiro
 * Header: Authorization: Bearer token
 * Role: admin, diretor
 * Body: { nome, cargo, nacionalidade?, membro_permanente?, poder_deliberativo? }
 * Response: { data: {...} }
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'diretor']),
  (req: Request, res: Response) => {
    ConselhoController.criar(req, res);
  }
);

/**
 * PUT /api/conselho/:id
 * Atualizar conselheiro
 * Header: Authorization: Bearer token
 * Role: admin, diretor
 * Body: { nome?, cargo?, nacionalidade?, ... }
 * Response: { data: {...} }
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin', 'diretor']),
  (req: Request, res: Response) => {
    ConselhoController.atualizar(req, res);
  }
);

/**
 * DELETE /api/conselho/:id
 * Deletar conselheiro
 * Header: Authorization: Bearer token
 * Role: admin
 * Response: { message }
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  (req: Request, res: Response) => {
    ConselhoController.deletar(req, res);
  }
);

/**
 * GET /api/conselho/votacoes/:sessaoId
 * Obter votos de uma sessão
 * Header: Authorization: Bearer token
 * Response: { data: [...], count }
 */
router.get('/votacoes/:sessaoId', authMiddleware, (req: Request, res: Response) => {
  ConselhoController.obterVotacoes(req, res);
});

export default router;
