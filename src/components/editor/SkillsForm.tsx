import React, { useState } from "react";
import { SkillCategory } from "../../types";
import { Plus, Trash2, X } from "lucide-react";

interface Props {
  categories: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

export const SkillsForm: React.FC<Props> = ({ categories, onChange }) => {
  const [newSkillText, setNewSkillText] = useState<{ [catId: string]: string }>({});

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: "cat-" + Date.now(),
      categoryName: "Nueva Categoría",
      skills: [],
    };
    onChange([...categories, newCat]);
  };

  const handleUpdateCategoryName = (id: string, name: string) => {
    onChange(categories.map((c) => (c.id === id ? { ...c, categoryName: name } : c)));
  };

  const handleDeleteCategory = (id: string) => {
    onChange(categories.filter((c) => c.id !== id));
  };

  const handleAddSkill = (catId: string) => {
    const text = (newSkillText[catId] || "").trim();
    if (!text) return;

    onChange(
      categories.map((c) => {
        if (c.id === catId) {
          return { ...c, skills: [...c.skills, text] };
        }
        return c;
      })
    );

    setNewSkillText({ ...newSkillText, [catId]: "" });
  };

  const handleDeleteSkill = (catId: string, skillIdx: number) => {
    onChange(
      categories.map((c) => {
        if (c.id === catId) {
          return { ...c, skills: c.skills.filter((_, i) => i !== skillIdx) };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-4 text-xs">
      {categories.map((cat) => (
        <div key={cat.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-xs">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <input
              type="text"
              value={cat.categoryName}
              onChange={(e) => handleUpdateCategoryName(cat.id, e.target.value)}
              placeholder="Nombre de categoría (ej: Lenguajes, Idiomas)"
              className="font-bold text-slate-800 text-xs px-2 py-1 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1 max-w-xs"
            />
            <button
              type="button"
              onClick={() => handleDeleteCategory(cat.id)}
              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Skill Pills */}
          <div className="flex flex-wrap gap-1.5">
            {cat.skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 transition-all"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(cat.id, sIdx)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillText[cat.id] || ""}
              onChange={(e) => setNewSkillText({ ...newSkillText, [cat.id]: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill(cat.id);
                }
              }}
              placeholder="Escribe una habilidad y presiona Enter..."
              className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(cat.id)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Añadir
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddCategory}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-dashed border-slate-300"
      >
        <Plus className="w-4 h-4" /> Añadir Categoría de Habilidades
      </button>
    </div>
  );
};
