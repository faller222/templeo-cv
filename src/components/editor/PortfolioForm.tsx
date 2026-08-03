import React from "react";
import type { PortfolioItem } from "../../types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  items: PortfolioItem[];
  onChange: (updated: PortfolioItem[]) => void;
}

export const PortfolioForm: React.FC<Props> = ({ items, onChange }) => {
  const add = () => {
    onChange([
      ...items,
      {
        id: `folio-${Date.now()}`,
        title: "",
        description: "",
        url: "",
        techStack: [],
      },
    ]);
  };

  const update = (
    id: string,
    field: keyof PortfolioItem,
    value: string | string[]
  ) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  return (
    <div className="space-y-3 text-xs">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800">
              Pieza #{index + 1}: {item.title || "Nueva"}
            </span>
            <button
              type="button"
              onClick={() => onChange(items.filter((i) => i.id !== item.id))}
              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Título
              </label>
              <input
                value={item.title}
                onChange={(e) => update(item.id, "title", e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                URL
              </label>
              <input
                value={item.url}
                onChange={(e) => update(item.id, "url", e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Descripción
              </label>
              <textarea
                value={item.description}
                onChange={(e) => update(item.id, "description", e.target.value)}
                rows={3}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Stack (separado por comas)
              </label>
              <input
                value={(item.techStack || []).join(", ")}
                onChange={(e) =>
                  update(
                    item.id,
                    "techStack",
                    e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-dashed border-slate-300 cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Añadir pieza de portafolio
      </button>
    </div>
  );
};
