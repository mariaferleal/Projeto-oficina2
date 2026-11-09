import 'dotenv/config';

import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function fecharConexao(): Promise<void> {
  await pool.end();
}