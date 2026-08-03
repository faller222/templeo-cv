import React from "react";
import type { LinkItem } from "../../types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  items: LinkItem[];
  onChange: (updated: LinkItem[]) => void;
}

export const LinksForm: React.FC<Props> = ({ items, onChange }) => {
  const add = () => {
    onChange([...items, { id: `link-${Date.now()}`, label: "", url: "" }]);
  };

  const update = (id: string, field: keyof LinkItem, value: string) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  return (
    <div className="space-y-3 text-xs">
      <p className="text-slate-500 text-[11px] leading-relaxed">
        Links adicionales a LinkedIn, GitHub y web (ya están en Datos personales).
      </p>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800">Link #{index + 1}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((i) => i.id !== item.id))}
              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Etiqueta
              </label>
              <input
                value={item.label}
                onChange={(e) => update(item.id, "label", e.target.value)}
                placeholder="Ej: Behance, Medium"
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
                placeholder="https://"
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
        <Plus className="w-4 h-4" /> Añadir link
      </button>
    </div>
  );
};
