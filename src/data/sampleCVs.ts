import { CvData, CvThemeSettings } from "../types";

export const defaultThemeSettings: CvThemeSettings = {
  templateId: "clasico-v1",
  primaryColor: "#2c3e50",
  fontFamily: "sans",
  fontSize: "md",
  spacing: "comfortable",
  showIcons: true,
  sidebarPosition: "left",
  paperSize: "a4",
};

/** Detecta PII legacy de Lenise en estado local (migración fuera del cliente). */
export function containsLegacyLenisePii(data: {
  personalInfo?: { email?: string; fullName?: string };
}): boolean {
  const email = (data.personalInfo?.email || "").toLowerCase();
  const name = (data.personalInfo?.fullName || "").toLowerCase();
  return (
    email.includes("lenylara1@hotmail.com") ||
    name.includes("lenise nocetti")
  );
}

export const sampleCvSpanish: CvData = {
  personalInfo: {
    fullName: "Mateo Fernández",
    title: "Ingeniero de Software Senior & Arquitecto Full-Stack",
    email: "mateo.fernandez@email.com",
    phone: "+54 9 11 5821-4902",
    location: "Buenos Aires, Argentina (Remoto)",
    website: "https://mateofernandez.dev",
    linkedin: "linkedin.com/in/mateofernandez-dev",
    github: "github.com/mfernandez-code",
    photoUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    showPhoto: true,
  },
  summary:
    "Ingeniero de Software con más de 7 años de experiencia diseñando e implementando sistemas distribuidos escalables en la nube, aplicaciones web de alto rendimiento y microservicios. Especializado en React, TypeScript, Node.js y arquitectura Cloud (GCP / AWS). Liderazgo probado de equipos ágiles multidisciplinarios e impulso constante de mejores prácticas de DevOps y testing automático.",
  experience: [
    {
      id: "exp-1",
      title: "Senior Full-Stack Engineer & Tech Lead",
      company: "MercadoTech Global",
      location: "Buenos Aires, Argentina",
      startDate: "Mar 2022",
      endDate: "Presente",
      current: true,
      bullets: [
        "Lideré el rediseño de la plataforma de pagos procesando más de $15M USD mensuales, reduciendo la latencia de respuesta en un 42%.",
        "Diseñé una arquitectura basada en microservicios con Node.js, Express y Google Cloud Run, alcanzando un uptime del 99.98%.",
        "Mentorée a un equipo de 6 desarrolladores frontend y backend, implementando revisiones de código rigurosas y pipelines CI/CD automatizados con GitHub Actions.",
        "Integré modelos de IA generativa para la clasificación automática de reclamos de soporte, disminuyendo los tiempos de resolución en un 35%.",
      ],
    },
    {
      id: "exp-2",
      title: "Desarrollador Frontend React",
      company: "Innovatech Solutions",
      location: "Santiago, Chile (Remoto)",
      startDate: "Ene 2019",
      endDate: "Feb 2022",
      current: false,
      bullets: [
        "Construí dashboards analíticos interactivos con React, Redux Toolkit y Recharts utilizados por más de 50,000 usuarios activos diarios.",
        "Optimicé el rendimiento Web Vitals del sitio web principal, incrementando la puntuación de Lighthouse de 64 a 96.",
        "Migré la base de código de JavaScript a TypeScript, reduciendo errores en tiempo de ejecución en un 60%.",
      ],
    },
    {
      id: "exp-3",
      title: "Desarrollador Web Jr",
      company: "Digital Studio BCN",
      location: "Barcelona, España",
      startDate: "Ago 2017",
      endDate: "Dic 2018",
      current: false,
      bullets: [
        "Desarrollé aplicaciones web dinámicas y sitios e-commerce con HTML5, Tailwind CSS y Node.js.",
        "Colaboré estrechamente con diseñadores UX/UI para transformar prototipos de Figma en código reutilizable y accesible.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Licenciatura en Ciencias de la Computación",
      fieldOfStudy: "Sistemas e Inteligencia Artificial",
      institution: "Universidad de Buenos Aires (UBA)",
      location: "Buenos Aires, Argentina",
      startDate: "2013",
      endDate: "2018",
      current: false,
      gpa: "Promedio: 8.9 / 10",
      highlights: "Tesis aprobada con honores: Optimización de algoritmos distribuidos.",
    },
  ],
  skillCategories: [
    {
      id: "skill-1",
      categoryName: "Lenguajes & Frameworks",
      skills: [
        "TypeScript",
        "JavaScript",
        "React.js",
        "Node.js",
        "Express",
        "Python",
        "Tailwind CSS",
        "Next.js",
      ],
    },
    {
      id: "skill-2",
      categoryName: "Cloud, DB & DevOps",
      skills: [
        "PostgreSQL",
        "Firestore",
        "Docker",
        "Google Cloud Platform",
        "AWS",
        "CI/CD",
        "Redis",
        "Git",
      ],
    },
    {
      id: "skill-3",
      categoryName: "Idiomas & Metodologías",
      skills: [
        "Español (Nativo)",
        "Inglés (C1 Avanzado)",
        "Scrum/Agile",
        "Testing (Jest / Playwright)",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "CloudFlow - Gestor de Tareas Colaborativo",
      role: "Creador & Desarrollador Principal",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
      link: "https://github.com/mfernandez-code/cloudflow",
      description:
        "Aplicación en tiempo real para gestión de proyectos ágiles con tableros Kanban, sincronización offline y analíticas de productividad.",
    },
    {
      id: "proj-2",
      title: "AI Resume Scanner & Optimizer",
      role: "Desarrollador Full-Stack",
      techStack: ["Node.js", "Gemini API", "Express", "Vite"],
      link: "https://github.com/mfernandez-code/ai-cv-optimizer",
      description:
        "Herramienta impulsada por IA que analiza CVs en formato PDF contra descripciones de puestos de trabajo para sugerir mejoras ATS.",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      title: "Google Cloud Certified Professional Cloud Architect",
      issuer: "Google Cloud",
      date: "2023",
      url: "https://credential.net/google-cloud-architect",
    },
    {
      id: "cert-2",
      title: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      date: "2021",
    },
  ],
  customSections: [
    {
      id: "custom-1",
      sectionTitle: "Publicaciones & Conferencias",
      items: [
        {
          id: "custom-item-1",
          title: "Ponente en JSConf LATAM 2023",
          subtitle:
            "Conferencia: 'Escalando microfrontends con TypeScript sin perder el juicio'",
          date: "Octubre 2023",
          description:
            "Presentación técnica sobre micro-frontends ante una audiencia de 800+ desarrolladores en Bogotá.",
        },
      ],
    },
  ],
  sectionOrder: [
    "personal",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "custom",
  ],
};

export const sampleCvEnglish: CvData = {
  personalInfo: {
    fullName: "Sarah Jenkins",
    title: "Senior Product Manager & Digital Strategist",
    email: "sarah.jenkins@productlab.io",
    phone: "+1 (555) 392-1049",
    location: "Austin, TX (Open to Remote)",
    website: "https://sarahjenkins.pm",
    linkedin: "linkedin.com/in/sarahjenkins-pm",
    github: "github.com/sjenkins-pm",
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    showPhoto: true,
  },
  summary:
    "Data-driven Senior Product Manager with 6+ years leading cross-functional engineering and design teams in SaaS and FinTech environments. Track record of scaling product adoption from 10k to 500k+ MAU while driving a 35% increase in retention. Expertise in product discovery, user research, OKR alignment, and AI feature integration.",
  experience: [
    {
      id: "exp-1",
      title: "Senior Product Manager",
      company: "FinFlow Technologies",
      location: "Austin, TX",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Spearheaded the launch of FinFlow's automated invoicing suite, generating $2.4M ARR within the first 10 months.",
        "Led product roadmap for a squad of 12 engineers and 2 UX designers using Agile/Scrum methodology.",
        "Increased 30-day user retention by 28% through onboarding stream simplification and targeted micro-surveys.",
        "Leveraged LLMs and Gemini API to automate invoice reconciliation, saving active users an average of 4 hours weekly.",
      ],
    },
    {
      id: "exp-2",
      title: "Product Manager",
      company: "CloudScale SaaS",
      location: "San Francisco, CA (Remote)",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      current: false,
      bullets: [
        "Managed core analytics dashboard product serving 120+ enterprise clients including Fortune 500 accounts.",
        "Conducted 100+ customer discovery interviews to define MVP requirements for enterprise SSO and compliance features.",
        "Decreased churn rate from 4.2% to 2.1% by prioritizing user-requested workflow integrations with Slack and Jira.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Business Administration & Information Systems",
      fieldOfStudy: "Product & Innovation Strategy",
      institution: "University of Texas at Austin",
      location: "Austin, TX",
      startDate: "2015",
      endDate: "2019",
      current: false,
      gpa: "3.85 / 4.0",
      highlights: "President of Entrepreneurship Club. Magna Cum Laude honors.",
    },
  ],
  skillCategories: [
    {
      id: "skill-1",
      categoryName: "Product Management",
      skills: [
        "Product Roadmap",
        "User Research",
        "A/B Testing",
        "Agile / Scrum",
        "Jira & Figma",
        "SQL Analytics",
      ],
    },
    {
      id: "skill-2",
      categoryName: "Strategy & Metrics",
      skills: [
        "OKR Framework",
        "Growth Hacking",
        "Churn Reduction",
        "Customer Acquisition Cost",
        "Mixpanel / Amplitude",
      ],
    },
    {
      id: "skill-3",
      categoryName: "Languages",
      skills: ["English (Native)", "Spanish (Professional Proficiency)"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "SaaS Metrics Calculator",
      role: "Creator",
      techStack: ["React", "Tailwind CSS", "Vite"],
      link: "https://saas-calculator-demo.com",
      description:
        "Free interactive tool for founders to calculate CAC, LTV, NRR, and Runway projections.",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      title: "Certified Scrum Product Owner (CSPO)",
      issuer: "Scrum Alliance",
      date: "2020",
    },
    {
      id: "cert-2",
      title: "Pragmatic Institute Certified (PMC-III)",
      issuer: "Pragmatic Institute",
      date: "2021",
    },
  ],
  customSections: [],
  sectionOrder: [
    "personal",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
  ],
};

export const sampleCvCamila: CvData = {
  personalInfo: {
    fullName: "Camila Rojas Silva",
    title: "Especialista en Marketing Digital & Contenidos",
    email: "camila.rojas.demo@email.com",
    phone: "+56 9 8765 4321",
    location: "Santiago, Chile",
    website: "https://camilarojas.demo",
    linkedin: "linkedin.com/in/camila-rojas-demo",
    github: "",
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300",
    showPhoto: true,
  },
  summary:
    "Especialista en marketing digital con 5 años impulsando crecimiento orgánico y paid en e-commerce y SaaS B2B. Experta en content strategy, SEO y performance en Meta Ads / Google Ads. Enfocada en métricas de negocio (CAC, ROAS, LTV) y storytelling de marca.",
  experience: [
    {
      id: "exp-cam-1",
      title: "Marketing Digital Lead",
      company: "NubeRetail LatAm",
      location: "Santiago, Chile",
      startDate: "Feb 2022",
      endDate: "Actualidad",
      current: true,
      bullets: [
        "Diseñé y ejecuté el plan de contenidos que elevó el tráfico orgánico un 68% en 14 meses.",
        "Optimicé campañas paid con ROAS promedio 4.2x y reducción de CAC del 22%.",
        "Coordiné un equipo freelance de 4 creativos (copy, diseño, video) con calendario editorial semanal.",
      ],
    },
    {
      id: "exp-cam-2",
      title: "Community & Content Manager",
      company: "Agencia Norte Creativo",
      location: "Valparaíso, Chile",
      startDate: "Mar 2019",
      endDate: "Ene 2022",
      current: false,
      bullets: [
        "Gestioné redes de 12 marcas PyME con un crecimiento combinado de +120k seguidores.",
        "Implementé reportes mensuales en Looker Studio alineados a KPIs comerciales del cliente.",
      ],
    },
  ],
  education: [
    {
      id: "edu-cam-1",
      degree: "Licenciatura en Comunicación Social",
      fieldOfStudy: "Marketing y Medios Digitales",
      institution: "Universidad de Chile",
      location: "Santiago, Chile",
      startDate: "2014",
      endDate: "2018",
      current: false,
      highlights: "Mención en periodismo digital.",
    },
  ],
  skillCategories: [
    {
      id: "skill-cam-1",
      categoryName: "Marketing & Ads",
      skills: [
        "SEO / SEM",
        "Meta Ads",
        "Google Ads",
        "Email Marketing",
        "Content Strategy",
        "Copywriting",
      ],
    },
    {
      id: "skill-cam-2",
      categoryName: "Herramientas",
      skills: ["HubSpot", "Looker Studio", "Canva", "Notion", "GA4", "Figma (básico)"],
    },
    {
      id: "skill-cam-3",
      categoryName: "Idiomas",
      skills: ["Español (Nativo)", "Inglés (B2)"],
    },
  ],
  projects: [
    {
      id: "proj-cam-1",
      title: "Playbook de lanzamientos e-commerce",
      role: "Autora",
      techStack: ["Notion", "GA4", "Meta Ads"],
      link: "",
      description:
        "Guía interna reutilizable para lanzamientos de productos con checklist de creativos, presupuesto y métricas de las primeras 72 horas.",
    },
  ],
  certifications: [
    {
      id: "cert-cam-1",
      title: "Google Ads Search Certification",
      issuer: "Google",
      date: "2023",
    },
    {
      id: "cert-cam-2",
      title: "HubSpot Content Marketing",
      issuer: "HubSpot Academy",
      date: "2022",
    },
  ],
  customSections: [],
  sectionOrder: [
    "personal",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
  ],
};

export const sampleCvDiego: CvData = {
  personalInfo: {
    fullName: "Diego Morales Peña",
    title: "Diseñador UX/UI & Product Designer",
    email: "diego.morales.demo@email.com",
    phone: "+598 99 123 456",
    location: "Montevideo, Uruguay",
    website: "https://diegomorales.demo",
    linkedin: "linkedin.com/in/diego-morales-demo",
    github: "github.com/dmorales-demo",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    showPhoto: true,
  },
  summary:
    "Product Designer con 6 años diseñando experiencias digitales para fintech y salud. Combino research, prototipado de alta fidelidad y design systems. Habituado a trabajar codo a codo con ingeniería en sprints ágiles y a medir impacto con métricas de usabilidad.",
  experience: [
    {
      id: "exp-die-1",
      title: "Senior Product Designer",
      company: "BancaÁgil",
      location: "Montevideo, Uruguay",
      startDate: "Ago 2021",
      endDate: "Actualidad",
      current: true,
      bullets: [
        "Rediseñé el flujo de onboarding KYC, reduciendo el abandono en un 31%.",
        "Construí y mantuve el design system de la app (120+ componentes) en Figma + tokens compartidos con front.",
        "Facilité workshops de discovery con compliance, legal y producto para features regulatorias.",
      ],
    },
    {
      id: "exp-die-2",
      title: "UX/UI Designer",
      company: "HealthPath LatAm",
      location: "Remoto",
      startDate: "Ene 2018",
      endDate: "Jul 2021",
      current: false,
      bullets: [
        "Diseñé el portal de pacientes (web + responsive) usado por 40k usuarios mensuales.",
        "Conduje tests de usabilidad moderados y unmoderados; prioricé backlog con severity ratings.",
      ],
    },
  ],
  education: [
    {
      id: "edu-die-1",
      degree: "Licenciatura en Diseño Industrial",
      fieldOfStudy: "Diseño de Interacción",
      institution: "Universidad ORT Uruguay",
      location: "Montevideo, Uruguay",
      startDate: "2012",
      endDate: "2017",
      current: false,
    },
  ],
  skillCategories: [
    {
      id: "skill-die-1",
      categoryName: "Diseño & Research",
      skills: [
        "Figma",
        "Design Systems",
        "User Interviews",
        "Usability Testing",
        "Prototyping",
        "Accessibility (WCAG)",
      ],
    },
    {
      id: "skill-die-2",
      categoryName: "Colaboración",
      skills: ["Agile / Scrum", "Jira", "FigJam", "Storybook (colab)", "HTML/CSS básico"],
    },
    {
      id: "skill-die-3",
      categoryName: "Idiomas",
      skills: ["Español (Nativo)", "Inglés (C1)"],
    },
  ],
  projects: [
    {
      id: "proj-die-1",
      title: "Kit de onboarding bancario open-source",
      role: "Diseñador principal",
      techStack: ["Figma", "Tokens", "Storybook"],
      link: "",
      description:
        "Biblioteca de flujos y componentes para onboarding financiero reutilizable en 3 productos internos.",
    },
  ],
  certifications: [
    {
      id: "cert-die-1",
      title: "Google UX Design Certificate",
      issuer: "Coursera / Google",
      date: "2021",
    },
  ],
  customSections: [],
  sectionOrder: [
    "personal",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
  ],
};

export type GuestSampleId = "mateo" | "sarah" | "camila" | "diego";

export const GUEST_SAMPLE_POOL: { id: GuestSampleId; data: CvData; language: "es" | "en"; templateId: CvThemeSettings["templateId"] }[] = [
  { id: "mateo", data: sampleCvSpanish, language: "es", templateId: "modern" },
  { id: "sarah", data: sampleCvEnglish, language: "en", templateId: "executive" },
  { id: "camila", data: sampleCvCamila, language: "es", templateId: "elegant" },
  { id: "diego", data: sampleCvDiego, language: "es", templateId: "creative" },
];

export function pickRandomGuestCv(): (typeof GUEST_SAMPLE_POOL)[number] {
  const idx = Math.floor(Math.random() * GUEST_SAMPLE_POOL.length);
  return GUEST_SAMPLE_POOL[idx];
}
