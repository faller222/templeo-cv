import React, { useState } from "react";
import { CvData, AtsResult, AppLanguage } from "../types";
import {
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Globe,
  FileCheck,
  Zap,
} from "lucide-react";
import { api } from "../lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cvData: CvData;
  setCvData: (data: CvData) => void;
  language: AppLanguage;
  onCreditsChange?: (n: number) => void;
}

export const AIAssistantDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cvData,
  setCvData,
  language,
  onCreditsChange,
}) => {
  const [targetJob, setTargetJob] = useState("");
  const [loadingAts, setLoadingAts] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsResult | null>(null);

  const [loadingTranslate, setLoadingTranslate] = useState(false);

  if (!isOpen) return null;

  const handleRunAtsCheck = async () => {
    setLoadingAts(true);
    setAtsResult(null);

    try {
      const data = await api.atsCheck({
        cvData,
        targetJobDescription: targetJob,
        language,
      });
      setAtsResult(data);
      if (typeof (data as any).creditosIa === "number") {
        onCreditsChange?.((data as any).creditosIa);
      }
    } catch (err: any) {
      alert(err.message || "Error realizando escaneo ATS");
    } finally {
      setLoadingAts(false);
    }
  };

  const handleTranslateCv = async (targetLang: "es" | "en") => {
    if (!confirm(`¿Seguro que deseas traducir todo el CV al ${targetLang === "en" ? "Inglés" : "Español"}?`)) {
      return;
    }

    setLoadingTranslate(true);

    try {
      let newSummary = cvData.summary;
      if (cvData.summary) {
        const sumData = await api.translate({
          text: cvData.summary,
          targetLang,
        });
        newSummary = sumData.translatedText || cvData.summary;
        if (typeof (sumData as any).creditosIa === "number") {
          onCreditsChange?.((sumData as any).creditosIa);
        }
      }

      const newExp = await Promise.all(
        cvData.experience.map(async (exp) => {
          const titleData = await api.translate({
            text: exp.title,
            targetLang,
          });

          const translatedBullets = await Promise.all(
            exp.bullets.map(async (b) => {
              if (!b) return b;
              const bData = await api.translate({ text: b, targetLang });
              return bData.translatedText || b;
            })
          );

          return {
            ...exp,
            title: titleData.translatedText || exp.title,
            bullets: translatedBullets,
          };
        })
      );

      setCvData({
        ...cvData,
        summary: newSummary,
        experience: newExp,
      });

      alert("¡Traducción completada con éxito!");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un problema durante la traducción.");
    } finally {
      setLoadingTranslate(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <h3 className="font-extrabold text-sm">Asistente IA Gemini & Análisis ATS</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
        {/* ATS Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-xs">Escanear Compatibilidad ATS</h4>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed">
            Pega la descripción de la oferta laboral para evaluar tu puntaje ATS y obtener palabras clave recomendadas.
          </p>

          <textarea
            rows={4}
            value={targetJob}
            onChange={(e) => setTargetJob(e.target.value)}
            placeholder="Pega aquí el texto de la oferta de trabajo u objetivos de puesto..."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button
            onClick={handleRunAtsCheck}
            disabled={loadingAts}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {loadingAts ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analizando CV con Gemini...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                Calcular Puntaje ATS
              </>
            )}
          </button>
        </div>

        {/* ATS Results Output */}
        {atsResult && (
          <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl space-y-4">
            {/* Score Gauge */}
            <div className="flex items-center gap-4 border-b border-indigo-100 pb-3">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-lg text-white shrink-0 ${
                  atsResult.score >= 80
                    ? "bg-emerald-600"
                    : atsResult.score >= 60
                    ? "bg-amber-500"
                    : "bg-rose-600"
                }`}
              >
                {atsResult.score}%
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-xs">Puntaje de Compatibilidad</h5>
                <p className="text-[11px] text-slate-600">
                  {atsResult.score >= 80
                    ? "¡Excelente! Tu CV destaca en formato y palabras clave."
                    : atsResult.score >= 60
                    ? "Buen nivel. Aplica los consejos sugeridos para superar el 85%."
                    : "Requiere ajustes. Optimiza con viñetas de impacto."}
                </p>
              </div>
            </div>

            {/* Strengths */}
            {atsResult.strengths && atsResult.strengths.length > 0 && (
              <div>
                <h6 className="font-bold text-indigo-900 text-[11px] mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fortalezas Clave
                </h6>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                  {atsResult.strengths.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Keywords */}
            {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
              <div>
                <h6 className="font-bold text-indigo-900 text-[11px] mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Palabras Clave Recomendadas
                </h6>
                <div className="flex flex-wrap gap-1">
                  {atsResult.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-medium text-[10px]">
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {atsResult.quickActionItems && atsResult.quickActionItems.length > 0 && (
              <div>
                <h6 className="font-bold text-indigo-900 text-[11px] mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> Acciones Prioritarias
                </h6>
                <ul className="list-decimal list-inside space-y-0.5 text-slate-700 text-[11px]">
                  {atsResult.quickActionItems.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Translation Section */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-slate-900 text-xs">Traducción Automática de CV</h4>
          </div>

          <p className="text-slate-600 text-[11px]">
            Traduce todo el contenido del currículum conservando el formato y terminología profesional.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTranslateCv("en")}
              disabled={loadingTranslate}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loadingTranslate ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "🇺🇸 Traducir a Inglés"}
            </button>

            <button
              onClick={() => handleTranslateCv("es")}
              disabled={loadingTranslate}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loadingTranslate ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "🇪🇸 Traducir a Español"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
