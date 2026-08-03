import { CvData, DEFAULT_SECTION_ORDER, emptyCvData } from "../types";

/** Garantiza campos nuevos en perfiles/CVs legacy. */
export function normalizeCvData(raw: Partial<CvData> | null | undefined): CvData {
  const base = emptyCvData();
  if (!raw) return base;

  return {
    ...base,
    ...raw,
    personalInfo: { ...base.personalInfo, ...(raw.personalInfo || {}) },
    summary: raw.summary ?? "",
    experience: raw.experience ?? [],
    education: raw.education ?? [],
    skillCategories: raw.skillCategories ?? [],
    projects: raw.projects ?? [],
    certifications: raw.certifications ?? [],
    languages: raw.languages ?? [],
    courses: raw.courses ?? [],
    publications: raw.publications ?? [],
    awards: raw.awards ?? [],
    achievements: raw.achievements ?? [],
    links: raw.links ?? [],
    portfolio: raw.portfolio ?? [],
    references: raw.references ?? [],
    customSections: raw.customSections ?? [],
    sectionOrder:
      raw.sectionOrder?.length ? raw.sectionOrder : [...DEFAULT_SECTION_ORDER],
  };
}
