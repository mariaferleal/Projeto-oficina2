# RF01 Autenticar com conta Google

## Descrição

Autenticar o usuário exclusivamente por meio de uma conta Google. No primeiro acesso válido, criar o cadastro mínimo necessário.

## Critérios de aceite

- A tela inicial oferece apenas o botão "Entrar com Google"; não há cadastro por senha nem outro provedor.
- No primeiro login válido, o sistema cria automaticamente o usuário no banco com o identificador da conta Google.
- Em um novo login com a mesma conta, o sistema reconhece o usuário existente e não cria um cadastro duplicado.
- Um token inválido ou expirado é recusado pela API, e o usuário continua sem acesso às funcionalidades.

## Prioridade

Essencial

## Sprint previsto

Sprint 1

## Regras de negócio relacionadas

RN01
