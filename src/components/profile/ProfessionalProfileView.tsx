import React, { useMemo, useState } from "react";
import type { AppLanguage, MasterProfile } from "../../types";
import {
  computeProfileCompleteness,
  type ProfileModuleId,
} from "../../lib/profileCompleteness";
import { PersonalInfoForm } from "../editor/PersonalInfoForm";
import { SummaryForm } from "../editor/SummaryForm";
import { ExperienceForm } from "../editor/ExperienceForm";
import { EducationForm } from "../editor/EducationForm";
import { SkillsForm } from "../editor/SkillsForm";
import { ProjectsForm } from "../editor/ProjectsForm";
import { CertificationsForm } from "../editor/CertificationsForm";
import { LanguagesForm } from "../editor/LanguagesForm";
import { CoursesForm } from "../editor/CoursesForm";
import { PublicationsForm } from "../editor/PublicationsForm";
import { AwardsForm } from "../editor/AwardsForm";
import { AchievementsForm } from "../editor/AchievementsForm";
import { LinksForm } from "../editor/LinksForm";
import { PortfolioForm } from "../editor/PortfolioForm";
import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  Code2,
  FileText,
  FolderGit2,
  Globe2,
  GraduationCap,
  Languages,
  Link2,
  Medal,
  Sparkles,
  Trophy,
  User,
  LayoutGrid,
} from "lucide-react";

interface Props {
  profile: MasterProfile;
  onChange: (updated: MasterProfile) => void;
  language: AppLanguage;
  locked?: boolean;
  onRequireAuth?: () => void;
  onGenerateCv?: () => void;
}

const ICONS: Record<ProfileModuleId, React.ElementType> = {
  personal: User,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  certifications: Award,
  courses: BookOpen,
  skills: Code2,
  languages: Languages,
  projects: FolderGit2,
  publications: BookOpen,
  awards: Trophy,
  achievements: Medal,
  links: Link2,
  portfolio: LayoutGrid,
};

