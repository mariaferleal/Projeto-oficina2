import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

app.use(express.json());

app.use('/health', healthRouter);
app.use('/api/auth', authRoutes);

export default app;
