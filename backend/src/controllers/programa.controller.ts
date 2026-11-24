import type { Request, Response } from 'express';

import * as repositorio from '../repositories/programa.repository.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TAMANHO_MAXIMO_TITULO = 100;

interface DadosPrograma {
  titulo: string;
  blocos: Record<string, unknown>;
}

/** Valida o corpo da requisição; devolve a mensagem de erro ou os dados prontos. */
export function validarPrograma(corpo: unknown): DadosPrograma | string {
  const { titulo, blocos } = (corpo ?? {}) as Record<string, unknown>;

  if (typeof titulo !== 'string' || !titulo.trim()) {
    return 'O título é obrigatório.';
  }
  if (titulo.trim().length > TAMANHO_MAXIMO_TITULO) {
    return `O título deve ter no máximo ${TAMANHO_MAXIMO_TITULO} caracteres.`;
  }
  if (!blocos || typeof blocos !== 'object' || Array.isArray(blocos)) {
    return 'A estrutura de blocos é inválida.';
  }
  return { titulo: titulo.trim(), blocos: blocos as Record<string, unknown> };
}

function idValido(req: Request, res: Response): string | null {
  const { id } = req.params;
  if (typeof id !== 'string' || !UUID.test(id)) {
    res.status(400).json({ mensagem: 'Identificador de programa inválido.' });
    return null;
  }
  return id;
}

function erroInterno(res: Response, erro: unknown): void {
  console.error('Erro ao acessar programas:', erro);
  res.status(500).json({ mensagem: 'Erro interno ao acessar os programas.' });
}

export async function listar(_req: Request, res: Response): Promise<void> {
  try {
    const programas = await repositorio.listarProgramas(res.locals.usuarioId);
    res.status(200).json({ programas });
  } catch (erro) {
    erroInterno(res, erro);
  }
}

export async function abrir(req: Request, res: Response): Promise<void> {
  const id = idValido(req, res);
  if (!id) return;
  try {
    const programa = await repositorio.buscarPrograma(res.locals.usuarioId, id);
    if (!programa) {
      res.status(404).json({ mensagem: 'Programa não encontrado.' });
      return;
    }
    res.status(200).json({ programa });
  } catch (erro) {
    erroInterno(res, erro);
  }
}

export async function criar(req: Request, res: Response): Promise<void> {
  const dados = validarPrograma(req.body);
  if (typeof dados === 'string') {
    res.status(400).json({ mensagem: dados });
    return;
  }
  try {
    const programa = await repositorio.criarPrograma(
      res.locals.usuarioId,
      dados.titulo,
      dados.blocos,
    );
    res.status(201).json({ programa });
  } catch (erro) {
    erroInterno(res, erro);
  }
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  const id = idValido(req, res);
  if (!id) return;
  const dados = validarPrograma(req.body);
  if (typeof dados === 'string') {
    res.status(400).json({ mensagem: dados });
    return;
  }
  try {
    const programa = await repositorio.atualizarPrograma(
      res.locals.usuarioId,
      id,
      dados.titulo,
      dados.blocos,
    );
    if (!programa) {
      res.status(404).json({ mensagem: 'Programa não encontrado.' });
      return;
    }
    res.status(200).json({ programa });
  } catch (erro) {
    erroInterno(res, erro);
  }
}

export async function excluir(req: Request, res: Response): Promise<void> {
  const id = idValido(req, res);
  if (!id) return;
  try {
    const excluido = await repositorio.excluirPrograma(res.locals.usuarioId, id);
    if (!excluido) {
      res.status(404).json({ mensagem: 'Programa não encontrado.' });
      return;
    }
    res.status(204).end();
  } catch (erro) {
    erroInterno(res, erro);
  }
}
