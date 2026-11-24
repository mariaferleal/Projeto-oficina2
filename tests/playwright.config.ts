import { defineConfig, devices } from '@playwright/test';

// Endereços do ambiente de teste (docker compose --profile test).
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:5174';
const API_URL = process.env.E2E_API_URL ?? 'http://localhost:3001';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /* Os testes compartilham o usuário de teste da API, então rodam um de cada vez. */
  fullyParallel: false,
  workers: 1,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Sobe a interface apontando para a API de teste, com o login simulado ligado. */
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5174',
    url: 'http://127.0.0.1:5174/',
    cwd: '../frontend',
    env: {
      VITE_API_URL: API_URL,
      VITE_LOGIN_TESTE: 'true',
    },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
