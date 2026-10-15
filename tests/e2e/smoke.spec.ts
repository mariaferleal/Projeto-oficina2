import { test, expect } from '@playwright/test';

// Teste de fumaça: confirma que a interface do BlocoBot sobe no ambiente de teste.
test('a tela inicial carrega', async ({ page }) => {
  const resposta = await page.goto('/');
  expect(resposta?.ok()).toBeTruthy();
});
