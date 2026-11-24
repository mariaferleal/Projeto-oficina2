import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import App, { toSavedProgram } from "./App";
import * as api from "./api";

// O Blockly precisa de um navegador de verdade para desenhar. Aqui ele é trocado por
// um editor falso, que entrega ao App o programa definido em cada teste.
const editor = vi.hoisted(() => ({
  state: null as Record<string, unknown> | null,
  blockCount: 0,
  workspace: { highlightBlock: vi.fn(), clear: vi.fn() },
  createStartBlock: vi.fn(),
  initialStates: [] as unknown[],
}));

vi.mock("blockly/core", () => ({
  serialization: { workspaces: { save: () => editor.state } },
}));

vi.mock("./components/BlockWorkspace", async () => {
  const { useEffect } = await import("react");
  return {
    createStartBlock: editor.createStartBlock,
    default: function EditorFalso(props: {
      initialState: unknown;
      onReady: (workspace: unknown) => void;
      onChange: (code: string[], count: number) => void;
    }) {
      useEffect(() => {
        editor.initialStates.push(props.initialState);
        props.onReady(editor.workspace);
        props.onChange(["programa", "{", "  frente()", "}"], editor.blockCount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return <div data-testid="editor-falso" />;
    },
  };
});

vi.mock("./api", async (original) => ({
  ...(await original<typeof api>()),
  usuarioDaSessao: vi.fn(),
  entrarComGoogle: vi.fn(),
  entrarComoTeste: vi.fn(),
  listarProgramas: vi.fn(),
  salvarPrograma: vi.fn(),
  excluirPrograma: vi.fn(),
  limparSessao: vi.fn(),
}));

const mocked = vi.mocked(api);
const usuario = { id: "u1", nome: "Ana Souza", email: "ana@exemplo.com" };

const programa = (...tipos: string[]) => ({
  blocks: {
    blocks: [
      {
        type: "bb_start",
        inputs: {
          DO: {
            block: tipos.reduceRight<Record<string, unknown> | undefined>(
              (next, type, i) => ({ type, id: `b${i}`, ...(next ? { next: { block: next } } : {}) }),
              undefined,
            ),
          },
        },
      },
    ],
  },
});

const salvo = { id: "p1", titulo: "Passeio em L", blocos: programa("bb_front", "bb_right"), atualizado_em: "2026-11-24T15:00:00Z" };

beforeEach(() => {
  editor.state = programa("bb_front");
  editor.blockCount = 1;
  editor.initialStates = [];
  mocked.usuarioDaSessao.mockResolvedValue(usuario);
  mocked.listarProgramas.mockResolvedValue([salvo]);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

const entrar = async () => {
  render(<App />);
  await screen.findByTestId("editor-falso");
};

describe("login (RF01)", () => {
  beforeEach(() => mocked.usuarioDaSessao.mockResolvedValue(null));

  it("mostra a tela de login quando não há sessão", async () => {
    render(<App />);
    expect(await screen.findByText("Olá! Eu sou o Bipi.")).toBeInTheDocument();
    expect(screen.queryByText("Entrar como teste")).toBeNull();
    expect(mocked.listarProgramas).not.toHaveBeenCalled();
  });

  it("entra com o login de teste e carrega os programas", async () => {
    vi.stubEnv("VITE_LOGIN_TESTE", "true");
    mocked.entrarComoTeste.mockResolvedValue(usuario);
    render(<App />);

    fireEvent.click(await screen.findByText("Entrar como teste"));

    expect(await screen.findByText("Ana Souza")).toBeInTheDocument();
    expect(screen.getByText("A")).toHaveClass("avatar");
    expect(mocked.listarProgramas).toHaveBeenCalledTimes(1);
  });

  it("mostra a mensagem da API quando o login falha", async () => {
    vi.stubEnv("VITE_LOGIN_TESTE", "true");
    mocked.entrarComoTeste.mockRejectedValue(new Error("Login de teste desativado."));
    render(<App />);

    fireEvent.click(await screen.findByText("Entrar como teste"));

    await waitFor(() => expect(screen.getByText("Login de teste desativado.")).toBeInTheDocument());
    expect(screen.queryByTestId("editor-falso")).toBeNull();
  });
});

describe("sessão ativa", () => {
  it("abre direto no editor com o nome do usuário", async () => {
    await entrar();
    expect(screen.getByText("Ana Souza")).toBeInTheDocument();
    expect(screen.getByText("frente()")).toBeInTheDocument();
  });

  it("sai da conta e volta para o login", async () => {
    await entrar();
    fireEvent.click(screen.getByLabelText("Sair"));
    expect(await screen.findByText("Olá! Eu sou o Bipi.")).toBeInTheDocument();
    expect(mocked.limparSessao).toHaveBeenCalled();
  });
});

describe("meus programas (RF08, RF09)", () => {
  it("lista os programas salvos", async () => {
    await entrar();
    fireEvent.click(screen.getByText("Meus programas"));
    expect(await screen.findByText("Passeio em L")).toBeInTheDocument();
    expect(screen.getByText("2 blocos")).toBeInTheDocument();
  });

  it("mostra a coleção vazia quando a lista não carrega", async () => {
    mocked.listarProgramas.mockRejectedValue(new Error("fora do ar"));
    await entrar();
    fireEvent.click(screen.getByText("Meus programas"));
    expect(await screen.findByText("Sua coleção começa aqui")).toBeInTheDocument();
  });

  it("reabre um programa salvo no editor", async () => {
    await entrar();
    fireEvent.click(screen.getByText("Meus programas"));
    fireEvent.click(await screen.findByText("Abrir programa"));
    await screen.findByTestId("editor-falso");
    expect(editor.initialStates.at(-1)).toEqual(salvo.blocos);
  });

  it("começa um programa novo em branco", async () => {
    await entrar();
    fireEvent.click(screen.getByText("Meus programas"));
    fireEvent.click(await screen.findByText("Novo programa"));
    await screen.findByTestId("editor-falso");
    expect(editor.initialStates.at(-1)).toBeNull();
  });

  it("exclui um programa da lista", async () => {
    mocked.excluirPrograma.mockResolvedValue();
    await entrar();
    fireEvent.click(screen.getByText("Meus programas"));
    fireEvent.click(await screen.findByLabelText("Excluir Passeio em L"));
    await waitFor(() => expect(screen.queryByText("Passeio em L")).toBeNull());
    expect(mocked.excluirPrograma).toHaveBeenCalledWith("p1");
  });

  it("salva o programa do editor na API", async () => {
    mocked.salvarPrograma.mockResolvedValue({ ...salvo, id: "p2", titulo: "Meu programa 2" });
    await entrar();
    fireEvent.click(screen.getByText("Salvar"));
    expect(await screen.findByText("Programa salvo na sua coleção.")).toBeInTheDocument();
    expect(mocked.salvarPrograma).toHaveBeenCalledWith("Meu programa 2", editor.state);
  });

  it("avisa quando não consegue salvar", async () => {
    mocked.salvarPrograma.mockRejectedValue(new Error("fora do ar"));
    await entrar();
    fireEvent.click(screen.getByText("Salvar"));
    expect(await screen.findByText("Não foi possível salvar. Tente de novo.")).toBeInTheDocument();
  });

  it("não deixa salvar um programa sem blocos", async () => {
    editor.blockCount = 0;
    await entrar();
    expect(screen.getByText("Salvar").closest("button")).toBeDisabled();
    expect(screen.getByText("Seu programa começa aqui")).toBeInTheDocument();
  });
});

describe("executar o programa (RF06, RF10)", () => {
  const executar = async () => {
    await entrar();
    vi.useFakeTimers();
    fireEvent.click(screen.getByText("Executar"));
    await act(() => vi.runAllTimersAsync());
  };

  it("avisa quando não há blocos embaixo de Ao iniciar", async () => {
    editor.state = { blocks: { blocks: [{ type: "bb_start" }] } };
    await executar();
    expect(screen.getByText("Encaixe pelo menos um bloco embaixo de Ao iniciar.")).toBeInTheDocument();
    expect(editor.workspace.highlightBlock).not.toHaveBeenCalled();
  });

  it("avisa quando há um bloco incompleto", async () => {
    editor.state = programa("bb_repeat");
    await executar();
    expect(screen.getByText("Há um bloco incompleto. Coloque algo dentro dele.")).toBeInTheDocument();
  });

  it("move o robô e destaca cada bloco", async () => {
    editor.state = programa("bb_front");
    await executar();
    expect(screen.getByLabelText("Bipi na coluna 3 e linha 2")).toBeInTheDocument();
    expect(screen.getByText("Programa concluído. Muito bem!")).toBeInTheDocument();
    expect(editor.workspace.highlightBlock).toHaveBeenNthCalledWith(1, "b0");
    expect(editor.workspace.highlightBlock).toHaveBeenLastCalledWith(null);
  });

  it("avisa quando o robô chega na borda", async () => {
    editor.state = programa("bb_right", "bb_right", "bb_right");
    await executar();
    expect(screen.getByLabelText("Bipi na coluna 5 e linha 3")).toBeInTheDocument();
    expect(screen.getByText("Borda alcançada! O Bipi não pode sair da área.")).toBeInTheDocument();
  });

  it("fecha o aviso", async () => {
    editor.state = programa("bb_front");
    await executar();
    fireEvent.click(screen.getByLabelText("Fechar aviso"));
    expect(screen.queryByText("Programa concluído. Muito bem!")).toBeNull();
  });

  it("limpa o editor e devolve o robô ao centro", async () => {
    editor.state = programa("bb_front");
    await executar();
    fireEvent.click(screen.getByText("Limpar"));
    expect(editor.workspace.clear).toHaveBeenCalled();
    expect(editor.createStartBlock).toHaveBeenCalledWith(editor.workspace);
    expect(screen.getByLabelText("Bipi na coluna 3 e linha 3")).toBeInTheDocument();
  });
});

describe("toSavedProgram", () => {
  it("conta os blocos sem o Ao iniciar e formata a data", () => {
    const convertido = toSavedProgram(salvo);
    expect(convertido).toMatchObject({ id: "p1", name: "Passeio em L", blockCount: 2, state: salvo.blocos });
    expect(convertido.updated).toMatch(/24\/11/);
  });

  it("deixa a data vazia quando ela é inválida", () => {
    expect(toSavedProgram({ ...salvo, atualizado_em: "ontem" }).updated).toBe("");
  });
});
