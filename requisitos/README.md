# Requisitos

Requisitos do BlocoBot, conforme o Documento de Projeto de Software. Cada requisito funcional tem um arquivo com descrição e critérios de aceite, usados para escrever as issues no GitHub.

## Requisitos funcionais

| Código | Requisito | Prioridade | Sprint |
|---|---|---|---|
| [RF01](RF01-autenticar-com-google.md) | Autenticar com conta Google | Essencial | Sprint 1 |
| [RF02](RF02-montar-programa-com-blocos.md) | Montar programa com blocos | Essencial | Sprint 1 |
| [RF03](RF03-blocos-de-movimento.md) | Blocos de movimento | Essencial | Sprint 1 |
| [RF04](RF04-bloco-repetir.md) | Bloco Repetir | Essencial | Sprint 2 |
| [RF05](RF05-bloco-se.md) | Bloco Se (condição de borda) | Essencial | Sprint 2 |
| [RF06](RF06-executar-programa-no-robo.md) | Executar o programa no robô virtual | Essencial | Sprint 1 |
| [RF07](RF07-gerar-codigo-portugol.md) | Gerar código em Portugol | Essencial | Sprint 2 |
| [RF08](RF08-salvar-programa.md) | Salvar programa e progresso | Essencial | Sprint 2 |
| [RF09](RF09-listar-e-reabrir-programas.md) | Listar e reabrir programas | Essencial | Sprint 2 |
| [RF10](RF10-avisar-programa-invalido.md) | Avisar programa incompleto ou inválido | Importante | Sprint 2 |

## Requisitos não funcionais

| Código | Descrição | Categoria |
|---|---|---|
| RNF01 | A interface deve usar linguagem simples, instruções visuais claras e retorno perceptível durante a execução, considerando o público infantil e adolescente. | Usabilidade |
| RNF02 | A aplicação deve funcionar em navegadores web modernos e adaptar-se a diferentes larguras de tela utilizadas nas atividades. | Compatibilidade |
| RNF03 | A simulação e o código gerado devem seguir a mesma interpretação dos blocos; um mesmo programa deve produzir resultados consistentes. | Consistência |
| RNF04 | O sistema deve armazenar apenas os dados necessários e restringir cada usuário aos seus próprios programas e progresso. | Segurança e privacidade |
| RNF05 | Editor, interpretador, simulador, gerador, autenticação e persistência devem ser módulos identificáveis para facilitar manutenção e testes. | Manutenibilidade |
| RNF06 | As funcionalidades devem possuir testes automatizados e relatório de cobertura atualizado a cada sprint. | Testabilidade |

## Regras de negócio

| Código | Regra | Requisitos relacionados |
|---|---|---|
| RN01 | O único meio de autenticação disponível será o login com Google. | RF01 |
| RN02 | Os comandos são executados na sequência em que aparecem no programa. | RF06 |
| RN03 | Cada bloco deve possuir comportamento visual e tradução textual equivalentes. | RF07, RNF03 |
| RN04 | O bloco Repetir aceita uma quantidade inteira entre 1 e 10 e executa seu conteúdo exatamente esse número de vezes. | RF04 |
| RN05 | O bloco Se avalia se o robô está na borda da área de execução. Quando a condição for verdadeira, executa os comandos internos; quando for falsa, não os executa. Não há bloco Senão na primeira versão. | RF05 |
| RN06 | Programas salvos só podem ser consultados e alterados pelo usuário proprietário autenticado. | RF09, RNF04 |
| RN07 | A execução é virtual e não envia comandos a placas Arduino ou robôs físicos. | RF06 |
| RN08 | A persistência guarda programas e progresso; não registra um histórico de cada ação do usuário. | RF08 |

A rastreabilidade entre requisitos e casos de teste está em [`tests/ResponsabilityMatrix-v1.0.md`](../tests/ResponsabilityMatrix-v1.0.md).
