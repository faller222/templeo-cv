import React from "react";
import { CvData, CvThemeSettings } from "../../types";
import { CvPhoto } from "../CvPhoto";

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

export const TechTemplate: React.FC<Props> = ({ data, theme }) => {
  const { personalInfo, summary, experience, education, skillCategories, projects, certifications } = data;
  const primary = theme.primaryColor;

  return (
    <div className="w-full h-full bg-slate-50 text-slate-900 font-mono leading-relaxed p-8 sm:p-10 text-[12px] print:p-8 print:text-[11px] rounded-sm border border-slate-200">
      {/* Code style Header */}
      <header className="bg-slate-900 text-slate-100 p-6 rounded-lg mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-emerald-400 font-mono text-xs mb-1">// Developer Resume</div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">
              {personalInfo.fullName || "Tu Nombre"}
            </h1>
            <p className="text-sm font-medium text-slate-300">
              {personalInfo.title}
            </p>
          </div>

          {personalInfo.showPhoto && personalInfo.photoUrl && (
            <CvPhoto
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-20 h-20 rounded-md border border-slate-700 object-cover shrink-0"
            />
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
          {personalInfo.email && <span>email: {personalInfo.email}</span>}
          {personalInfo.github && <span className="text-emerald-400">github: {personalInfo.github.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.website && <span>web: {personalInfo.website.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.location && <span>loc: {personalInfo.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6 bg-white p-4 rounded border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            /* README.md */
          </h2>
          <p className="text-slate-800 font-sans leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Tech Stack Grid */}
      {skillCategories && skillCategories.length > 0 && (
        <section className="mb-6 bg-white p-4 rounded border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <span className="text-emerald-600 font-mono">&gt;</span> Skills & Tech Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skillCategories.map((cat) => (
              <div key={cat.id}>
                <div className="font-bold text-slate-700 mb-1">{cat.categoryName}</div>
                <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                  {cat.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 font-medium border border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6 bg-white p-4 rounded border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-emerald-600 font-mono">&gt;</span> Work History
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-2 pl-3 border-slate-300">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="font-bold text-slate-900">{exp.title}</h3>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {exp.startDate} ~ {exp.current ? "PRESENT" : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-bold mb-1.5" style={{ color: primary }}>
                  @{exp.company}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 font-sans">
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

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6 bg-white p-4 rounded border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <span className="text-emerald-600 font-mono">&gt;</span> Featured Repos / Projects
          </h2>
          <div className="space-y-3 font-sans">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-slate-900 font-mono">{proj.title}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs font-mono text-emerald-600 underline">
                      view repo
                    </a>
                  )}
                </div>
                <p className="text-slate-700 text-xs mb-2">{proj.description}</p>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                    {proj.techStack.map((tech, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded">
                        #{tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certs */}
      {education && education.length > 0 && (
        <section className="bg-white p-4 rounded border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 font-mono">
            // Education
          </h2>
          <div className="space-y-2 font-sans">
            {education.map((e) => (
              <div key={e.id} className="flex justify-between items-baseline">
                <div>
                  <strong className="font-bold text-slate-900">{e.degree}</strong>
                  <p className="text-slate-600">{e.institution}</p>
                </div>
                <span className="text-slate-500 font-mono text-xs">{e.startDate} - {e.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
