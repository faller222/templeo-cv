import React from "react";
import { EducationItem } from "../../types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  items: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const EducationForm: React.FC<Props> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: EducationItem = {
      id: "edu-" + Date.now(),
      degree: "",
      fieldOfStudy: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof EducationItem, value: any) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const handleDeleteItem = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="space-y-4 text-xs">
      {items.map((edu, index) => (
        <div key={edu.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 text-xs">
              Educación #{index + 1}: {edu.degree || "Nueva Titulación"}
            </span>
            <button
              type="button"
              onClick={() => handleDeleteItem(edu.id)}
              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Título / Grado *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleUpdateItem(edu.id, "degree", e.target.value)}
                placeholder="Ej: Licenciatura en Informática"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Institución *</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleUpdateItem(edu.id, "institution", e.target.value)}
                placeholder="Ej: Universidad de Buenos Aires"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Fecha Inicio</label>
              <input
                type="text"
                value={edu.startDate}
                onChange={(e) => handleUpdateItem(edu.id, "startDate", e.target.value)}
                placeholder="2018"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Fecha Fin</label>
              <input
                type="text"
                value={edu.endDate}
                onChange={(e) => handleUpdateItem(edu.id, "endDate", e.target.value)}
                placeholder="2022"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Promedio / Nota (Opcional)</label>
              <input
                type="text"
                value={edu.gpa || ""}
                onChange={(e) => handleUpdateItem(edu.id, "gpa", e.target.value)}
                placeholder="8.5 / 10"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-dashed border-slate-300"
      >
        <Plus className="w-4 h-4" /> Añadir Educación
      </button>
    </div>
  );
};
