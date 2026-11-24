import { describe, expect, it } from "vitest";
import { type BlockNode, PROBLEM_MESSAGES, validate } from "./interpreter";

const start = (inside?: BlockNode) => ({
  blocks: { blocks: [{ type: "bb_start", inputs: inside ? { DO: { block: inside } } : {} }] },
});
const repeat = (inside?: BlockNode, next?: BlockNode): BlockNode => ({
  type: "bb_repeat",
  fields: { COUNT: "3" },
  inputs: inside ? { DO: { block: inside } } : undefined,
  next: next ? { block: next } : undefined,
});
const ifEdge = (inside?: BlockNode): BlockNode => ({
  type: "bb_if_edge",
  inputs: inside ? { DO: { block: inside } } : undefined,
});
const front: BlockNode = { type: "bb_front" };

describe("aviso de programa inválido (RF10)", () => {
  it("avisa quando não há bloco embaixo de Ao iniciar", () => {
    expect(validate(start())).toBe("vazio");
    expect(validate(null)).toBe("vazio");
    expect(validate({})).toBe("vazio");
  });

  it("avisa quando só há blocos desativados", () => {
    expect(validate(start({ type: "bb_front", enabled: false }))).toBe("vazio");
  });

  it("avisa quando o Repetir está vazio", () => {
    expect(validate(start(repeat()))).toBe("incompleto");
  });

  it("avisa quando o Se na borda está vazio", () => {
    expect(validate(start(ifEdge()))).toBe("incompleto");
  });

  it("avisa quando o bloco vazio está dentro de outro", () => {
    expect(validate(start(repeat(ifEdge())))).toBe("incompleto");
  });

  it("avisa quando o bloco vazio vem depois de um bloco válido", () => {
    expect(validate(start({ ...front, next: { block: repeat() } }))).toBe("incompleto");
  });

  it("trata como vazio o bloco que só tem blocos desativados dentro", () => {
    expect(validate(start(repeat({ type: "bb_front", enabled: false })))).toBe("incompleto");
  });

  it("aceita um programa completo", () => {
    expect(validate(start(front))).toBeNull();
    expect(validate(start(repeat(front, ifEdge(front))))).toBeNull();
  });

  it("tem uma mensagem para cada problema", () => {
    expect(PROBLEM_MESSAGES.vazio).toMatch(/Ao iniciar/);
    expect(PROBLEM_MESSAGES.incompleto).toMatch(/incompleto/);
  });
});
