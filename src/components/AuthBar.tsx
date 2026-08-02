import React, { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  isFirebaseConfigured,
  logOut,
  signInWithGoogle,
  signInWithLinkedIn,
  watchAuth,
} from "../lib/firebase";
import { api } from "../lib/api";
import { LogIn, LogOut, Coins } from "lucide-react";

interface Props {
  onUserChange?: (user: User | null) => void;
  credits?: number | null;
  onCreditsChange?: (n: number) => void;
}

export const AuthBar: React.FC<Props> = ({
  onUserChange,
  credits,
  onCreditsChange,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return watchAuth((u) => {
      setUser(u);
      onUserChange?.(u);
    });
  }, [onUserChange]);

  const handle = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e: any) {
      setError(e?.message || "Error de autenticación");
    } finally {
      setBusy(false);
    }
  };

  const claim = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await api.claimAdToken();
      onCreditsChange?.(res.creditosIa);
      if (!res.granted) setError("Cooldown de recarga activo");
    } catch (e: any) {
      setError(e?.message || "No se pudo reclamar crédito");
    } finally {
      setBusy(false);
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
        Firebase no configurado
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {typeof credits === "number" && (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
          <Coins className="w-3 h-3 text-amber-500" />
          {credits}
        </span>
      )}

      {user ? (
        <>
          <span className="text-[11px] text-slate-600 max-w-[120px] truncate">
            {user.displayName || user.email}
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={claim}
            className="text-[11px] font-semibold px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            +1 crédito
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => handle(logOut)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            <LogOut className="w-3 h-3" /> Salir
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            disabled={busy}
            onClick={() => handle(signInWithGoogle)}
            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-md bg-slate-900 text-white cursor-pointer"
          >
            <LogIn className="w-3 h-3" /> Google
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => handle(signInWithLinkedIn)}
            className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-md bg-[#0A66C2] text-white cursor-pointer"
          >
            LinkedIn
          </button>
        </>
      )}

      {error && (
        <span className="text-[10px] text-red-600 max-w-[200px] truncate" title={error}>
          {error}
        </span>
      )}
    </div>
  );
};
