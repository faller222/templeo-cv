import React from "react";
import { CvData, CvThemeSettings } from "../../types";

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

export const ElegantTemplate: React.FC<Props> = ({ data, theme }) => {
  const { personalInfo, summary, experience, education, skillCategories, projects, certifications } = data;
  const primary = theme.primaryColor;

  return (
    <div className="w-full h-full bg-white text-slate-800 font-serif leading-relaxed p-10 sm:p-12 text-[13px] print:p-8 print:text-[12px] rounded-sm">
      {/* Header */}
      <header className="text-center pb-6 mb-6 border-b border-slate-300">
        <h1 className="text-3xl sm:text-4xl font-normal tracking-wide text-slate-900 mb-1">
          {personalInfo.fullName || "Tu Nombre"}
        </h1>
        <p className="text-sm font-sans tracking-widest uppercase text-slate-600 mb-3" style={{ color: primary }}>
          {personalInfo.title}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-sans text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin.replace(/^https?:\/\//, "")}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6 text-center italic max-w-2xl mx-auto text-slate-700">
          <p className="leading-relaxed text-sm">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 text-center mb-4 border-b pb-1 border-slate-200">
            Experiencia Profesional
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-slate-900 text-sm">{exp.title}</h3>
                  <span className="text-xs font-sans text-slate-500">
                    {exp.startDate} – {exp.current ? "Presente" : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-sans font-semibold text-slate-700 mb-1.5 italic">
                  {exp.company} {exp.location && `— ${exp.location}`}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-5 space-y-1 text-xs text-slate-700">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 mb-3 border-b pb-1 border-slate-200">
              Formación Académica
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                  <p className="text-xs text-slate-700 italic">{edu.institution}</p>
                  <p className="text-[11px] font-sans text-slate-500">{edu.startDate} – {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skillCategories && skillCategories.length > 0 && (
          <section>
            <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 mb-3 border-b pb-1 border-slate-200">
              Aptitudes & Especialidades
            </h2>
            <div className="space-y-2 text-xs">
              {skillCategories.map((cat) => (
                <div key={cat.id}>
                  <strong className="font-sans font-bold text-slate-900">{cat.categoryName}: </strong>
                  <span className="text-slate-700">{cat.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 mb-2 border-b pb-1 border-slate-200">
            Certificaciones
          </h2>
          <div className="flex flex-wrap gap-x-6 text-xs">
            {certifications.map((c) => (
              <span key={c.id} className="text-slate-800">
                <strong>{c.title}</strong> ({c.issuer}, {c.date})
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
