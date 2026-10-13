# Descrição do sistema

## Proposta

O BlocoBot é uma aplicação web educativa na qual o usuário monta programas conectando blocos de comando. Esses programas controlam um robô virtual exibido na tela, que pode se mover para frente, para trás, para a direita e para a esquerda, além de contar com blocos de repetição e de condição (Se). Cada comando desloca o robô uma unidade visual, sem alterar sua orientação. Ao executar a sequência, a aplicação anima o robô passo a passo e apresenta o código equivalente em Portugol.

O Portugol é exibido como material de consulta e aprendizagem: não é necessário digitá-lo, e o código é atualizado automaticamente sempre que o programa em blocos é alterado.

## Objetivo geral

Desenvolver uma aplicação web educativa de programação em blocos que permita a crianças e adolescentes criar programas para um robô virtual, acompanhar a execução dos comandos na tela e visualizar a tradução do programa para Portugol.

## Objetivos específicos

- Oferecer blocos de movimento para frente, para trás, para a direita e para a esquerda.
- Permitir montar, editar e reorganizar sequências de instruções, incluindo repetição e condição (Se).
- Simular visualmente, passo a passo, a execução dos comandos pelo robô virtual.
- Exibir, em tempo real, o código Portugol correspondente ao programa.
- Autenticar os usuários exclusivamente por meio de uma conta Google.
- Salvar os programas e o progresso associados à conta.

## Limites e restrições

- Aplicação web acessada pelo navegador; o escopo inicial não inclui aplicativo móvel nativo.
- Execução em um robô virtual na tela, sem Arduino, robô físico ou periféricos.
- Gera apenas pseudocódigo didático em Portugol; não há geração de código em C.
- Área de execução delimitada, sem mapa ou obstáculos. O robô sempre permanece dentro da área; quando está em uma borda, a condição do bloco Se é verdadeira.
- Persistência apenas dos programas e do progresso necessários para retomar o trabalho.
- Público principal: crianças e adolescentes de até aproximadamente 15 anos, em fase inicial de aprendizagem.

## Usuários do sistema

- **Aprendiz:** usuário principal. Entra com a conta Google, cria e executa programas com blocos, consulta o código em Portugol e salva ou reabre seus programas.
- **Educador ou monitor:** conduz atividades de lógica e programação com os estudantes. Na primeira versão, usa as mesmas funcionalidades do aprendiz; não há área administrativa.

No primeiro acesso com Google, o sistema cria automaticamente o cadastro mínimo do usuário. Não há cadastro por senha nem outro provedor de autenticação.

Os requisitos estão em [`requisitos/`](../requisitos/README.md).
