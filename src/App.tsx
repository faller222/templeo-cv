import React, { useState, useEffect } from "react";
import { CvData, CvThemeSettings, AppLanguage } from "./types";
import { sampleCvLenise, sampleCvSpanish, defaultThemeSettings } from "./data/sampleCVs";
import { Navbar } from "./components/Navbar";
import { FormEditor } from "./components/FormEditor";
import { CvRenderer } from "./components/CvRenderer";
import { ThemeCustomizerModal } from "./components/ThemeCustomizerModal";
import { AIAssistantDrawer } from "./components/AIAssistantDrawer";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Edit3,
  Sparkles,
  Maximize2,
  FileText,
} from "lucide-react";

export default function App() {
  const [cvData, setCvData] = useState<CvData>(() => {
    const saved = localStorage.getItem("cv_builder_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed loading saved CV data", e);
      }
    }
    return sampleCvLenise;
  });

  const [theme, setTheme] = useState<CvThemeSettings>(() => {
    const saved = localStorage.getItem("cv_builder_theme");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed loading saved theme", e);
      }
    }
    return defaultThemeSettings;
  });

  const [language, setLanguage] = useState<AppLanguage>("es");
  const [zoomLevel, setZoomLevel] = useState<number>(0.95);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem("cv_builder_data", JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem("cv_builder_theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* Navigation Header */}
      <Navbar
        cvData={cvData}
        setCvData={setCvData}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Mobile View Toggle Tabs */}
        <div className="lg:hidden col-span-1 flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs mb-1">
          <button
            onClick={() => setMobileTab("editor")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileTab === "editor"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Editar Formulario
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileTab === "preview"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" /> Vista Previa CV
          </button>
        </div>

        {/* Left Pane: Form Editor */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            mobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-600" />
              Contenido del Currículum
            </h2>
            <span className="text-[11px] text-slate-500">Guardado automático ⚡</span>
          </div>

          <FormEditor data={cvData} onChange={setCvData} language={language} />
        </div>

        {/* Right Pane: Live CV Canvas Preview */}
        <div
          className={`lg:col-span-7 flex flex-col items-center ${
            mobileTab === "editor" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Canvas Toolbar Controls */}
          <div className="w-full bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs mb-4 flex items-center justify-between text-xs print:hidden">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Vista Previa en Tiempo Real</span>
              <span className="hidden sm:inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                A4 (210 x 297 mm)
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
                title="Alejar"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-700 font-bold min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
                title="Acercar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(0.95)}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
                title="Restablecer Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Paper Sheet Wrapper */}
          <div className="w-full flex justify-center overflow-x-auto pb-10">
            <div
              id="cv-preview-container"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out",
                width: "210mm",
                minHeight: "297mm",
              }}
              className="bg-white shadow-xl rounded-sm border border-slate-200 transition-all shrink-0 relative overflow-hidden"
            >
              <CvRenderer data={cvData} theme={theme} />
            </div>
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />

      <AIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        cvData={cvData}
        setCvData={setCvData}
        language={language}
      />
    </div>
  );
}
