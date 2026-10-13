**Navegação Rápida:** 
[Matriz de Responsabilidades](./ResponsabilityMatrix.md) | [Casos de Teste](./TestCases-v4.md) | [Plano de Teste](./TestPlan-v1.0.md)

---

# BlocoBot - Plano de Teste (v1.0)

| BlocoBot - Plano de Teste | Versão 1.0 |
| :--- | :---: |
| **Preparado por** | Paulo André |
| **Data** | 10/10/2026 |

---

### **1. Introdução**

* **Objetivo / Resumo Executivo**:
  Este Plano de Teste estabelece as diretrizes, a estratégia de cobertura e os critérios de validação da qualidade para a aplicação web educativa **BlocoBot**. O objetivo principal é garantir o correto funcionamento das regras de interpretação dos blocos visuais, da simulação gráfica do robô virtual em SVG, da geração do pseudocódigo em Portugol e da persistência segura dos dados. O plano norteia as atividades de QA ao longo das duas *sprints* do projeto.

---

### **2. Escopo dos Testes**

* **No âmbito (In-Scope)**:
  * **Autenticação**: Validação do fluxo exclusivo de login via Google OAuth 2.0 (RF01) e criação automática de perfil no primeiro acesso.
  * **Editor Blockly e Manipulação de Blocos**: Criação, montagem, edição, reorganização e limpeza da sequência de blocos (RF02).
  * **Comandos de Movimentação**: Teste dos blocos de deslocamento em 1 unidade visual (frente, trás, direita e esquerda) mantendo a orientação fixa do robô (RF03).
  * **Estruturas de Controle**:
    * Bloco `Repetir`: Execução do laço no intervalo válido de 1 a 10 iterações (RF04, RN04).
    * Bloco `Se`: Avaliação condicional baseada na posição do robô nas bordas da área delimitada em SVG (RF05, RN05).
  * **Simulador SVG do Robô Virtual**: Animação sequencial passo a passo e garantia de retenção do robô dentro dos limites visuais (RF06, RN02).
  * **Gerador de Portugol**: Atualização em tempo real do pseudocódigo traduzido e equivalência comportamental entre o simulador e o código em Portugol (RF07, RN03).
  * **API e Persistência**: Operações CRUD de salvamento, listagem e reabertura de programas via API Express com banco PostgreSQL (RF08, RF09).
  * **Controle de Acesso / Autorização**: Garantia de que cada usuário acesse e altere estritamente seus próprios programas e progresso (RNF04, RN06).
  * **Tratamento de Erros**: Notificação visual e mensagens amigáveis ao tentar executar ou traduzir programas incompletos ou inconsistentes (RF10).

* **Fora do escopo (Out-of-Scope)**:
  * **Hardware e Equipamentos Físicos**: Conexão ou envio de instruções para placas Arduino, robôs físicos ou periféricos externos (RN07).
  * **Dispositivos Móveis Nativos**: Desenvolvimento ou testes em aplicativos móveis Android/iOS nativos.
  * **Linguagens Textuais de Terceiros**: Geração de código em linguagem C, C++ ou execução em compiladores externos.
  * **Múltiplos Provedores de Autenticação**: Autenticação por e-mail/senha tradicional ou outras redes sociais (RN01).
  * **Estruturas Lógicas Avançadas**: Estrutura condicional com cláusula `Senão` (*Else*) ou laços genéricos (`Enquanto`) não previstos na versão MVP.
  * **Log Histórico de Ações**: Armazenamento do histórico passo a passo de edições na interface (focado apenas no estado final salvo) (RN08).

---

### **3. Objetivos do Teste**

* **Garantir a Equivalência Comportamental**: Assegurar que a interpretação da sequência de blocos, a animação no simulador SVG e a geração do pseudocódigo Portugol produzam exatamente os mesmos resultados sintáticos e lógicos (RNF03).
* **Atingir a Meta de Cobertura de Código**: Alcançar uma cobertura de testes automatizados de no mínimo **80%** nos módulos centrais da aplicação (interpretador de blocos e gerador de Portugol) (RNF06).
* **Validar a Segurança e Isolamento de Dados**: Garantir que as rotas da API restrinjam o acesso e alteração de programas salvos exclusivamente ao proprietário autenticado (RNF04, RN06).
* **Garantir a Estabilidade em Valores Limite**: Verificar o comportamento do laço de repetição nos limites mínimo (1) e máximo (10), prevenindo *loops* infinitos ou travamentos do navegador.
* **Assegurar a Experiência e Usabilidade Infantil**: Validar se mensagens de erro amigáveis são exibidas quando blocos estiverem desconectados ou incompletos (RF10, RNF01).

---

### **4. Abordagem de Teste**

* **Metodologias**:
  * **Testes Baseados em Requisitos (Caixa-Preta)**: Aplicação de técnicas de Particionamento em Classes de Equivalência e Análise do Valor Limite na criação dos casos de teste lógicos.
  * **Testes Estruturais (Caixa-Branca)**: Análise de cobertura de comandos e decisões para validar a lógica interna do interpretador e do gerador.
  * **Testes Baseados em Risco e Ágeis**: Priorização das suítes de automação integradas às *sprints* do Scrum e ao ciclo de vida de *pull requests* do GitHub (GitHub Flow).
