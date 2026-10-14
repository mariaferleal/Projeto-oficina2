import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.routes.js';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  }),
);

app.use('/health', healthRouter);

export default app;