import React, { useEffect, useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";

export type AnalysisPhase =
  | "idle"
  | "analyzing"
  | "tech"
  | "seniority"
  | "skills"
  | "keywords"
  | "generating"
  | "done"
  | "error";

interface Props {
  open: boolean;
  phase: AnalysisPhase;
  error?: string | null;
}

const STEPS: { id: AnalysisPhase; label: string }[] = [
  { id: "tech", label: "Tecnologías detectadas" },
  { id: "seniority", label: "Seniority" },
  { id: "skills", label: "Habilidades" },
  { id: "keywords", label: "Palabras clave ATS" },
];

const ORDER: AnalysisPhase[] = [
  "analyzing",
  "tech",
  "seniority",
  "skills",
  "keywords",
  "generating",
  "done",
];

function rank(phase: AnalysisPhase): number {
  return ORDER.indexOf(phase);
}

export const JobAnalysisOverlay: React.FC<Props> = ({
  open,
  phase,
  error,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) setVisible(true);
    else {
      const t = window.setTimeout(() => setVisible(false), 200);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  const current = rank(phase);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 transition-opacity duration-200 ${
        open ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-extrabold text-slate-900">
            {phase === "generating" || phase === "done"
              ? "Generando CV…"
              : "Analizando la oferta…"}
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Adaptamos tu Perfil Profesional a este puesto. Sin inventar datos.
        </p>

        <ul className="space-y-2.5">
          {STEPS.map((step) => {
            const stepRank = rank(step.id);
            const done = current > stepRank || phase === "done";
            const active = phase === step.id || (phase === "analyzing" && step.id === "tech");
            return (
              <li
                key={step.id}
                className={`flex items-center gap-2.5 text-xs font-semibold rounded-xl px-3 py-2.5 border transition-all ${
                  done
                    ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                    : active
                      ? "bg-indigo-50 border-indigo-100 text-indigo-800"
                      : "bg-slate-50 border-slate-100 text-slate-400"
                }`}
              >
                {done ? (
                  <Check className="w-3.5 h-3.5" />
                ) : active ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-current opacity-40" />
                )}
                {step.label}
              </li>
            );
          })}
        </ul>

        {(phase === "generating" || phase === "done") && (
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-indigo-700">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Generando CV desde tu perfil…
          </div>
        )}

        {phase === "error" && error && (
          <p className="mt-4 text-xs text-rose-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};
