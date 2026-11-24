import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock('../src/config/database.js', () => ({ pool: { query } }));

const { default: app } = await import('../src/app.js');

const dono = '11111111-1111-4111-8111-111111111111';
const idPrograma = '22222222-2222-4222-8222-222222222222';
const token = jwt.sign({ sub: dono }, 'segredo-de-teste', { algorithm: 'HS256', expiresIn: '1h' });
const auth = { Authorization: `Bearer ${token}` };

const programa = {
  id: idPrograma,
  usuario_id: dono,
  titulo: 'Quadrado',
  blocos: { blocks: { blocks: [] } },
};

beforeEach(() => {
  query.mockReset();
});

describe('/api/programas sem sessão', () => {
  it('bloqueia qualquer rota sem o cabeçalho Authorization (CT-API-13)', async () => {
    for (const chamada of [
      request(app).get('/api/programas'),
      request(app).post('/api/programas').send({ titulo: 'x', blocos: {} }),
      request(app).delete(`/api/programas/${idPrograma}`),
    ]) {
      expect((await chamada).status).toBe(401);
    }
    expect(query).not.toHaveBeenCalled();
  });
});

describe('Salvar programa (HU12)', () => {
  it('cria um programa do usuário autenticado (CT-API-01)', async () => {
    query.mockResolvedValueOnce({ rows: [programa] });
    const resposta = await request(app).post('/api/programas').set(auth).send({ titulo: ' Quadrado ', blocos: programa.blocos });

    expect(resposta.status).toBe(201);
    expect(resposta.body.programa.titulo).toBe('Quadrado');
    expect(query.mock.calls[0][1]).toEqual([dono, 'Quadrado', JSON.stringify(programa.blocos)]);
  });

  it('recusa título ausente ou vazio (CT-API-02)', async () => {
    const resposta = await request(app).post('/api/programas').set(auth).send({ titulo: '  ', blocos: {} });
    expect(resposta.status).toBe(400);
    expect(query).not.toHaveBeenCalled();
  });

  it('recusa título com mais de 100 caracteres (CT-API-03)', async () => {
    const resposta = await request(app).post('/api/programas').set(auth).send({ titulo: 'a'.repeat(101), blocos: {} });
    expect(resposta.status).toBe(400);
  });

  it('recusa estrutura de blocos inválida (CT-API-04)', async () => {
    for (const blocos of [null, 'texto', [1, 2]]) {
      const resposta = await request(app).post('/api/programas').set(auth).send({ titulo: 'Ok', blocos });
      expect(resposta.status).toBe(400);
    }
  });

  it('responde 500 quando o banco falha ao salvar (CT-API-14)', async () => {
    query.mockRejectedValue(new Error('timeout'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const resposta = await request(app).post('/api/programas').set(auth).send({ titulo: 'Ok', blocos: {} });
    expect(resposta.status).toBe(500);
  });
});

describe('Ver e reabrir programas (HU13)', () => {
  it('lista só os programas do usuário (CT-API-05)', async () => {
    query.mockResolvedValueOnce({ rows: [programa] });
    const resposta = await request(app).get('/api/programas').set(auth);
    expect(resposta.status).toBe(200);
    expect(resposta.body.programas).toHaveLength(1);
    expect(query.mock.calls[0][1]).toEqual([dono]);
  });

  it('devolve lista vazia para quem ainda não salvou nada (CT-API-06)', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    const resposta = await request(app).get('/api/programas').set(auth);
    expect(resposta.body.programas).toEqual([]);
  });

  it('reabre um programa do próprio usuário (CT-API-07)', async () => {
    query.mockResolvedValueOnce({ rows: [programa] });
    const resposta = await request(app).get(`/api/programas/${idPrograma}`).set(auth);
    expect(resposta.status).toBe(200);
    expect(resposta.body.programa.id).toBe(idPrograma);
  });

  it('recusa identificador que não é UUID (CT-API-09)', async () => {
    const resposta = await request(app).get('/api/programas/123').set(auth);
    expect(resposta.status).toBe(400);
    expect(query).not.toHaveBeenCalled();
  });
});

describe('Programas protegidos (HU14)', () => {
  it('não abre programa de outro usuário (CT-API-08)', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    const resposta = await request(app).get(`/api/programas/${idPrograma}`).set(auth);
    expect(resposta.status).toBe(404);
    expect(query.mock.calls[0][1]).toEqual([idPrograma, dono]);
  });

  it('atualiza programa do próprio usuário (CT-API-10)', async () => {
    query.mockResolvedValueOnce({ rows: [{ ...programa, titulo: 'Novo' }] });
    const resposta = await request(app).put(`/api/programas/${idPrograma}`).set(auth).send({ titulo: 'Novo', blocos: {} });
    expect(resposta.status).toBe(200);
    expect(resposta.body.programa.titulo).toBe('Novo');
  });

  it('não atualiza programa de outro usuário', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    const resposta = await request(app).put(`/api/programas/${idPrograma}`).set(auth).send({ titulo: 'Novo', blocos: {} });
    expect(resposta.status).toBe(404);
  });

  it('exclui programa do próprio usuário (CT-API-11)', async () => {
    query.mockResolvedValueOnce({ rowCount: 1 });
    const resposta = await request(app).delete(`/api/programas/${idPrograma}`).set(auth);
    expect(resposta.status).toBe(204);
  });

  it('não exclui programa de outro usuário (CT-API-12)', async () => {
    query.mockResolvedValueOnce({ rowCount: 0 });
    const resposta = await request(app).delete(`/api/programas/${idPrograma}`).set(auth);
    expect(resposta.status).toBe(404);
  });
});
