# Backend

Servidor em Node com TypeScript e Express. Cuida do login com Google, do cadastro dos usuários e dos programas salvos.

Responsáveis: Ricardo (back) e Paulo (testes).

## Rotas

| Método e rota | Sessão | O que faz |
|---|---|---|
| `GET /health` | não | Verifica se a API está no ar |
| `POST /api/auth/google` | não | Recebe o `idToken` do Google, cria o usuário no primeiro acesso e devolve `{ token, usuario }` |
| `GET /api/auth/me` | sim | Devolve o usuário da sessão |
| `POST /api/auth/logout` | sim | Encerra a sessão; o mesmo token passa a receber `401` |
| `POST /api/auth/teste` | não | Login simulado para os testes E2E; só existe com `NODE_ENV=test` |
| `GET /api/programas` | sim | Lista os programas do usuário |
| `GET /api/programas/:id` | sim | Abre um programa do usuário |
| `POST /api/programas` | sim | Salva um programa `{ titulo, blocos }` |
| `PUT /api/programas/:id` | sim | Atualiza um programa do usuário |
| `DELETE /api/programas/:id` | sim | Exclui um programa do usuário |

Rotas com sessão exigem o cabeçalho `Authorization: Bearer <token>`. Um usuário nunca lê, altera ou exclui programa de outro: para ele a resposta é `404`.

## Banco de dados

As migrations ficam em `migrations/` e rodam sozinhas ao subir o servidor (`npm run dev`), ou com `npm run db:migrate`.

- `001_criar_usuarios.sql`: tabela `usuarios`
- `002_criar_programas.sql`: tabela `programas`, ligada ao dono

## Login com Google

1. No [Google Cloud Console](https://console.cloud.google.com/), o projeto **BlocoBot** tem um Client ID do tipo "Aplicativo da Web" com a origem `http://localhost:5173`.
2. Coloque o Client ID no `.env` em `GOOGLE_CLIENT_ID` e `VITE_GOOGLE_CLIENT_ID`. O Client ID é passado pelo grupo em canal privado e nunca vai para o repositório.

## Testes

```
npm test
npm run test:coverage
```

O banco e o Google são simulados nos testes, então eles rodam sem Docker.
