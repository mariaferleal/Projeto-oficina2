**Navegação Rápida:** 
[Matriz de Rastreabilidade](./ResponsabilityMatrix-v1.0.md) | [Casos de Teste](./TestCases-v4.md) | [Plano de Teste](./TestPlan-v1.0.md)

---
# BlocoBot - Casos de Teste (v4.0)

| BlocoBot - Casos de Teste | Versão 4.0 |
| :--- | :---: |
| **Preparado por** | Paulo André |
| **Data** | 11/10/2026 |

---

# Matriz de Classes de Equivalência e Casos de Teste — BlocoBot (v4)

Este documento reúne o mapeamento sistemático de **Particionamento em Classes de Equivalência** (seguindo os princípios metodológicos de *Marcio Eduardo Delamaro*) e a especificação detalhada de **Casos de Teste** para os três módulos centrais da aplicação educativa **BlocoBot**.

---

## Módulo 1: Autenticação Google OAuth 2.0 & Gestão de Perfil

### 1.1 Matriz de Classes de Equivalência

| ID | Condição / Variável de Entrada | Classe de Equivalência | Tipo |
| :--- | :--- | :--- | :--- |
| **CE-AUTH-01** | Provedor de Login | Botão/Fluxo oficial do Google OAuth 2.0 | **Válida** |
| **CE-AUTH-02** | Provedor de Login | Tentativa via e-mail/senha tradicional ou outro provedor | **Inválida** |
| **CE-AUTH-03** | Parâmetro `client_id` | `client_id` do BlocoBot registrado no Console Google Cloud | **Válida** |
| **CE-AUTH-04** | Parâmetro `client_id` | `client_id` ausente, malformado ou não reconhecido | **Inválida** |
| **CE-AUTH-05** | Parâmetro `redirect_uri` | URI idêntica à cadastrada no Google Cloud (`http://localhost:5173/callback`) | **Válida** |
| **CE-AUTH-06** | Parâmetro `redirect_uri` | URI diferente da cadastrada no painel (`redirect_uri_mismatch`) | **Inválida** |
| **CE-AUTH-07** | Parâmetro `scope` | Escopos básicos autorizados (`email`, `profile`, `openid`) | **Válida** |
| **CE-AUTH-08** | Parâmetro `scope` | Escopo ausente, não suportado ou negado na tela de consentimento | **Inválida** |
| **CE-AUTH-09** | Parâmetro `state` (CSRF) | String de estado idêntica entre a solicitação e o retorno do callback | **Válida** |
| **CE-AUTH-10** | Parâmetro `state` (CSRF) | String de estado alterada, divergente ou ausente no callback | **Inválida** |
| **CE-AUTH-11** | `authorization_code` | Código retornado pelo Google válido e não utilizado previamente | **Válida** |
| **CE-AUTH-12** | `authorization_code` | Código expirado ou tentativa de reuso (*code reuse*) | **Inválida** |
| **CE-AUTH-13** | Integridade do `access_token` | Token assinado pelo Google, não adulterado e dentro da expiração | **Válida** |
| **CE-AUTH-14** | Integridade do `access_token` | Token expirado (`exp` passado) | **Inválida** |
| **CE-AUTH-15** | Integridade do `access_token` | Token com assinatura inválida, adulterado ou inexistente | **Inválida** |
| **CE-AUTH-16** | Status do `refresh_token` | Token ativo para renovação de sessão | **Válida** |
| **CE-AUTH-17** | Status do `refresh_token` | Token revogado pelo usuário no Google ou inativo por mais de 6 meses | **Inválida** |
| **CE-AUTH-18** | Cadastro no Banco (PostgreSQL) | E-mail do token referente a um usuário cadastrado no banco | **Válida** |
| **CE-AUTH-19** | Cadastro no Banco (PostgreSQL) | E-mail inédito (primeiro acesso — gera cadastro automático) | **Válida** |
| **CE-AUTH-20** | Conexão com Banco de Dados | Falha de conexão/timeout com a instância PostgreSQL de teste | **Inválida** |

---

