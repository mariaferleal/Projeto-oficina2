# BlocoBot — programando passo a passo

Projeto da disciplina Oficina de Integração 2 (UTFPR).

O BlocoBot é uma aplicação web educativa de programação em blocos. O usuário monta um programa encaixando blocos e controla um robô virtual na tela: frente, trás, direita, esquerda, repetir (1 a 10 vezes) e a condição Se (robô na borda). A cada alteração, o programa é traduzido automaticamente para Portugol. O acesso é feito somente com a conta Google, e o cadastro é criado automaticamente no primeiro login.

## Documentação

| Documento | Conteúdo |
|---|---|
| [Descrição do sistema](docs/descricao-do-sistema.md) | Proposta, objetivos, limites e usuários |
| [Requisitos](requisitos/README.md) | Requisitos funcionais, não funcionais e regras de negócio |
| [Arquitetura](docs/arquitetura.md) | Componentes e fluxos do sistema |
| [Tecnologias](docs/tecnologias.md) | Ferramentas adotadas e decisões |
| [Testes](docs/testes.md) | Estratégia de testes automatizados ([plano e casos de teste](tests/)) |
| [Processo e cronograma](docs/processo.md) | Scrum, issues, Kanban, definição de pronto e datas |

Quadro Kanban: [BlocoBot — Kanban](https://github.com/users/LunnaFM/projects/1) (GitHub Projects). As histórias de usuário e tarefas de cada sprint estão nas [issues](https://github.com/mariaferleal/Projeto-oficina2/issues), organizadas pelos milestones Sprint 1 e Sprint 2.

## Equipe

| Pessoa | Responsabilidade |
|---|---|
| Luana | PO e documentação |
| Mafe | Design e front |
| Kenji | Front |
| Ricardo | Back e banco |
| Paulo | Testes e banco |

Todos se ajudam. O responsável de cada área garante a entrega e cuida dos documentos daquela área. As atividades de cada integrante ficam registradas nas issues, commits e pull requests.

## Como rodar

Você precisa do Docker instalado.

```
cp .env.example .env
docker compose --profile dev up --build
```

- Interface em http://localhost:5173
- Servidor em http://localhost:3000

## Como rodar os testes unitários

```
cd frontend && npm test
cd backend && npm test
```

## Como rodar os testes ponta a ponta (E2E)

**Ligue o ambiente de testes em segundo plano (-d)**
```
docker compose --profile test up -d
```

**Rode os testes E2E**
```
cd tests && npm run test
```

**Ao finalizar, desligue o ambiente**
```
docker compose --profile test down
```

Os testes também rodam sozinhos no GitHub Actions a cada envio de código. Veja mais em `docs/testes.md`.

## Cronograma

| Etapa | Entrega |
|---|---|
| Planejamento | 28/09 |
| Sprint 1 | 16/10 (presencial) |
| Sprint 2 | 30/11 |

Detalhes de cada sprint em [`docs/processo.md`](docs/processo.md).
