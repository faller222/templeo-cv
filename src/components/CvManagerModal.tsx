import React, { useState } from "react";
import type { CvInstance } from "../types";
import { Copy, FilePlus, Sparkles, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  instances: CvInstance[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClone: () => void;
  onCreateBlank: (title: string) => void;
  onGenerateAi: (jobHint: string) => Promise<void>;
}

export const CvManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  instances,
  activeId,
  onSelect,
  onClone,
  onCreateBlank,
  onGenerateAi,
}) => {
  const [title, setTitle] = useState("Nuevo CV");
  const [jobHint, setJobHint] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="font-extrabold text-sm">Mis CVs (instancias)</h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-slate-100 rounded cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <ul className="space-y-1">
            {instances.map((cv) => (
              <li key={cv.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(cv.id);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                    cv.id === activeId
                      ? "border-blue-500 bg-blue-50 font-bold"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div>{cv.title}</div>
                  {cv.sourceJobHint && (
                    <div className="text-[10px] text-slate-500 truncate">
                      {cv.sourceJobHint}
                    </div>
                  )}
                </button>
              </li>
            ))}
            {!instances.length && (
              <li className="text-xs text-slate-500">No hay instancias aún.</li>
            )}
          </ul>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClone}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Clonar activo
            </button>
            <button
              type="button"
              onClick={() => onCreateBlank(title || "Nuevo CV")}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" /> En blanco
            </button>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <label className="text-xs font-bold text-slate-700 block">
              Crear con IA (hint / requirements del llamado)
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del CV"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
            />
            <textarea
              value={jobHint}
              onChange={(e) => setJobHint(e.target.value)}
              placeholder="Pegá requisitos del job o indicaciones para la IA…"
              rows={4}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
            />
            <button
              type="button"
              disabled={busy || !jobHint.trim()}
              onClick={async () => {
                setBusy(true);
                setError(null);
                try {
                  await onGenerateAi(jobHint.trim());
                  onClose();
                } catch (e: any) {
                  setError(e?.message || "Error generando CV");
                } finally {
                  setBusy(false);
                }
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {busy ? "Generando…" : "Generar desde Master + hint"}
            </button>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
