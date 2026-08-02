import { CvData, CvThemeSettings } from "../types";
import leniseFoto from "../assets/images/foto.jpg";

export const defaultThemeSettings: CvThemeSettings = {
  templateId: "clasico-v1",
  primaryColor: "#2c3e50", // Dark Slate Blue for Clasico
  fontFamily: "sans",
  fontSize: "md",
  spacing: "comfortable",
  showIcons: true,
  sidebarPosition: "left",
  paperSize: "a4",
};

export const sampleCvLenise: CvData = {
  personalInfo: {
    fullName: "LENISE NOCETTI IBARGOYEN",
    title: "Agente Comercial",
    email: "lenylara1@hotmail.com",
    phone: "094250999",
    location: "Buceo, Montevideo, Uruguay",
    website: "",
    linkedin: "linkedin.com/in/lenise-nocetti",
    github: "",
    photoUrl: leniseFoto,
    showPhoto: true,
    birthDate: "01/04/2001 (23 años)",
    age: 23,
    documentation: [
      "Libreta de conducir: CAT G2 - CAT A",
      "Carné de salud: VIGENTE"
    ],
  },
  summary:
    "Estudiante de Odontología con experiencia en atención al cliente, ventas y recepción en el sector turístico y comercial. Experiencia en gestión de reservas, manejo de caja, control de stock y atención personalizada. Bilingüe español-inglés con habilidades en herramientas de Microsoft Office.",
  experience: [
    {
      id: "exp-lenise-1",
      title: "Recepcionista",
      company: "OPTA Coliving",
      location: "Punta Carretas, Montevideo",
      startDate: "Abril 2025",
      endDate: "Actualidad",
      current: true,
      bullets: [
        "Atención completa al huésped y residente mediante check-in, check-out, asistencia personalizada y soporte en experiencias de coliving.",
        "Provisión de información turística y orientación especializada para estadías prolongadas.",
        "Gestión directa de reservas y coordinación con plataformas de alojamiento como Booking, Despegar y Expedia.",
        "Manejo de caja, facturación, control de pagos y administración de servicios internos mediante app Lavomat.",
        "Coordinación con equipos de limpieza y mantenimiento para garantizar altos estándares de servicio. Utilización de sistema hotelero Desbravador."
      ],
    },
    {
      id: "exp-lenise-2",
      title: "Vendedora",
      company: "FARMASHOP",
      location: "Buceo, Montevideo",
      startDate: "Agosto 2024",
      endDate: "Octubre 2024",
      current: false,
      bullets: [
        "Limpieza y organización completa del local.",
        "Recepción y reposición estratégica de mercadería.",
        "Elaboración eficiente de pedidos, gestión de reposición de productos y facturación precisa.",
        "Coordinación de distribución de mercancías manteniendo altos estándares de orden y presentación."
      ],
    },
    {
      id: "exp-lenise-3",
      title: "Auxiliar de ventas",
      company: "FIT&FEET",
      location: "Paseo del Este, Maldonado",
      startDate: "2024",
      endDate: "2024",
      current: false,
      bullets: [
        "Asesoramiento al cliente y apoyo activo en ventas.",
        "Control de stock y reposición periódica de productos."
      ],
    },
    {
      id: "exp-lenise-4",
      title: "Recepcionista",
      company: "HOSTEL DEL PUERTO",
      location: "Punta del Este",
      startDate: "Verano 2024",
      endDate: "2024",
      current: false,
      bullets: [
        "Atención personalizada al huésped mediante gestión eficiente de procesos de check-in y check-out.",
        "Provisión de información turística especializada y asistencia completa durante la estadía.",
        "Gestión de reservas y coordinación con plataformas de alojamiento.",
        "Manejo de caja, facturación y coordinación con equipos de limpieza utilizando sistema hotelero Octopus."
      ],
    },
    {
      id: "exp-lenise-5",
      title: "Recepcionista",
      company: "HOTEL LA VISTA 32",
      location: "Punta del Este",
      startDate: "Verano 2023",
      endDate: "2023",
      current: false,
      bullets: [
        "Atención excepcional al cliente mediante gestión eficiente de reservas y procesos de check-in y check-out.",
        "Manejo profesional de comunicaciones telefónicas y por correo electrónico.",
        "Coordinación de servicios hoteleros y resolución de incidencias con sistema hotelero Octopus."
      ],
    },
    {
      id: "exp-lenise-6",
      title: "Vendedora",
      company: "BAZAR COSTA ESTE",
      location: "La Barra, Maldonado",
      startDate: "2018",
      endDate: "2021",
      current: false,
      bullets: [
        "Desarrollo de habilidades comerciales fundamentales mediante atención a clientes y gestión de ventas en entorno de bazar.",
        "Adquisición de experiencia en manejo de inventario, atención personalizada y resolución de consultas."
      ],
    },
  ],
  education: [
    {
      id: "edu-lenise-1",
      degree: "Carrera en Odontología",
      fieldOfStudy: "Facultad de Odontología",
      institution: "UNIVERSIDAD DE LA REPUBLICA (UDELAR)",
      location: "Montevideo, Uruguay",
      startDate: "2023",
      endDate: "Actualidad",
      current: true,
      highlights: "Estado: En curso",
    },
    {
      id: "edu-lenise-2",
      degree: "Bachillerato tecnológico",
      fieldOfStudy: "Educador en deporte y recreación",
      institution: "UNIDAD TECNICA DE EDUCACION EN URUGUAY (UTU)",
      location: "Uruguay",
      startDate: "2019",
      endDate: "2022",
      current: false,
      highlights: "Estado: Completado",
    },
  ],
  skillCategories: [
    {
      id: "cat-lenise-1",
      categoryName: "Software & Herramientas",
      skills: ["Microsoft Excel", "Microsoft PowerPoint", "Sistema Hotelero Octopus", "Sistema Hotelero Desbravador", "App Lavomat"],
    },
    {
      id: "cat-lenise-2",
      categoryName: "Habilidades Comerciales & Recepción",
      skills: ["Atención al Cliente", "Gestión de Reservas", "Booking / Expedia / Despegar", "Manejo de Caja & Facturación", "Control de Stock & Inventario", "Check-in & Check-out"],
    },
    {
      id: "cat-lenise-3",
      categoryName: "Idiomas",
      skills: ["Español (Nativo)", "Inglés (Intermedio)"],
    },
  ],
  references: [
    {
      id: "ref-lenise-1",
      name: "Micaela Palacio",
      role: "Encargada",
      company: "Fit&feet",
      phone: "099184092",
    },
    {
      id: "ref-lenise-2",
      name: "Débora Cairo",
      role: "Encargada",
      company: "Hostel del Puerto",
      phone: "091075733",
    },
  ],
  projects: [],
  certifications: [
    {
      id: "cert-lenise-1",
      title: "Libreta de Conducir CAT G2 - CAT A",
      issuer: "Intendencia de Montevideo",
      date: "Vigente",
    },
    {
      id: "cert-lenise-2",
      title: "Carné de Salud",
      issuer: "Ministerio de Salud Pública",
      date: "Vigente",
    },
  ],
  customSections: [],
  sectionOrder: [
    "personal",
    "summary",
    "experience",
    "education",
    "skills",
    "certifications",
  ],
};

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
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
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
      skills: ["TypeScript", "JavaScript", "React.js", "Node.js", "Express", "Python", "Tailwind CSS", "Next.js"],
    },
    {
      id: "skill-2",
      categoryName: "Cloud, DB & DevOps",
      skills: ["PostgreSQL", "Firestore", "Docker", "Google Cloud Platform", "AWS", "CI/CD", "Redis", "Git"],
    },
    {
      id: "skill-3",
      categoryName: "Idiomas & Metodologías",
      skills: ["Español (Nativo)", "Inglés (C1 Avanzado)", "Scrum/Agile", "Testing (Jest / Playwright)"],
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
          subtitle: "Conferencia: 'Escalando microfrontends con TypeScript sin perder el juicio'",
          date: "Octubre 2023",
          description: "Presentación técnica sobre micro-frontends ante una audiencia de 800+ desarrolladores en Bogotá.",
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
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
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
      skills: ["Product Roadmap", "User Research", "A/B Testing", "Agile / Scrum", "Jira & Figma", "SQL Analytics"],
    },
    {
      id: "skill-2",
      categoryName: "Strategy & Metrics",
      skills: ["OKR Framework", "Growth Hacking", "Churn Reduction", "Customer Acquisition Cost", "Mixpanel / Amplitude"],
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
      description: "Free interactive tool for founders to calculate CAC, LTV, NRR, and Runway projections.",
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
