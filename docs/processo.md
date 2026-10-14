# Processo de desenvolvimento

- **Metodologia:** Scrum com uma Sprint 0 de preparação e duas sprints de desenvolvimento, com revisão ao final de cada uma.
- **Issues:** cada funcionalidade é uma issue no GitHub, com critérios de aceite e testes esperados (baseados nos arquivos de `requisitos/`).
- **Commits e pull requests:** sempre referenciam a issue correspondente (ex.: `feat: blocos de movimento (#12)`).
- **Kanban:** quadro no [GitHub Projects](https://github.com/users/LunnaFM/projects/1) com as colunas Backlog, A fazer, Em andamento, Em revisão e Concluído. Cada card é a própria issue, e as issues fechadas por pull request vão automaticamente para Concluído.
- **Fim de cada sprint:** vídeo de até 5 minutos com a aplicação, as funcionalidades implementadas e a execução dos testes. Os ajustes pedidos pelo professor viram issues.

## Definição de pronto

Uma issue só vai para "Concluído" quando:

- tem testes automatizados;
- o pull request foi revisado e referencia a issue;
- o CI está verde;
- o card está em Concluído no quadro.

## Cronograma

| Etapa | Período | Entrega |
|---|---|---|
| Planejamento | até 28/09 | Documento de planejamento |
| Sprint 0 | 29/09 a 16/10 | Reunião presencial em 16/10 |
| Sprint 1 | 17/10 a 07/11 | 07/11 |
| Sprint 2 | 08/11 a 30/11 | 30/11 |
| Revisão/recuperação | Após a Sprint 2 | Ajustes definidos pelo professor |

| Sprint | Entregas | Testes |
|---|---|---|
| Sprint 0 | Documento de planejamento; requisitos e histórias de usuário; quadro Kanban; ambiente Docker; Playwright e CI; projetos base do front e do back; configuração do Google OAuth; formato do programa | Teste de fumaça e CI rodando |
| Sprint 1 | Login Google e tabela de usuários; editor de blocos; movimentos básicos; simulador e limites da área | Unitários dos movimentos e do simulador |
| Sprint 2 | Blocos Repetir e Se; gerador de Portugol; salvar e reabrir programas; integração entre módulos; refinamento da interface | Integração e ponta a ponta |
