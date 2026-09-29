# Estratégia de testes

Os testes usam Vitest e React Testing Library nos testes unitários e de componentes, e Playwright nos testes de ponta a ponta. Todos rodam no GitHub Actions a cada envio de código e a cada pull request.

## Testes unitários

- Movimentos do robô e atualização da posição na área de execução
- Geração de Portugol para cada comando, para sequências e para programas vazios ou incompletos
- Bloco Repetir com a quantidade mínima, a máxima e uma intermediária, conferindo que o conteúdo roda exatamente o número de vezes indicado
- Bloco Se nos caminhos verdadeiro e falso, variando a posição do robô em relação à borda
- Mensagens para programas inválidos e para valores fora dos limites

## Testes de integração

- Criação do cadastro no primeiro login com Google e acesso às funções do sistema
- Comunicação entre a API e o banco nas ações de salvar, listar, carregar e atualizar programas
- Garantia de que um usuário não acessa nem altera programas de outra conta
- Comparação entre o que o simulador executa e o Portugol gerado para o mesmo programa

## Testes de ponta a ponta

Um usuário simulado entra no ambiente de teste, sem usar o login real do Google, monta uma sequência de blocos, executa o robô, confere o código gerado, salva o programa e o reabre. Os testes ficam ligados às issues correspondentes.

## Cobertura

A cobertura é acompanhada por módulo e por sprint. A meta é chegar a pelo menos 80% no interpretador e no gerador, que concentram as regras principais. O percentual não substitui a qualidade dos casos. O objetivo é verificar comportamentos importantes, e não apenas passar por linhas de código.

## Quando um teste é aprovado

- Todos os testes passam
- Um pull request só entra na branch principal com os testes passando
