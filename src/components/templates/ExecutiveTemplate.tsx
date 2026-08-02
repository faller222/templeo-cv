import React from "react";
import { CvData, CvThemeSettings } from "../../types";

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

export const ExecutiveTemplate: React.FC<Props> = ({ data, theme }) => {
  const { personalInfo, summary, experience, education, skillCategories, projects, certifications, customSections } = data;
  const primary = theme.primaryColor;

  return (
    <div className="w-full h-full bg-white text-slate-800 font-sans leading-relaxed text-[13px] print:text-[12px]">
      {/* Header Banner */}
      <header className="p-8 sm:p-10 text-white" style={{ backgroundColor: primary }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              {personalInfo.fullName || "Tu Nombre"}
            </h1>
            <p className="text-base font-medium text-slate-100 opacity-95">
              {personalInfo.title}
            </p>
          </div>

          {personalInfo.showPhoto && personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-20 h-20 rounded-full border-2 border-white/80 object-cover shrink-0"
            />
          )}
        </div>

        {/* Contact Info Row */}
        <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-100">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin.replace(/^https?:\/\//, "")}</span>}
        </div>
      </header>

      {/* Body Content */}
      <div className="p-8 sm:p-10 space-y-6">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
              Resumen Ejecutivo
            </h2>
            <p className="text-slate-700 leading-normal">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
              Trayectoria Profesional
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-slate-900 text-sm">{exp.title}</h3>
                    <span className="text-xs font-semibold text-slate-600">
                      {exp.startDate} – {exp.current ? "Presente" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mb-1" style={{ color: primary }}>
                    {exp.company} {exp.location && `(${exp.location})`}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
                Formación Académica
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                    <p className="text-xs text-slate-700">{edu.institution}</p>
                    <p className="text-[11px] text-slate-500">
                      {edu.startDate} – {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Competencies */}
          {skillCategories && skillCategories.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
                Competencias Clave
              </h2>
              <div className="space-y-2">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <h4 className="font-bold text-xs text-slate-900">{cat.categoryName}</h4>
                    <p className="text-xs text-slate-700">{cat.skills.join(" • ")}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
              Certificaciones & Licencias
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-bold text-slate-900">{c.title}</span> – {c.issuer}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
