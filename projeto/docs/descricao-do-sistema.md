# Descrição do sistema

## Proposta

O BlocoBot é uma aplicação web educativa. O usuário monta programas conectando blocos de comando, como peças que se encaixam. Os programas controlam um robô virtual na tela, que anda para frente, para trás, para a direita e para a esquerda. Existem também blocos de repetição e de condição (Se).

Ao executar, a aplicação anima o robô passo a passo e mostra o código equivalente em Portugol. O Portugol serve para consulta e aprendizado. Ninguém precisa digitá-lo para programar o robô, e ele se atualiza sozinho a cada mudança nos blocos.

## Contexto e justificativa

Para quem está começando, escrever código costuma ser uma barreira. Um ponto e vírgula esquecido desvia a atenção do raciocínio, que é o que realmente importa. Com blocos, a pessoa vê o efeito de cada instrução na hora e aprende sequência, repetição e condição de forma mais concreta.

Ver o código em Portugol ao lado dos blocos ajuda a comparar a forma visual com uma linguagem escrita e prepara a passagem para etapas mais avançadas.

## Objetivo geral

Desenvolver uma aplicação web educativa de programação em blocos que permita a crianças e adolescentes criar programas para um robô virtual, acompanhar a execução na tela e ver a tradução do programa para Portugol.

## Objetivos específicos

- Oferecer blocos de movimento para frente, para trás, para a direita e para a esquerda
- Permitir montar, editar e reorganizar sequências, incluindo repetição e condição (Se)
- Simular a execução dos comandos, passo a passo, com o robô virtual
- Mostrar em tempo real o código Portugol do programa
- Autenticar os usuários somente com conta Google
- Salvar os programas e o progresso na conta, para retomar depois

## Usuários

**Aprendiz.** É o usuário principal. Entra com a conta Google, monta e executa programas, acompanha o robô, consulta o Portugol e salva ou reabre seus programas.

**Educador ou monitor.** Conduz atividades de lógica com os estudantes, propondo desafios e acompanhando as soluções. Na primeira versão não existe área administrativa, então ele usa as mesmas funções do aprendiz.

No primeiro acesso com Google, o sistema cria o cadastro mínimo para identificar o usuário. Não existe cadastro por senha nem outro tipo de login, o que reduz os dados pessoais guardados.

## Limites e restrições

- Aplicação web acessada pelo navegador, sem aplicativo móvel
- Execução em um robô virtual na tela, sem Arduino, robô físico ou outros equipamentos
- A primeira versão gera Portugol. Não gera código em C
- A execução acontece em uma área delimitada, sem mapa nem obstáculos. O robô sempre fica dentro dela e, na borda, a condição do Se é verdadeira
- O sistema guarda programas e progresso. Não guarda o histórico de cada ação do usuário
- Público principal com até cerca de 15 anos, em fase inicial de aprendizado

## Parâmetros do MVP

| Tema | Definição |
|---|---|
| Movimentos | Cada comando move o robô uma unidade visual. O robô não gira |
| Condição do Se | Verifica se o robô está na borda da área. Não existe Senão |
| Repetição | Número inteiro de 1 a 10, com limite de execução para evitar travamentos |
| Linguagem | Portugol didático, atualizado a cada alteração nos blocos |
| Dados guardados | Identificador da conta Google, programas e progresso |
| Execução | Toda no navegador |
