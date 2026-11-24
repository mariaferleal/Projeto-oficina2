import { pool } from '../config/database.js';

import type { Usuario } from '../models/usuario.model.js';

export async function buscarUsuarioPorGoogleId(
  googleId: string,
): Promise<Usuario | null> {
  const resultado = await pool.query<Usuario>(
    'SELECT * FROM usuarios WHERE google_id = $1',
    [googleId],
  );

  return resultado.rows[0] ?? null;
}

export async function criarUsuario(
  googleId: string,
  nome: string,
  email: string,
): Promise<Usuario> {
  const resultado = await pool.query<Usuario>(
    `INSERT INTO usuarios (google_id, nome, email)
     VALUES ($1, $2, $3)
     ON CONFLICT (google_id)
     DO UPDATE SET google_id = EXCLUDED.google_id
     RETURNING *`,
    [googleId, nome, email],
  );

  return resultado.rows[0];
}

export async function buscarUsuarioPorId(
  id: string,
): Promise<Usuario | null> {
  const resultado = await pool.query<Usuario>(
    'SELECT * FROM usuarios WHERE id = $1',
    [id],
  );

  return resultado.rows[0] ?? null;
}