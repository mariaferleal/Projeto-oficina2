import { describe, expect, it } from "vitest";
import {
  type BlockNode,
  MAX_STEPS,
  START_POSITION,
  firstBlock,
  interpret,
  isEdge,
  move,
  repeatCount,
} from "./interpreter";

const chain = (...nodes: BlockNode[]): BlockNode | undefined =>
  nodes.reduceRight<BlockNode | undefined>((next, node) => (next ? { ...node, next: { block: next } } : node), undefined);

const step = (type: string, extra: Partial<BlockNode> = {}): BlockNode => ({ type, id: type, ...extra });
const repeat = (count: unknown, ...inside: BlockNode[]): BlockNode => ({
  type: "bb_repeat",
  id: "repeat",
  fields: { COUNT: count },
  inputs: { DO: { block: chain(...inside) } },
});
const ifEdge = (...inside: BlockNode[]): BlockNode => ({
  type: "bb_if_edge",
  id: "if",
  inputs: { DO: { block: chain(...inside) } },
});
const program = (...nodes: BlockNode[]) => ({
  blocks: { languageVersion: 0, blocks: [{ type: "bb_start", inputs: { DO: { block: chain(...nodes) } } }] },
});

describe("movimento do robô", () => {
  it("começa no centro da área 5x5", () => {
    expect(START_POSITION).toEqual({ x: 2, y: 2 });
  });

  it.each([
    ["bb_front", { x: 2, y: 1 }],
    ["bb_back", { x: 2, y: 3 }],
    ["bb_left", { x: 1, y: 2 }],
    ["bb_right", { x: 3, y: 2 }],
  ])("%s anda uma casa", (type, expected) => {
    expect(move(START_POSITION, type)).toEqual(expected);
  });

  it("não sai da área em nenhum dos quatro lados", () => {
    expect(move({ x: 0, y: 0 }, "bb_left")).toEqual({ x: 0, y: 0 });
    expect(move({ x: 0, y: 0 }, "bb_front")).toEqual({ x: 0, y: 0 });
    expect(move({ x: 4, y: 4 }, "bb_right")).toEqual({ x: 4, y: 4 });
    expect(move({ x: 4, y: 4 }, "bb_back")).toEqual({ x: 4, y: 4 });
  });

  it("ignora um tipo de bloco desconhecido", () => {
    expect(move(START_POSITION, "bb_voar")).toEqual(START_POSITION);
  });

  it("reconhece a borda", () => {
    expect(isEdge({ x: 2, y: 2 })).toBe(false);
    expect(isEdge({ x: 0, y: 2 })).toBe(true);
    expect(isEdge({ x: 4, y: 2 })).toBe(true);
    expect(isEdge({ x: 2, y: 0 })).toBe(true);
    expect(isEdge({ x: 2, y: 4 })).toBe(true);
  });
});

describe("execução do programa", () => {
  it("roda os blocos de cima para baixo", () => {
    const result = interpret(program(step("bb_front"), step("bb_right"), step("bb_right")));
    expect(result.steps.map((s) => s.type)).toEqual(["bb_front", "bb_right", "bb_right"]);
    expect(result.steps.map((s) => s.position)).toEqual([
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
    ]);
    expect(result.position).toEqual({ x: 4, y: 1 });
    expect(result.truncated).toBe(false);
  });

  it("continua a partir da posição informada", () => {
    expect(interpret(program(step("bb_left")), { x: 4, y: 4 }).position).toEqual({ x: 3, y: 4 });
  });

  it("marca o movimento barrado pelo limite e mantém o robô na área", () => {
    const result = interpret(program(repeat(4, step("bb_front"))));
    const moves = result.steps.filter((s) => s.kind === "move");
    expect(moves.map((s) => s.blocked)).toEqual([false, false, true, true]);
    expect(result.position).toEqual({ x: 2, y: 0 });
  });

  it("repete os blocos de dentro o número de vezes escolhido", () => {
    const result = interpret(program(repeat(2, step("bb_right"), step("bb_back"))));
    expect(result.steps.map((s) => s.type)).toEqual(["bb_repeat", "bb_right", "bb_back", "bb_right", "bb_back"]);
    expect(result.steps[0].kind).toBe("control");
    expect(result.position).toEqual({ x: 4, y: 4 });
  });

  it("aceita repetições aninhadas", () => {
    const result = interpret(program(repeat(2, repeat(2, step("bb_left")))), { x: 4, y: 2 });
    expect(result.steps.filter((s) => s.kind === "move")).toHaveLength(4);
    expect(result.position).toEqual({ x: 0, y: 2 });
  });

  it("limita as repetições entre 1 e 10", () => {
    expect(repeatCount(repeat("3"))).toBe(3);
    expect(repeatCount(repeat(0))).toBe(1);
    expect(repeatCount(repeat(99))).toBe(10);
    expect(repeatCount(repeat("abc"))).toBe(1);
    expect(repeatCount({ type: "bb_repeat" })).toBe(1);
  });

  it("só roda o bloco Se na borda quando o robô está na borda", () => {
    const fora = interpret(program(ifEdge(step("bb_left"))));
    expect(fora.steps.map((s) => s.type)).toEqual(["bb_if_edge"]);
    expect(fora.position).toEqual(START_POSITION);

    const naBorda = interpret(program(ifEdge(step("bb_left"))), { x: 2, y: 0 });
    expect(naBorda.steps.map((s) => s.type)).toEqual(["bb_if_edge", "bb_left"]);
    expect(naBorda.position).toEqual({ x: 1, y: 0 });
  });

  it("avalia a borda no momento em que o bloco roda", () => {
    const result = interpret(program(repeat(2, step("bb_front")), ifEdge(step("bb_right"))));
    expect(result.position).toEqual({ x: 3, y: 0 });
  });

  it("pula blocos desativados", () => {
    const result = interpret(
      program(step("bb_front", { enabled: false }), step("bb_right", { disabledReasons: ["MANUAL"] }), step("bb_back")),
    );
    expect(result.steps.map((s) => s.type)).toEqual(["bb_back"]);
  });

  it("ignora blocos de tipo desconhecido", () => {
    expect(interpret(program(step("bb_voar"), step("bb_back"))).steps.map((s) => s.type)).toEqual(["bb_back"]);
  });

  it("guarda o id do bloco para destacar na tela", () => {
    expect(interpret(program({ type: "bb_front", id: "abc" })).steps[0].blockId).toBe("abc");
  });

  it("interrompe programas longos demais", () => {
    const longo = program(repeat(10, repeat(10, repeat(10, repeat(10, step("bb_front"))))));
    const result = interpret(longo);
    expect(result.truncated).toBe(true);
    expect(result.steps).toHaveLength(MAX_STEPS);
  });

  it("não executa nada sem o bloco Ao iniciar", () => {
    expect(interpret(null).steps).toEqual([]);
    expect(interpret({}).steps).toEqual([]);
    expect(interpret({ blocks: { blocks: [step("bb_front")] } }).steps).toEqual([]);
    expect(firstBlock({ blocks: { blocks: "x" } })).toBeNull();
  });
});
