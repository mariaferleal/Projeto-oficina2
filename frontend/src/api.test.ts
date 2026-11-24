import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "./api";

const resposta = (status: number, corpo?: unknown) =>
  ({
    status,
    ok: status >= 200 && status < 300,
    json: corpo === undefined ? () => Promise.reject(new Error("sem corpo")) : () => Promise.resolve(corpo),
  }) as Response;

const fetchMock = vi.fn<typeof fetch>();
const usuario = { id: "u1", nome: "Ana", email: "ana@exemplo.com" };

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

const chamada = (indice = 0) => {
  const [url, opcoes] = fetchMock.mock.calls[indice];
  return { url: String(url), opcoes: opcoes as RequestInit & { headers: Record<string, string> } };
};

describe("sessão", () => {
  it("guarda, lê e limpa o token", () => {
    expect(api.tokenAtual()).toBeNull();
    api.guardarSessao("abc");
    expect(api.tokenAtual()).toBe("abc");
    api.limparSessao();
    expect(api.tokenAtual()).toBeNull();
  });

  it("entra com o Google e guarda o token devolvido pela API", async () => {
    fetchMock.mockResolvedValue(resposta(200, { token: "jwt", usuario }));
    await expect(api.entrarComGoogle("id-token")).resolves.toEqual(usuario);
    expect(chamada().url).toBe(`${api.API_URL}/api/auth/google`);
    expect(chamada().opcoes.method).toBe("POST");
    expect(JSON.parse(String(chamada().opcoes.body))).toEqual({ idToken: "id-token" });
    expect(api.tokenAtual()).toBe("jwt");
  });

  it("entra com o login de teste", async () => {
    fetchMock.mockResolvedValue(resposta(200, { token: "jwt-teste", usuario }));
    await api.entrarComoTeste();
    expect(chamada().url).toBe(`${api.API_URL}/api/auth/teste`);
    expect(api.tokenAtual()).toBe("jwt-teste");
  });

  it("não guarda sessão quando o login é recusado", async () => {
    fetchMock.mockResolvedValue(resposta(401, { mensagem: "Token do Google inválido." }));
    await expect(api.entrarComGoogle("ruim")).rejects.toMatchObject({
      name: "ErroDaApi",
      status: 401,
      message: "Token do Google inválido.",
    });
    expect(api.tokenAtual()).toBeNull();
  });

  it("não consulta a API quando não há token", async () => {
    await expect(api.usuarioDaSessao()).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("devolve o usuário da sessão e envia o token no cabeçalho", async () => {
    api.guardarSessao("jwt");
    fetchMock.mockResolvedValue(resposta(200, { usuario }));
    await expect(api.usuarioDaSessao()).resolves.toEqual(usuario);
    expect(chamada().opcoes.headers.Authorization).toBe("Bearer jwt");
  });

  it("limpa a sessão quando o token expirou", async () => {
    api.guardarSessao("vencido");
    fetchMock.mockResolvedValue(resposta(401, { mensagem: "Sessão expirada." }));
    await expect(api.usuarioDaSessao()).resolves.toBeNull();
    expect(api.tokenAtual()).toBeNull();
  });

  it("limpa a sessão quando a API está fora do ar", async () => {
    api.guardarSessao("jwt");
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(api.usuarioDaSessao()).resolves.toBeNull();
    expect(api.tokenAtual()).toBeNull();
  });
});

describe("programas", () => {
  const programa = { id: "p1", titulo: "Passeio", blocos: { blocks: {} }, atualizado_em: "2026-11-24T12:00:00Z" };

  beforeEach(() => api.guardarSessao("jwt"));

  it("lista os programas do usuário", async () => {
    fetchMock.mockResolvedValue(resposta(200, { programas: [programa] }));
    await expect(api.listarProgramas()).resolves.toEqual([programa]);
    expect(chamada().url).toBe(`${api.API_URL}/api/programas`);
    expect(chamada().opcoes.headers.Authorization).toBe("Bearer jwt");
  });

  it("salva um programa com título e blocos", async () => {
    fetchMock.mockResolvedValue(resposta(201, { programa }));
    await expect(api.salvarPrograma("Passeio", { blocks: {} })).resolves.toEqual(programa);
    expect(chamada().opcoes.method).toBe("POST");
    expect(JSON.parse(String(chamada().opcoes.body))).toEqual({ titulo: "Passeio", blocos: { blocks: {} } });
  });

  it("exclui um programa e aceita a resposta sem corpo", async () => {
    fetchMock.mockResolvedValue(resposta(204));
    await expect(api.excluirPrograma("p1")).resolves.toBeUndefined();
    expect(chamada().url).toBe(`${api.API_URL}/api/programas/p1`);
    expect(chamada().opcoes.method).toBe("DELETE");
  });

  it("usa uma mensagem padrão quando o erro vem sem corpo", async () => {
    fetchMock.mockResolvedValue(resposta(500));
    await expect(api.listarProgramas()).rejects.toMatchObject({
      status: 500,
      message: "Não foi possível falar com o servidor.",
    });
  });

  it("mantém a sessão em erros que não são de autenticação", async () => {
    fetchMock.mockResolvedValue(resposta(404, { mensagem: "Programa não encontrado." }));
    await expect(api.excluirPrograma("outro")).rejects.toMatchObject({ status: 404 });
    expect(api.tokenAtual()).toBe("jwt");
  });
});
