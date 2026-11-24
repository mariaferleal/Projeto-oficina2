import {
  buscarUsuarioPorGoogleId,
  criarUsuario,
} from '../repositories/usuario.repository.js';

import type { Usuario } from '../models/usuario.model.js';

interface DadosUsuarioGoogle {
  googleId: string;
  nome: string;
  email: string;
}

export async function registrarPrimeiroAcesso(
  dados: DadosUsuarioGoogle,
): Promise<Usuario> {

  const usuarioExistente = await buscarUsuarioPorGoogleId(
    dados.googleId,
  );

  if (usuarioExistente) {
    return usuarioExistente;
  }

  const novoUsuario = await criarUsuario(
    dados.googleId,
    dados.nome,
    dados.email,
  );

  return novoUsuario;
}