import React from "react";
import { CvThemeSettings, CvTemplateId, FontFamily, FontSize } from "../types";
import { X, Check, Palette, Type, Layout, FileCode } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme: CvThemeSettings;
  setTheme: React.Dispatch<React.SetStateAction<CvThemeSettings>>;
}

export const ThemeCustomizerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
}) => {
  if (!isOpen) return null;

  const colorSwatches = [
    { name: "Azul Real", value: "#2563eb" },
    { name: "Esmeralda", value: "#059669" },
    { name: "Pizarra / Negro", value: "#0f172a" },
    { name: "Índigo", value: "#4f46e5" },
    { name: "Rosa / Carmín", value: "#e11d48" },
    { name: "Ámbar / Cálido", value: "#d97706" },
    { name: "Violeta", value: "#7c3aed" },
    { name: "Verde Azulado", value: "#0d9488" },
  ];

  const templates: { id: CvTemplateId; title: string; desc: string }[] = [
    { id: "clasico-v1", title: "Clásico Dos Columnas", desc: "Formato A4 clásico de 2 columnas (25/75), foto circular y referencias" },
    { id: "markdown-template-v1", title: "ATS Corporativo (MD)", desc: "1 columna ejecutiva corporativa con separadores limpios para ATS" },
    { id: "modern", title: "Moderno", desc: "Diseño fresco con barra lateral y tarjetas limpias" },
    { id: "minimal", title: "Minimalista", desc: "1 sola columna, diseño ultra limpio sin distracciones" },
    { id: "executive", title: "Ejecutivo", desc: "Encabezado destacado, estilo corporativo formal" },
    { id: "tech", title: "Tech / Dev", desc: "Inspirado en código, ideal para desarrolladores y analistas" },
    { id: "creative", title: "Creativo", desc: "Barra lateral de color con tipografía moderna" },
    { id: "elegant", title: "Elegante Serif", desc: "Tipografía editorial clásica con bordes delicados" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-base">Personalizar Diseño & Estilos</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Plantilla de CV
          </label>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setTheme((t) => ({ ...t, templateId: tpl.id }))}
                className={`p-2.5 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                  theme.templateId === tpl.id
                    ? "border-blue-600 bg-blue-50/60 text-blue-900 font-bold shadow-xs"
                    : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span>{tpl.title}</span>
                  {theme.templateId === tpl.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <p className="text-[10px] text-slate-500 font-normal leading-tight">{tpl.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Color Palette */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Color Principal / Acento
          </label>
          <div className="flex flex-wrap gap-2.5">
            {colorSwatches.map((color) => (
              <button
                key={color.value}
                onClick={() => setTheme((t) => ({ ...t, primaryColor: color.value }))}
                title={color.name}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform cursor-pointer border-2 ${
                  theme.primaryColor === color.value ? "border-slate-900 scale-110 shadow-sm" : "border-transparent"
                }`}
                style={{ backgroundColor: color.value }}
              >
                {theme.primaryColor === color.value && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Typography & Font Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Tipografía
            </label>
            <select
              value={theme.fontFamily}
              onChange={(e) => setTheme((t) => ({ ...t, fontFamily: e.target.value as FontFamily }))}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
            >
              <option value="sans">Sans-Serif (Moderna)</option>
              <option value="serif">Serif (Editorial / Clásica)</option>
              <option value="mono">Monospace (Dev / Código)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Tamaño de Texto
            </label>
            <select
              value={theme.fontSize}
              onChange={(e) => setTheme((t) => ({ ...t, fontSize: e.target.value as FontSize }))}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500"
            >
              <option value="sm">Compacto (12px)</option>
              <option value="md">Normal (13px)</option>
              <option value="lg">Cómodo (14px)</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            Guardar y Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
