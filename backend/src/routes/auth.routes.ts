import { Router } from 'express';
import {
  loginGoogle,
  obterUsuarioAutenticado,
} from '../controllers/auth.controller.js';
import { autenticarJWT } from '../middleware/auth.middleware.js';


const router = Router();

router.post('/google', loginGoogle);
router.get('/me', autenticarJWT, obterUsuarioAutenticado);

export default router;