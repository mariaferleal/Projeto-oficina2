# Ferramenta de programação em blocos

Projeto da disciplina Oficina 2 (UTFPR).

O usuário monta um programa arrastando blocos e a ferramenta gera o código em Portugol e em C. Os blocos controlam os movimentos básicos de um robô (frente, trás, direita, esquerda), além de repetir e da condicional Se. O cadastro é feito no sistema e o login pode ser feito com a conta Google.

## Equipe

| Pessoa | Responsabilidade |
|---|---|
| Luana | PO e documentação |
| Mafe | Design e front |
| Kenji | Front |
| Ricardo | Back e banco |
| Paulo | Testes e banco |

Todos se ajudam. O responsável de cada área garante a entrega e cuida dos documentos daquela área.

## Como rodar

Você precisa do Docker instalado.

```
cp .env.example .env
docker compose up --build
```

- Interface em http://localhost:5173
- Servidor em http://localhost:3000

## Como rodar os testes

```
cd frontend && npm test
cd backend && npm test
```

Os testes também rodam sozinhos no GitHub Actions a cada envio de código. Veja mais em `docs/testes.md`.

## Organização do projeto

- Scrum com sprints de duas semanas
- Tarefas no Jira
- Reunião com o professor a cada duas semanas