### 1.2 Casos de Teste Derivados (Especificação Completa)

| ID do CT | Descrição / Objetivo | Pré-condição | Entradas | Procedimento de Execução | Saída Desejada (Resultado Esperado) | Classes Cobertas |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CT-AUTH-01** | Validar criação automática de conta e login no primeiro acesso via Google. | Aplicação BlocoBot aberta na tela inicial; e-mail `novo@univ.edu` sem cadastro prévio no banco. | Credenciais válidas da conta Google (`novo@univ.edu`), `client_id` e `scope` configurados. | 1. Clicar no botão "Entrar com Google".<br>2. Inserir e-mail e senha no pop-up do Google.<br>3. Autorizar as permissões solicitadas (`email`, `profile`).<br>4. Aguardar o retorno do callback. | Conta criada automaticamente no PostgreSQL, token JWT retornado, sessão iniciada e redirecionamento para o editor visual. | CE-AUTH-01, CE-AUTH-03, CE-AUTH-05, CE-AUTH-07, CE-AUTH-09, CE-AUTH-11, CE-AUTH-13, CE-AUTH-19 |
| **CT-AUTH-02** | Validar login e recuperação de projetos salvos de usuário já cadastrado. | Usuário com e-mail `aluno@univ.edu` já cadastrado no banco PostgreSQL com programas salvos. | Credenciais válidas do Google (`aluno@univ.edu`), token de acesso válido. | 1. Acessar a tela inicial do BlocoBot.<br>2. Clicar em "Entrar com Google".<br>3. Confirmar login na conta pré-existente. | Sessão iniciada com sucesso e lista de programas salvos do usuário carregada automaticamente no painel. | CE-AUTH-01, CE-AUTH-03, CE-AUTH-05, CE-AUTH-07, CE-AUTH-09, CE-AUTH-11, CE-AUTH-13, CE-AUTH-18 |
| **CT-AUTH-03** | Impedir tentativa de autenticação por método não suportado (e-mail/senha). | API do BlocoBot em execução. | Payload HTTP POST para `/api/login` contendo `{ "email": "teste@univ.edu", "password": "123" }`. | 1. Enviar requisição POST direta para a rota de login sem passar pelo OAuth 2.0. | API rejeita a requisição retornando status HTTP `400 Bad Request` com mensagem "Autenticação permitida exclusivamente via Google OAuth 2.0" (RN01). | CE-AUTH-02 |
| **CT-AUTH-04** | Tratar cancelamento da tela de consentimento do Google pelo usuário. | Pop-up de login do Google aberto na tela de permissões. | Ação de fechamento/cancelamento da janela pelo usuário. | 1. Clicar em "Entrar com Google".<br>2. Na janela de consentimento do Google, clicar em "Cancelar" ou fechar o pop-up. | Pop-up fecha, usuário permanece não autenticado na tela inicial e nenhuma alteração é realizada no banco. | CE-AUTH-08 |
| **CT-AUTH-05** | Bloquear callback OAuth com parâmetro `state` divergente (proteção CSRF). | Solicitação de login iniciada gerando `state="abc123hash"`. | Callback recebido contendo `state="xyz999alterado"`. | 1. Iniciar fluxo de login.<br>2. Intercept do callback e alterar o valor do parâmetro `state`. | Aplicação rejeita o callback com erro de validação CSRF (HTTP `400 Bad Request`) e impede o estabelecimento da sessão. | CE-AUTH-10 |
| **CT-AUTH-06** | Rejeitar tentativa de reuso de `authorization_code`. | Código de autorização `code_789` já utilizado anteriormente em uma troca de token. | Requisição POST para a API contendo `code="code_789"`. | 1. Enviar requisição de troca de token reaproveitando um código de autorização já consumido. | API rejeita a solicitação com status HTTP `400 Invalid Grant` / `Bad Request`. | CE-AUTH-12 |
| **CT-AUTH-07** | Negar acesso a rotas protegidas ao apresentar token expirado. | Token de acesso JWT com o campo `exp` referente a um horário passado. | Requisição HTTP GET `/api/programas` com cabeçalho `Authorization: Bearer <token_expirado>`. | 1. Enviar requisição para buscar programas incluindo o token expirado. | API responde com HTTP `401 Unauthorized` e mensagem solicitando renovação ou novo login. | CE-AUTH-14 |
| **CT-AUTH-08** | Negar acesso ao apresentar token com assinatura corrompida. | Token JWT com payload ou assinatura adulterada no cliente. | Requisição HTTP POST `/api/programas` com `Authorization: Bearer <token_invalid_signature>`. | 1. Tentar salvar um programa enviando token com assinatura alterada. | API responde com HTTP `401 Unauthorized` por falha de integridade do token. | CE-AUTH-15 |
| **CT-AUTH-09** | Encerrar sessão ao tentar renovação com `refresh_token` revogado. | Usuário revogou o acesso do BlocoBot no painel de segurança da conta Google. | Requisição de renovação de token enviando `refresh_token` revogado. | 1. Acionar renovação automática de sessão na API. | API responde com HTTP `401 Unauthorized`, limpa os tokens armazenados e redireciona o usuário para a tela de login. | CE-AUTH-17 |
| **CT-AUTH-10** | Tratar falha de comunicação com o banco de dados durante a autenticação. | Instância PostgreSQL de teste indisponível ou offline. | Token Google válido, tentativa de login. | 1. Tentar realizar login no BlocoBot enquanto o banco PostgreSQL estiver offline. | API responde com HTTP `500 Internal Server Error` e a interface exibe mensagem amigável: "Serviço temporariamente indisponível". | CE-AUTH-20 |

