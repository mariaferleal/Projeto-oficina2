/** Cliente da API do BlocoBot. O token da sessão fica no sessionStorage. */

const CHAVE_TOKEN = 'blocobot.token';

export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export type Usuario = { id: string; nome: string; email: string };

export type ProgramaSalvo = {
  id: string;
  titulo: string;
  blocos: Record<string, unknown>;
  atualizado_em: string;
};

export class ErroDaApi extends Error {
  constructor(public status: number, mensagem: string) {
    super(mensagem);
    this.name = 'ErroDaApi';
  }
}

export function tokenAtual(): string | null {
  return sessionStorage.getItem(CHAVE_TOKEN);
}

export function guardarSessao(token: string): void {
  sessionStorage.setItem(CHAVE_TOKEN, token);
}

export function limparSessao(): void {
  sessionStorage.removeItem(CHAVE_TOKEN);
}

async function chamar<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const token = tokenAtual();
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  });

  if (resposta.status === 401) limparSessao();
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => ({}));
    throw new ErroDaApi(resposta.status, corpo.mensagem ?? 'Não foi possível falar com o servidor.');
  }
  return resposta.status === 204 ? (undefined as T) : resposta.json();
}

async function entrar(caminho: string, corpo: object): Promise<Usuario> {
  const { token, usuario } = await chamar<{ token: string; usuario: Usuario }>(caminho, {
    method: 'POST',
    body: JSON.stringify(corpo),
  });
  guardarSessao(token);
  return usuario;
}

/** Troca o idToken do Google por uma sessão da API (HU01, HU02). */
export const entrarComGoogle = (idToken: string) => entrar('/api/auth/google', { idToken });

/** Login simulado, aceito só quando a API roda com NODE_ENV=test (TT08). */
export const entrarComoTeste = () => entrar('/api/auth/teste', {});

export async function usuarioDaSessao(): Promise<Usuario | null> {
  if (!tokenAtual()) return null;
  try {
    const { usuario } = await chamar<{ usuario: Usuario }>('/api/auth/me');
    return usuario;
  } catch {
    limparSessao();
    return null;
  }
}

export async function listarProgramas(): Promise<ProgramaSalvo[]> {
  const { programas } = await chamar<{ programas: ProgramaSalvo[] }>('/api/programas');
  return programas;
}

export async function salvarPrograma(titulo: string, blocos: Record<string, unknown>): Promise<ProgramaSalvo> {
  const { programa } = await chamar<{ programa: ProgramaSalvo }>('/api/programas', {
    method: 'POST',
    body: JSON.stringify({ titulo, blocos }),
  });
  return programa;
}

export async function excluirPrograma(id: string): Promise<void> {
  await chamar<void>(`/api/programas/${id}`, { method: 'DELETE' });
}
