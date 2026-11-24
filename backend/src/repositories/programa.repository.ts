import { pool } from '../config/database.js';

import type { Programa } from '../models/programa.model.js';

// Toda consulta filtra pelo dono do programa (RN06).

export async function listarProgramas(usuarioId: string): Promise<Programa[]> {
  const resultado = await pool.query<Programa>(
    'SELECT * FROM programas WHERE usuario_id = $1 ORDER BY atualizado_em DESC',
    [usuarioId],
  );
  return resultado.rows;
}

export async function buscarPrograma(
  usuarioId: string,
  id: string,
): Promise<Programa | null> {
  const resultado = await pool.query<Programa>(
    'SELECT * FROM programas WHERE id = $1 AND usuario_id = $2',
    [id, usuarioId],
  );
  return resultado.rows[0] ?? null;
}

export async function criarPrograma(
  usuarioId: string,
  titulo: string,
  blocos: Record<string, unknown>,
): Promise<Programa> {
  const resultado = await pool.query<Programa>(
    `INSERT INTO programas (usuario_id, titulo, blocos)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [usuarioId, titulo, JSON.stringify(blocos)],
  );
  return resultado.rows[0];
}

export async function atualizarPrograma(
  usuarioId: string,
  id: string,
  titulo: string,
  blocos: Record<string, unknown>,
): Promise<Programa | null> {
  const resultado = await pool.query<Programa>(
    `UPDATE programas
     SET titulo = $3, blocos = $4, atualizado_em = NOW()
     WHERE id = $1 AND usuario_id = $2
     RETURNING *`,
    [id, usuarioId, titulo, JSON.stringify(blocos)],
  );
  return resultado.rows[0] ?? null;
}

export async function excluirPrograma(
  usuarioId: string,
  id: string,
): Promise<boolean> {
  const resultado = await pool.query(
    'DELETE FROM programas WHERE id = $1 AND usuario_id = $2',
    [id, usuarioId],
  );
  return (resultado.rowCount ?? 0) > 0;
}
