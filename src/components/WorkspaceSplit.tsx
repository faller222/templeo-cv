import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Edit3, Eye } from "lucide-react";

type DesktopPanels = { editor: boolean; preview: boolean };

interface Props {
  editor: React.ReactNode;
  preview: React.ReactNode;
}

function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= breakpoint : true
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isDesktop;
}

const railBtn =
  "flex flex-col items-center justify-center gap-1 w-8 shrink-0 self-stretch border-0 cursor-pointer transition-colors bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-35 disabled:cursor-not-allowed z-20";

export const WorkspaceSplit: React.FC<Props> = ({ editor, preview }) => {
  const isDesktop = useIsDesktop();
  const [desktop, setDesktop] = useState<DesktopPanels>({
    editor: true,
    preview: true,
  });
  const [mobilePanel, setMobilePanel] = useState<"editor" | "preview">(
    "editor"
  );

  const toggleEditor = useCallback(() => {
    setDesktop((prev) => {
      if (prev.editor && !prev.preview) return prev;
      return { ...prev, editor: !prev.editor };
    });
  }, []);

  const togglePreview = useCallback(() => {
    setDesktop((prev) => {
      if (prev.preview && !prev.editor) return prev;
      return { ...prev, preview: !prev.preview };
    });
  }, []);

  if (!isDesktop) {
    return (
      <div className="flex flex-1 min-h-0 h-full w-full overflow-hidden">
        {mobilePanel === "preview" && (
          <button
            type="button"
            onClick={() => setMobilePanel("editor")}
            aria-label="Volver al formulario"
            title="Editar"
            className={`${railBtn} rounded-none`}
          >
            <ChevronRight className="w-4 h-4" />
            <Edit3 className="w-3.5 h-3.5 text-blue-300" />
          </button>
        )}

        <div className="relative flex-1 min-h-0 min-w-0 overflow-hidden">
          <div
            className="flex h-full w-[200%] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform:
                mobilePanel === "editor"
                  ? "translateX(0)"
                  : "translateX(-50%)",
            }}
          >
            <section
              data-panel="editor"
              className="w-1/2 h-full min-h-0 overflow-y-auto overscroll-contain px-3 py-3"
            >
              {editor}
            </section>
            <section
              data-panel="preview"
              className="w-1/2 h-full min-h-0 overflow-hidden px-2 py-2"
            >
              {preview}
            </section>
          </div>
        </div>

        {mobilePanel === "editor" && (
          <button
            type="button"
            onClick={() => setMobilePanel("preview")}
            aria-label="Ver vista previa del CV"
            title="Vista previa"
            className={`${railBtn} rounded-none`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-300" />
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  const showEditor = desktop.editor;
  const showPreview = desktop.preview;

  return (
    <div className="flex flex-1 min-h-0 h-full w-full overflow-hidden">
      <button
        type="button"
        onClick={toggleEditor}
        disabled={showEditor && !showPreview}
        aria-label={showEditor ? "Ocultar formulario" : "Mostrar formulario"}
        aria-pressed={showEditor}
        title={showEditor ? "Ocultar formulario" : "Mostrar formulario"}
        className={railBtn}
      >
        {showEditor ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        <Edit3 className="w-3.5 h-3.5 text-blue-300" />
      </button>

      <section
        data-panel="editor"
        aria-hidden={!showEditor}
        className="min-h-0 overflow-hidden transition-[flex-grow,flex-basis,opacity,max-width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          flexGrow: showEditor ? (showPreview ? 55 : 100) : 0,
          flexShrink: 1,
          flexBasis: 0,
          maxWidth: showEditor ? "100%" : 0,
          opacity: showEditor ? 1 : 0,
          minWidth: 0,
          pointerEvents: showEditor ? "auto" : "none",
        }}
      >
        <div className="h-full min-h-0 overflow-y-auto overscroll-contain px-4 py-3">
          {editor}
        </div>
      </section>

      <section
        data-panel="preview"
        aria-hidden={!showPreview}
        className="min-h-0 overflow-hidden transition-[flex-grow,flex-basis,opacity,max-width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          flexGrow: showPreview ? (showEditor ? 45 : 100) : 0,
          flexShrink: 1,
          flexBasis: 0,
          maxWidth: showPreview ? "100%" : 0,
          opacity: showPreview ? 1 : 0,
          minWidth: 0,
          pointerEvents: showPreview ? "auto" : "none",
        }}
      >
        <div className="h-full min-h-0 overflow-hidden p-3">{preview}</div>
      </section>

      <button
        type="button"
        onClick={togglePreview}
        disabled={showPreview && !showEditor}
        aria-label={
          showPreview ? "Ocultar vista previa" : "Mostrar vista previa"
        }
        aria-pressed={showPreview}
        title={showPreview ? "Ocultar vista previa" : "Mostrar vista previa"}
        className={railBtn}
      >
        <Eye className="w-3.5 h-3.5 text-blue-300" />
        {showPreview ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
