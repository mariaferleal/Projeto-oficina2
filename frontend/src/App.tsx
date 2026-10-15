import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly/core";
import BlockWorkspace, { createStartBlock, getStartBlock } from "./components/BlockWorkspace";
import { STARTER_PROGRAMS, type SavedProgram, type WorkspaceState } from "./blockly/programs";

type IconName =
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "repeat"
  | "branch"
  | "play"
  | "trash"
  | "save"
  | "logout"
  | "folder"
  | "blocks"
  | "check"
  | "close"
  | "spark";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<IconName, React.ReactNode> = {
    "arrow-up": <><path d="m6 10 6-6 6 6" /><path d="M12 4v16" /></>,
    "arrow-down": <><path d="m6 14 6 6 6-6" /><path d="M12 20V4" /></>,
    "arrow-left": <><path d="m10 6-6 6 6 6" /><path d="M4 12h16" /></>,
    "arrow-right": <><path d="m14 6 6 6-6 6" /><path d="M20 12H4" /></>,
    repeat: <><path d="m17 2 4 4-4 4" /><path d="M3 11V9a3 3 0 0 1 3-3h15" /><path d="m7 22-4-4 4-4" /><path d="M21 13v2a3 3 0 0 1-3 3H3" /></>,
    branch: <><path d="M6 3v12" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="6" r="3" /><path d="M6 9c5 0 4-3 9-3" /></>,
    play: <path d="m8 5 11 7-11 7Z" fill="currentColor" />,
    trash: <><path d="M4 7h16" /><path d="M9 3h6l1 4H8Z" /><path d="m7 7 1 14h8l1-14" /></>,
    save: <><path d="M5 3h12l2 2v16H5Z" /><path d="M8 3v6h8V3" /><path d="M8 21v-7h8v7" /></>,
    logout: <><path d="M10 5H5v14h5" /><path d="m14 8 4 4-4 4" /><path d="M18 12H9" /></>,
    folder: <path d="M3 6h7l2 2h9v11H3Z" />,
    blocks: <><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="8" y="13" width="8" height="8" rx="2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    spark: <><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Button({
  children,
  variant = "secondary",
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`button button--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

function Logo() {
  return (
    <div className="logo" aria-label="BlocoBot">
      <div className="logo__mark">
        <span />
        <span />
        <span />
      </div>
      <strong>Bloco<span>Bot</span></strong>
    </div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <main className="login">
      <section className="login__intro">
        <Logo />
        <div className="eyebrow"><Icon name="spark" size={16} /> Código para mentes curiosas</div>
        <div className="login__title">Programe.<br />Veja acontecer.</div>
        <p className="login__copy">
          Encaixe blocos, crie movimentos e ajude o Bipi a explorar. Você aprende lógica brincando.
        </p>
        <div className="login__steps">
          <div><b>1</b><span>Escolha os blocos</span></div>
          <i />
          <div><b>2</b><span>Monte seu plano</span></div>
          <i />
          <div><b>3</b><span>Aperte executar</span></div>
        </div>
      </section>
      <section className="login__panel">
        <div className="login__card">
          <RobotPreview />
          <div className="login__welcome">Olá! Eu sou o Bipi.</div>
          <p>Entre para criar, salvar e continuar seus programas.</p>
          <button className="google-button" onClick={onLogin} type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.5c2-1.9 3.2-4.6 3.2-7.9Z" />
              <path fill="#34A853" d="M12 22c2.9 0 5.3-1 7-2.6l-3.5-2.8c-1 .7-2.2 1-3.5 1-2.8 0-5.2-1.8-6-4.4H2.4V16A10 10 0 0 0 12 22Z" />
              <path fill="#FBBC05" d="M6 13.2A6 6 0 0 1 6 9.4V6.6H2.4a10 10 0 0 0 0 9.4L6 13.2Z" />
              <path fill="#EA4335" d="M12 6.4c1.6 0 3 .6 4.1 1.6l3.1-3A10 10 0 0 0 2.4 6.6L6 9.4c.8-2.5 3.2-4 6-4Z" />
            </svg>
            Entrar com Google
          </button>
          <small>Ao entrar, você aceita usar seus dados apenas para salvar seu progresso.</small>
        </div>
      </section>
    </main>
  );
}

function RobotPreview() {
  return (
    <svg className="robot-preview" viewBox="0 0 180 150" role="img" aria-label="Robô Bipi acenando">
      <path className="robot-antenna" d="M90 36V20" />
      <circle className="robot-antenna-dot" cx="90" cy="14" r="8" />
      <rect className="robot-head" x="42" y="34" width="96" height="76" rx="28" />
      <rect className="robot-face" x="55" y="48" width="70" height="44" rx="18" />
      <circle className="robot-eye" cx="77" cy="69" r="6" />
      <circle className="robot-eye" cx="104" cy="69" r="6" />
      <path className="robot-smile" d="M80 81c7 5 14 5 21 0" />
      <path className="robot-arm" d="M44 76 22 60M136 76l22-22" />
      <circle className="robot-hand" cx="19" cy="57" r="7" />
      <circle className="robot-hand" cx="160" cy="51" r="7" />
      <rect className="robot-body" x="59" y="108" width="62" height="29" rx="13" />
      <path className="robot-foot" d="M73 136v8M108 136v8" />
    </svg>
  );
}

function Robot({ x, y }: { x: number; y: number }) {
  return (
    <g className="board-robot" transform={`translate(${x * 58 + 13} ${y * 58 + 13})`}>
      <path d="M16 10V4" className="mini-line" />
      <circle cx="16" cy="3" r="3" className="mini-accent" />
      <rect x="3" y="9" width="26" height="23" rx="8" className="mini-head" />
      <rect x="7" y="14" width="18" height="11" rx="5" className="mini-face" />
      <circle cx="12" cy="19" r="2" className="mini-eye" />
      <circle cx="20" cy="19" r="2" className="mini-eye" />
      <path d="M12 28h8v6h-8z" className="mini-body" />
    </g>
  );
}

function Header({
  page,
  onPage,
  onLogout,
}: {
  page: "editor" | "saved";
  onPage: (page: "editor" | "saved") => void;
  onLogout: () => void;
}) {
  return (
    <header className="app-header">
      <Logo />
      <nav aria-label="Navegação principal">
        <button className={page === "editor" ? "active" : ""} onClick={() => onPage("editor")} type="button">
          <Icon name="blocks" size={18} /> Criar
        </button>
        <button className={page === "saved" ? "active" : ""} onClick={() => onPage("saved")} type="button">
          <Icon name="folder" size={18} /> Meus programas
        </button>
      </nav>
      <div className="profile">
        <div className="avatar">L</div>
        <span><b>Luiza</b><small>Aprendiz</small></span>
        <button onClick={onLogout} type="button" aria-label="Sair"><Icon name="logout" size={19} /></button>
      </div>
    </header>
  );
}

function SavedPrograms({
  programs,
  onOpen,
  onDelete,
  onNew,
}: {
  programs: SavedProgram[];
  onOpen: (program: SavedProgram) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}) {
  return (
    <main className="saved-page">
      <div className="saved-page__header">
        <div>
          <div className="eyebrow">Sua coleção</div>
          <div className="page-title">Meus programas</div>
          <p>Continue de onde parou ou comece uma ideia nova.</p>
        </div>
        <Button variant="primary" onClick={onNew}><span className="plus">+</span> Novo programa</Button>
      </div>
      {programs.length ? (
        <div className="program-grid">
          {programs.map((program, index) => (
            <article className="saved-card" key={program.id}>
              <div className={`saved-card__preview saved-card__preview--${index % 3}`}>
                <div className="tiny-grid" />
                <svg viewBox="0 0 40 40" aria-hidden="true">
                  <rect x="5" y="8" width="30" height="25" rx="9" />
                  <circle cx="15" cy="20" r="3" />
                  <circle cx="25" cy="20" r="3" />
                </svg>
                <span>{program.blockCount} {program.blockCount === 1 ? "bloco" : "blocos"}</span>
              </div>
              <div className="saved-card__body">
                <b>{program.name}</b>
                <small>Editado {program.updated}</small>
                <div>
                  <Button onClick={() => onOpen(program)}>Abrir programa <Icon name="arrow-right" size={17} /></Button>
                  <button className="icon-button" onClick={() => onDelete(program.id)} type="button" aria-label={`Excluir ${program.name}`}>
                    <Icon name="trash" size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-saved">
          <div className="empty-saved__art"><Icon name="folder" size={42} /><span>+</span></div>
          <div className="empty-saved__title">Sua coleção começa aqui</div>
          <p>Os programas que você salvar vão aparecer nesta página.</p>
          <Button variant="primary" onClick={onNew}>Criar meu primeiro programa</Button>
        </div>
      )}
    </main>
  );
}

type Notice = { type: "error" | "success" | "edge"; text: string };

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const isEdge = (p: { x: number; y: number }) => p.x === 0 || p.x === 4 || p.y === 0 || p.y === 4;
const clamp = (value: number) => Math.max(0, Math.min(4, value));
const START_POSITION = { x: 2, y: 2 };

/** Um bloco de repetição ou de condição vazio deixa o programa incompleto. */
function isIncomplete(first: Blockly.Block | null): boolean {
  for (let block = first; block; block = block.getNextBlock()) {
    if (!block.isEnabled()) continue;
    if (block.type === "bb_repeat" || block.type === "bb_if_edge") {
      const inner = block.getInputTargetBlock("DO");
      if (!inner || isIncomplete(inner)) return true;
    }
  }
  return false;
}

function Editor({
  initialState,
  onSave,
}: {
  initialState: WorkspaceState | null;
  onSave: (state: WorkspaceState, blockCount: number) => void;
}) {
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const cancelled = useRef(false);
  const [blockCount, setBlockCount] = useState(0);
  const [code, setCode] = useState<string[]>(["programa", "{", "}"]);
  const [position, setPosition] = useState(START_POSITION);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
    };
  }, []);

  const run = async () => {
    const workspace = workspaceRef.current;
    const first = workspace ? getStartBlock(workspace)?.getInputTargetBlock("DO") ?? null : null;
    if (!workspace || !first || isIncomplete(first)) {
      setNotice({
        type: "error",
        text: !first
          ? "Encaixe pelo menos um bloco embaixo de Ao iniciar."
          : "Há um bloco incompleto. Coloque algo dentro dele.",
      });
      return;
    }

    setRunning(true);
    setNotice(null);
    let current = { ...position };

    const execute = async (head: Blockly.Block | null): Promise<void> => {
      for (let block = head; block; block = block.getNextBlock()) {
        if (cancelled.current) return;
        if (!block.isEnabled()) continue;
        workspace.highlightBlock(block.id);

        if (block.type === "bb_repeat") {
          await sleep(320);
          const times = Number(block.getFieldValue("COUNT")) || 1;
          for (let i = 0; i < times; i += 1) await execute(block.getInputTargetBlock("DO"));
        } else if (block.type === "bb_if_edge") {
          await sleep(320);
          if (isEdge(current)) await execute(block.getInputTargetBlock("DO"));
        } else {
          await sleep(560);
          current = {
            x: clamp(current.x + (block.type === "bb_right" ? 1 : block.type === "bb_left" ? -1 : 0)),
            y: clamp(current.y + (block.type === "bb_back" ? 1 : block.type === "bb_front" ? -1 : 0)),
          };
          setPosition(current);
        }
      }
    };

    await execute(first);
    if (cancelled.current) return;
    workspace.highlightBlock(null);
    setRunning(false);
    setNotice(
      isEdge(current)
        ? { type: "edge", text: "Borda alcançada! O Bipi não pode sair da área." }
        : { type: "success", text: "Programa concluído. Muito bem!" },
    );
  };

  const clear = () => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    workspace.clear();
    createStartBlock(workspace);
    setPosition(START_POSITION);
    setNotice(null);
  };

  const save = () => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    onSave(Blockly.serialization.workspaces.save(workspace), blockCount);
    setNotice({ type: "success", text: "Programa salvo na sua coleção." });
  };

  return (
    <main className="editor">
      <div className="editor__topline">
        <div>
          <span className={`status-dot ${running ? "is-running" : ""}`} />
          <b>{running ? "Executando programa..." : "Programa sem título"}</b>
          <small>{running ? "Veja cada bloco ganhar vida" : "Todas as mudanças são automáticas"}</small>
        </div>
        <div className="actions">
          <Button onClick={clear} disabled={running}><Icon name="trash" size={17} /> Limpar</Button>
          <Button onClick={save} disabled={!blockCount || running}><Icon name="save" size={17} /> Salvar</Button>
          <Button variant="primary" onClick={run} disabled={running}><Icon name="play" size={17} /> {running ? "Executando..." : "Executar"}</Button>
        </div>
      </div>

      {notice && (
        <div className={`notice notice--${notice.type}`}>
          <span><Icon name={notice.type === "error" ? "close" : "check"} size={17} /></span>
          <b>{notice.type === "error" ? "Ops! Revise seu programa" : notice.type === "edge" ? "Chegamos na borda" : "Tudo certo"}</b>
          <p>{notice.text}</p>
          <button onClick={() => setNotice(null)} type="button" aria-label="Fechar aviso"><Icon name="close" size={16} /></button>
        </div>
      )}

      <div className="editor-grid">
        <section className="panel workspace">
          <div className="panel__heading">
            <span className="step-number">1</span>
            <div><b>Monte seu programa</b><small>Arraste os blocos e encaixe embaixo de “Ao iniciar”. Eles rodam de cima para baixo</small></div>
          </div>
          <div className="workspace__canvas">
            <BlockWorkspace
              initialState={initialState}
              locked={running}
              onReady={(workspace) => { workspaceRef.current = workspace; }}
              onChange={(lines, count) => { setCode(lines); setBlockCount(count); }}
            />
            {!blockCount && (
              <div className="empty-workspace">
                <div className="empty-workspace__icon"><Icon name="blocks" size={30} /></div>
                <b>Seu programa começa aqui</b>
                <p>Arraste um bloco da esquerda e encaixe embaixo de “Ao iniciar”.</p>
              </div>
            )}
          </div>
        </section>

        <div className="right-column">
          <section className="panel robot-panel">
            <div className="panel__heading panel__heading--compact">
              <div><b>Bipi</b><small>{running ? "Seguindo seus comandos" : "Pronto para começar"}</small></div>
              <span className={`robot-status ${running ? "is-running" : ""}`}>{running ? "Em movimento" : "Aguardando"}</span>
            </div>
            <div className="robot-board">
              <svg viewBox="0 0 290 290" role="img" aria-label={`Bipi na coluna ${position.x + 1} e linha ${position.y + 1}`}>
                <defs>
                  <pattern id="grid" width="58" height="58" patternUnits="userSpaceOnUse">
                    <path d="M58 0H0V58" className="board-grid-line" />
                  </pattern>
                </defs>
                <rect width="290" height="290" rx="15" className="board-bg" />
                <rect width="290" height="290" rx="15" fill="url(#grid)" />
                <Robot x={position.x} y={position.y} />
              </svg>
              <div className="axis axis--top"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
              <div className="axis axis--left"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
            </div>
          </section>

          <section className="panel code-panel">
            <div className="panel__heading panel__heading--compact">
              <div><b>Código em Portugol</b><small>Atualiza junto com os blocos</small></div>
              <span className="live-pill"><i /> Ao vivo</span>
            </div>
            <div className="code-window">
              <div className="code-window__bar"><i /><i /><i /><span>programa.por</span></div>
              <pre>
                {code.map((line, index) => (
                  <div key={`${line}-${index}`} className={running && index > 1 ? "code-line" : ""}>
                    <span>{index + 1}</span><code>{line}</code>
                  </div>
                ))}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState<"editor" | "saved">("editor");
  const [programs, setPrograms] = useState<SavedProgram[]>(STARTER_PROGRAMS);
  const [currentState, setCurrentState] = useState<WorkspaceState | null>(null);
  const [editorKey, setEditorKey] = useState(0);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const openProgram = (program: SavedProgram) => {
    setCurrentState(program.state);
    setEditorKey((key) => key + 1);
    setPage("editor");
  };

  const newProgram = () => {
    setCurrentState(null);
    setEditorKey((key) => key + 1);
    setPage("editor");
  };

  return (
    <div className="app-shell">
      <Header page={page} onPage={setPage} onLogout={() => setLoggedIn(false)} />
      {page === "editor" ? (
        <Editor
          key={editorKey}
          initialState={currentState}
          onSave={(state, blockCount) => {
            const next: SavedProgram = {
              id: `saved-${Date.now()}`,
              name: `Meu programa ${programs.length + 1}`,
              updated: "agora",
              blockCount,
              state,
            };
            setPrograms((items) => [next, ...items]);
          }}
        />
      ) : (
        <SavedPrograms
          programs={programs}
          onOpen={openProgram}
          onDelete={(id) => setPrograms((items) => items.filter((program) => program.id !== id))}
          onNew={newProgram}
        />
      )}
    </div>
  );
}
