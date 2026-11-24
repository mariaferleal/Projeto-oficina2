import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import GoogleLogin, { carregarGoogle } from "./GoogleLogin";

const SCRIPT = 'script[src="https://accounts.google.com/gsi/client"]';

const googleFalso = () => {
  const id = { initialize: vi.fn(), renderButton: vi.fn() };
  window.google = { accounts: { id } };
  return id;
};

afterEach(() => {
  delete window.google;
  document.querySelectorAll(SCRIPT).forEach((script) => script.remove());
});

describe("botão Entrar com Google (RF01)", () => {
  it("avisa quando o Client ID não está configurado", () => {
    render(<GoogleLogin clientId={undefined} onCredential={vi.fn()} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Login com Google não configurado.");
    expect(document.querySelector(SCRIPT)).toBeNull();
  });

  it("desenha o botão do Google com o Client ID", async () => {
    const id = googleFalso();
    render(<GoogleLogin clientId="cliente-123" onCredential={vi.fn()} />);

    await waitFor(() => expect(id.renderButton).toHaveBeenCalled());
    expect(id.initialize.mock.calls[0][0].client_id).toBe("cliente-123");
    expect(id.renderButton.mock.calls[0][0]).toBe(screen.getByTestId("botao-google"));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("repassa o idToken devolvido pelo Google", async () => {
    const id = googleFalso();
    const onCredential = vi.fn();
    render(<GoogleLogin clientId="cliente-123" onCredential={onCredential} />);

    await waitFor(() => expect(id.initialize).toHaveBeenCalled());
    id.initialize.mock.calls[0][0].callback({ credential: "id-token" });
    expect(onCredential).toHaveBeenCalledWith("id-token");
  });

  it("avisa quando o script do Google não carrega", async () => {
    render(<GoogleLogin clientId="cliente-123" onCredential={vi.fn()} />);
    document.querySelector(SCRIPT)!.dispatchEvent(new Event("error"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível carregar o login do Google.");
  });

  it("não desenha o botão depois que o componente sai da tela", async () => {
    const { unmount } = render(<GoogleLogin clientId="cliente-123" onCredential={vi.fn()} />);
    const script = document.querySelector(SCRIPT)!;
    unmount();
    const id = googleFalso();
    script.dispatchEvent(new Event("load"));
    await Promise.resolve();
    expect(id.renderButton).not.toHaveBeenCalled();
  });
});

describe("carregarGoogle", () => {
  it("inclui o script uma única vez", () => {
    void carregarGoogle().catch(() => undefined);
    void carregarGoogle().catch(() => undefined);
    expect(document.querySelectorAll(SCRIPT)).toHaveLength(1);
  });

  it("resolve quando o script termina de carregar", async () => {
    const promessa = carregarGoogle();
    const id = googleFalso();
    document.querySelector(SCRIPT)!.dispatchEvent(new Event("load"));
    await expect(promessa).resolves.toBe(id);
  });

  it("falha quando o script carrega sem expor o Google", async () => {
    const promessa = carregarGoogle();
    document.querySelector(SCRIPT)!.dispatchEvent(new Event("load"));
    await expect(promessa).rejects.toThrow("Google indisponível");
  });
});
