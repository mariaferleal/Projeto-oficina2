# Estratégia de testes automatizados

Responsável: Paulo.

| Tipo | O que testa | Ferramenta |
|---|---|---|
| Unitário | Cada bloco gera o trecho certo em Portugol e em C | Vitest ou Jest |
| Compilação | O código C gerado compila com GCC e produz o resultado esperado | GCC |
| Servidor | Cadastro, login e programas salvos | Jest |
| Tela | Do cadastro até ver o código gerado | Playwright |

## Quando rodam

Todos os testes rodam no GitHub Actions a cada envio de código e a cada pull request.

## Quando um teste é aprovado

- Todos os testes passam
- Um pull request só entra na branch principal com os testes passando
