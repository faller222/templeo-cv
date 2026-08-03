import React, { useState } from "react";
import { CvData, AppLanguage } from "../types";
import { PersonalInfoForm } from "./editor/PersonalInfoForm";
import { SummaryForm } from "./editor/SummaryForm";
import { ExperienceForm } from "./editor/ExperienceForm";
import { EducationForm } from "./editor/EducationForm";
import { SkillsForm } from "./editor/SkillsForm";
import { ProjectsForm } from "./editor/ProjectsForm";
import { CertificationsForm } from "./editor/CertificationsForm";
import { CustomSectionsForm } from "./editor/CustomSectionsForm";
import { ReferencesForm } from "./editor/ReferencesForm";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Sparkles,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  data: CvData;
  onChange: (updated: CvData) => void;
  language: AppLanguage;
}

export const FormEditor: React.FC<Props> = ({ data, onChange, language }) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    personal: true,
    summary: true,
    experience: true,
    skills: true,
    education: false,
    projects: false,
    certifications: false,
    custom: false,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const allSkills = data.skillCategories.flatMap((c) => c.skills);

  const sectionsConfig = [
    {
      id: "personal",
      title: language === "es" ? "Datos Personales" : "Personal Information",
      icon: User,
      component: (
        <PersonalInfoForm
          data={data.personalInfo}
          onChange={(personalInfo) => onChange({ ...data, personalInfo })}
        />
      ),
    },
    {
      id: "summary",
      title: language === "es" ? "Resumen profesional (IA)" : "Professional Summary (AI)",
      icon: FileText,
      badge: "IA ✨",
      component: (
        <SummaryForm
          summary={data.summary}
          jobTitle={data.personalInfo.title}
          skills={allSkills}
          onChange={(summary) => onChange({ ...data, summary })}
          language={language}
        />
      ),
    },
    {
      id: "experience",
      title: language === "es" ? "Experiencia Laboral" : "Work Experience",
      icon: Briefcase,
      count: data.experience?.length || 0,
      component: (
        <ExperienceForm
          items={data.experience}
          onChange={(experience) => onChange({ ...data, experience })}
          language={language}
        />
      ),
    },
    {
      id: "skills",
      title: language === "es" ? "Habilidades & Competencias" : "Skills & Competencies",
      icon: Code2,
      count: allSkills.length,
      component: (
        <SkillsForm
          categories={data.skillCategories}
          onChange={(skillCategories) => onChange({ ...data, skillCategories })}
        />
      ),
    },
    {
      id: "education",
      title: language === "es" ? "Educación & Formación" : "Education",
      icon: GraduationCap,
      count: data.education?.length || 0,
      component: (
        <EducationForm
          items={data.education}
          onChange={(education) => onChange({ ...data, education })}
        />
      ),
    },
    {
      id: "projects",
      title: language === "es" ? "Proyectos Destacados" : "Key Projects",
      icon: FolderGit2,
      count: data.projects?.length || 0,
      component: (
        <ProjectsForm
          items={data.projects}
          onChange={(projects) => onChange({ ...data, projects })}
        />
      ),
    },
    {
      id: "certifications",
      title: language === "es" ? "Certificaciones" : "Certifications",
      icon: Award,
      count: data.certifications?.length || 0,
      component: (
        <CertificationsForm
          items={data.certifications}
          onChange={(certifications) => onChange({ ...data, certifications })}
        />
      ),
    },
    {
      id: "references",
      title: language === "es" ? "Referencias Laborales" : "Work References",
      icon: UserCheck,
      count: data.references?.length || 0,
      component: (
        <ReferencesForm
          items={data.references}
          onChange={(references) => onChange({ ...data, references })}
        />
      ),
    },
    {
      id: "custom",
      title: language === "es" ? "Secciones Personalizadas" : "Custom Sections",
      icon: Sparkles,
      count: data.customSections?.length || 0,
      component: (
        <CustomSectionsForm
          sections={data.customSections}
          onChange={(customSections) => onChange({ ...data, customSections })}
        />
      ),
    },
  ];

  return (
    <div className="space-y-3 pb-8">
      {sectionsConfig.map((sec) => {
        const Icon = sec.icon;
        const isOpen = openSections[sec.id];

        return (
          <div
            key={sec.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-all"
          >
            {/* Accordion Header */}
            <button
              type="button"
              onClick={() => toggleSection(sec.id)}
              className="w-full px-4 py-3 bg-slate-50/80 hover:bg-slate-100 flex items-center justify-between transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">{sec.title}</span>
                {sec.badge && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-extrabold">
                    {sec.badge}
                  </span>
                )}
                {typeof sec.count === "number" && sec.count > 0 && (
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
                    {sec.count}
                  </span>
                )}
              </div>

              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Accordion Content */}
            {isOpen && <div className="p-4 border-t border-slate-100">{sec.component}</div>}
          </div>
        );
      })}
    </div>
  );
};
