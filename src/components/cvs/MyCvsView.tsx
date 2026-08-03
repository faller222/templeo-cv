import React, { useState } from "react";
import type { CvInstance } from "../../types";
import {
  Copy,
  Download,
  MoreHorizontal,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

const TEMPLATE_LABELS: Record<string, string> = {
  "clasico-v1": "Clásico",
  "markdown-template-v1": "ATS Corporativo",
  modern: "Moderno",
  minimal: "Minimalista",
  executive: "Ejecutivo",
  tech: "Tech / Dev",
  creative: "Creativo",
  elegant: "Elegante",
};

function formatDate(ts: number) {
  try {
    return new Intl.DateTimeFormat("es", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(ts));
  } catch {
    return "—";
  }
}

interface Props {
  instances: CvInstance[];
  profileUsable: boolean;
  locked?: boolean;
  onRequireAuth?: () => void;
  onCreate: () => void;
  onOpen: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

export const MyCvsView: React.FC<Props> = ({
  instances,
  profileUsable,
  locked,
  onRequireAuth,
  onCreate,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
  onExport,
}) => {
  const [menuId, setMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const gate = () => {
    if (locked) {
      onRequireAuth?.();
      return false;
    }
    return true;
  };

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_#f8fafc_0%,_#eef2f7_50%,_#f1f5f9_100%)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Versiones derivadas de tu perfil
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Mis CVs
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-lg">
              Cada CV es una adaptación de tu Perfil Profesional para un
              objetivo distinto. No vuelvas a cargar la misma información.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!gate()) return;
              onCreate();
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Crear nuevo CV
          </button>
        </div>

        {!instances.length ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              Todavía no tenés versiones
            </h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              {profileUsable
                ? "Tu perfil ya está listo — generá el primer CV en segundos."
                : "Completá tu Perfil Profesional y después generá CVs adaptados a cada oportunidad."}
            </p>
            <button
              type="button"
              onClick={() => {
                if (!gate()) return;
                onCreate();
              }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Crear nuevo CV
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {instances.map((cv) => {
              const origin = cv.sourceJobHint?.trim()
                ? "Desde oferta"
                : "General";
              return (
                <article
                  key={cv.id}
                  className="group relative rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (!gate()) return;
                      onOpen(cv.id);
                    }}
                    className="w-full text-left cursor-pointer"
                  >
                    {editingId === cv.id ? (
                      <input
                        autoFocus
                        value={draft}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={() => {
                          onRename(cv.id, draft);
                          setEditingId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onRename(cv.id, draft);
                            setEditingId(null);
                          }
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="w-full text-sm font-extrabold border border-blue-300 rounded-lg px-2 py-1 mb-1"
                      />
                    ) : (
                      <h3 className="text-sm font-extrabold text-slate-900 truncate pr-8">
                        {cv.title}
                      </h3>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1 truncate">
                      {origin}
                      {cv.sourceJobHint
                        ? ` · ${cv.sourceJobHint.slice(0, 48)}${
                            cv.sourceJobHint.length > 48 ? "…" : ""
                          }`
                        : ""}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {TEMPLATE_LABELS[cv.templateId] || cv.templateId}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {formatDate(cv.updatedAt || cv.createdAt)}
                      </span>
                      {typeof cv.atsScore === "number" ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                          ATS {cv.atsScore}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-400">
                          Sin ATS
                        </span>
                      )}
                    </div>
                  </button>

                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuId(menuId === cv.id ? null : cv.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuId === cv.id && (
                      <div className="absolute right-0 mt-1 w-40 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-10">
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          onClick={() => {
                            if (!gate()) return;
                            onOpen(cv.id);
                            setMenuId(null);
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5" /> Editar
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          onClick={() => {
                            if (!gate()) return;
                            setDraft(cv.title);
                            setEditingId(cv.id);
                            setMenuId(null);
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5" /> Renombrar
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          onClick={() => {
                            if (!gate()) return;
                            onDuplicate(cv.id);
                            setMenuId(null);
                          }}
                        >
                          <Copy className="w-3.5 h-3.5" /> Duplicar
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          onClick={() => {
                            if (!gate()) return;
                            onExport(cv.id);
                            setMenuId(null);
                          }}
                        >
                          <Download className="w-3.5 h-3.5" /> Exportar
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                          onClick={() => {
                            if (!gate()) return;
                            if (
                              window.confirm(
                                `¿Eliminar “${cv.title}”? Esta acción no se puede deshacer.`
                              )
                            ) {
                              onDelete(cv.id);
                            }
                            setMenuId(null);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