---

## Módulo 2: Editor Visual Blockly, Comandos de Movimentação e Estruturas de Controle (`Repetir` e `Se`)

### 2.1 Matriz de Classes de Equivalência

| ID | Condição / Variável de Entrada | Classe de Equivalência | Tipo |
| :--- | :--- | :--- | :--- |
| **CE-BLK-01** | Estado do Workspace | Sequência de blocos totalmente conectados e consistentes | **Válida** |
| **CE-BLK-02** | Estado do Workspace | Blocos soltos, desconectados ou incompletos na área de trabalho | **Inválida** |
| **CE-BLK-03** | Estado do Workspace | Workspace completamente vazio (nenhum bloco inserido) | **Inválida** |
| **CE-BLK-04** | Ação do Workspace | Acionamento do botão "Limpar Workspace" | **Válida** |
| **CE-BLK-05** | Ação do Workspace | Reorganização / reordenação manual da sequência de blocos | **Válida** |
| **CE-BLK-06** | Comando de Movimento | Bloco "Mover para Frente" (avanço de 1 unidade visual) | **Válida** |
| **CE-BLK-07** | Comando de Movimento | Bloco "Mover para Trás" (recuo de 1 unidade visual) | **Válida** |
| **CE-BLK-08** | Comando de Movimento | Bloco "Mover para Direita" (deslocamento de 1 unidade à direita) | **Válida** |
| **CE-BLK-09** | Comando de Movimento | Bloco "Mover para Esquerda" (deslocamento de 1 unidade à esquerda) | **Válida** |
| **CE-BLK-10** | Orientação do Robô | Manutenção da orientação fixa durante o movimento (sem rotação) | **Válida** |
| **CE-BLK-11** | Estrutura de Bloco | Bloco de comando com tipo desconhecido ou AST corrompida | **Inválida** |
| **CE-BLK-12** | Bloco `Repetir` — Quantidade ($N$) | Valor inteiro no intervalo válido ($1 < N < 10$, ex.: $N=5$) | **Válida** |
| **CE-BLK-13** | Bloco `Repetir` — Quantidade ($N$) | Valor no limite mínimo permitido ($N = 1$) | **Válida** |
| **CE-BLK-14** | Bloco `Repetir` — Quantidade ($N$) | Valor no limite máximo permitido ($N = 10$) | **Válida** |
| **CE-BLK-15** | Bloco `Repetir` — Quantidade ($N$) | Valor inteiro abaixo do limite mínimo ($N \le 0$, ex.: $N=0, -1$) | **Inválida** |
| **CE-BLK-16** | Bloco `Repetir` — Quantidade ($N$) | Valor inteiro acima do limite máximo ($N > 10$, ex.: $N=11$) | **Inválida** |
| **CE-BLK-17** | Bloco `Repetir` — Quantidade ($N$) | Valor decimal / não-inteiro (ex.: $N = 3.5$) | **Inválida** |
| **CE-BLK-18** | Bloco `Repetir` — Quantidade ($N$) | Valor não-numérico, caractere especial ou campo vazio | **Inválida** |
| **CE-BLK-19** | Bloco `Repetir` — Corpo do Laço | Bloco `Repetir` sem blocos de comando internos (laço vazio) | **Inválida** |
| **CE-BLK-20** | Bloco `Se` — Posição do Robô | Robô posicionado exatamente em uma das 4 bordas do SVG | **Válida** |
| **CE-BLK-21** | Bloco `Se` — Posição do Robô | Robô posicionado no interior / área livre do SVG (fora da borda) | **Válida** |
| **CE-BLK-22** | Bloco `Se` — Corpo Condicional | Bloco `Se` sem blocos de comando internos (condicional vazia) | **Inválida** |
| **CE-BLK-23** | Estrutura Condicional | Tentativa de adicionar cláusula `Senão` (*Else*) ou laço `Enquanto` | **Inválida** |
| **CE-BLK-24** | Simulador SVG — Limites | Movimento do robô em área com espaço livre (dentro da grade) | **Válida** |
| **CE-BLK-25** | Simulador SVG — Limites | Movimento que ultrapassaria a borda (retenção dentro da área) | **Válida** |
| **CE-BLK-26** | Gerador de Portugol | Atualização em tempo real do pseudocódigo Portugol ao alterar blocos | **Válida** |
| **CE-BLK-27** | Gerador de Portugol | Equivalência sintática e lógica entre a animação SVG e o Portugol | **Válida** |
| **CE-BLK-28** | Gerador de Portugol | Tentativa de tradução com blocos desconectados ou incompletos | **Inválida** |

