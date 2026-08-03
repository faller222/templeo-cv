import { signInWithCredential } from "firebase/auth";
import { getFirebaseAuth, getLinkedInProvider } from "./firebase";
import { LINKEDIN_CLIENT_ID } from "./linkedinClientId";
import { LINKEDIN_OAUTH_MSG } from "./linkedinOAuthMsg";

function linkedInRedirectUri() {
  return `${window.location.origin}/auth/linkedin`;
}

function openPopup(url: string): Window {
  const width = 520;
  const height = 700;
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
  const popup = window.open(
    url,
    "templeo-linkedin",
    `width=${width},height=${height},left=${left},top=${top},popup=yes`
  );
  if (!popup) {
    throw new Error("El navegador bloqueó el popup de LinkedIn");
  }
  return popup;
}

function waitForLinkedInCode(expectedState: string, popup: Window): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Timeout esperando LinkedIn"));
    }, 120_000);

    const timer = window.setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error("Login de LinkedIn cancelado"));
      }
    }, 500);

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || data.type !== LINKEDIN_OAUTH_MSG) return;
      cleanup();
      if (data.error) {
        reject(new Error(String(data.error)));
        return;
      }
      if (!data.code || data.state !== expectedState) {
        reject(new Error("Respuesta OAuth inválida (state/code)"));
        return;
      }
      resolve(String(data.code));
    }

    function cleanup() {
      window.clearTimeout(timeout);
      window.clearInterval(timer);
      window.removeEventListener("message", onMessage);
      try {
        if (!popup.closed) popup.close();
      } catch {
        /* ignore */
      }
    }

    window.addEventListener("message", onMessage);
  });
}

async function exchangeCode(code: string, redirectUri: string): Promise<string> {
  const res = await fetch("/api/auth/linkedin/exchange", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, redirectUri }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Error ${res.status} en exchange LinkedIn`);
  }
  if (typeof body.idToken !== "string" || !body.idToken) {
    throw new Error("Exchange sin id_token");
  }
  return body.idToken;
}

/** LinkedIn OIDC via our backend (Firebase built-in OIDC drops client_secret). */
export async function signInWithLinkedInManual() {
  const clientId =
    import.meta.env.VITE_LINKEDIN_CLIENT_ID?.trim() || LINKEDIN_CLIENT_ID;

  const redirectUri = linkedInRedirectUri();
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile email",
    state,
  });

  const popup = openPopup(
    `https://www.linkedin.com/oauth/v2/authorization?${params}`
  );
  const code = await waitForLinkedInCode(state, popup);
  const idToken = await exchangeCode(code, redirectUri);

  const credential = getLinkedInProvider().credential({ idToken });
  return signInWithCredential(getFirebaseAuth(), credential);
}
