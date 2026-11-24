import { afterEach, beforeAll, describe, expect, it } from "vitest";
import * as Blockly from "blockly/core";
import { registerBlocks } from "./blocks";
import { generatePortugol } from "./portugol";
import { STARTER_PROGRAMS, type WorkspaceState } from "./programs";

type Node = { type: string; fields?: Record<string, string>; inputs?: unknown; next?: unknown };

const chain = (...nodes: Node[]): Node | undefined =>
  nodes.reduceRight<Node | undefined>((next, node) => (next ? { ...node, next: { block: next } } : node), undefined);

const program = (...nodes: Node[]): WorkspaceState => ({
  blocks: {
    languageVersion: 0,
    blocks: [{ type: "bb_start", x: 0, y: 0, inputs: nodes.length ? { DO: { block: chain(...nodes) } } : {} }],
  },
});
const repeat = (count: number, ...inside: Node[]): Node => ({
  type: "bb_repeat",
  fields: { COUNT: String(count) },
  inputs: inside.length ? { DO: { block: chain(...inside) } } : {},
});
const ifEdge = (...inside: Node[]): Node => ({
  type: "bb_if_edge",
  inputs: inside.length ? { DO: { block: chain(...inside) } } : {},
});

let workspace: Blockly.Workspace | undefined;

const generate = (state: WorkspaceState) => {
  workspace = new Blockly.Workspace();
  Blockly.serialization.workspaces.load(state, workspace);
  return generatePortugol(workspace);
};

beforeAll(() => registerBlocks());
afterEach(() => {
  workspace?.dispose();
  workspace = undefined;
});

describe("geração de código em Portugol (RF07)", () => {
  it("gera o programa vazio", () => {
    expect(generate(program())).toEqual(["programa", "{", "}"]);
  });

  it("gera só a estrutura quando não há Ao iniciar", () => {
    workspace = new Blockly.Workspace();
    expect(generatePortugol(workspace)).toEqual(["programa", "{", "}"]);
  });

  it("gera um comando para cada bloco de movimento, na ordem", () => {
    expect(
      generate(program({ type: "bb_front" }, { type: "bb_back" }, { type: "bb_left" }, { type: "bb_right" })),
    ).toEqual(["programa", "{", "  frente()", "  tras()", "  esquerda()", "  direita()", "}"]);
  });

  it("gera o repita com o número de vezes e o corpo recuado", () => {
    expect(generate(program(repeat(3, { type: "bb_right" })))).toEqual([
      "programa",
      "{",
      "  repita 3 vezes",
      "    direita()",
      "  fim_repita",
      "}",
    ]);
  });

  it("gera o se da borda", () => {
    expect(generate(program(ifEdge({ type: "bb_left" })))).toEqual([
      "programa",
      "{",
      "  se robo_na_borda() entao",
      "    esquerda()",
      "  fim_se",
      "}",
    ]);
  });

  it("recua blocos aninhados e continua depois deles", () => {
    expect(generate(program(repeat(2, ifEdge({ type: "bb_back" })), { type: "bb_front" }))).toEqual([
      "programa",
      "{",
      "  repita 2 vezes",
      "    se robo_na_borda() entao",
      "      tras()",
      "    fim_se",
      "  fim_repita",
      "  frente()",
      "}",
    ]);
  });

  it("gera repita e se vazios sem corpo", () => {
    expect(generate(program(repeat(1), ifEdge()))).toEqual([
      "programa",
      "{",
      "  repita 1 vezes",
      "  fim_repita",
      "  se robo_na_borda() entao",
      "  fim_se",
      "}",
    ]);
  });

  it("não inclui blocos soltos fora do Ao iniciar", () => {
    const state = program({ type: "bb_front" });
    (state.blocks as { blocks: unknown[] }).blocks.push({ type: "bb_back", x: 200, y: 200 });
    expect(generate(state)).toEqual(["programa", "{", "  frente()", "}"]);
  });

  it("gera o código dos programas de exemplo", () => {
    expect(generate(STARTER_PROGRAMS[0].state!)).toContain("  repita 3 vezes");
    expect(generate(STARTER_PROGRAMS[1].state!)).toContain("  se robo_na_borda() entao");
  });
});
