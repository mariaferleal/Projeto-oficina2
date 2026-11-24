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

O login usa o Google Identity Services: a interface recebe um `idToken` do Google e a API confere esse token com o Client ID do projeto.

### Para rodar o projeto

1. Peça o Client ID ao grupo. Ele é passado em canal privado e nunca vai para o repositório.
2. No `.env` da raiz, preencha as duas variáveis com o mesmo valor:

   ```
   GOOGLE_CLIENT_ID=<client id>
   VITE_GOOGLE_CLIENT_ID=<client id>
   ```

3. Suba a aplicação e entre em http://localhost:5173. Sem o Client ID, a tela de login mostra "Login com Google não configurado".

Só entram as contas cadastradas como usuários de teste no projeto do Google Cloud. Se a sua não estiver lá, peça para incluírem.

### Como o Client ID foi criado

Feito uma vez, no [Google Cloud Console](https://console.cloud.google.com/). A conta precisa ter a verificação em duas etapas ativada.

1. Criar o projeto **BlocoBot**.
2. Em **APIs e serviços → Tela de consentimento OAuth** (Google Auth Platform), configurar o app:
   - nome do app: BlocoBot;
   - público: **Externo**;
   - status de publicação: **Teste**;
   - usuários de teste: os e-mails do grupo e o do professor.
3. Em **APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth**:
   - tipo de aplicativo: **Aplicativo da Web**;
   - origens JavaScript autorizadas: `http://localhost:5173` e `http://localhost`;
   - URIs de redirecionamento: nenhum, porque o login usa o botão do Google na própria página.
4. Copiar o Client ID gerado para o `.env`. A chave secreta do cliente não é usada.

Para rodar em outro endereço (por exemplo, uma versão publicada), inclua esse endereço nas origens JavaScript autorizadas do mesmo Client ID.

## Testes

```
npm test
npm run test:coverage
```

O banco e o Google são simulados nos testes, então eles rodam sem Docker.
