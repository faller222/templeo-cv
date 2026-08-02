import React, { useState } from "react";
import { ExperienceItem } from "../../types";
import { Plus, Trash2, Sparkles, Loader2, ChevronDown, ChevronUp, Check, Layers } from "lucide-react";

interface Props {
  items: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
  language: "es" | "en";
}

export const ExperienceForm: React.FC<Props> = ({ items, onChange, language }) => {
  const [activeAiIndex, setActiveAiIndex] = useState<{ expId: string; bulletIdx: number } | null>(null);
  const [loadingBullet, setLoadingBullet] = useState(false);
  const [bulletSuggestions, setBulletSuggestions] = useState<{ type: string; bulletText: string }[] | null>(null);

  const handleAddItem = () => {
    const newItem: ExperienceItem = {
      id: "exp-" + Date.now(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const handleDeleteItem = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  const handleAddBullet = (expId: string) => {
    onChange(
      items.map((it) => (it.id === expId ? { ...it, bullets: [...it.bullets, ""] } : it))
    );
  };

  const handleUpdateBullet = (expId: string, idx: number, value: string) => {
    onChange(
      items.map((it) => {
        if (it.id === expId) {
          const newBullets = [...it.bullets];
          newBullets[idx] = value;
          return { ...it, bullets: newBullets };
        }
        return it;
      })
    );
  };

  const handleDeleteBullet = (expId: string, idx: number) => {
    onChange(
      items.map((it) => {
        if (it.id === expId) {
          return { ...it, bullets: it.bullets.filter((_, i) => i !== idx) };
        }
        return it;
      })
    );
  };

  const handleEnhanceBullet = async (exp: ExperienceItem, bulletIdx: number) => {
    const originalBullet = exp.bullets[bulletIdx];
    if (!originalBullet || originalBullet.trim().length === 0) return;

    setActiveAiIndex({ expId: exp.id, bulletIdx });
    setLoadingBullet(true);
    setBulletSuggestions(null);

    try {
      const res = await fetch("/api/ai/enhance-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet: originalBullet,
          jobTitle: exp.title,
          company: exp.company,
          language,
        }),
      });

      if (!res.ok) throw new Error("Error procesando viñeta con IA");
      const data = await res.json();
      if (data.suggestions) {
        setBulletSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBullet(false);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {items.map((exp, index) => (
        <div key={exp.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 text-xs">
              Experiencia #{index + 1}: {exp.title || "Nueva Experiencia"}
            </span>
            <button
              type="button"
              onClick={() => handleDeleteItem(exp.id)}
              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
              title="Eliminar experiencia"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Puesto / Cargo *</label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => handleUpdateItem(exp.id, "title", e.target.value)}
                placeholder="Ej: Senior Software Engineer"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Empresa *</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleUpdateItem(exp.id, "company", e.target.value)}
                placeholder="Ej: MercadoLibre"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Ubicación</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => handleUpdateItem(exp.id, "location", e.target.value)}
                placeholder="Ej: Buenos Aires, Argentina"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Fecha Inicio</label>
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => handleUpdateItem(exp.id, "startDate", e.target.value)}
                placeholder="Ene 2021"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Fecha Fin</label>
              <input
                type="text"
                disabled={exp.current}
                value={exp.current ? "Presente" : exp.endDate}
                onChange={(e) => handleUpdateItem(exp.id, "endDate", e.target.value)}
                placeholder="Dic 2023"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`current-${exp.id}`}
              checked={exp.current}
              onChange={(e) => handleUpdateItem(exp.id, "current", e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
            />
            <label htmlFor={`current-${exp.id}`} className="text-[11px] text-slate-700 cursor-pointer">
              Trabajo actualmente aquí
            </label>
          </div>

          {/* Bullet Points */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-700">
                Logros y Responsabilidades (Viñetas)
              </label>
              <button
                type="button"
                onClick={() => handleAddBullet(exp.id)}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Añadir viñeta
              </button>
            </div>

            {exp.bullets.map((b, bIdx) => (
              <div key={bIdx} className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                    placeholder="Ej: Lideré el desarrollo del módulo de facturación reduciendo el tiempo de procesamiento en un 30%..."
                    className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                  />

                  <button
                    type="button"
                    onClick={() => handleEnhanceBullet(exp, bIdx)}
                    disabled={!b || loadingBullet}
                    title="Optimizar logro con IA"
                    className="p-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg disabled:opacity-40 cursor-pointer"
                  >
                    {loadingBullet && activeAiIndex?.expId === exp.id && activeAiIndex?.bulletIdx === bIdx ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteBullet(exp.id, bIdx)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Inline AI suggestions for this bullet */}
                {activeAiIndex?.expId === exp.id && activeAiIndex?.bulletIdx === bIdx && bulletSuggestions && (
                  <div className="ml-2 p-2 bg-indigo-50 border border-indigo-200 rounded-lg space-y-1.5 text-[11px]">
                    <div className="font-bold text-indigo-900 flex justify-between items-center">
                      <span>IA Sugerencias (Fórmula STAR ATS):</span>
                      <button
                        onClick={() => {
                          setActiveAiIndex(null);
                          setBulletSuggestions(null);
                        }}
                        className="text-slate-400 hover:text-slate-600 text-[10px]"
                      >
                        Cerrar
                      </button>
                    </div>

                    {bulletSuggestions.map((sug, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => {
                          handleUpdateBullet(exp.id, bIdx, sug.bulletText);
                          setActiveAiIndex(null);
                          setBulletSuggestions(null);
                        }}
                        className="p-1.5 bg-white rounded border border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition-all flex items-start gap-1.5"
                      >
                        <Check className="w-3 h-3 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-indigo-700 mr-1">[{sug.type}]:</span>
                          <span className="text-slate-800">{sug.bulletText}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-dashed border-slate-300"
      >
        <Plus className="w-4 h-4" /> Añadir Experiencia Laboral
      </button>
    </div>
  );
};
