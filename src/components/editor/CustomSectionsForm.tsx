import React from "react";
import { CustomSection, CustomSectionItem } from "../../types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  sections: CustomSection[];
  onChange: (updated: CustomSection[]) => void;
}

export const CustomSectionsForm: React.FC<Props> = ({ sections, onChange }) => {
  const handleAddSection = () => {
    const newSec: CustomSection = {
      id: "custom-" + Date.now(),
      sectionTitle: "Sección Personalizada",
      items: [
        {
          id: "item-" + Date.now(),
          title: "",
          subtitle: "",
          date: "",
          description: "",
        },
      ],
    };
    onChange([...sections, newSec]);
  };

  const handleUpdateTitle = (secId: string, title: string) => {
    onChange(sections.map((s) => (s.id === secId ? { ...s, sectionTitle: title } : s)));
  };

  const handleDeleteSection = (secId: string) => {
    onChange(sections.filter((s) => s.id !== secId));
  };

  const handleAddItem = (secId: string) => {
    onChange(
      sections.map((s) => {
        if (s.id === secId) {
          const newItem: CustomSectionItem = {
            id: "item-" + Date.now(),
            title: "",
            subtitle: "",
            date: "",
            description: "",
          };
          return { ...s, items: [...s.items, newItem] };
        }
        return s;
      })
    );
  };

  const handleUpdateItem = (secId: string, itemId: string, field: keyof CustomSectionItem, value: string) => {
    onChange(
      sections.map((s) => {
        if (s.id === secId) {
          return {
            ...s,
            items: s.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)),
          };
        }
        return s;
      })
    );
  };

  const handleDeleteItem = (secId: string, itemId: string) => {
    onChange(
      sections.map((s) => {
        if (s.id === secId) {
          return { ...s, items: s.items.filter((it) => it.id !== itemId) };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-4 text-xs">
      {sections.map((sec) => (
        <div key={sec.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-xs">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <input
              type="text"
              value={sec.sectionTitle}
              onChange={(e) => handleUpdateTitle(sec.id, e.target.value)}
              placeholder="Título de Sección (ej: Voluntariado, Premios)"
              className="font-bold text-slate-800 text-xs px-2 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 flex-1 max-w-xs"
            />
            <button
              type="button"
              onClick={() => handleDeleteSection(sec.id)}
              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {sec.items.map((item, iIdx) => (
              <div key={item.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-[11px]">Elemento #{iIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(sec.id, item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(sec.id, item.id, "title", e.target.value)}
                      placeholder="Título / Puesto"
                      className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => handleUpdateItem(sec.id, item.id, "subtitle", e.target.value)}
                      placeholder="Subtítulo / Organización"
                      className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => handleUpdateItem(sec.id, item.id, "date", e.target.value)}
                      placeholder="Fecha / Año"
                      className="w-full px-2 py-1 border border-slate-200 rounded bg-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleUpdateItem(sec.id, item.id, "description", e.target.value)}
                    placeholder="Detalles adicionales..."
                    className="w-full p-2 border border-slate-200 rounded bg-white text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleAddItem(sec.id)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir elemento a esta sección
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddSection}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-dashed border-slate-300"
      >
        <Plus className="w-4 h-4" /> Añadir Sección Personalizada
      </button>
    </div>
  );
};
