import * as Blockly from "blockly/core";

export type BlockType =
  | "bb_start"
  | "bb_front"
  | "bb_back"
  | "bb_left"
  | "bb_right"
  | "bb_repeat"
  | "bb_if_edge";

const ICON_PATHS = {
  up: '<path d="m6 10 6-6 6 6"/><path d="M12 4v16"/>',
  down: '<path d="m6 14 6 6 6-6"/><path d="M12 20V4"/>',
  left: '<path d="m10 6-6 6 6 6"/><path d="M4 12h16"/>',
  right: '<path d="m14 6 6 6-6 6"/><path d="M20 12H4"/>',
  repeat:
    '<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  branch:
    '<path d="M6 3v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9c5 0 4-3 9-3"/>',
  play: '<path d="m8 5 11 7-11 7Z" fill="currentColor"/>',
} as const;

function iconUri(name: keyof typeof ICON_PATHS, color: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ` +
    `stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">` +
    ICON_PATHS[name].split("currentColor").join(color) +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function icon(name: keyof typeof ICON_PATHS, color: string, alt: string) {
  return { type: "field_image", src: iconUri(name, color), width: 18, height: 18, alt };
}

const MOVE = "#363b9f";
const LOGIC = "#a33f33";
const COND = "#116b52";

const COUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => [String(i + 1), String(i + 1)]);

let registered = false;

export function registerBlocks() {
  if (registered) return;
  registered = true;

  Blockly.common.defineBlocksWithJsonArray([
    {
      type: "bb_start",
      message0: "%1 Ao iniciar",
      args0: [icon("play", "#ffffff", "")],
      message1: "%1",
      args1: [{ type: "input_statement", name: "DO" }],
      style: "bb_start",
      tooltip: "Os blocos rodam de cima para baixo, a partir daqui.",
      deletable: false,
      movable: false,
      editable: false,
    },
    {
      type: "bb_front",
      message0: "%1 Frente",
      args0: [icon("up", MOVE, "")],
      previousStatement: null,
      nextStatement: null,
      style: "bb_move",
      tooltip: "Sobe 1 casa",
    },
    {
      type: "bb_back",
      message0: "%1 Trás",
      args0: [icon("down", MOVE, "")],
      previousStatement: null,
      nextStatement: null,
      style: "bb_move",
      tooltip: "Desce 1 casa",
    },
    {
      type: "bb_right",
      message0: "%1 Direita",
      args0: [icon("right", MOVE, "")],
      previousStatement: null,
      nextStatement: null,
      style: "bb_move",
      tooltip: "Vai 1 casa para a direita",
    },
    {
      type: "bb_left",
      message0: "%1 Esquerda",
      args0: [icon("left", MOVE, "")],
      previousStatement: null,
      nextStatement: null,
      style: "bb_move",
      tooltip: "Vai 1 casa para a esquerda",
    },
    {
      type: "bb_repeat",
      message0: "%1 Repetir %2 vezes",
      args0: [
        icon("repeat", LOGIC, ""),
        { type: "field_dropdown", name: "COUNT", options: COUNT_OPTIONS },
      ],
      message1: "%1",
      args1: [{ type: "input_statement", name: "DO" }],
      previousStatement: null,
      nextStatement: null,
      style: "bb_logic",
      tooltip: "Repete os blocos de dentro de 1 a 10 vezes",
    },
    {
      type: "bb_if_edge",
      message0: "%1 Se na borda",
      args0: [icon("branch", COND, "")],
      message1: "%1",
      args1: [{ type: "input_statement", name: "DO" }],
      previousStatement: null,
      nextStatement: null,
      style: "bb_condition",
      tooltip: "Só roda os blocos de dentro se o robô estiver na borda",
    },
  ]);
}

export const TOOLBOX: Blockly.utils.toolbox.ToolboxDefinition = {
  kind: "flyoutToolbox",
  contents: [
    { kind: "label", text: "Movimento" },
    { kind: "block", type: "bb_front" },
    { kind: "block", type: "bb_back" },
    { kind: "block", type: "bb_right" },
    { kind: "block", type: "bb_left" },
    { kind: "label", text: "Lógica" },
    { kind: "block", type: "bb_repeat", fields: { COUNT: "3" } },
    { kind: "block", type: "bb_if_edge" },
  ],
};