---

### 2.2 Casos de Teste Derivados (Especificação Completa)

| ID do CT | Descrição / Objetivo | Pré-condição | Entradas | Procedimento de Execução | Saída Desejada (Resultado Esperado) | Classes Cobertas |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CT-BLK-01** | Validar montagem e execução de sequência básica com geração de Portugol. | Editor BlocoBot aberto; robô na posição inicial (0,0) voltado para frente. | Drag & drop dos blocos `Mover para Frente` e `Mover para Direita`. | 1. Arrastar `Mover para Frente` para a área de trabalho.<br>2. Encaixar `Mover para Direita` abaixo.<br>3. Observar painel de Portugol.<br>4. Clicar em "Executar". | Robô avança 1 unidade para frente e 1 para direita sem girar; código Portugol correspondente gerado em tempo real. | CE-BLK-01, CE-BLK-06, CE-BLK-08, CE-BLK-10, CE-BLK-24, CE-BLK-26, CE-BLK-27 |
| **CT-BLK-02** | Validar laço `Repetir` no limite mínimo ($N = 1$). | Workspace limpo; robô na posição (1,1). | Bloco `Repetir` configurado para `1` contendo `Mover para Trás`. | 1. Arrastar bloco `Repetir` e definir repetições como `1`.<br>2. Inserir `Mover para Trás` internamente.<br>3. Clicar em "Executar". | Robô recua exatamente 1 unidade no SVG; Portugol exibe `para i de 1 ate 1 faca`. | CE-BLK-01, CE-BLK-07, CE-BLK-13, CE-BLK-26, CE-BLK-27 |
| **CT-BLK-03** | Validar laço `Repetir` no limite máximo ($N = 10$). | Workspace limpo; robô na posição (10,5). | Bloco `Repetir` configurado para `10` contendo `Mover para Esquerda`. | 1. Configurar laço `Repetir` com valor `10`.<br>2. Encaixar `Mover para Esquerda` no corpo do laço.<br>3. Clicar em "Executar". | Robô executa deslocamento à esquerda exatamente 10 vezes sem travar o navegador; Portugol exibe `para i de 1 ate 10 faca`. | CE-BLK-01, CE-BLK-09, CE-BLK-14, CE-BLK-26, CE-BLK-27 |
| **CT-BLK-04** | Validar laço `Repetir` com valor intermediário válido ($N = 5$). | Workspace limpo. | Bloco `Repetir` com valor `5` contendo `Mover para Frente`. | 1. Configurar laço `Repetir` para `5`.<br>2. Inserir `Mover para Frente` internamente.<br>3. Clicar em "Executar". | Animação sequencial executa 5 passos à frente; Portugol exibe `para i de 1 ate 5 faca`. | CE-BLK-01, CE-BLK-12, CE-BLK-26, CE-BLK-27 |
| **CT-BLK-05** | Impedir laço `Repetir` com quantidade menor ou igual a zero ($N \le 0$). | Editor aberto. | Bloco `Repetir` com valor `0` ou `-1`. | 1. Arrastar bloco `Repetir`.<br>2. Digitar `0` ou `-1` no campo de repetições.<br>3. Tentar clicar em "Executar". | Botão "Executar" bloqueado ou exibe alerta: "A quantidade de repetições deve ser entre 1 e 10" (RF10, RN04). | CE-BLK-15 |
| **CT-BLK-06** | Impedir laço `Repetir` com quantidade acima do limite ($N = 11$). | Editor aberto. | Bloco `Repetir` com valor `11`. | 1. Inserir valor `11` no campo do laço `Repetir`.<br>2. Tentar executar a simulação. | Bloqueio de execução com notificação visual orientando a ajustar o valor para no máximo 10 (RN04). | CE-BLK-16 |
| **CT-BLK-07** | Rejeitar valores decimais ou texto no campo do laço `Repetir`. | Editor aberto. | Inserção de `3.5` ou `"cinco"` no campo de repetição. | 1. Digitar `3.5` ou texto no input do bloco `Repetir`. | Campo recusa os caracteres inválidos ou exibe mensagem de erro solicitando número inteiro. | CE-BLK-17, CE-BLK-18 |
| **CT-BLK-08** | Impedir execução de bloco `Repetir` sem comandos no interior. | Editor aberto. | Bloco `Repetir` vazio (sem comandos internos). | 1. Arrastar bloco `Repetir` sem inserir nenhum bloco interno.<br>2. Clicar em "Executar". | Notificação de programa incompleto; bloqueio da animação no SVG (RF10). | CE-BLK-19 |
| **CT-BLK-09** | Executar bloco `Se` quando robô está posicionado na borda do SVG. | Robô posicionado na borda $X=0$ do SVG. | Bloco `Se` configurado para checar borda contendo `Mover para Direita`. | 1. Posicionar robô na borda.<br>2. Montar condicional `Se`.<br>3. Clicar em "Executar". | Condição avaliada como verdadeira; robô executa o comando `Mover para Direita` internamente ao `Se`. | CE-BLK-01, CE-BLK-20, CE-BLK-26, CE-BLK-27 |
| **CT-BLK-10** | Ignorar bloco `Se` quando robô está no centro (fora da borda). | Robô posicionado em $X=5, Y=5$ (interior do SVG). | Bloco `Se` configurado para checar borda contendo `Mover para Frente`. | 1. Posicionar robô no centro.<br>2. Executar programa contendo o bloco `Se`. | Condição avaliada como falsa; robô ignora o bloco interno e não avança. | CE-BLK-01, CE-BLK-21, CE-BLK-26, CE-BLK-27 |
| **CT-BLK-11** | Garantir retenção visual do robô dentro do limite SVG ao tentar sair. | Robô posicionado na borda $Y=0$. | Bloco `Mover para Trás` direcionado contra a borda. | 1. Posicionar robô na borda superior.<br>2. Executar comando de recuo contra o limite visual. | Robô realiza tentativa de movimento mas permanece retido na borda sem ultrapassar a área visual (RN02). | CE-BLK-25 |
| **CT-BLK-12** | Notificar erro visual ao tentar executar com blocos desconectados. | Workspace contendo blocos soltos. | Bloco `Mover para Frente` desconectado na área de trabalho. | 1. Deixar um bloco solto na área de trabalho.<br>2. Clicar no botão "Executar". | Exibição de mensagem amigável notificando blocos desconectados e impedimento da simulação (RF10). | CE-BLK-02, CE-BLK-28 |
| **CT-BLK-13** | Limpar workspace e resetar estado do simulador e do Portugol. | Workspace com sequência de blocos e simulador em posição alterada. | Clique no botão "Limpar Workspace". | 1. Clicar no botão "Limpar Workspace". | Workspace esvaziado, robô reseta para a posição inicial (0,0) e o painel de Portugol é limpo. | CE-BLK-04 |

