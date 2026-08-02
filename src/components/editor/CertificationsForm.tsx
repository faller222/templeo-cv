import React from "react";
import { CertificationItem } from "../../types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  items: CertificationItem[];
  onChange: (updated: CertificationItem[]) => void;
}

export const CertificationsForm: React.FC<Props> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: CertificationItem = {
      id: "cert-" + Date.now(),
      title: "",
      issuer: "",
      date: "",
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof CertificationItem, value: any) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const handleDeleteItem = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="space-y-4 text-xs">
      {items.map((cert, index) => (
        <div key={cert.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 relative shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-800 text-xs">
              Certificación #{index + 1}: {cert.title || "Nueva Certificación"}
            </span>
            <button
              type="button"
              onClick={() => handleDeleteItem(cert.id)}
              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Nombre *</label>
              <input
                type="text"
                value={cert.title}
                onChange={(e) => handleUpdateItem(cert.id, "title", e.target.value)}
                placeholder="Ej: AWS Certified Architect"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Emisor *</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => handleUpdateItem(cert.id, "issuer", e.target.value)}
                placeholder="Ej: Amazon Web Services"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">Año / Fecha</label>
              <input
                type="text"
                value={cert.date}
                onChange={(e) => handleUpdateItem(cert.id, "date", e.target.value)}
                placeholder="2023"
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
        <Plus className="w-4 h-4" /> Añadir Certificación
      </button>
    </div>
  );
};
