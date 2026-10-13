**Navegação Rápida:** 
[Matriz de Responsabilidades](./ResponsabilityMatrix.md) | [Casos de Teste](./TestCases-v4.md) | [Plano de Teste](./TestPlan-v1.0.md)

---

# BlocoBot - Matriz de Responsabilidade (1.0)

| BlocoBot - Plano de Teste | Versão 1.0 |
| :--- | :---: |
| **Preparado por** | Paulo André |
| **Data** | 11/10/2026 |

---

# Matriz de Rastreabilidade e Cobertura de Requisitos — BlocoBot

Este documento apresenta a **Matriz de Rastreabilidade Bidirecional** mapeando a cobertura entre os **Requisitos do Sistema** (Requisitos Funcionais `RF`, Requisitos Não-Funcionais `RNF` e Regras de Negócio `RN`), descritos na documentação oficial do **BlocoBot**, e os **Casos de Teste (CTs)** projetados a partir do Particionamento em Classes de Equivalência.

---

## 1. Mapeamento por Requisitos Funcionais (RF01 a RF10)

| ID Requisito | Descrição Resumida | Prioridade | Casos de Teste Relacionados | Módulos de Teste | Status de Cobertura |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF01** | Autenticação exclusiva via Google OAuth 2.0 e criação de cadastro no 1º acesso. | Essencial | `CT-AUTH-01`, `CT-AUTH-02`, `CT-AUTH-03`, `CT-AUTH-04`, `CT-AUTH-05`, `CT-AUTH-06`, `CT-AUTH-07`, `CT-AUTH-08`, `CT-AUTH-09`, `CT-AUTH-10`, `CT-API-13` | Autenticação / API | **100% Coberto** |
| **RF02** | Criar, montar, editar, reorganizar e limpar programa em blocos. | Essencial | `CT-BLK-01`, `CT-BLK-12`, `CT-BLK-13` | Editor Blockly | **100% Coberto** |
| **RF03** | Blocos de deslocamento unitário (frente, trás, direita, esquerda) sem alterar orientação. | Essencial | `CT-BLK-01`, `CT-BLK-02`, `CT-BLK-03`, `CT-BLK-04` | Editor / Simulador | **100% Coberto** |
| **RF04** | Bloco `Repetir` executando laço de 1 a 10 vezes. | Essencial | `CT-BLK-02` (N=1), `CT-BLK-03` (N=10), `CT-BLK-04` (N=5), `CT-BLK-05` (N<=0), `CT-BLK-06` (N>10), `CT-BLK-07` (dec/txt), `CT-BLK-08` (vazio) | Editor / Interpretador | **100% Coberto** |
| **RF05** | Bloco `Se` verificando posição de borda e executando comandos internos quando verdadeiro. | Essencial | `CT-BLK-09` (na borda = True), `CT-BLK-10` (no centro = False) | Editor / Interpretador | **100% Coberto** |
| **RF06** | Execução sequencial no robô virtual e retenção dentro da área visual de execução. | Essencial | `CT-BLK-01`, `CT-BLK-11` (retenção SVG) | Simulador SVG | **100% Coberto** |
| **RF07** | Gerar e exibir automaticamente pseudocódigo Portugol equivalente. | Essencial | `CT-BLK-01`, `CT-BLK-02`, `CT-BLK-03`, `CT-BLK-04`, `CT-BLK-09`, `CT-BLK-10` | Gerador Portugol | **100% Coberto** |
| **RF08** | Salvar programa e progresso associados à conta autenticada. | Essencial | `CT-API-01`, `CT-API-02`, `CT-API-03`, `CT-API-04`, `CT-API-10`, `CT-API-11` | API Express / PostgreSQL | **100% Coberto** |
| **RF09** | Listar e reabrir programas salvos pelo próprio usuário. | Essencial | `CT-AUTH-02`, `CT-API-05`, `CT-API-06`, `CT-API-07`, `CT-API-08`, `CT-API-09` | API Express / PostgreSQL | **100% Coberto** |
| **RF10** | Notificar o usuário quando o programa estiver incompleto, desconectado ou inconsistente. | Importante | `CT-BLK-05`, `CT-BLK-06`, `CT-BLK-08`, `CT-BLK-12`, `CT-API-02`, `CT-API-03`, `CT-API-04`, `CT-API-09` | Front-end / API | **100% Coberto** |