---

## Módulo 3: API REST Express & Persistência no PostgreSQL

### 3.1 Matriz de Classes de Equivalência

| ID | Condição / Variável de Entrada | Classe de Equivalência | Tipo |
| :--- | :--- | :--- | :--- |
| **CE-API-01** | Título do Programa (`titulo`) | String válida com comprimento entre 1 e 100 caracteres | **Válida** |
| **CE-API-02** | Título do Programa (`titulo`) | Campo ausente, nulo ou string vazia `""` | **Inválida** |
| **CE-API-03** | Título do Programa (`titulo`) | String excedendo o limite máximo de 100 caracteres | **Inválida** |
| **CE-API-04** | Estrutura de Blocos (`blocos`) | Objeto JSON válido representando a árvore de sintaxe (AST) do Blockly | **Válida** |
| **CE-API-05** | Estrutura de Blocos (`blocos`) | Campo ausente, nulo ou string JSON malformada/corrompida | **Inválida** |
| **CE-API-06** | Código Portugol (`portugol`) | String válida contendo o pseudocódigo gerado | **Válida** |
| **CE-API-07** | Código Portugol (`portugol`) | Campo ausente ou nulo | **Inválida** |
| **CE-API-08** | Listagem de Programas | Usuário autenticado com 1 ou mais programas cadastrados no PostgreSQL | **Válida** |
| **CE-API-09** | Listagem de Programas | Usuário autenticado recém-criado (retorna lista vazia `[]`) | **Válida** |
| **CE-API-10** | Identificador de Programa (`id`) | UUID v4 válido existente no banco de dados | **Válida** |
| **CE-API-11** | Identificador de Programa (`id`) | UUID v4 válido inexistente no banco de dados (não encontrado) | **Inválida** |
| **CE-API-12** | Identificador de Programa (`id`) | Formato de ID inválido / não-UUID (ex.: `"id-123-invalido"`) | **Inválida** |
| **CE-API-13** | Propriedade do Programa (*Ownership*) | `user_id` do programa corresponde exatamente ao `user_id` do token | **Válida** |
| **CE-API-14** | Propriedade do Programa (*Ownership*) | `user_id` do programa pertence a OUTRO usuário cadastrado | **Inválida** |
| **CE-API-15** | Payload de Atualização (`PUT`) | Dados válidos (`titulo`, `blocos`, `portugol`) para ID próprio existente | **Válida** |
| **CE-API-16** | Payload de Atualização (`PUT`) | ID inexistente ou pertencente a outro usuário | **Inválida** |
| **CE-API-17** | Exclusão de Programa (`DELETE`) | ID válido de programa pertencente ao próprio usuário autenticado | **Válida** |
| **CE-API-18** | Exclusão de Programa (`DELETE`) | ID de programa de propriedade de outro usuário | **Inválida** |
| **CE-API-19** | Autenticação no Cabeçalho HTTP | Cabeçalho `Authorization: Bearer <token_valido>` presente na requisição | **Válida** |
| **CE-API-20** | Autenticação no Cabeçalho HTTP | Cabeçalho `Authorization` ausente, sem prefixo `Bearer` ou token nulo | **Inválida** |
| **CE-API-21** | Conexão com PostgreSQL | Instância PostgreSQL ativa, operacional e respondendo às queries | **Válida** |
| **CE-API-22** | Conexão com PostgreSQL | Falha de conexão, timeout ou erro de restrição de integridade no banco | **Inválida** |

