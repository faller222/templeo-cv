import React from "react";
import type { CvData } from "../../../types";

/** Secciones nuevas del perfil que los templates clásicos aún no renderizan inline. */
export const ProfileExtras: React.FC<{
  data: CvData;
  accent?: string;
  compact?: boolean;
}> = ({ data, accent = "#0f172a", compact }) => {
  const titleCls = compact
    ? "text-[10px] font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2"
    : "text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3";
  const itemCls = compact ? "text-[10px]" : "text-xs";

  const blocks: { title: string; body: React.ReactNode }[] = [];

  if (data.languages?.length) {
    blocks.push({
      title: "Idiomas",
      body: (
        <p className={`text-slate-700 ${itemCls}`}>
          {data.languages
            .map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`)
            .join(" · ")}
        </p>
      ),
    });
  }
  if (data.courses?.length) {
    blocks.push({
      title: "Cursos",
      body: (
        <ul className="space-y-1">
          {data.courses.map((c) => (
            <li key={c.id} className={itemCls}>
              <span className="font-bold text-slate-900">{c.title}</span>
              {(c.institution || c.date) && (
                <span className="text-slate-600">
                  {" "}
                  — {[c.institution, c.date].filter(Boolean).join(", ")}
                </span>
              )}
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (data.achievements?.length) {
    blocks.push({
      title: "Logros",
      body: (
        <ul className="space-y-1.5">
          {data.achievements.map((a) => (
            <li key={a.id} className={itemCls}>
              <div className="font-bold text-slate-900">{a.title}</div>
              {a.description && (
                <div className="text-slate-600">{a.description}</div>
              )}
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (data.awards?.length) {
    blocks.push({
      title: "Premios",
      body: (
        <ul className="space-y-1">
          {data.awards.map((a) => (
            <li key={a.id} className={itemCls}>
              <span className="font-bold text-slate-900">{a.title}</span>
              <span className="text-slate-600">
                {" "}
                — {[a.issuer, a.date].filter(Boolean).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (data.publications?.length) {
    blocks.push({
      title: "Publicaciones",
      body: (
        <ul className="space-y-1">
          {data.publications.map((p) => (
            <li key={p.id} className={itemCls}>
              <span className="font-bold text-slate-900">{p.title}</span>
              <span className="text-slate-600">
                {" "}
                — {[p.publisher, p.date].filter(Boolean).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (data.portfolio?.length) {
    blocks.push({
      title: "Portafolio",
      body: (
        <ul className="space-y-1.5">
          {data.portfolio.map((p) => (
            <li key={p.id} className={itemCls}>
              <div className="font-bold text-slate-900">{p.title}</div>
              {p.description && (
                <div className="text-slate-600">{p.description}</div>
              )}
              {p.url && <div className="text-slate-500">{p.url}</div>}
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (data.links?.length) {
    blocks.push({
      title: "Links",
      body: (
        <ul className="space-y-0.5">
          {data.links.map((l) => (
            <li key={l.id} className={`text-slate-700 ${itemCls}`}>
              <span className="font-semibold">{l.label}</span>
              {l.url ? `: ${l.url}` : ""}
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (!blocks.length) return null;

  return (
    <>
      {blocks.map((b) => (
        <section key={b.title} className="mt-3">
          <h2 className={titleCls} style={{ borderColor: accent }}>
            {b.title}
          </h2>
          {b.body}
        </section>
      ))}
    </>
  );
};
