import React from "react";
import { ReferenceItem } from "../../types";
import { Plus, Trash2, UserCheck, Phone } from "lucide-react";

interface Props {
  items: ReferenceItem[] | undefined;
  onChange: (updated: ReferenceItem[]) => void;
}

export const ReferencesForm: React.FC<Props> = ({ items = [], onChange }) => {
  const handleItemChange = (index: number, field: keyof ReferenceItem, value: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const handleAddItem = () => {
    const newItem: ReferenceItem = {
      id: `ref-${Date.now()}`,
      name: "",
      role: "",
      company: "",
      phone: "",
    };
    onChange([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-4 text-xs sm:text-sm">
      {items.map((ref, idx) => (
        <div key={ref.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 text-xs">Referencia #{idx + 1}</span>
            <button
              type="button"
              onClick={() => handleRemoveItem(idx)}
              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
              title="Eliminar referencia"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                value={ref.name}
                onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                placeholder="Ej: Micaela Palacio"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo / Puesto</label>
              <input
                type="text"
                value={ref.role}
                onChange={(e) => handleItemChange(idx, "role", e.target.value)}
                placeholder="Ej: Encargada"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa</label>
              <input
                type="text"
                value={ref.company}
                onChange={(e) => handleItemChange(idx, "company", e.target.value)}
                placeholder="Ej: Fit&feet"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono de Contacto</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={ref.phone}
                  onChange={(e) => handleItemChange(idx, "phone", e.target.value)}
                  placeholder="Ej: 099184092"
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-dashed border-slate-300 cursor-pointer transition-colors"
      >
        <Plus className="w-4 h-4 text-blue-600" /> Agregar Referencia Laboral
      </button>
    </div>
  );
};