---

## 2. Mapeamento por Regras de Negócio (RN01 a RN08)

| ID Regra | Regra de Negócio | Requisitos Vinculados | Casos de Teste Relacionados | Foco da Validação |
| :--- | :--- | :--- | :--- | :--- |
| **RN01** | Autenticação exclusiva via Google OAuth 2.0 (sem login por e-mail/senha). | RF01 | `CT-AUTH-01`, `CT-AUTH-02`, `CT-AUTH-03` | Rejeição de login tradicional e fluxo único OAuth. |
| **RN02** | Execução de comandos na sequência exata em que aparecem no programa. | RF06 | `CT-BLK-01`, `CT-BLK-11` | Ordem dos movimentos e comportamento na borda. |
| **RN03** | Equivalência comportamental e sintática entre bloco visual, simulador SVG e Portugol. | RF07, RNF03 | `CT-BLK-01`, `CT-BLK-02`, `CT-BLK-03`, `CT-BLK-04`, `CT-BLK-09`, `CT-BLK-10` | Sincronia entre animação gráfica e código texto. |
| **RN04** | Bloco `Repetir` restrito a inteiros de 1 a 10 repetições. | RF04 | `CT-BLK-02`, `CT-BLK-03`, `CT-BLK-04`, `CT-BLK-05`, `CT-BLK-06`, `CT-BLK-07` | Validação de limites (1 e 10) e rejeição de inválidos. |
| **RN05** | Bloco `Se` avalia exclusivamente a borda da área (sem cláusula `Senão` / *Else* no MVP). | RF05 | `CT-BLK-09`, `CT-BLK-10` | Avaliação booleana baseada em coordenadas de borda. |
| **RN06** | Isolamento de dados: programas salvos acessíveis/alteráveis apenas pelo proprietário. | RF09, RNF04 | `CT-AUTH-02`, `CT-API-05`, `CT-API-07`, `CT-API-08`, `CT-API-10`, `CT-API-12` | Bloqueio `403 Forbidden` / `404 Not Found` para não-proprietários. |
| **RN07** | Execução 100% virtual no navegador (sem envio para Arduino ou hardware físico). | RF06 | `CT-BLK-01`, `CT-BLK-11` | Execução restrita ao canvas SVG local. |
| **RN08** | Persistência do estado final dos programas e progresso (sem log de histórico ação a ação). | RF08 | `CT-API-01`, `CT-API-10` | Gravação e atualização do registro único por projeto. |

---

## 3. Mapeamento por Requisitos Não-Funcionais (RNF01 a RNF06)

| ID RNF | Categoria | Descrição do RNF | Casos de Teste Relacionados | Estratégia de Verificação |
| :--- | :--- | :--- | :--- | :--- |
| **RNF01** | Usabilidade | Interface amigável com retorno visual perceptível para público infantil/adolescente. | `CT-BLK-12` | Exibição de mensagens visuais claras em blocos desconectados. |
| **RNF02** | Compatibilidade | Funcionamento em navegadores modernos (Chromium, Firefox, WebKit). | Suíte E2E via Playwright (`CT-AUTH-01`, `CT-BLK-01`) | Automação cross-browser executada no CI. |
| **RNF03** | Consistência | Interpretação idêntica de um programa entre o simulador e o código Portugol gerado. | `CT-BLK-01`, `CT-BLK-02`, `CT-BLK-03`, `CT-BLK-04`, `CT-BLK-09` | Testes de integração comparando estado SVG e texto Portugol. |
| **RNF04** | Segurança & Privacidade | Armazenamento estritamente necessário e restrição ao próprio usuário. | `CT-AUTH-05`, `CT-AUTH-08`, `CT-API-08`, `CT-API-12`, `CT-API-13` | Validação de token JWT e autorização por `user_id`. |
| **RNF05** | Manutenibilidade | Arquitetura modular (Editor, Interpretador, Simulador, Gerador, Auth, API). | `CT-AUTH-10`, `CT-API-14` | Isolamento de camadas e tratamento de falhas de banco. |
| **RNF06** | Testabilidade | Automação de testes e relatório de cobertura atualizado ($\ge 80\%$). | Todos os Casos de Teste (`CT-AUTH-*`, `CT-BLK-*`, `CT-API-*`) | Suítes em Vitest, React Testing Library e Playwright no GitHub Actions. |

