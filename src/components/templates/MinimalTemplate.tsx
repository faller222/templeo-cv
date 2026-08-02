import React from "react";
import { CvData, CvThemeSettings } from "../../types";

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

export const MinimalTemplate: React.FC<Props> = ({ data, theme }) => {
  const { personalInfo, summary, experience, education, skillCategories, projects, certifications, customSections } = data;
  const primary = theme.primaryColor;

  return (
    <div className="w-full h-full bg-white text-slate-900 font-sans leading-relaxed p-8 sm:p-12 text-[13px] print:p-8 print:text-[12px] rounded-sm">
      {/* Header */}
      <header className="mb-6 text-center border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-slate-900">
          {personalInfo.fullName || "Tu Nombre"}
        </h1>
        <p className="text-base font-medium mb-3 uppercase tracking-wider text-slate-600">
          {personalInfo.title}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.github && <span>• {personalInfo.github.replace(/^https?:\/\//, "")}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <p className="text-slate-700 text-sm leading-relaxed text-center max-w-2xl mx-auto italic">
            "{summary}"
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest pb-1 mb-4 border-b-2"
            style={{ borderColor: primary, color: primary }}
          >
            Experiencia
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-slate-900">{exp.title}</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {exp.startDate} – {exp.current ? "Presente" : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5">
                  {exp.company} {exp.location && `| ${exp.location}`}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
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

      {/* Skills & Education side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
              style={{ borderColor: primary, color: primary }}
            >
              Educación
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                    <span className="text-[11px] text-slate-500">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skillCategories && skillCategories.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
              style={{ borderColor: primary, color: primary }}
            >
              Habilidades
            </h2>
            <div className="space-y-2 text-xs">
              {skillCategories.map((cat) => (
                <div key={cat.id}>
                  <span className="font-bold text-slate-900">{cat.categoryName}: </span>
                  <span className="text-slate-700">{cat.skills.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
            style={{ borderColor: primary, color: primary }}
          >
            Proyectos
          </h2>
          <div className="space-y-3 text-xs">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] underline text-slate-500">
                      Enlace
                    </a>
                  )}
                </div>
                <p className="text-slate-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Custom */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-widest pb-1 mb-2 border-b-2"
            style={{ borderColor: primary, color: primary }}
          >
            Certificaciones
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
            {certifications.map((c) => (
              <span key={c.id} className="text-slate-800">
                <strong className="font-semibold">{c.title}</strong> – {c.issuer} ({c.date})
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