export const ProfessionalProfileView: React.FC<Props> = ({
  profile,
  onChange,
  language,
  locked,
  onRequireAuth,
  onGenerateCv,
}) => {
  const completeness = useMemo(
    () => computeProfileCompleteness(profile),
    [profile]
  );
  const [active, setActive] = useState<ProfileModuleId>("personal");

  const allSkills = profile.skillCategories.flatMap((c) => c.skills);
  const missingLabels = completeness.missing
    .slice(0, 4)
    .map((m) => m.label);

  const content: Record<ProfileModuleId, React.ReactNode> = {
    personal: (
      <PersonalInfoForm
        data={profile.personalInfo}
        onChange={(personalInfo) => onChange({ ...profile, personalInfo })}
      />
    ),
    summary: (
      <div className="space-y-3">
        <p className="text-xs text-slate-500 leading-relaxed">
          Tu narrativa profesional completa. Los CVs tomarán versiones más
          cortas o adaptadas según cada oferta.
        </p>
        <SummaryForm
          summary={profile.summary}
          jobTitle={profile.personalInfo.title}
          skills={allSkills}
          onChange={(summary) => onChange({ ...profile, summary })}
          language={language}
        />
      </div>
    ),
    experience: (
      <ExperienceForm
        items={profile.experience}
        onChange={(experience) => onChange({ ...profile, experience })}
        language={language}
      />
    ),
    education: (
      <EducationForm
        items={profile.education}
        onChange={(education) => onChange({ ...profile, education })}
      />
    ),
    certifications: (
      <CertificationsForm
        items={profile.certifications}
        onChange={(certifications) => onChange({ ...profile, certifications })}
      />
    ),
    courses: (
      <CoursesForm
        items={profile.courses}
        onChange={(courses) => onChange({ ...profile, courses })}
      />
    ),
    skills: (
      <SkillsForm
        categories={profile.skillCategories}
        onChange={(skillCategories) =>
          onChange({ ...profile, skillCategories })
        }
      />
    ),
    languages: (
      <LanguagesForm
        items={profile.languages}
        onChange={(languages) => onChange({ ...profile, languages })}
      />
    ),
    projects: (
      <ProjectsForm
        items={profile.projects}
        onChange={(projects) => onChange({ ...profile, projects })}
      />
    ),
    publications: (
      <PublicationsForm
        items={profile.publications}
        onChange={(publications) => onChange({ ...profile, publications })}
      />
    ),
    awards: (
      <AwardsForm
        items={profile.awards}
        onChange={(awards) => onChange({ ...profile, awards })}
      />
    ),
    achievements: (
      <AchievementsForm
        items={profile.achievements}
        onChange={(achievements) => onChange({ ...profile, achievements })}
      />
    ),
    links: (
      <LinksForm
        items={profile.links}
        onChange={(links) => onChange({ ...profile, links })}
      />
    ),
    portfolio: (
      <PortfolioForm
        items={profile.portfolio}
        onChange={(portfolio) => onChange({ ...profile, portfolio })}
      />
    ),
  };

  const activeModule = completeness.modules.find((m) => m.id === active);

  return (
    <div className="h-full min-h-0 flex flex-col bg-[radial-gradient(ellipse_at_top,_#f8fafc_0%,_#eef2ff_45%,_#f1f5f9_100%)]">
      <div className="shrink-0 px-4 sm:px-6 pt-5 pb-4 border-b border-slate-200/80 bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Fuente única de tu carrera
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Mi Perfil Profesional
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Completalo una sola vez. Después generá versiones optimizadas de
              tu CV para cada oportunidad en segundos.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-64">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">
                {completeness.percent}% completo
              </span>
              {completeness.isUsable ? (
                <span className="text-[10px] font-bold text-emerald-700">
                  Listo para generar CVs
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700">
                  Seguí completando
                </span>
              )}
            </div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                style={{ width: `${completeness.percent}%` }}
              />
            </div>
            {missingLabels.length > 0 && (
              <p className="text-[11px] text-slate-500 mt-2">
                Faltan: {missingLabels.join(" · ")}
                {completeness.missing.length > 4
                  ? ` +${completeness.missing.length - 4}`
                  : ""}
              </p>
            )}
          </div>
        </div>

        {completeness.isUsable && onGenerateCv && (
          <div className="max-w-6xl mx-auto mt-4">
            <button
              type="button"
              onClick={() => {
                if (locked) {
                  onRequireAuth?.();
                  return;
                }
                onGenerateCv();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Generar mi primer CV
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 max-w-6xl w-full mx-auto flex gap-0 sm:gap-4 px-0 sm:px-6 py-0 sm:py-4">
        <aside className="w-[220px] shrink-0 hidden md:flex flex-col border border-slate-200 rounded-2xl bg-white/90 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Módulos
          </div>
          <nav className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {completeness.modules.map((mod) => {
              const Icon = ICONS[mod.id];
              const isActive = active === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActive(mod.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      mod.done
                        ? isActive
                          ? "bg-emerald-400/20 text-emerald-300"
                          : "bg-emerald-50 text-emerald-600"
                        : isActive
                          ? "bg-white/10 text-slate-300"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {mod.done ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Icon className="w-3 h-3" />
                    )}
                  </span>
                  <span className="font-semibold truncate">{mod.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile module chips */}
        <div className="md:hidden shrink-0 w-full absolute left-0 right-0 top-auto" />

        <section className="flex-1 min-w-0 min-h-0 flex flex-col bg-white sm:rounded-2xl border-y sm:border border-slate-200 overflow-hidden">
          <div className="md:hidden shrink-0 overflow-x-auto border-b border-slate-100 px-3 py-2 flex gap-1.5">
            {completeness.modules.map((mod) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActive(mod.id)}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                  active === mod.id
                    ? "bg-slate-900 text-white"
                    : mod.done
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {mod.label}
              </button>
            ))}
          </div>

          <div className="shrink-0 px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {activeModule?.label}
              </h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Globe2 className="w-3 h-3" />
                Esto alimenta todos tus CVs · no es un documento
              </p>
            </div>
            {activeModule?.done && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                Completo
              </span>
            )}
          </div>

          <div className="relative flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
            <div
              className={
                locked ? "pointer-events-none select-none opacity-90" : undefined
              }
            >
              {content[active]}
            </div>
            {locked && (
              <button
                type="button"
                aria-label="Iniciar sesión para editar el perfil"
                onClick={() => onRequireAuth?.()}
                className="absolute inset-0 z-10 cursor-pointer border-0 bg-transparent"
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
