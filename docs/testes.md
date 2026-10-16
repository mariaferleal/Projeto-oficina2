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
