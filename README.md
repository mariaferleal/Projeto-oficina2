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

## Planejamento

| Período | Atividade |
|---|---|
| 28/09 a 02/10 | Montar o Jira e cadastrar os requisitos |
| 28/09 a 02/10 | Fechar as perguntas para o professor |
| 30/09 | Reunião com o professor (prevista) |
| 28/09 a 02/10 | Desenhar os fluxos das telas |
| 28/09 a 02/10 | Escolher as ferramentas do front |
| 28/09 a 02/10 | Decidir servidor e banco de dados |
| 05/10 a 09/10 | Criar o repositório e enviar os arquivos iniciais |
| 05/10 a 09/10 | Escrever o README e a descrição do sistema |
| 05/10 a 09/10 | Montar o ambiente do servidor e do banco |
| 05/10 a 09/10 | Montar o ambiente do front e o protótipo das telas |
| 05/10 a 09/10 | Definir os testes e a automação |
| 05/10 a 09/10 | Fazer o diagrama de arquitetura |
| 05/10 a 09/10 | Fechar a lista de requisitos funcionais |
| 13/10 | Revisar todos os documentos e o repositório |
| 14/10 | Reunião com o professor (prevista) |
| 15/10 | Ensaiar a apresentação |
| 16/10 | Apresentação |

