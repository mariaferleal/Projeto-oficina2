import { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import * as PtBr from "blockly/msg/pt-br";
import "blockly/blocks";
import { registerBlocks, TOOLBOX } from "../blockly/blocks";
import { bipiTheme } from "../blockly/theme";
import { generatePortugol } from "../blockly/portugol";
import type { WorkspaceState } from "../blockly/programs";

Blockly.setLocale(PtBr as unknown as Record<string, string>);
registerBlocks();

export const START_X = 24;
export const START_Y = 24;

export function createStartBlock(workspace: Blockly.WorkspaceSvg) {
  const start = workspace.newBlock("bb_start");
  start.initSvg();
  start.render();
  start.moveBy(START_X, START_Y);
  return start;
}

export function getStartBlock(workspace: Blockly.Workspace) {
  return workspace.getTopBlocks(false).find((block) => block.type === "bb_start") ?? null;
}

type Props = {
  initialState: WorkspaceState | null;
  locked: boolean;
  onReady: (workspace: Blockly.WorkspaceSvg) => void;
  onChange: (code: string[], blockCount: number) => void;
};

export default function BlockWorkspace({ initialState, locked, onReady, onChange }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReady, onChange });
  callbacks.current = { onReady, onChange };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const workspace = Blockly.inject(host, {
      toolbox: TOOLBOX,
      renderer: "zelos",
      theme: bipiTheme,
      trashcan: true,
      media: `${import.meta.env.BASE_URL}media/`,
      sounds: false,
      zoom: { controls: false, wheel: false, startScale: 0.95, minScale: 0.6, maxScale: 1.4 },
      move: { scrollbars: true, drag: true, wheel: true },
      grid: { spacing: 18, length: 1, colour: "#dcdde4", snap: false },
    });

    const refresh = () => {
      const count = workspace
        .getAllBlocks(false)
        .filter((block) => block.type !== "bb_start" && block.isEnabled()).length;
      callbacks.current.onChange(generatePortugol(workspace), count);
    };

    if (initialState) {
      Blockly.serialization.workspaces.load(initialState, workspace);
    }
    if (!getStartBlock(workspace)) createStartBlock(workspace);

    // Blocos soltos fora do "Ao iniciar" ficam desativados e não entram na execução.
    workspace.addChangeListener(Blockly.Events.disableOrphans);
    workspace.addChangeListener((event: Blockly.Events.Abstract) => {
      if (!event.isUiEvent) refresh();
    });

    const resize = new ResizeObserver(() => Blockly.svgResize(workspace));
    resize.observe(host);

    callbacks.current.onReady(workspace);
    refresh();

    return () => {
      resize.disconnect();
      workspace.dispose();
    };
    // O workspace é criado uma vez por montagem do Editor (que é remontado via key).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="blockly-host">
      <div ref={hostRef} className="blockly-host__inner" />
      {locked && <div className="blockly-host__lock" aria-hidden="true" />}
    </div>
  );
}
