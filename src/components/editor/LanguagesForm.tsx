import React from "react";
import type { LanguageItem } from "../../types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  items: LanguageItem[];
  onChange: (updated: LanguageItem[]) => void;
}

const LEVELS = ["Nativo", "C2", "C1", "B2", "B1", "A2", "A1"];

export const LanguagesForm: React.FC<Props> = ({ items, onChange }) => {
  const add = () => {
    onChange([
      ...items,
      { id: `lang-${Date.now()}`, name: "", level: "B2" },
    ]);
  };

  const update = (id: string, field: keyof LanguageItem, value: string) => {
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
              Idioma #{index + 1}
            </span>
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
                Idioma
              </label>
              <input
                value={item.name}
                onChange={(e) => update(item.id, "name", e.target.value)}
                placeholder="Ej: Inglés"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Nivel
              </label>
              <select
                value={item.level}
                onChange={(e) => update(item.id, "level", e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-dashed border-slate-300 cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Añadir idioma
      </button>
    </div>
  );
};
