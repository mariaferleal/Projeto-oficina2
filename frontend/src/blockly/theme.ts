import * as Blockly from "blockly/core";

export const bipiTheme = Blockly.Theme.defineTheme("bipi", {
  name: "bipi",
  blockStyles: {
    bb_start: { colourPrimary: "#17213c", colourSecondary: "#2b3658", colourTertiary: "#0d1426", hat: "cap" },
    bb_move: { colourPrimary: "#dfe0ff", colourSecondary: "#eceeff", colourTertiary: "#8f93f0", hat: "" },
    bb_logic: { colourPrimary: "#ffd9d3", colourSecondary: "#ffe8e4", colourTertiary: "#f29a8b", hat: "" },
    bb_condition: { colourPrimary: "#cff3e5", colourSecondary: "#e1f8ef", colourTertiary: "#6fd0ab", hat: "" },
  },
  categoryStyles: {},
  componentStyles: {
    workspaceBackgroundColour: "#fafaf7",
    toolboxBackgroundColour: "#ffffff",
    flyoutBackgroundColour: "#ffffff",
    flyoutOpacity: 1,
    scrollbarColour: "#b8bdc9",
    scrollbarOpacity: 0.6,
    insertionMarkerColour: "#5a5ee7",
    insertionMarkerOpacity: 0.3,
  },
  fontStyle: { family: "Nunito, sans-serif", weight: "800", size: 11 },
  startHats: true,
});
