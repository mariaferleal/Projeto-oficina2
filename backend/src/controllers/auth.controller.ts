
import type { Request, Response } from 'express';

import {
  autenticarComGoogle,
  TokenGoogleInvalidoError,
} from '../services/auth.service.js';

import { buscarUsuarioPorId } from '../repositories/usuario.repository.js';

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
