import React, { useEffect, useState } from "react";
import { LogIn, X } from "lucide-react";
import {
  isFirebaseConfigured,
  signInWithGoogle,
  signInWithLinkedIn,
} from "../lib/firebase";
import { isAuthCancelled } from "../lib/authErrors";

export type AuthModalReason = "edit" | "export" | "theme" | "ai" | "manage" | "generic";

const REASON_COPY: Record<AuthModalReason, { title: string; body: string }> = {
  edit: {
    title: "Iniciá sesión para editar",
    body: "Estás viendo un CV de ejemplo. Para personalizarlo con tus datos, entrá con Google o LinkedIn.",
  },
  export: {
    title: "Iniciá sesión para exportar",
    body: "El PDF y la exportación están disponibles cuando tenés tu documento asociado a tu cuenta.",
  },
  theme: {
    title: "Iniciá sesión para personalizar",
    body: "Plantillas, colores y estilos se desbloquean al iniciar sesión.",
  },
  ai: {
    title: "Iniciá sesión para usar IA",
    body: "El asistente ATS y la generación con IA requieren una cuenta.",
  },
  manage: {
    title: "Iniciá sesión para gestionar CVs",
    body: "Clonar, crear o guardar instancias requiere autenticación.",
  },
  generic: {
    title: "Iniciá sesión para continuar",
    body: "Creá tu cuenta en segundos con Google o LinkedIn.",
  },
};

interface Props {
  open: boolean;
  reason?: AuthModalReason;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({
  open,
  reason = "generic",
  onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
  }, [open]);

  if (!open) return null;

  const copy = REASON_COPY[reason] || REASON_COPY.generic;

  const handle = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      // El modal lo cierra App tras el claim / sync en onUserChange.
    } catch (e: unknown) {
      if (!isAuthCancelled(e)) {
        const msg =
          e instanceof Error ? e.message : "Error de autenticación";
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-slate-900/45 cursor-pointer border-0"
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 transition-all duration-200 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h2
          id="auth-modal-title"
          className="text-lg font-extrabold text-slate-900 pr-8"
        >
          {copy.title}
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{copy.body}</p>

        {!isFirebaseConfigured ? (
          <p className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Firebase no está configurado en este entorno.
          </p>
        ) : (
          <div className="mt-5 flex flex-col gap-2.5">
            <button
              type="button"
              disabled={busy}
              onClick={() => handle(signInWithGoogle)}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-60 cursor-pointer transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Continuar con Google
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => handle(signInWithLinkedIn)}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#0A66C2] text-white text-sm font-bold hover:bg-[#084e96] disabled:opacity-60 cursor-pointer transition-colors"
            >
              Continuar con LinkedIn
            </button>
          </div>
        )}

        {error && (
          <p className="mt-3 text-xs text-red-600" title={error}>
            {error}
          </p>
        )}

        <p className="mt-4 text-[11px] text-slate-400 text-center">
          Comienza con un CV de ejemplo ya cargado y personalízalo con tu
          información.
        </p>
      </div>
    </div>
  );
};
