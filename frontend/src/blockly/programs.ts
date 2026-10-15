export type WorkspaceState = Record<string, unknown>;

type Node = {
  type: string;
  fields?: Record<string, string>;
  inputs?: Record<string, { block: Node }>;
  next?: { block: Node };
};

/** Encadeia blocos um abaixo do outro e devolve o primeiro. */
const chain = (...nodes: Node[]): Node =>
  nodes.reduceRight<Node | undefined>(
    (next, node) => (next ? { ...node, next: { block: next } } : node),
    undefined,
  )!;

const repeat = (count: number, ...inside: Node[]): Node => ({
  type: "bb_repeat",
  fields: { COUNT: String(count) },
  inputs: { DO: { block: chain(...inside) } },
});

const ifEdge = (...inside: Node[]): Node => ({
  type: "bb_if_edge",
  inputs: { DO: { block: chain(...inside) } },
});

const step = (type: "bb_front" | "bb_back" | "bb_left" | "bb_right"): Node => ({ type });

function program(...nodes: Node[]): WorkspaceState {
  return {
    blocks: {
      languageVersion: 0,
      blocks: [
        {
          type: "bb_start",
          x: 24,
          y: 24,
          inputs: { DO: { block: chain(...nodes) } },
        },
      ],
    },
  };
}

export type SavedProgram = {
  id: string;
  name: string;
  updated: string;
  blockCount: number;
  state: WorkspaceState | null;
};

export const STARTER_PROGRAMS: SavedProgram[] = [
  {
    id: "saved-1",
    name: "Passeio em L",
    updated: "Hoje, 14:32",
    blockCount: 3,
    state: program(step("bb_front"), repeat(3, step("bb_right"))),
  },
  {
    id: "saved-2",
    name: "Até a borda",
    updated: "Ontem, 18:05",
    blockCount: 4,
    state: program(repeat(4, step("bb_front")), ifEdge(step("bb_left"))),
  },
];
