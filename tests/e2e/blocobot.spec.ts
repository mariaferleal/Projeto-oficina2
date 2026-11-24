import { test, expect, type APIRequestContext, type Page } from '@playwright/test';

const API_URL = process.env.E2E_API_URL ?? 'http://localhost:3001';

// Programa com um bloco "Frente" encaixado em "Ao iniciar", no formato salvo pelo Blockly.
const PROGRAMA_FRENTE = {
  blocks: {
    languageVersion: 0,
    blocks: [{ type: 'bb_start', x: 24, y: 24, inputs: { DO: { block: { type: 'bb_front' } } } }],
  },
};

/** Abre uma sessão do usuário de teste direto na API e devolve o cabeçalho de autorização. */
async function sessaoDeTeste(request: APIRequestContext) {
  const resposta = await request.post(`${API_URL}/api/auth/teste`, { data: {} });
  expect(resposta.ok()).toBeTruthy();
  const { token } = await resposta.json();
  return { Authorization: `Bearer ${token}` };
}

/** Apaga os programas do usuário de teste, para cada teste começar do zero. */
async function limparProgramas(request: APIRequestContext) {
  const headers = await sessaoDeTeste(request);
  const { programas } = await (await request.get(`${API_URL}/api/programas`, { headers })).json();
  for (const programa of programas) {
    await request.delete(`${API_URL}/api/programas/${programa.id}`, { headers });
  }
}

async function entrar(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Entrar como teste' }).click();
  await expect(page.getByRole('button', { name: 'Executar' })).toBeVisible();
}

test.beforeEach(async ({ request }) => {
  await limparProgramas(request);
});

test.afterAll(async ({ request }) => {
  await limparProgramas(request);
});

test('entra, vê o editor de blocos e sai (RF01, RF02)', async ({ page }) => {
  await entrar(page);

  await expect(page.getByText('Aprendiz de Teste')).toBeVisible();
  await expect(page.locator('.blocklyFlyout').getByText('Frente')).toBeVisible();
  await expect(page.locator('.blocklyMainBackground')).toBeVisible();

  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page.getByText('Olá! Eu sou o Bipi.')).toBeVisible();
});

test('mantém a sessão ao recarregar a página', async ({ page }) => {
  await entrar(page);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Executar' })).toBeVisible();
});

test('avisa quando o programa está vazio (RF10)', async ({ page }) => {
  await entrar(page);
  await page.getByRole('button', { name: 'Executar' }).click();
  await expect(page.getByText('Encaixe pelo menos um bloco embaixo de Ao iniciar.')).toBeVisible();
});

test('reabre um programa salvo, executa e salva de novo (RF06 a RF09)', async ({ page, request }) => {
  const headers = await sessaoDeTeste(request);
  const criado = await request.post(`${API_URL}/api/programas`, {
    headers,
    data: { titulo: 'Passo à frente', blocos: PROGRAMA_FRENTE },
  });
  expect(criado.status()).toBe(201);

  await entrar(page);
  await page.getByRole('button', { name: 'Meus programas' }).click();
  await expect(page.getByText('Passo à frente')).toBeVisible();
  await expect(page.getByText('1 bloco', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Abrir programa' }).click();
  await expect(page.locator('.code-window')).toContainText('frente()');

  await page.getByRole('button', { name: 'Executar' }).click();
  await expect(page.getByRole('img', { name: 'Bipi na coluna 3 e linha 2' })).toBeVisible();
  await expect(page.getByText('Programa concluído. Muito bem!')).toBeVisible();

  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Programa salvo na sua coleção.')).toBeVisible();

  await page.getByRole('button', { name: 'Meus programas' }).click();
  await expect(page.getByText('Meu programa 2')).toBeVisible();

  await page.getByRole('button', { name: 'Excluir Passo à frente' }).click();
  await expect(page.getByText('Passo à frente')).toHaveCount(0);
  await expect(page.getByText('Meu programa 2')).toBeVisible();
});
