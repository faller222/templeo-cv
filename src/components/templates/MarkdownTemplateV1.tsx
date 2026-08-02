import React from "react";
import { CvData, CvThemeSettings } from "../../types";

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

export const MarkdownTemplateV1: React.FC<Props> = ({ data, theme }) => {
  const { personalInfo, summary, experience, education, skillCategories, certifications, references } = data;

  return (
    <article className="md-cv w-full max-w-[800px] mx-auto p-[0.5in_0.65in] bg-white text-black font-sans text-[11px] leading-[1.5] box-border">
      {/* Header */}
      <header className="mb-3">
        <h1 className="text-[26px] font-bold uppercase tracking-tight leading-tight m-0 text-black">
          {personalInfo.fullName || "FULL NAME"}
        </h1>
        <p className="text-[18px] font-semibold text-slate-800 mt-1 mb-2">
          {personalInfo.title || "Agente Comercial / Professional"}
        </p>

        {/* Contact info plain lines */}
        <div className="text-[11px] space-y-0.5 text-slate-700">
          {personalInfo.location && <p className="m-0">📍 {personalInfo.location}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.email && <span>✉️ {personalInfo.email}</span>}
            {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          </div>
          {personalInfo.documentation && personalInfo.documentation.length > 0 && (
            <p className="m-0 font-medium text-slate-800 pt-0.5">
              📄 {personalInfo.documentation.join(" | ")}
            </p>
          )}
        </div>
      </header>

      <hr className="h-[1px] bg-slate-300 border-0 my-4" />

      {/* Professional Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-[15px] font-bold uppercase tracking-wide text-black mb-2">PROFESSIONAL SUMMARY</h2>
          <p className="m-0 text-[11px] leading-relaxed text-slate-800 text-justify">{summary}</p>
        </section>
      )}

      {summary && <hr className="h-[1px] bg-slate-300 border-0 my-4" />}

      {/* Skills */}
      {skillCategories && skillCategories.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[15px] font-bold uppercase tracking-wide text-black mb-2">TECHNICAL & PROFESSIONAL SKILLS</h2>
          <div className="space-y-2">
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-[12px] font-semibold text-slate-900 mt-2 mb-1">{cat.categoryName}</h3>
                <ul className="list-disc pl-5 m-0 space-y-0.5">
                  {cat.skills.map((skill, idx) => (
                    <li key={idx} className="text-[11px] text-slate-800">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {skillCategories && skillCategories.length > 0 && <hr className="h-[1px] bg-slate-300 border-0 my-4" />}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[15px] font-bold uppercase tracking-wide text-black mb-3">PROFESSIONAL EXPERIENCE</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[13px] font-bold text-black m-0">
                    {exp.title} — <span className="font-semibold text-slate-900">{exp.company}</span>
                  </h3>
                  <span className="text-[11px] font-medium text-slate-600">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.location && <p className="text-[11px] italic text-slate-600 m-0">{exp.location}</p>}

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc pl-5 m-0 mt-1 space-y-1">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="text-[11px] text-slate-800 leading-snug">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {experience && experience.length > 0 && <hr className="h-[1px] bg-slate-300 border-0 my-4" />}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[15px] font-bold uppercase tracking-wide text-black mb-2">EDUCATION</h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="text-[12px] font-semibold text-black m-0">{edu.degree}</h3>
                  <p className="text-[11px] text-slate-700 m-0">{edu.institution}</p>
                  {edu.highlights && <p className="text-[10.5px] italic text-slate-500 m-0">{edu.highlights}</p>}
                </div>
                <span className="text-[11px] font-medium text-slate-600">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications / References if present */}
      {((certifications && certifications.length > 0) || (references && references.length > 0)) && (
        <>
          <hr className="h-[1px] bg-slate-300 border-0 my-4" />
          <section className="mb-4">
            <h2 className="text-[15px] font-bold uppercase tracking-wide text-black mb-2">
              CERTIFICATIONS & REFERENCES
            </h2>
            {certifications && certifications.length > 0 && (
              <ul className="list-disc pl-5 m-0 space-y-1 mb-3">
                {certifications.map((c) => (
                  <li key={c.id} className="text-[11px] text-slate-800">
                    <span className="font-semibold">{c.title}</span> — {c.issuer} ({c.date})
                  </li>
                ))}
              </ul>
            )}

            {references && references.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {references.map((r) => (
                  <div key={r.id} className="text-[11px]">
                    <span className="font-bold text-black">{r.name}</span> ({r.role} @ {r.company}) — Tel: {r.phone}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </article>
  );
};
