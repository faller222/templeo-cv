import React, { useState } from "react";
import { FileText, Sparkles, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profileUsable: boolean;
  profilePercent: number;
  onCreateGeneral: () => Promise<void> | void;
  onAnalyzeOffer: (jobDescription: string) => Promise<void>;
}

export const CreateCvModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profileUsable,
  profilePercent,
  onCreateGeneral,
  onAnalyzeOffer,
}) => {
  const [jobDescription, setJobDescription] = useState("");
  const [busyGeneral, setBusyGeneral] = useState(false);
  const [busyOffer, setBusyOffer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-200 overflow-hidden">
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Crear nuevo CV
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Parte siempre de tu Perfil Profesional. Sin reescribir tu carrera.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {!profileUsable && (
          <div className="mx-5 mt-4 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            Tu perfil está al {profilePercent}%. Completá al menos los módulos
            críticos para generar CVs de calidad.
          </div>
        )}

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 p-4 flex flex-col bg-gradient-to-b from-slate-50 to-white">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-3">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Crear CV General
            </h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed flex-1">
              Genera un CV profesional utilizando toda la información de tu
              Perfil Profesional. Ideal para postulaciones generales.
            </p>
            <button
              type="button"
              disabled={busyGeneral || !profileUsable}
              onClick={async () => {
                setBusyGeneral(true);
                setError(null);
                try {
                  await onCreateGeneral();
                  onClose();
                } catch (e: unknown) {
                  setError(
                    e instanceof Error ? e.message : "No se pudo crear el CV"
                  );
                } finally {
                  setBusyGeneral(false);
                }
              }}
              className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              {busyGeneral ? "Creando…" : "Crear CV"}
            </button>
          </div>

          <div className="rounded-2xl border border-indigo-200 p-4 flex flex-col bg-gradient-to-b from-indigo-50/80 to-white">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Crear desde una Oferta Laboral
            </h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Pegá la descripción del puesto y la plataforma generará un CV
              adaptado, resaltando únicamente la experiencia relevante sin
              inventar información.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Pega aquí la descripción del puesto..."
              rows={6}
              className="mt-3 w-full text-xs border border-indigo-100 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
            />
            <button
              type="button"
              disabled={
                busyOffer || !profileUsable || !jobDescription.trim()
              }
              onClick={async () => {
                const jd = jobDescription.trim();
                if (!jd) return;
                setBusyOffer(true);
                setError(null);
                setJobDescription("");
                onClose();
                try {
                  await onAnalyzeOffer(jd);
                } catch {
                  /* el overlay de análisis ya muestra el error */
                } finally {
                  setBusyOffer(false);
                }
              }}
              className="mt-3 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              {busyOffer ? "Analizando…" : "Analizar oferta"}
            </button>
          </div>
        </div>

        {error && (
          <p className="px-5 pb-4 text-xs text-rose-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
};
