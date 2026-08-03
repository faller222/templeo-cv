import React from "react";
import { CvData, CvThemeSettings, AppLanguage, CvTemplateId } from "../types";
import type { AuthModalReason } from "./AuthModal";
import {
  Printer,
  Sparkles,
  Download,
  Upload,
  Palette,
  Layout,
  ArrowLeft,
  CloudUpload,
} from "lucide-react";

interface Props {
  cvData: CvData;
  setCvData: (data: CvData) => void;
  theme: CvThemeSettings;
  setTheme: React.Dispatch<React.SetStateAction<CvThemeSettings>>;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  onOpenAiDrawer: () => void;
  onOpenThemeModal: () => void;
  onRequireAuth?: (reason?: AuthModalReason) => boolean;
  onBackToCvs?: () => void;
  onSyncCloud?: () => void;
  compact?: boolean;
}

export const Navbar: React.FC<Props> = ({
  cvData,
  setCvData,
  theme,
  setTheme,
  onOpenAiDrawer,
  onOpenThemeModal,
  onRequireAuth,
  onBackToCvs,
  onSyncCloud,
  compact,
}) => {
  const gate = (reason: AuthModalReason = "generic") =>
    !onRequireAuth || onRequireAuth(reason);
  const templates: { id: CvTemplateId; name: string }[] = [
    { id: "clasico-v1", name: "Clásico (2 Col)" },
    { id: "markdown-template-v1", name: "ATS Corporativo" },
    { id: "modern", name: "Moderno" },
    { id: "minimal", name: "Minimalista" },
    { id: "executive", name: "Ejecutivo" },
    { id: "tech", name: "Tech / Dev" },
    { id: "creative", name: "Creativo" },
    { id: "elegant", name: "Elegante" },
  ];

  const handleOpenPrintWindow = () => {
    const container = document.getElementById("cv-preview-container");
    if (!container) {
      window.print();
      return;
    }

    const title = cvData.personalInfo.fullName.trim() || "Curriculum_Vitae";
    const printWin = window.open("", "_blank", "width=1050,height=1200");
    if (!printWin) {
      window.print();
      return;
    }

    // Collect all stylesheets and style blocks from current page
    const styleTags = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((el) => el.outerHTML)
      .join("\n");

    // Clone container & reset any zoom / scale transforms
    const cloned = container.cloneNode(true) as HTMLElement;
    cloned.style.transform = "none";
    cloned.style.width = "210mm";
    cloned.style.minHeight = "297mm";
    cloned.style.boxShadow = "none";
    cloned.style.border = "none";
    cloned.style.margin = "0 auto";
    cloned.style.borderRadius = "0";

    // Convert relative img src to absolute URL
    const imgs = cloned.querySelectorAll("img");
    imgs.forEach((img) => {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("data:") && !src.startsWith("http")) {
        img.src = new URL(src, window.location.origin).href;
      }
    });

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=210mm, initial-scale=1.0" />
          <title>CV - ${title} (PDF A4)</title>
          <base href="${window.location.origin}/" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
          ${styleTags}
          <style>
            @page {
              size: A4 portrait;
              margin: 0 !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100%;
              background-color: #334155;
              font-family: system-ui, -apple-system, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            @media screen {
              .no-print-bar {
                position: sticky;
                top: 0;
                left: 0;
                right: 0;
                z-index: 99999;
                background: #0f172a;
                color: #f8fafc;
                padding: 14px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 4px 15px rgba(0,0,0,0.4);
                border-bottom: 1px solid #1e293b;
              }
              .btn-print {
                background: #10b981;
                color: white;
                font-weight: 700;
                padding: 10px 22px;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
                transition: all 0.2s;
              }
              .btn-print:hover {
                background: #059669;
                transform: translateY(-1px);
              }
              .a4-viewport-container {
                padding: 30px 0 60px 0;
                display: flex;
                justify-content: center;
                background-color: #334155;
                min-height: calc(100vh - 70px);
              }
              .a4-sheet-wrapper {
                width: 210mm;
                min-height: 297mm;
                background: white;
                box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                box-sizing: border-box;
                border-radius: 2px;
              }
            }

            @media print {
              .no-print-bar {
                display: none !important;
              }
              body, html {
                background: white !important;
                width: 210mm !important;
              }
              .a4-viewport-container {
                padding: 0 !important;
                background: white !important;
                display: block !important;
              }
              .a4-sheet-wrapper {
                width: 210mm !important;
                min-height: 297mm !important;
                box-shadow: none !important;
                border: none !important;
                margin: 0 !important;
                padding: 0 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print-bar">
            <div style="display:flex; align-items:center; gap:14px;">
              <span style="font-size:22px;">📄</span>
              <div>
                <strong style="font-size:16px; display:block; color: #ffffff;">Vista de Impresión / PDF A4 Fiel</strong>
                <span style="font-size:12px; color:#94a3b8;">
                  Dimensión A4 exacta (210mm × 297mm). Recomendado: Activar <strong>"Gráficos de fondo"</strong> y márgenes en <strong>"Ninguno"</strong> al guardar.
                </span>
              </div>
            </div>
            <button onclick="window.print()" class="btn-print">
              🖨️ Guardar como PDF / Imprimir
            </button>
          </div>
          <div class="a4-viewport-container">
            <div class="a4-sheet-wrapper">
              ${cloned.outerHTML}
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleExportPdf = () => {
    if (!gate("export")) return;
    // WYSIWYG: imprime el preview real (respeta plantilla). El PDF genérico de react-pdf no.
    handleOpenPrintWindow();
  };

  const handleExportJson = () => {
    if (!gate("export")) return;
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(cvData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `CV_${cvData.personalInfo.fullName.replace(/\s+/g, "_") || "mi_cv"}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!gate("edit")) {
      e.target.value = "";
      return;
    }
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.personalInfo) {
            setCvData(parsed);
          }
        } catch {
          alert("Archivo JSON no válido.");
        }
      };
    }
  };

  return (
    <div
      className={`shrink-0 z-20 print:hidden border-b border-slate-200 bg-white ${
        compact ? "" : ""
      }`}
    >
      <div className="px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {onBackToCvs && (
            <button
              type="button"
              onClick={onBackToCvs}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Mis CVs
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs">
            <Layout className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={theme.templateId}
              onChange={(e) => {
                if (!gate("theme")) return;
                setTheme((t) => ({
                  ...t,
                  templateId: e.target.value as CvTemplateId,
                }));
              }}
              onMouseDown={(e) => {
                if (onRequireAuth && !onRequireAuth("theme")) {
                  e.preventDefault();
                }
              }}
              className="bg-transparent text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenThemeModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-blue-600" /> Estilos
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onSyncCloud && (
            <button
              type="button"
              onClick={onSyncCloud}
              title="Subir instancia a Firestore"
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
            >
              <CloudUpload className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAiDrawer}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            ATS / IA
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            title="Exportar PDF"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Exportar PDF
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            title="Exportar JSON"
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          <label
            title="Importar JSON"
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 cursor-pointer"
            onClick={(e) => {
              if (!gate("edit")) e.preventDefault();
            }}
          >
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