---

## 4. Matriz Inversa: Casos de Teste $
ightarrow$ Requisitos Cobertos

| Módulo de Teste | ID do Caso de Teste | Requisitos Funcionais | Regras de Negócio | Requisitos Não-Funcionais |
| :--- | :--- | :--- | :--- | :--- |
| **Autenticação** | `CT-AUTH-01` | RF01 | RN01 | RNF04 |
| | `CT-AUTH-02` | RF01, RF09 | RN01, RN06 | RNF04 |
| | `CT-AUTH-03` | RF01 | RN01 | RNF04 |
| | `CT-AUTH-04` | RF01 | RN01 | - |
| | `CT-AUTH-05` | RF01 | - | RNF04 |
| | `CT-AUTH-06` | RF01 | - | RNF04 |
| | `CT-AUTH-07` | RF01 | - | RNF04 |
| | `CT-AUTH-08` | RF01 | - | RNF04 |
| | `CT-AUTH-09` | RF01 | - | RNF04 |
| | `CT-AUTH-10` | RF01 | - | RNF05 |
| **Editor / Robô** | `CT-BLK-01` | RF02, RF03, RF06, RF07 | RN02, RN03, RN07 | RNF03 |
| | `CT-BLK-02` | RF03, RF04, RF07 | RN03, RN04 | RNF03 |
| | `CT-BLK-03` | RF03, RF04, RF07 | RN03, RN04 | RNF03 |
| | `CT-BLK-04` | RF03, RF04, RF07 | RN03, RN04 | RNF03 |
| | `CT-BLK-05` | RF04, RF10 | RN04 | RNF01 |
| | `CT-BLK-06` | RF04, RF10 | RN04 | RNF01 |
| | `CT-BLK-07` | RF04, RF10 | RN04 | RNF01 |
| | `CT-BLK-08` | RF04, RF10 | - | RNF01 |
| | `CT-BLK-09` | RF05, RF07 | RN03, RN05 | RNF03 |
| | `CT-BLK-10` | RF05, RF07 | RN03, RN05 | RNF03 |
| | `CT-BLK-11` | RF06 | RN02, RN07 | - |
| | `CT-BLK-12` | RF02, RF10 | - | RNF01 |
| | `CT-BLK-13` | RF02 | - | - |
| **API & Banco** | `CT-API-01` | RF08 | RN08 | RNF04 |
| | `CT-API-02` | RF08, RF10 | - | - |
| | `CT-API-03` | RF08, RF10 | - | - |
| | `CT-API-04` | RF08, RF10 | - | - |
| | `CT-API-05` | RF09 | RN06 | RNF04 |
| | `CT-API-06` | RF09 | RN06 | RNF04 |
| | `CT-API-07` | RF09 | RN06 | RNF04 |
| | `CT-API-08` | RF09 | RN06 | RNF04 |
| | `CT-API-09` | RF09, RF10 | - | - |
| | `CT-API-10` | RF08 | RN06, RN08 | RNF04 |
| | `CT-API-11` | RF08 | RN06 | - |
| | `CT-API-12` | - | RN06 | RNF04 |
| | `CT-API-13` | RF01 | - | RNF04 |
| | `CT-API-14` | - | - | RNF05 |

---

## 5. Resumo Executivo da Cobertura de Teste

* **Total de Requisitos Funcionais (RFs)**: 10/10 (**100% de Cobertura**)
* **Total de Regras de Negócio (RNs)**: 8/8 (**100% de Cobertura**)
* **Total de Requisitos Não-Funcionais (RNFs)**: 6/6 (**100% de Cobertura**)
* **Total de Casos de Teste Mapeados**: **37 Casos de Teste** (10 em Autenticação, 13 no Editor/Robô e 14 na API REST/PostgreSQL)
* **Garantia de Qualidade**: Todos os cenários críticos e de exceção foram diretamente rastreados até os requisitos do projeto BlocoBot, atendendo ao parâmetro de **80% de cobertura de código** e controle total de regressão.
