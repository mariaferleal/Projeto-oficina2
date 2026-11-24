/**
 * Interpretador do BlocoBot (RF06, RF10).
 *
 * Recebe o programa no formato salvo pelo Blockly (o mesmo JSON que vai para a API)
 * e devolve a lista de passos que o robô executa. Não depende do React nem do
 * Blockly, então pode ser testado sozinho.
 */

export type Position = { x: number; y: number };

export type BlockNode = {
  type: string;
  id?: string;
  enabled?: boolean;
  disabledReasons?: string[];
  fields?: Record<string, unknown>;
  inputs?: Record<string, { block?: BlockNode } | undefined>;
  next?: { block?: BlockNode };
};

export type ProgramState = Record<string, unknown> | null | undefined;

/** Um passo da execução: o bloco que rodou e onde o robô ficou depois dele. */
export type Step = {
  blockId?: string;
  type: string;
  kind: "move" | "control";
  position: Position;
  /** Verdadeiro quando o movimento foi barrado pelo limite da área (RN de limites). */
  blocked: boolean;
};

export type Result = {
  steps: Step[];
  position: Position;
  /** Verdadeiro quando a execução parou por atingir o limite de passos. */
  truncated: boolean;
};

export type Problem = "vazio" | "incompleto";

export const GRID_SIZE = 5;
export const START_POSITION: Position = { x: 2, y: 2 };
export const MAX_STEPS = 2000;
export const MAX_REPEAT = 10;

const MOVES: Record<string, Position> = {
  bb_front: { x: 0, y: -1 },
  bb_back: { x: 0, y: 1 },
  bb_left: { x: -1, y: 0 },
  bb_right: { x: 1, y: 0 },
};

const CONTAINERS = new Set(["bb_repeat", "bb_if_edge"]);

const clamp = (value: number) => Math.max(0, Math.min(GRID_SIZE - 1, value));

export const isEdge = (p: Position) =>
  p.x === 0 || p.x === GRID_SIZE - 1 || p.y === 0 || p.y === GRID_SIZE - 1;

/** Move o robô uma casa, sem deixar sair da área. */
export function move(from: Position, type: string): Position {
  const delta = MOVES[type];
  if (!delta) return from;
  return { x: clamp(from.x + delta.x), y: clamp(from.y + delta.y) };
}

const isEnabled = (block: BlockNode) => block.enabled !== false && !block.disabledReasons?.length;

const inner = (block: BlockNode) => block.inputs?.DO?.block ?? null;

/** Percorre uma pilha de blocos, de cima para baixo, pulando os desativados. */
function* stack(first: BlockNode | null): Generator<BlockNode> {
  for (let block = first; block; block = block.next?.block ?? null) {
    if (isEnabled(block)) yield block;
  }
}

/** Primeiro bloco encaixado embaixo de "Ao iniciar", ou null se não houver. */
export function firstBlock(state: ProgramState): BlockNode | null {
  const top = (state as { blocks?: { blocks?: BlockNode[] } } | null | undefined)?.blocks?.blocks;
  const start = Array.isArray(top) ? top.find((block) => block.type === "bb_start") : undefined;
  if (!start) return null;
  // Se o primeiro bloco estiver desativado, o programa começa no próximo ativo.
  for (const block of stack(inner(start))) return block;
  return null;
}

function hasEmptyContainer(first: BlockNode | null): boolean {
  for (const block of stack(first)) {
    if (!CONTAINERS.has(block.type)) continue;
    const [child] = stack(inner(block));
    if (!child || hasEmptyContainer(child)) return true;
  }
  return false;
}

/** Diz por que o programa não pode rodar, ou null se ele é válido (RF10). */
export function validate(state: ProgramState): Problem | null {
  const first = firstBlock(state);
  if (!first) return "vazio";
  return hasEmptyContainer(first) ? "incompleto" : null;
}

export const PROBLEM_MESSAGES: Record<Problem, string> = {
  vazio: "Encaixe pelo menos um bloco embaixo de Ao iniciar.",
  incompleto: "Há um bloco incompleto. Coloque algo dentro dele.",
};

/** Número de repetições de um bloco "Repetir", sempre entre 1 e 10. */
export function repeatCount(block: BlockNode): number {
  const value = Math.trunc(Number(block.fields?.COUNT));
  return Number.isFinite(value) ? Math.max(1, Math.min(MAX_REPEAT, value)) : 1;
}

/** Executa o programa a partir de uma posição e devolve todos os passos. */
export function interpret(state: ProgramState, from: Position = START_POSITION): Result {
  const steps: Step[] = [];
  let position = { ...from };
  let truncated = false;

  const push = (block: BlockNode, kind: Step["kind"], blocked = false) => {
    if (steps.length >= MAX_STEPS) {
      truncated = true;
      return false;
    }
    steps.push({ blockId: block.id, type: block.type, kind, position: { ...position }, blocked });
    return true;
  };

  const run = (first: BlockNode | null): boolean => {
    for (const block of stack(first)) {
      if (block.type === "bb_repeat") {
        if (!push(block, "control")) return false;
        for (let i = 0; i < repeatCount(block); i += 1) {
          if (!run(inner(block))) return false;
        }
      } else if (block.type === "bb_if_edge") {
        if (!push(block, "control")) return false;
        if (isEdge(position) && !run(inner(block))) return false;
      } else if (MOVES[block.type]) {
        const next = move(position, block.type);
        const blocked = next.x === position.x && next.y === position.y;
        position = next;
        if (!push(block, "move", blocked)) return false;
      }
    }
    return true;
  };

  run(firstBlock(state));
  return { steps, position, truncated };
}
