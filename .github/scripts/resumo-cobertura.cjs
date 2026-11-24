// Escreve a tabela de cobertura no resumo do GitHub Actions.
// Uso: node resumo-cobertura.cjs "<nome>" <caminho do coverage-summary.json>
const fs = require('fs');

const [nome, caminho] = process.argv.slice(2);

console.log(`### 📊 Cobertura de Testes - ${nome}`);

if (!caminho || !fs.existsSync(caminho)) {
  console.log('⚠️ Arquivo coverage-summary.json não encontrado.');
  process.exit(0);
}

const total = JSON.parse(fs.readFileSync(caminho, 'utf8')).total;

console.log('| Métrica | Percentual |');
console.log('| :--- | :--- |');
console.log(`| Linhas | ${total.lines.pct}% |`);
console.log(`| Funções | ${total.functions.pct}% |`);
console.log(`| Branches | ${total.branches.pct}% |`);
console.log(`| Declarações | ${total.statements.pct}% |`);
