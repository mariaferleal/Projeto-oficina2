# Requisitos do sistema

Este documento reúne os requisitos funcionais, os requisitos não funcionais e as regras de negócio do BlocoBot. Os critérios de aceite de cada requisito funcional estão na pasta [requisitos](../requisitos/README.md).

## Requisitos funcionais

| ID | Funcionalidade | Prioridade |
|---|---|---|
| RF01 | Autenticar o usuário somente com conta Google. No primeiro acesso válido, criar o cadastro mínimo necessário | Essencial |
| RF02 | Permitir criar, montar, editar e limpar um programa composto por blocos | Essencial |
| RF03 | Disponibilizar blocos para mover o robô uma unidade visual para frente, para trás, para a direita e para a esquerda, sem mudar a orientação dele | Essencial |
| RF04 | Disponibilizar um bloco Repetir que executa a sequência de dentro de 1 a 10 vezes, conforme a quantidade indicada pelo usuário | Essencial |
| RF05 | Disponibilizar um bloco Se cuja condição verifica se o robô está na borda da área de execução. Quando a condição for verdadeira, executar os comandos de dentro | Essencial |
| RF06 | Executar o programa na ordem dos blocos e mostrar cada comando no robô virtual. Se um movimento chegar a uma borda, manter o robô dentro da área | Essencial |
| RF07 | Gerar e mostrar automaticamente o pseudocódigo equivalente em Portugol sempre que o programa em blocos for alterado | Essencial |
| RF08 | Salvar um programa e o progresso na conta autenticada | Essencial |
| RF09 | Listar e reabrir os programas salvos pelo próprio usuário | Essencial |
| RF10 | Informar o usuário quando um programa não puder ser executado ou traduzido por estar incompleto ou inconsistente | Importante |

## Requisitos não funcionais

| ID | Descrição | Categoria |
|---|---|---|
| RNF01 | A interface usa linguagem simples, instruções visuais claras e retorno perceptível durante a execução, pensando no público infantil e adolescente | Usabilidade |
| RNF02 | A aplicação funciona em navegadores modernos e se adapta a diferentes larguras de tela usadas nas atividades | Compatibilidade |
| RNF03 | A simulação e o código gerado seguem a mesma interpretação dos blocos. Um mesmo programa dá sempre resultados consistentes | Consistência |
| RNF04 | O sistema guarda só os dados necessários e limita cada usuário aos seus próprios programas e progresso | Segurança e privacidade |
| RNF05 | Editor, interpretador, simulador, gerador, autenticação e persistência são módulos identificáveis, para facilitar a manutenção e os testes | Manutenibilidade |
| RNF06 | As funcionalidades têm testes automatizados e o relatório de cobertura é atualizado a cada sprint | Testabilidade |

## Regras de negócio

| ID | Regra | Relacionados |
|---|---|---|
| RN01 | O único meio de login é a conta Google | RF01 |
| RN02 | Os comandos rodam na ordem em que aparecem no programa | RF06 |
| RN03 | Cada bloco tem comportamento visual e tradução em texto equivalentes | RF07, RNF03 |
| RN04 | O bloco Repetir aceita um número inteiro de 1 a 10 e executa seu conteúdo exatamente essa quantidade de vezes | RF04 |
| RN05 | O bloco Se verifica se o robô está na borda da área. Se for verdadeiro, executa os comandos de dentro. Se for falso, não executa. Não existe bloco Senão na primeira versão | RF05 |
| RN06 | Programas salvos só podem ser vistos e alterados pelo dono, já autenticado | RF09, RNF04 |
| RN07 | A execução é virtual e não envia comandos a Arduino nem a robôs físicos | RF06 |
| RN08 | O sistema guarda programas e progresso, sem registrar o histórico de cada ação do usuário | RF08 |

## Fora do escopo da primeira versão

- Geração de código em C
- Conexão com Arduino ou robô físico
- Aplicativo móvel
- Área administrativa para o educador
- Bloco Senão
- Mapa e obstáculos na área de execução
- Histórico detalhado das ações do usuário
