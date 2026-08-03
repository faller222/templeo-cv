import React from "react";
import type { AppView } from "../types";
import { FileText, FolderOpen, UserRound } from "lucide-react";

interface Props {
  view: AppView;
  onNavigate: (view: AppView) => void;
  authSlot?: React.ReactNode;
  completenessPercent?: number;
  cvCount?: number;
  trailing?: React.ReactNode;
}

export const AppShell: React.FC<Props> = ({
  view,
  onNavigate,
  authSlot,
  completenessPercent,
  cvCount = 0,
  trailing,
}) => {
  const navBtn = (
    id: AppView,
    label: string,
    icon: React.ReactNode,
    meta?: string
  ) => {
    const active = view === id || (id === "cvs" && view === "editor");
    return (
      <button
        type="button"
        onClick={() => onNavigate(id)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
          active
            ? "bg-white text-slate-900 shadow-sm"
            : "text-slate-300 hover:text-white hover:bg-slate-800"
        }`}
      >
        {icon}
        <span>{label}</span>
        {meta && (
          <span
            className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
              active ? "bg-slate-100 text-slate-600" : "bg-slate-800 text-slate-400"
            }`}
          >
            {meta}
          </span>
        )}
      </button>
    );
  };

  return (
    <header className="shrink-0 bg-slate-950 border-b border-slate-800 z-40">
      <div className="px-3 sm:px-5 py-2.5 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-extrabold tracking-tight text-white">
                Templeo<span className="text-blue-400">CV</span>
              </h1>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Un perfil · infinitos CVs
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            {navBtn(
              "profile",
              "Mi Perfil",
              <UserRound className="w-3.5 h-3.5" />,
              completenessPercent != null
                ? `${completenessPercent}%`
                : undefined
            )}
            {navBtn(
              "cvs",
              "Mis CVs",
              <FolderOpen className="w-3.5 h-3.5" />,
              String(cvCount)
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {trailing}
          {authSlot}
        </div>
      </div>
    </header>
  );
};
