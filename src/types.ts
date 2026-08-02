export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photoUrl: string;
  showPhoto: boolean;
  birthDate?: string;
  age?: number;
  documentation?: string[];
}

export interface ReferenceItem {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  highlights?: string;
}

export interface SkillCategory {
  id: string;
  categoryName: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  techStack: string[];
  link: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export type CvTemplateId =
  | "clasico-v1"
  | "markdown-template-v1"
  | "modern"
  | "minimal"
  | "executive"
  | "tech"
  | "creative"
  | "elegant";

export type FontFamily = "sans" | "serif" | "mono" | "jakarta";
export type FontSize = "sm" | "md" | "lg";
export type SpacingDensity = "compact" | "comfortable" | "spacious";

export interface CvThemeSettings {
  templateId: CvTemplateId;
  primaryColor: string;
  fontFamily: FontFamily;
  fontSize: FontSize;
  spacing: SpacingDensity;
  showIcons: boolean;
  sidebarPosition: "left" | "right";
  paperSize: "a4" | "letter";
}

export interface CvData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  references?: ReferenceItem[];
  customSections: CustomSection[];
  sectionOrder: string[];
}

export interface AtsResult {
  score: number;
  strengths: string[];
  missingKeywords: string[];
  formatFeedback: string[];
  quickActionItems: string[];
}

export type AppLanguage = "es" | "en";