---

### 3.2 Casos de Teste Derivados (Especificação Completa)

| ID do CT | Descrição / Objetivo | Pré-condição | Entradas | Procedimento de Execução | Saída Desejada (Resultado Esperado) | Classes Cobertas |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CT-API-01** | Validar criação e persistência de novo programa com payload válido. | Usuário autenticado (`user_id_10`); API Express e PostgreSQL em execução. | HTTP POST `/api/programas`<br>Headers: `Authorization: Bearer <token_valido>`<br>Body: `{ "titulo": "Meu Primeiro Robô", "blocos": { "kind": "Block", "type": "mover_frente" }, "portugol": "inicio\n  moverFrente()\nfim" }`. | 1. Enviar requisição POST com o payload do novo programa.<br>2. Verificar resposta HTTP.<br>3. Consultar registro diretamente no PostgreSQL. | Resposta HTTP `201 Created` contendo o `id` (UUID) gerado e o `user_id` vinculado; registro gravado no PostgreSQL (RF08). | CE-API-01, CE-API-04, CE-API-06, CE-API-13, CE-API-19, CE-API-21 |
| **CT-API-02** | Rejeitar criação de programa com título ausente ou string vazia. | Usuário autenticado. | HTTP POST `/api/programas`<br>Body: `{ "titulo": "", "blocos": { ... }, "portugol": "..." }`. | 1. Enviar requisição POST contendo o campo `titulo` como string vazia `""`. | Resposta HTTP `400 Bad Request` com mensagem "O campo 'titulo' é obrigatório e não pode ser vazio". | CE-API-02, CE-API-19 |
| **CT-API-03** | Rejeitar criação de programa com estouro de tamanho no título (>100 chars). | Usuário autenticado. | HTTP POST `/api/programas`<br>Body: `{ "titulo": "<string de 105 caracteres>", "blocos": { ... } }`. | 1. Enviar requisição POST com título de 105 caracteres. | Resposta HTTP `400 Bad Request` informando que o título excede o limite máximo de 100 caracteres. | CE-API-03, CE-API-19 |
| **CT-API-04** | Rejeitar criação de programa com estrutura de blocos (AST JSON) corrompida. | Usuário autenticado. | HTTP POST `/api/programas`<br>Body: `{ "titulo": "Projeto 1", "blocos": "invalid_json_string{" }`. | 1. Enviar requisição POST enviando JSON malformado no atributo `blocos`. | Resposta HTTP `400 Bad Request` com mensagem informando estrutura de blocos inválida. | CE-API-05, CE-API-19 |
| **CT-API-05** | Listar programas salvos do usuário autenticado. | Usuário `user_id_10` possui 2 programas previamente salvos no banco. | HTTP GET `/api/programas`<br>Header: `Authorization: Bearer <token_user_10>`. | 1. Enviar requisição GET para a rota de listagem de programas. | Resposta HTTP `200 OK` retornando array JSON contendo exatamente os 2 programas pertencentes ao `user_id_10` (RF09). | CE-API-08, CE-API-19, CE-API-21 |
| **CT-API-06** | Listar programas de usuário recém-cadastrado sem projetos salvos. | Usuário `user_id_99` novo no sistema, sem registros na tabela de programas. | HTTP GET `/api/programas`<br>Header: `Authorization: Bearer <token_user_99>`. | 1. Enviar requisição GET para listar programas. | Resposta HTTP `200 OK` retornando array JSON vazio `[]` sem erros de servidor. | CE-API-09, CE-API-19 |
| **CT-API-07** | Reabrir programa específico por UUID válido de propriedade do usuário. | Programa com `id="a1b2c3d4-0000-4000-8000-000000000001"` cadastrado para o `user_id_10`. | HTTP GET `/api/programas/a1b2c3d4-0000-4000-8000-000000000001`<br>Header: `Authorization: Bearer <token_user_10>`. | 1. Enviar requisição GET solicitando o programa por seu UUID. | Resposta HTTP `200 OK` com os detalhes completos do programa (`titulo`, `blocos`, `portugol`). | CE-API-10, CE-API-13, CE-API-19 |
| **CT-API-08** | Garantir isolamento de dados: proibir acesso a programa de outro usuário. | Programa `id="ff001122-..."` pertence ao `user_id_99`. Requisição feita pelo `user_id_10`. | HTTP GET `/api/programas/ff001122-...`<br>Header: `Authorization: Bearer <token_user_10>`. | 1. Tentar acessar via URL o ID de um programa cujo dono é outro estudante. | Resposta HTTP `403 Forbidden` ou `404 Not Found`, garantindo que o usuário não acesse dados alheios (RN06, RNF04). | CE-API-14, CE-API-19 |
| **CT-API-09** | Rejeitar consulta com formato de ID de programa inválido (não-UUID). | Usuário autenticado. | HTTP GET `/api/programas/id-invalido-123`. | 1. Enviar requisição GET passando ID que não atende ao padrão UUID v4. | Resposta HTTP `400 Bad Request` com mensagem "O parâmetro 'id' deve ser um UUID válido". | CE-API-12, CE-API-19 |
| **CT-API-10** | Atualizar título e blocos de programa existente do próprio usuário (`PUT`). | Programa `id="a1b2c3d4-..."` pertence ao `user_id_10`. | HTTP PUT `/api/programas/a1b2c3d4-...`<br>Body: `{ "titulo": "Título Atualizado", "blocos": { ... } }`. | 1. Enviar requisição PUT com o payload alterado para o ID do programa. | Resposta HTTP `200 OK`; registro atualizado no PostgreSQL com o novo título e timestamp de modificação. | CE-API-15, CE-API-19, CE-API-21 |
| **CT-API-11** | Excluir programa de propriedade do próprio usuário (`DELETE`). | Programa `id="a1b2c3d4-..."` existente pertencente ao `user_id_10`. | HTTP DELETE `/api/programas/a1b2c3d4-...`<br>Header: `Authorization: Bearer <token_user_10>`. | 1. Enviar requisição DELETE informando o ID do programa.<br>2. Tentar buscar novamente o programa. | Resposta HTTP `200 OK` ou `204 No Content`; programa removido do PostgreSQL e subsequente GET retorna `404 Not Found`. | CE-API-17, CE-API-19, CE-API-21 |
| **CT-API-12** | Impedir exclusão de programa pertencente a outro usuário. | Programa `id="ff001122-..."` pertence ao `user_id_99`. Tentativa de deleção pelo `user_id_10`. | HTTP DELETE `/api/programas/ff001122-...`<br>Header: `Authorization: Bearer <token_user_10>`. | 1. Enviar requisição DELETE tentando excluir programa de outro estudante. | Resposta HTTP `403 Forbidden` ou `404 Not Found`; o registro permanece intocado no PostgreSQL (RN06). | CE-API-18, CE-API-19 |
| **CT-API-13** | Bloquear acesso a qualquer endpoint da API quando o cabeçalho `Authorization` estiver ausente. | API Express ativa. | HTTP GET `/api/programas` sem enviar cabeçalho `Authorization`. | 1. Enviar requisição sem passar nenhum token de autenticação. | Resposta HTTP `401 Unauthorized` com mensagem "Cabeçalho de autorização é obrigatório". | CE-API-20 |
| **CT-API-14** | Tratar falha de comunicação / timeout com o PostgreSQL durante operação de salvamento. | Instância do PostgreSQL inacessível ou em timeout durante a transação. | HTTP POST `/api/programas` com payload válido. | 1. Disparar salvamento enquanto a conexão com o PostgreSQL estiver interrompida. | Resposta HTTP `500 Internal Server Error` com mensagem "Erro interno ao processar a solicitação no banco de dados". | CE-API-22 |
