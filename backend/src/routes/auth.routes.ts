import { Router } from 'express';
import {
  loginDeTeste,
  loginGoogle,
  logout,
  obterUsuarioAutenticado,
} from '../controllers/auth.controller.js';
import { autenticarJWT } from '../middleware/auth.middleware.js';


const router = Router();

router.post('/google', loginGoogle);
router.get('/me', autenticarJWT, obterUsuarioAutenticado);
router.post('/logout', autenticarJWT, logout);
router.post('/teste', loginDeTeste);

export default router;