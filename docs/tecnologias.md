# Tecnologias

| Uso | Tecnologia |
|---|---|
| Interface | React com TypeScript (Vite) |
| Editor de blocos | Blockly, com blocos personalizados e gerador de Portugol próprio |
| Simulação do robô | SVG no navegador |
| Servidor | Node.js com TypeScript e Express |
| Banco de dados | PostgreSQL |
| Login | Conta Google (OAuth 2.0 / Google Identity Services) |
| Testes unitários e de componentes | Vitest e React Testing Library |
| Testes de ponta a ponta | Playwright |
| Ambiente | Docker e Docker Compose |
| Código e integração contínua | GitHub e GitHub Actions |
| Organização das tarefas | Kanban no Jira (cada card referencia a issue do GitHub) |

## Decisões

- **Express** em vez de NestJS: mais simples para o tamanho do projeto e para o prazo de dois sprints.
- **PostgreSQL** (relacional): os dados têm relação clara entre usuário e programas, e a regra de propriedade (RN06) é garantida com chave estrangeira.
- **Sem geração de código em C**: o escopo da primeira versão é apenas Portugol.
