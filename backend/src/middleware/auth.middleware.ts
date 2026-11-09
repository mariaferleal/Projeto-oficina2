
import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import jwt from 'jsonwebtoken';

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

    next();
  } catch {
    res.status(401).json({
      mensagem: 'Token inválido ou expirado.',
    });
  }
}
