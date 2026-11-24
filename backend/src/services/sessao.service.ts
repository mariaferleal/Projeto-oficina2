// Tokens encerrados pelo logout (HU03). Ficam em memória até expirar.
const tokensEncerrados = new Map<string, number>();

export function encerrarSessao(token: string, expiraEmSegundos: number): void {
  tokensEncerrados.set(token, expiraEmSegundos * 1000);
}

export function sessaoEncerrada(token: string): boolean {
  const expiraEm = tokensEncerrados.get(token);
  if (expiraEm === undefined) return false;
  if (expiraEm < Date.now()) {
    tokensEncerrados.delete(token);
    return false;
  }
  return true;
}
