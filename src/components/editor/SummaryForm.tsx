import React, { useState } from "react";
import { Sparkles, Loader2, Check, RefreshCw } from "lucide-react";
import { api } from "../../lib/api";

interface Props {
  summary: string;
  jobTitle: string;
  skills: string[];
  onChange: (val: string) => void;
  language: "es" | "en";
}

export const SummaryForm: React.FC<Props> = ({ summary, jobTitle, skills, onChange, language }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ style: string; text: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAiEnhance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.enhanceSummary({
        jobTitle,
        summary,
        skills,
        language,
      });
      if (data.options && data.options.length > 0) {
        setSuggestions(data.options);
      } else {
        setError("No se pudieron generar sugerencias.");
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error conectando con la IA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 text-xs sm:text-sm">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          Resumen / Perfil Profesional
        </label>

        <button
          type="button"
          onClick={handleAiEnhance}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Mejorar con IA
            </>
          )}
        </button>
      </div>

      <textarea
        rows={5}
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe una breve descripción de tu perfil profesional, años de experiencia, logros principales y habilidades destacadas..."
        className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
      />

      {error && (
        <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* AI Suggestions modal or dropdown */}
      {suggestions && suggestions.length > 0 && (
        <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-indigo-900 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Sugerencias de la IA (Gemini):
            </h4>
            <button
              onClick={() => setSuggestions(null)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Cerrar
            </button>
          </div>

          <div className="space-y-2">
            {suggestions.map((opt, i) => (
              <div
                key={i}
                className="p-2.5 bg-white rounded-lg border border-indigo-100 hover:border-indigo-300 transition-all text-xs"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-indigo-700 text-[11px] uppercase tracking-wider">
                    {opt.style}
                  </span>
                  <button
                    onClick={() => {
                      onChange(opt.text);
                      setSuggestions(null);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-medium cursor-pointer"
                  >
                    <Check className="w-3 h-3" /> Usar esta opción
                  </button>
                </div>
                <p className="text-slate-700 leading-normal">{opt.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
