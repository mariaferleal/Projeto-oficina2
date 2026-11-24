import { useEffect, useRef, useState } from "react";

type GoogleId = {
  initialize: (config: { client_id: string; callback: (resposta: { credential: string }) => void }) => void;
  renderButton: (elemento: HTMLElement, opcoes: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

const SCRIPT_GOOGLE = "https://accounts.google.com/gsi/client";

/** Carrega o script do Google Identity Services uma única vez. */
export function carregarGoogle(documento: Document = document): Promise<GoogleId> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve(window.google.accounts.id);
    let script = documento.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_GOOGLE}"]`);
    if (!script) {
      script = documento.createElement("script");
      script.src = SCRIPT_GOOGLE;
      script.async = true;
      documento.head.appendChild(script);
    }
    script.addEventListener("load", () =>
      window.google?.accounts?.id ? resolve(window.google.accounts.id) : reject(new Error("Google indisponível")),
    );
    script.addEventListener("error", () => reject(new Error("Google indisponível")));
  });
}

type Props = {
  clientId: string | undefined;
  onCredential: (idToken: string) => void;
};

/** Botão "Entrar com Google" (RF01): o Google devolve o idToken, que a API valida. */
export default function GoogleLogin({ clientId, onCredential }: Props) {
  const alvo = useRef<HTMLDivElement>(null);
  const callback = useRef(onCredential);
  callback.current = onCredential;
  const [erro, setErro] = useState<string | null>(clientId ? null : "Login com Google não configurado.");

  useEffect(() => {
    if (!clientId) return;
    let ativo = true;
    carregarGoogle()
      .then((google) => {
        if (!ativo || !alvo.current) return;
        google.initialize({ client_id: clientId, callback: ({ credential }) => callback.current(credential) });
        google.renderButton(alvo.current, { theme: "outline", size: "large", text: "signin_with", locale: "pt-BR", width: 280 });
      })
      .catch(() => ativo && setErro("Não foi possível carregar o login do Google."));
    return () => {
      ativo = false;
    };
  }, [clientId]);

  return (
    <div className="google-login">
      <div ref={alvo} data-testid="botao-google" />
      {erro && <small role="alert">{erro}</small>}
    </div>
  );
}
