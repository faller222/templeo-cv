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

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface CourseItem {
  id: string;
  title: string;
  institution: string;
  date: string;
  url?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date?: string;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  url: string;
  techStack?: string[];
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
  languages: LanguageItem[];
  courses: CourseItem[];
  publications: PublicationItem[];
  awards: AwardItem[];
  achievements: AchievementItem[];
  links: LinkItem[];
  portfolio: PortfolioItem[];
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

/** Fuente de verdad del usuario — máxima transparencia para la IA */
export type MasterProfile = CvData;

export type AppView = "profile" | "cvs" | "editor";

export interface UserEconomy {
  creditosIa: number;
  ultimaRecarga: number | null;
}

export interface UserDoc {
  profile: MasterProfile;
  economy: UserEconomy;
  createdAt: number;
  updatedAt: number;
}

/** Proyección de CV para un puesto/template concreto */
export interface CvInstance {
  id: string;
  userId: string;
  title: string;
  sourceJobHint?: string;
  templateId: CvTemplateId;
  data: CvData;
  theme: CvThemeSettings;
  clonedFrom?: string | null;
  /** Timestamp del perfil al momento de crear/sincronizar este CV */
  basedOnProfileAt?: number;
  atsScore?: number | null;
  createdAt: number;
  updatedAt: number;
}

export const DEFAULT_ECONOMY: UserEconomy = {
  creditosIa: 5,
  ultimaRecarga: null,
};

export const DEFAULT_SECTION_ORDER = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "courses",
  "publications",
  "awards",
  "achievements",
  "links",
  "portfolio",
  "references",
  "custom",
];

export const emptyCvData = (): CvData => ({
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    photoUrl: "",
    showPhoto: false,
  },
  summary: "",
  experience: [],
  education: [],
  skillCategories: [],
  projects: [],
  certifications: [],
  languages: [],
  courses: [],
  publications: [],
  awards: [],
  achievements: [],
  links: [],
  portfolio: [],
  references: [],
  customSections: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
});
