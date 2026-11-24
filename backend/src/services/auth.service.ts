
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { registrarPrimeiroAcesso } from './usuario.service.js';

const googleClient = new OAuth2Client();

export class TokenGoogleInvalidoError extends Error {
  constructor() {
    super('TOKEN_GOOGLE_INVALIDO');
    this.name = 'TokenGoogleInvalidoError';
  }
}

function erroDeTokenInvalido(erro: unknown): boolean {
  if (!(erro instanceof Error)) return false;

  const mensagem = erro.message.toLowerCase();

  return [
    'wrong recipient',
    'invalid token signature',
    'token used too late',
    'token used too early',
    'no pem found',
    'invalid token',
    'invalid value for aud',
    'invalid value for iss',
    'jwt malformed',
  ].some((trecho) => mensagem.includes(trecho));
}

export async function autenticarComGoogle(idToken: string) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const jwtSecret = process.env.JWT_SECRET;

  if (!googleClientId || !jwtSecret) {
    throw new Error('Configurações de autenticação não definidas.');
  }

  let ticket;

  try {
    ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });
  } catch (erro) {
    if (erroDeTokenInvalido(erro)) {
      throw new TokenGoogleInvalidoError();
    }

    // Falhas de rede ou do serviço externo não são erros 401.
    throw erro;
  }

  const payload = ticket.getPayload();

  if (
    !payload?.sub ||
    !payload.email ||
    payload.email_verified !== true
  ) {
    throw new TokenGoogleInvalidoError();
  }

  const usuario = await registrarPrimeiroAcesso({
    googleId: payload.sub,
    nome: payload.name || payload.email,
    email: payload.email,
  });

  const token = jwt.sign(
    { sub: usuario.id },
    jwtSecret,
    {
      expiresIn: '1h',
      algorithm: 'HS256',
    },
  );

  return { token, usuario };
}
