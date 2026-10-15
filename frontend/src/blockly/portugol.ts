import * as Blockly from "blockly/core";

const portugol = new Blockly.CodeGenerator("Portugol");
portugol.INDENT = "  ";

// Une o código de um bloco com o dos blocos que vêm depois dele na pilha.
portugol.scrub_ = function (block, code, thisOnly) {
  const next = block.nextConnection?.targetBlock();
  return code + (next && !thisOnly ? this.blockToCode(next) : "");
};

portugol.forBlock["bb_front"] = () => "frente()\n";
portugol.forBlock["bb_back"] = () => "tras()\n";
portugol.forBlock["bb_left"] = () => "esquerda()\n";
portugol.forBlock["bb_right"] = () => "direita()\n";

portugol.forBlock["bb_repeat"] = (block, generator) => {
  const count = block.getFieldValue("COUNT") ?? "1";
  const body = generator.statementToCode(block, "DO");
  return `repita ${count} vezes\n${body}fim_repita\n`;
};

portugol.forBlock["bb_if_edge"] = (block, generator) => {
  const body = generator.statementToCode(block, "DO");
  return `se robo_na_borda() entao\n${body}fim_se\n`;
};

/** Gera as linhas do programa em Portugol a partir do workspace. */
export function generatePortugol(workspace: Blockly.Workspace): string[] {
  const start = workspace.getTopBlocks(false).find((block) => block.type === "bb_start");
  const body = start ? portugol.statementToCode(start, "DO") : "";
  return ["programa", "{", ...body.split("\n").filter(Boolean), "}"];
}
