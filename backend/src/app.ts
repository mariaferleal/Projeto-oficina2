import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import programaRoutes from './routes/programa.routes.js';

const app = express();

// FRONTEND_URL aceita mais de um endereço, separados por vírgula.
export const origensPermitidas = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origem) => origem.trim())
  .filter(Boolean);

app.use(cors({
  origin: origensPermitidas,
}));

app.use(express.json());

app.use('/health', healthRouter);
app.use('/api/auth', authRoutes);
app.use('/api/programas', programaRoutes);

export default app;