* **Tipos de Teste**:
  * **Testes Unitários**: Validação isolada de funções matemáticas de posição do robô, montagem de linhas de Portugol e avaliação das condições de borda.
  * **Testes de Componentes**: Validação do comportamento dos componentes React (editor Blockly e área visual SVG).
  * **Testes de Integração**: Verificação do fluxo API <-> PostgreSQL, validação do token Google OAuth 2.0 e consistência simultânea entre o simulador e a área de código.
  * **Testes de Ponta a Ponta (E2E)**: Simulação automatizada da jornada completa do estudante (autenticação simulada, montagem de blocos, simulação, salvamento, listagem e reabertura).
* **Ferramentas Utilizadas**:
  * **Vitest & React Testing Library**: Testes unitários e de componentes no front-end e regras de negócio no back-end.
  * **Playwright**: Automação dos testes E2E e validação da interface web em navegadores headless.
  * **Postman**: Coleção de testes e asserções automatizadas para os *endpoints* da API Express.

---

### **5. Ambiente de Teste**

* **Hardware/Software**:
  * **Testes Locais (Desenvolvimento & QA)**: Máquinas dos desenvolvedores executando ambiente runtime Node.js (v18+).
  * **Banco de Dados de Teste**: Instância de banco de dados PostgreSQL executada em container Docker isolado (porta mapeada dedicada a testes, ex.: `5433`), garantindo ambiente reproduzível e rápido descarte de dados.
  * **Navegadores**: Execução headless dos motores Chromium, Firefox e WebKit, gerenciados nativamente pela ferramenta Playwright para testes E2E e de componentes.
  * **Integração Contínua (CI)**: GitHub Actions configurado para executar a suíte de testes unitários e de integração a cada Pull Request submetido.

* **URL de teste ou versão do aplicativo**:
  * **Interface do Usuário (Front-end)**: `http://localhost:5173` (servidor de desenvolvimento Vite).
  * **API REST (Back-end)**: `http://localhost:3000` (servidor Express com variáveis de ambiente configuradas para o banco de teste).
  * **Versão da Aplicação**: Build de desenvolvimento local referente à *branch* sob avaliação (`feature/*` ou `release/*`).

* **Fontes de dados de teste**:
  * **Testes Unitários**: *Mocks* e *stubs* em memória simulando os retornos das funções do robô, do interpretador de blocos e do gerador de Portugol.
  * **Testes de API e Integração**: Banco de dados PostgreSQL populado com scripts de *seed* (massa de dados simulada) contendo usuários e programas de teste criados/resetados antes de cada ciclo de execução.
  * **Testes E2E e Autenticação**: Utilização de *mocks* do token Google OAuth 2.0 para simular a jornada de login (RF01) sem depender de contas pessoais reais ou de requisições externas em ambiente de teste.

---

### **6. Riscos e Mitigação**

| Risco | Estratégia de Mitigação |
| :--- | :--- |
| Cronograma de lançamento apertado (2 *sprints*) | Priorizar casos de teste críticos (interpretador, gerador e auth) e automatizar testes unitários no CI. |
| Cobertura limitada de navegadores/dispositivos | Utilizar testes automatizados headless via Playwright nos motores Chromium, Firefox e WebKit. |
| Inconsistência entre simulador SVG e Portugol gerado | Implementar testes de integração focados em comparar as saídas do interpretador e do gerador para os mesmos blocos. |
| Falha na validação de permissão de acesso aos programas | Criar testes automatizados de API no Postman/Vitest validando a restrição por ID de proprietário autenticado. |

---

### **7. Entregáveis de Teste**

* **Plano de Teste**: Documento vivo atualizado a cada *sprint* (versão atual `v0.1`).
* **Casos e Cenários de Teste**: Mapeamento detalhado dos cenários funcionais, unitários, de integração e E2E.
* **Matriz de Responsabilidade / Rastreabilidade**: Relação entre Requisitos (RF/RNF), Casos de Teste e *Issues* no GitHub/Jira.
* **Suítes de Teste Automatizadas**: Código fonte dos testes em Vitest, React Testing Library e Playwright no repositório.
* **Collection no Postman**: Coleção de requisições e asserções automatizadas para validação dos *endpoints* da API.
* **Relatório de Execução, Bugs e Cobertura**: Registros de *issues* no GitHub e relatório de cobertura de código (*Code Coverage* >= 80%).

---

### **8. Critérios de Entrada e Saída**

* **Critérios de Entrada**:
  * Código do módulo disponível para teste em *Pull Request*.
  * Ambiente local/Docker configurado e estável.
  * Casos de teste escritos e revisados.
* **Critérios de Saída**:
  * Cobertura mínima de **80%** nos módulos centrais (Interpretador e Gerador Portugol).
  * 100% de aprovação nos testes E2E e de integração críticos.
  * Nenhum bug crítico ou grave em aberto.
