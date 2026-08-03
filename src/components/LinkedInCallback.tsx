import React, { useEffect, useState } from "react";
import { LINKEDIN_OAUTH_MSG } from "../lib/linkedinOAuthMsg";

/** Popup landing page after LinkedIn redirects back with ?code= */
export const LinkedInCallback: React.FC = () => {
  const [status, setStatus] = useState("Cerrando…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    const payload = {
      type: LINKEDIN_OAUTH_MSG,
      code,
      state,
      error: error || (errorDescription ? `${error}: ${errorDescription}` : null),
    };

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(payload, window.location.origin);
      setStatus("Listo. Podés cerrar esta ventana.");
      window.close();
      return;
    }

    setStatus(
      error
        ? `Error de LinkedIn: ${errorDescription || error}`
        : "No hay ventana padre. Cerrá esta pestaña e intentá de nuevo."
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700 text-sm p-6">
      {status}
    </div>
  );
};
