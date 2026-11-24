
import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';
import { sessaoEncerrada } from '../services/sessao.service.js';

export function autenticarJWT(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authorization = req.headers.authorization;

  if (
    !authorization ||
    !/^Bearer\s+\S+$/i.test(authorization)
  ) {
    res.status(401).json({
      mensagem: 'Token de autenticação não informado.',
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({
      mensagem: 'Configuração de autenticação indisponível.',
    });
    return;
  }

  const token = authorization.split(/\s+/)[1];

  if (sessaoEncerrada(token)) {
    res.status(401).json({
      mensagem: 'Sessão encerrada. Entre novamente.',
    });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
    });

    if (
      typeof payload === 'string' ||
      typeof payload.sub !== 'string' ||
      !payload.sub
    ) {
      res.status(401).json({
        mensagem: 'Token de autenticação inválido.',
      });
      return;
    }

    res.locals.usuarioId = payload.sub;
    res.locals.token = token;
    res.locals.expiraEm = payload.exp ?? Math.floor(Date.now() / 1000) + 3600;

    next();
  } catch {
    res.status(401).json({
      mensagem: 'Token inválido ou expirado.',
    });
  }
}
