export interface Programa {
  id: string;
  usuario_id: string;
  titulo: string;
  blocos: Record<string, unknown>;
  criado_em: Date;
  atualizado_em: Date;
}
