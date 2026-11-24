/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  /** "true" mostra o botão de login simulado (testes E2E). */
  readonly VITE_LOGIN_TESTE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
