
import 'dotenv/config';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const pastaMigrations = path.resolve(diretorioAtual, '../migrations');

async function executarMigrations(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não configurada.');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();

    try {
      // Impede migrations simultâneas
      await client.query('SELECT pg_advisory_lock($1)', [847213]);

      try {
        // Registra as migrations executadas
        await client.query(`
          CREATE TABLE IF NOT EXISTS schema_migrations (
            nome TEXT PRIMARY KEY,
            executada_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `);

        // Lista os arquivos SQL
        const arquivos = (await readdir(pastaMigrations))
          .filter((arquivo) => arquivo.endsWith('.sql'))
          .sort();

        for (const arquivo of arquivos) {
          // Verifica se a migration já foi executada
          const jaExecutada = await client.query(
            'SELECT 1 FROM schema_migrations WHERE nome = $1',
            [arquivo],
          );

          if (jaExecutada.rowCount) {
            console.log(`Migration já executada: ${arquivo}`);
            continue;
          }

          // Lê o arquivo SQL
          const sql = await readFile(
            path.join(pastaMigrations, arquivo),
            'utf8',
          );

          await client.query('BEGIN');

          try {
            // Executa a migration
            await client.query(sql);

            // Registra sua execução
            await client.query(
              'INSERT INTO schema_migrations (nome) VALUES ($1)',
              [arquivo],
            );

            await client.query('COMMIT');

            console.log(`Migration executada: ${arquivo}`);
          } catch (erro) {
            await client.query('ROLLBACK');
            throw erro;
          }
        }
      } finally {
        // Libera o bloqueio
        await client.query(
          'SELECT pg_advisory_unlock($1)',
          [847213],
        );
      }
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

executarMigrations().catch((erro) => {
  console.error('Erro ao executar migrations:', erro);
  process.exitCode = 1;
});
