import React from "react";
import { CvData, CvThemeSettings } from "../../types";
import { Mail, Phone, MapPin, Calendar, FileCheck, UserCheck } from "lucide-react";
import { CvPhoto } from "../CvPhoto";

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

export const ClasicoV1Template: React.FC<Props> = ({ data, theme }) => {
  const { personalInfo, summary, experience, education, skillCategories, references, certifications } = data;
  const primaryColor = theme.primaryColor || "#2c3e50";
  const secondaryColor = "#7b8a9a";

  return (
    <div className="viewer clasico-v1 w-full min-h-[297mm] bg-white flex text-slate-800 font-sans leading-relaxed text-xs">
      {/* Left Column (25%) */}
      <div
        className="w-[28%] shrink-0 p-5 text-slate-100 flex flex-col gap-5 print:p-4"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Profile Photo */}
        {personalInfo.showPhoto && personalInfo.photoUrl && (
          <div className="flex justify-center my-2">
            <CvPhoto
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
        )}

        {/* INFORMACIÓN / DOCUMENTACIÓN */}
        <div className="space-y-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
            style={{ borderColor: secondaryColor }}
          >
            INFORMACIÓN
          </h3>

          <div className="space-y-2 text-[11px] text-slate-200">
            {personalInfo.birthDate && (
              <div className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: secondaryColor }} />
                <span>Nacimiento: {personalInfo.birthDate}</span>
              </div>
            )}

            {personalInfo.documentation && personalInfo.documentation.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <FileCheck className="w-3.5 h-3.5 shrink-0" style={{ color: secondaryColor }} />
                  <span>Documentación:</span>
                </div>
                <ul className="pl-5 space-y-0.5 list-disc text-[10.5px] text-slate-200">
                  {personalInfo.documentation.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* CONTACTO */}
        <div className="space-y-3">
          <h3
            className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
            style={{ borderColor: secondaryColor }}
          >
            CONTACTO
          </h3>

          <div className="space-y-2 text-[11px] text-slate-200">
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: secondaryColor }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}

            {personalInfo.email && (
              <div className="flex items-center gap-2 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: secondaryColor }} />
                <span>{personalInfo.email}</span>
              </div>
            )}

            {personalInfo.location && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: secondaryColor }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* REFERENCIAS LABORALES */}
        {references && references.length > 0 && (
          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
              style={{ borderColor: secondaryColor }}
            >
              REFERENCIAS
            </h3>

            <div className="space-y-3 text-[11px]">
              {references.map((ref) => (
                <div key={ref.id} className="space-y-0.5">
                  <p className="font-bold text-white text-xs">{ref.name}</p>
                  <p className="text-slate-300">
                    {ref.role} - <span className="font-semibold text-white">{ref.company}</span>
                  </p>
                  <p className="text-slate-300 font-mono">Tel: {ref.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (72%) */}
      <div className="flex-1 p-8 space-y-6 bg-white print:p-6">
        {/* Main Header */}
        <div className="border-b-3 pb-3" style={{ borderColor: primaryColor }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase" style={{ color: primaryColor }}>
            {personalInfo.fullName || "Nombre Completo"}
          </h1>
          <h2 className="text-sm sm:text-base font-semibold text-slate-500 uppercase tracking-wide mt-0.5">
            {personalInfo.title || "Agente Comercial"}
          </h2>
        </div>

        {/* Resumen Profesional */}
        {summary && (
          <div className="space-y-2">
            <h3
              className="text-xs font-bold uppercase tracking-wider border-b pb-1"
              style={{ color: primaryColor, borderColor: secondaryColor }}
            >
              PERFIL PROFESIONAL
            </h3>
            <p className="text-slate-700 leading-relaxed text-[11.5px] text-justify">{summary}</p>
          </div>
        )}

        {/* Experiencia Laboral */}
        {experience && experience.length > 0 && (
          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider border-b pb-1"
              style={{ color: primaryColor, borderColor: secondaryColor }}
            >
              EXPERIENCIA LABORAL
            </h3>

            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bold text-xs" style={{ color: primaryColor }}>
                      {exp.title} — <span className="font-extrabold text-slate-800">{exp.company}</span>
                    </span>
                    <span className="text-[10.5px] italic text-slate-500 font-medium shrink-0">
                      {exp.startDate} – {exp.current ? "Actualidad" : exp.endDate}
                    </span>
                  </div>

                  {exp.location && <p className="text-[10.5px] italic text-slate-500">{exp.location}</p>}

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 text-[11px] leading-snug">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educación */}
        {education && education.length > 0 && (
          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider border-b pb-1"
              style={{ color: primaryColor, borderColor: secondaryColor }}
            >
              EDUCACIÓN & FORMACIÓN
            </h3>

            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{edu.degree}</h4>
                    <p className="text-slate-600 font-medium text-[11px]">{edu.institution}</p>
                    {edu.highlights && <p className="text-[10.5px] italic text-blue-700 mt-0.5">{edu.highlights}</p>}
                  </div>
                  <span className="text-[10.5px] italic text-slate-500 font-medium shrink-0">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Habilidades */}
        {skillCategories && skillCategories.length > 0 && (
          <div className="space-y-3">
            <h3
              className="text-xs font-bold uppercase tracking-wider border-b pb-1"
              style={{ color: primaryColor, borderColor: secondaryColor }}
            >
              HABILIDADES & COMPETENCIAS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skillCategories.map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">{cat.categoryName}</h4>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[10.5px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
