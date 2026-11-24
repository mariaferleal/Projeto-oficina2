# Estratégia de testes automatizados

Responsável: Paulo.

| Tipo | O que testa | Ferramenta |
|---|---|---|
| Unitário | Interpretador (movimentos, Repetir, Se, limite da área) e gerador de Portugol | Vitest |
| Componentes | Editor, área do robô e painel de código | Vitest e React Testing Library |
| Integração | Login Google, criação do usuário, salvar, listar e reabrir programas, isolamento entre contas | Vitest |
| Ponta a ponta | Login com usuário simulado, montar blocos, executar, conferir o código, salvar e reabrir | Playwright |

A cobertura é acompanhada por módulo e por sprint, com meta de pelo menos 80% no interpretador e no gerador.

O plano de teste, os casos de teste e a matriz de rastreabilidade estão na pasta [`tests/docs`](../tests/docs).

## Quando rodam

Todos os testes rodam no GitHub Actions a cada envio de código e a cada pull request.

## Quando um teste é aprovado

- Todos os testes passam
- Um pull request só entra na branch principal com os testes passando

## O que está automatizado

| Onde | Arquivo | O que cobre | Requisitos |
|---|---|---|---|
| Back-end | `backend/tests/auth.test.ts` | Login com Google, criação do usuário no primeiro acesso, sessão, logout e login simulado | RF01 |
| Back-end | `backend/tests/programas.test.ts` | Salvar, listar, abrir, atualizar e excluir programas; um usuário não acessa programa de outro | RF08, RF09 |
| Back-end | `backend/tests/health.test.ts` | Rota de saúde | — |
| Front-end | `frontend/src/blockly/interpreter.test.ts` | Movimentos, limites da área, Repetir, Se na borda e blocos desativados | RF03 a RF06 |
| Front-end | `frontend/src/blockly/validate.test.ts` | Aviso de programa vazio ou incompleto | RF10 |
| Front-end | `frontend/src/blockly/portugol.test.ts` | Código em Portugol gerado a partir dos blocos | RF07 |
| Front-end | `frontend/src/api.test.ts` | Cliente da API e sessão no navegador | RF01, RF08, RF09 |
| Front-end | `frontend/src/components/GoogleLogin.test.tsx` | Botão "Entrar com Google" | RF01 |
| Front-end | `frontend/src/App.test.tsx` | Telas de login, editor e "Meus programas" | RF01, RF06, RF08 a RF10 |
| Ponta a ponta | `tests/e2e/blocobot.spec.ts` | Entrar, ver o editor, avisar programa vazio, reabrir, executar, salvar e excluir um programa | RF01, RF02, RF06 a RF10 |

Nos testes unitários e de integração o banco e o Google são simulados. Nos testes de ponta a ponta a API e o banco são reais (Docker) e o login usa o usuário simulado.

### Limites conhecidos

- Arrastar e encaixar blocos com o mouse (RF02) não tem teste automatizado. Os testes de ponta a ponta abrem um programa já salvo em vez de montar um do zero.
- O login com uma conta Google de verdade é conferido à mão, porque depende da tela do Google.
- O componente que desenha a área de blocos (`BlockWorkspace.tsx`) só é exercitado nos testes de ponta a ponta, então não entra na cobertura medida pelo Vitest.

### Cobertura

O relatório de cada projeto é publicado como artefato em toda execução do CI, e o resumo aparece na página da execução. Para gerar localmente: `npm run test:coverage` em `frontend/` e em `backend/`.
