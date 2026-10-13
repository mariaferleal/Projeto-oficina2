# Processo de desenvolvimento

- **Metodologia:** Scrum com dois sprints de uma semana e revisão ao final de cada um.
- **Issues:** cada funcionalidade é uma issue no GitHub, com critérios de aceite e testes esperados (baseados nos arquivos de `requisitos/`).
- **Commits e pull requests:** sempre referenciam a issue correspondente (ex.: `feat: blocos de movimento (#12)`).
- **Kanban:** quadro no Jira com as colunas Backlog, A fazer, Em andamento, Em revisão e Concluído. Cada card referencia a issue do GitHub.
- **Fim de cada sprint:** vídeo de até 5 minutos com a aplicação, as funcionalidades implementadas e a execução dos testes. Os ajustes pedidos pelo professor viram issues.

## Definição de pronto

Uma issue só vai para "Concluído" quando:

- tem testes automatizados;
- o pull request foi revisado e referencia a issue;
- o CI está verde;
- o card foi movido no Jira.

## Cronograma

| Etapa | Entrega |
|---|---|
| Planejamento | 28/09 |
| Sprint 1 | 16/10 (presencial) |
| Sprint 2 | 30/11 |
| Revisão/recuperação | 1 semana após o Sprint 2, com ajustes definidos pelo professor |

| Sprint | Entregas | Testes |
|---|---|---|
| Sprint 1 | Repositório e ambiente; estrutura da interface; login Google; editor de blocos; movimentos básicos; primeira versão do simulador | Unitários dos movimentos |
| Sprint 2 | Blocos Repetir e Se; gerador de Portugol; salvar e reabrir programas; integração entre módulos; refinamento da interface | Integração e ponta a ponta |
