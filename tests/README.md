# Testes do BlocoBot

| Documento | Conteúdo |
|---|---|
| [Plano de Teste](./TestPlan-v1.0.md) | Estratégia, tipos de teste, ferramentas e critérios de qualidade |
| [Casos de Teste](./TestCases-v4.md) | Classes de equivalência e casos de teste de autenticação, editor/simulador e API |
| [Matriz de Rastreabilidade](./ResponsabilityMatrix-v1.0.md) | Ligação entre requisitos (RF, RNF e RN) e casos de teste |

## Automação

- Testes de ponta a ponta com Playwright em [`e2e/`](./e2e) (configuração em `playwright.config.ts`).
- Testes unitários e de integração com Vitest ficam em `frontend/` e `backend/`.
- Todos rodam no GitHub Actions a cada envio de código. Como rodar localmente: veja o [README principal](../README.md).
