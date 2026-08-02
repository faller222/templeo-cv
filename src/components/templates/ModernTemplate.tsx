import React from "react";
import { CvData, CvThemeSettings } from "../../types";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  FolderGit2,
  Sparkles,
} from "lucide-react";

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

export const ModernTemplate: React.FC<Props> = ({ data, theme }) => {
  const { personalInfo, summary, experience, education, skillCategories, projects, certifications, customSections, sectionOrder } = data;
  const primary = theme.primaryColor;

  // Font styling class mapping
  const fontClass =
    theme.fontFamily === "serif"
      ? "font-serif"
      : theme.fontFamily === "mono"
      ? "font-mono"
      : "font-sans";

  return (
    <div
      className={`w-full h-full bg-white text-slate-800 ${fontClass} leading-relaxed p-8 sm:p-10 text-[13px] print:p-8 print:text-[12px] shadow-sm border border-slate-100 rounded-sm`}
      style={{
        fontSize: theme.fontSize === "sm" ? "12px" : theme.fontSize === "lg" ? "14px" : "13px",
      }}
    >
      {/* Header */}
      <header className="border-b border-slate-200 pb-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {personalInfo.showPhoto && personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 shadow-sm shrink-0"
              style={{ borderColor: primary }}
            />
          )}

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1">
              {personalInfo.fullName || "Tu Nombre"}
            </h1>
            <p className="text-base font-semibold mb-3" style={{ color: primary }}>
              {personalInfo.title || "Tu Título Profesional"}
            </p>

            {/* Contact Info Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-600">
              {personalInfo.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.website && (
                <span className="inline-flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  {personalInfo.website.replace(/^https?:\/\//, "")}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="inline-flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  {personalInfo.linkedin.replace(/^https?:\/\//, "")}
                </span>
              )}
              {personalInfo.github && (
                <span className="inline-flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  {personalInfo.github.replace(/^https?:\/\//, "")}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column (Main content or Sidebar depending on user preference) */}
        <div className="md:col-span-8 space-y-6">
          {/* Summary */}
          {summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primary }} />
                Perfil Profesional
              </h2>
              <p className="text-slate-700 leading-normal whitespace-pre-line">{summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" style={{ color: primary }} />
                Experiencia Laboral
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                      <div>
                        <h3 className="font-bold text-slate-900">{exp.title}</h3>
                        <span className="font-medium text-slate-700 text-xs">{exp.company}</span>
                        {exp.location && <span className="text-slate-500 text-xs ml-2">• {exp.location}</span>}
                      </div>
                      <span className="text-xs font-semibold text-slate-500 shrink-0 mt-0.5 sm:mt-0">
                        {exp.startDate} – {exp.current ? "Presente" : exp.endDate}
                      </span>
                    </div>

                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" style={{ color: primary }} />
                Proyectos Destacados
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex items-baseline justify-between mb-0.5">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        {proj.title}
                        {proj.role && <span className="text-xs font-normal text-slate-500">({proj.role})</span>}
                      </h3>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium hover:underline shrink-0"
                          style={{ color: primary }}
                        >
                          Ver enlace
                        </a>
                      )}
                    </div>
                    {proj.description && <p className="text-slate-700 text-xs mb-1">{proj.description}</p>}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="md:col-span-4 space-y-6">
          {/* Skills */}
          {skillCategories && skillCategories.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" style={{ color: primary }} />
                Habilidades
              </h2>
              <div className="space-y-3">
                {skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <h4 className="font-semibold text-slate-800 text-xs mb-1.5">{cat.categoryName}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-xs font-medium rounded-md border border-slate-200 bg-slate-50 text-slate-700"
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

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" style={{ color: primary }} />
                Educación
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                    <p className="text-slate-700 text-xs">{edu.institution}</p>
                    <p className="text-slate-500 text-[11px]">
                      {edu.startDate} – {edu.current ? "Presente" : edu.endDate}
                    </p>
                    {edu.gpa && <p className="text-slate-600 text-[11px] font-medium mt-0.5">{edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: primary }} />
                Certificaciones
              </h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-bold text-slate-900 text-xs">{cert.title}</h3>
                    <p className="text-slate-600 text-[11px]">
                      {cert.issuer} ({cert.date})
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {customSections && customSections.length > 0 && (
            <>
              {customSections.map((cs) => (
                <section key={cs.id}>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: primary }} />
                    {cs.sectionTitle}
                  </h2>
                  <div className="space-y-2">
                    {cs.items.map((item) => (
                      <div key={item.id}>
                        <h3 className="font-bold text-slate-900 text-xs">{item.title}</h3>
                        {item.subtitle && <p className="text-slate-700 text-xs">{item.subtitle}</p>}
                        {item.date && <p className="text-slate-500 text-[11px]">{item.date}</p>}
                        {item.description && <p className="text-slate-600 text-xs mt-0.5">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
