import app from './app.js';

const porta = Number(process.env.PORT) || 3000;

app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});