
import type { Request, Response } from 'express';

import {
  autenticarComGoogle,
  TokenGoogleInvalidoError,
} from '../services/auth.service.js';

import { buscarUsuarioPorId } from '../repositories/usuario.repository.js';
import { encerrarSessao } from '../services/sessao.service.js';
import { registrarPrimeiroAcesso } from '../services/usuario.service.js';
import jwt from 'jsonwebtoken';

export async function loginGoogle(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { idToken } = req.body ?? {};

    if (typeof idToken !== 'string' || !idToken.trim()) {
      res.status(400).json({
        mensagem: 'O token Google é obrigatório.',
      });
      return;
    }

    const resultado = await autenticarComGoogle(idToken);

    res.status(200).json(resultado);
  } catch (erro) {
    if (erro instanceof TokenGoogleInvalidoError) {
      res.status(401).json({
        mensagem: 'Token Google inválido ou expirado.',
      });
      return;
    }

    console.error('Erro interno na autenticação:', erro);

    res.status(500).json({
      mensagem: 'Erro interno ao realizar autenticação.',
    });
  }
}

export async function obterUsuarioAutenticado(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const usuarioId: unknown = res.locals.usuarioId;

    if (typeof usuarioId !== 'string' || !usuarioId) {
      res.status(401).json({
        mensagem: 'Usuário não autenticado.',
      });
      return;
    }

    const usuario = await buscarUsuarioPorId(usuarioId);

    if (!usuario) {
      res.status(404).json({
        mensagem: 'Usuário não encontrado.',
      });
      return;
    }

    res.status(200).json({ usuario });
  } catch (erro) {
    console.error('Erro ao consultar usuário:', erro);

    res.status(500).json({
      mensagem: 'Erro interno ao consultar usuário.',
    });
  }
}

export function logout(_req: Request, res: Response): void {
  encerrarSessao(res.locals.token, res.locals.expiraEm);
  res.status(204).end();
}

/**
 * Login simulado para os testes de ponta a ponta (TT08).
 * Só existe quando NODE_ENV=test; em qualquer outro ambiente responde 404.
 */
export async function loginDeTeste(req: Request, res: Response): Promise<void> {
  const jwtSecret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV !== 'test' || !jwtSecret) {
    res.status(404).json({ mensagem: 'Rota não encontrada.' });
    return;
  }
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email : 'aprendiz@teste.local';
    const usuario = await registrarPrimeiroAcesso({
      googleId: `teste-${email}`,
      nome: 'Aprendiz de Teste',
      email,
    });
    const token = jwt.sign({ sub: usuario.id }, jwtSecret, { expiresIn: '1h', algorithm: 'HS256' });
    res.status(200).json({ token, usuario });
  } catch (erro) {
    console.error('Erro no login de teste:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao realizar autenticação.' });
  }
}
