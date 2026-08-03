import React from "react";
import { CvData, CvThemeSettings } from "../../types";
import { CvPhoto } from "../CvPhoto";

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

export const CreativeTemplate: React.FC<Props> = ({ data, theme }) => {
  const { personalInfo, summary, experience, education, skillCategories, projects, certifications } = data;
  const primary = theme.primaryColor;

  return (
    <div className="w-full h-full bg-white text-slate-800 font-sans leading-relaxed text-[13px] print:text-[12px]">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-full">
        {/* Left Sidebar Tint */}
        <aside
          className="md:col-span-4 p-6 sm:p-8 text-white space-y-6 shrink-0"
          style={{ backgroundColor: primary }}
        >
          {personalInfo.showPhoto && personalInfo.photoUrl && (
            <div className="flex justify-center mb-4">
              <CvPhoto
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-28 h-28 rounded-2xl border-4 border-white/20 object-cover shadow-md"
              />
            </div>
          )}

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black text-white leading-tight mb-1">
              {personalInfo.fullName || "Tu Nombre"}
            </h1>
            <p className="text-sm font-medium text-white/90 uppercase tracking-wider">
              {personalInfo.title}
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2 text-xs text-white/90 border-t border-white/20 pt-4">
            <h3 className="font-bold uppercase tracking-wider text-white text-[11px]">Contacto</h3>
            {personalInfo.email && <p className="break-all">✉ {personalInfo.email}</p>}
            {personalInfo.phone && <p>📞 {personalInfo.phone}</p>}
            {personalInfo.location && <p>📍 {personalInfo.location}</p>}
            {personalInfo.website && <p className="break-all">🌐 {personalInfo.website.replace(/^https?:\/\//, "")}</p>}
            {personalInfo.linkedin && <p className="break-all">💼 {personalInfo.linkedin.replace(/^https?:\/\//, "")}</p>}
          </div>

          {/* Skills */}
          {skillCategories && skillCategories.length > 0 && (
            <div className="space-y-3 border-t border-white/20 pt-4">
              <h3 className="font-bold uppercase tracking-wider text-white text-[11px]">Habilidades</h3>
              {skillCategories.map((cat) => (
                <div key={cat.id}>
                  <p className="font-semibold text-white/90 text-xs mb-1">{cat.categoryName}</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-white/20 text-white font-medium text-[10px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="space-y-3 border-t border-white/20 pt-4 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-white text-[11px]">Educación</h3>
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-white">{edu.degree}</p>
                  <p className="text-white/80">{edu.institution}</p>
                  <p className="text-white/60 text-[11px]">{edu.startDate} – {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Right Main Body */}
        <main className="md:col-span-8 p-6 sm:p-8 space-y-6">
          {/* Summary */}
          {summary && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                Sobre Mí
              </h2>
              <p className="text-slate-700 leading-normal">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                Experiencia Profesional
              </h2>
              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: primary }}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-slate-900 text-sm">{exp.title}</h3>
                      <span className="text-xs font-semibold text-slate-500">
                        {exp.startDate} – {exp.current ? "Presente" : exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">{exp.company}</p>
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

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primary }} />
                Proyectos Creativos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 text-xs">{p.title}</h3>
                    <p className="text-slate-600 text-xs mt-1">{p.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
