import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const { query, verifyIdToken } = vi.hoisted(() => ({
  query: vi.fn(),
  verifyIdToken: vi.fn(),
}));

vi.mock('../src/config/database.js', () => ({ pool: { query } }));
vi.mock('google-auth-library', () => ({
  OAuth2Client: class {
    verifyIdToken = verifyIdToken;
  },
}));

const { default: app } = await import('../src/app.js');

const usuario = {
  id: '11111111-1111-4111-8111-111111111111',
  google_id: 'google-123',
  nome: 'Ana',
  email: 'ana@exemplo.com',
};

function tokenGoogleValido(email_verified = true) {
  verifyIdToken.mockResolvedValue({
    getPayload: () => ({ sub: 'google-123', name: 'Ana', email: 'ana@exemplo.com', email_verified }),
  });
}

function tokenDaApi(sub = usuario.id, opcoes: jwt.SignOptions = { expiresIn: '1h' }) {
  return jwt.sign({ sub }, 'segredo-de-teste', { algorithm: 'HS256', ...opcoes });
}

beforeEach(() => {
  query.mockReset();
  verifyIdToken.mockReset();
});

describe('POST /api/auth/google (HU01, HU02)', () => {
  it('recusa a requisição sem token do Google', async () => {
    const resposta = await request(app).post('/api/auth/google').send({});
    expect(resposta.status).toBe(400);
  });

  it('cria a conta no primeiro acesso e devolve a sessão (CT-AUTH-01)', async () => {
    tokenGoogleValido();
    query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [usuario] });

    const resposta = await request(app).post('/api/auth/google').send({ idToken: 'abc' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.usuario.email).toBe('ana@exemplo.com');
    expect(jwt.verify(resposta.body.token, 'segredo-de-teste')).toMatchObject({ sub: usuario.id });
    expect(query).toHaveBeenCalledTimes(2);
    expect(query.mock.calls[1][0]).toContain('INSERT INTO usuarios');
  });

  it('reconhece quem já entrou antes sem criar outra conta (CT-AUTH-02)', async () => {
    tokenGoogleValido();
    query.mockResolvedValueOnce({ rows: [usuario] });

    const resposta = await request(app).post('/api/auth/google').send({ idToken: 'abc' });

    expect(resposta.status).toBe(200);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('recusa token do Google inválido ou expirado (CT-AUTH-08)', async () => {
    verifyIdToken.mockRejectedValue(new Error('Invalid token signature'));
    const resposta = await request(app).post('/api/auth/google').send({ idToken: 'falso' });
    expect(resposta.status).toBe(401);
  });

  it('recusa conta Google com e-mail não verificado', async () => {
    tokenGoogleValido(false);
    const resposta = await request(app).post('/api/auth/google').send({ idToken: 'abc' });
    expect(resposta.status).toBe(401);
  });

  it('responde 500 quando o banco falha (CT-AUTH-10)', async () => {
    tokenGoogleValido();
    query.mockRejectedValue(new Error('conexão recusada'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const resposta = await request(app).post('/api/auth/google').send({ idToken: 'abc' });
    expect(resposta.status).toBe(500);
  });
});

describe('GET /api/auth/me', () => {
  it('exige o token de sessão (CT-API-13)', async () => {
    const resposta = await request(app).get('/api/auth/me');
    expect(resposta.status).toBe(401);
  });

  it('recusa token expirado (CT-AUTH-07)', async () => {
    const expirado = tokenDaApi(usuario.id, { expiresIn: -10 });
    const resposta = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${expirado}`);
    expect(resposta.status).toBe(401);
  });

  it('recusa token com assinatura de outro segredo (CT-AUTH-08)', async () => {
    const falso = jwt.sign({ sub: usuario.id }, 'outro-segredo');
    const resposta = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${falso}`);
    expect(resposta.status).toBe(401);
  });

  it('devolve o usuário autenticado', async () => {
    query.mockResolvedValueOnce({ rows: [usuario] });
    const resposta = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${tokenDaApi()}`);
    expect(resposta.status).toBe(200);
    expect(resposta.body.usuario.id).toBe(usuario.id);
  });

  it('responde 404 quando o usuário não existe mais', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    const resposta = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${tokenDaApi()}`);
    expect(resposta.status).toBe(404);
  });
});

describe('POST /api/auth/logout (HU03)', () => {
  it('encerra a sessão: o mesmo token deixa de valer', async () => {
    const token = tokenDaApi();
    const saida = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${token}`);
    expect(saida.status).toBe(204);

    const depois = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(depois.status).toBe(401);
  });
});

describe('POST /api/auth/teste (TT08)', () => {
  it('entra com um usuário de teste no ambiente de testes', async () => {
    query.mockResolvedValueOnce({ rows: [usuario] });
    const resposta = await request(app).post('/api/auth/teste').send({});
    expect(resposta.status).toBe(200);
    expect(resposta.body.token).toBeTypeOf('string');
  });

  it('não existe fora do ambiente de testes', async () => {
    const anterior = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const resposta = await request(app).post('/api/auth/teste').send({});
    process.env.NODE_ENV = anterior;
    expect(resposta.status).toBe(404);
  });
});
