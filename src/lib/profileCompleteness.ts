import type { CvData, MasterProfile } from "../types";

export type ProfileModuleId =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "certifications"
  | "courses"
  | "skills"
  | "languages"
  | "projects"
  | "publications"
  | "awards"
  | "achievements"
  | "links"
  | "portfolio";

export type ProfileModule = {
  id: ProfileModuleId;
  label: string;
  tier: "critical" | "important" | "bonus";
  weight: number;
  done: boolean;
};

const WEIGHTS = {
  critical: 70,
  important: 20,
  bonus: 10,
} as const;

function personalDone(data: CvData): boolean {
  const p = data.personalInfo;
  return Boolean(
    p.fullName?.trim() &&
      p.email?.trim() &&
      (p.title?.trim() || p.phone?.trim() || p.location?.trim())
  );
}

function moduleDone(id: ProfileModuleId, data: CvData): boolean {
  switch (id) {
    case "personal":
      return personalDone(data);
    case "summary":
      return (data.summary?.trim().length || 0) >= 40;
    case "experience":
      return (data.experience?.length || 0) > 0;
    case "education":
      return (data.education?.length || 0) > 0;
    case "certifications":
      return (data.certifications?.length || 0) > 0;
    case "courses":
      return (data.courses?.length || 0) > 0;
    case "skills":
      return data.skillCategories.some((c) => c.skills.length > 0);
    case "languages":
      return (data.languages?.length || 0) > 0;
    case "projects":
      return (data.projects?.length || 0) > 0;
    case "publications":
      return (data.publications?.length || 0) > 0;
    case "awards":
      return (data.awards?.length || 0) > 0;
    case "achievements":
      return (data.achievements?.length || 0) > 0;
    case "links":
      return (
        (data.links?.length || 0) > 0 ||
        Boolean(data.personalInfo.linkedin?.trim()) ||
        Boolean(data.personalInfo.github?.trim()) ||
        Boolean(data.personalInfo.website?.trim())
      );
    case "portfolio":
      return (data.portfolio?.length || 0) > 0;
  }
}

const MODULE_DEFS: Omit<ProfileModule, "done">[] = [
  { id: "personal", label: "Datos personales", tier: "critical", weight: 0 },
  { id: "summary", label: "Resumen profesional", tier: "critical", weight: 0 },
  { id: "experience", label: "Experiencia laboral", tier: "critical", weight: 0 },
  { id: "skills", label: "Habilidades", tier: "critical", weight: 0 },
  { id: "education", label: "Educación", tier: "important", weight: 0 },
  { id: "languages", label: "Idiomas", tier: "important", weight: 0 },
  { id: "certifications", label: "Certificaciones", tier: "important", weight: 0 },
  { id: "projects", label: "Proyectos", tier: "bonus", weight: 0 },
  { id: "courses", label: "Cursos", tier: "bonus", weight: 0 },
  { id: "publications", label: "Publicaciones", tier: "bonus", weight: 0 },
  { id: "awards", label: "Premios", tier: "bonus", weight: 0 },
  { id: "achievements", label: "Logros", tier: "bonus", weight: 0 },
  { id: "links", label: "Links", tier: "bonus", weight: 0 },
  { id: "portfolio", label: "Portafolio", tier: "bonus", weight: 0 },
];

function distributeWeights(): ProfileModule[] {
  const byTier = {
    critical: MODULE_DEFS.filter((m) => m.tier === "critical"),
    important: MODULE_DEFS.filter((m) => m.tier === "important"),
    bonus: MODULE_DEFS.filter((m) => m.tier === "bonus"),
  };

  return MODULE_DEFS.map((m) => {
    const peers = byTier[m.tier];
    return { ...m, weight: WEIGHTS[m.tier] / peers.length, done: false };
  });
}

export type ProfileCompleteness = {
  percent: number;
  modules: ProfileModule[];
  missing: ProfileModule[];
  criticalDone: boolean;
  isUsable: boolean;
};

/** Umbral para permitir generar CVs con confianza. */
export const PROFILE_USABLE_THRESHOLD = 60;

export function computeProfileCompleteness(
  profile: MasterProfile
): ProfileCompleteness {
  const modules = distributeWeights().map((m) => ({
    ...m,
    done: moduleDone(m.id, profile),
  }));

  const percent = Math.round(
    modules.reduce((sum, m) => sum + (m.done ? m.weight : 0), 0)
  );

  const criticalDone = modules
    .filter((m) => m.tier === "critical")
    .every((m) => m.done);

  const missing = modules.filter((m) => !m.done);

  return {
    percent: Math.min(100, percent),
    modules,
    missing,
    criticalDone,
    isUsable: percent >= PROFILE_USABLE_THRESHOLD && criticalDone,
  };
}
