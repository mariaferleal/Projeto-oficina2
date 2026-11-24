import { Router } from 'express';

import {
  abrir,
  atualizar,
  criar,
  excluir,
  listar,
} from '../controllers/programa.controller.js';
import { autenticarJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.use(autenticarJWT);
router.get('/', listar);
router.get('/:id', abrir);
router.post('/', criar);
router.put('/:id', atualizar);
router.delete('/:id', excluir);

export default router;
