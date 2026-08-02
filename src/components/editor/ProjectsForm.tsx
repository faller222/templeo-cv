import React from "react";
import { ProjectItem } from "../../types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  items: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

export const ProjectsForm: React.FC<Props> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: ProjectItem = {
      id: "proj-" + Date.now(),
      title: "",
      role: "",
      techStack: [],
      link: "",
      description: "",
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const handleDeleteItem = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="space-y-4 text-xs">
      {items.map((proj, index) => (
        <div key={proj.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 text-xs">
              Proyecto #{index + 1}: {proj.title || "Nuevo Proyecto"}
            </span>
            <button
              type="button"
              onClick={() => handleDeleteItem(proj.id)}
              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Nombre del Proyecto *</label>
              <input
                type="text"
                value={proj.title}
                onChange={(e) => handleUpdateItem(proj.id, "title", e.target.value)}
                placeholder="Ej: E-Commerce App"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Tu Rol</label>
              <input
                type="text"
                value={proj.role}
                onChange={(e) => handleUpdateItem(proj.id, "role", e.target.value)}
                placeholder="Ej: Creador & Lead Dev"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Enlace / Demo</label>
              <input
                type="text"
                value={proj.link}
                onChange={(e) => handleUpdateItem(proj.id, "link", e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Tecnologías (separadas por coma)</label>
              <input
                type="text"
                value={proj.techStack?.join(", ") || ""}
                onChange={(e) =>
                  handleUpdateItem(
                    proj.id,
                    "techStack",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="React, TypeScript, Node.js"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              rows={2}
              value={proj.description}
              onChange={(e) => handleUpdateItem(proj.id, "description", e.target.value)}
              placeholder="Breve resumen de los objetivos y logros del proyecto..."
              className="w-full p-2 border border-slate-200 rounded-lg text-xs leading-relaxed"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-dashed border-slate-300"
      >
        <Plus className="w-4 h-4" /> Añadir Proyecto
      </button>
    </div>
  );
};
