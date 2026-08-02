import { Router } from "express";
import { Type } from "@google/genai";
import { GEMINI_MODEL, getGeminiClient } from "../gemini";
import { requireAuth, type AuthedRequest } from "../middleware/auth";
import { consumeCredit, getOrInitUserEconomy } from "../economy";

const router = Router();

router.use(requireAuth);

async function withCredit(req: AuthedRequest, res: any, fn: () => Promise<any>) {
  const credit = await consumeCredit(req, 1);
  if (!credit.ok) {
    return res.status(402).json({
      error: "Sin créditos de IA. Usá claim-ad-token o esperá recarga.",
      creditosIa: credit.creditosIa,
    });
  }
  try {
    const result = await fn();
    return res.json({ ...result, creditosIa: credit.creditosIa });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "Error IA" });
  }
}

router.post("/enhance-summary", async (req: AuthedRequest, res) => {
  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ error: "GEMINI_API_KEY no configurada." });

  const { jobTitle, summary, skills, language = "es" } = req.body;
  const langInstruction = language === "es" ? "en español" : "in English";

  return withCredit(req, res, async () => {
    const prompt = `Actúa como un experto reclutador y redactor de currículums profesional.
Genera 3 opciones optimizadas de resumen profesional ${langInstruction} para la siguiente persona:
- Puesto/Título: ${jobTitle || "Profesional"}
- Habilidades clave: ${skills?.join(", ") || "No especificadas"}
- Resumen actual/borrador: ${summary || "Sin borrador"}

Reglas:
1. Cada opción debe tener entre 3 y 5 oraciones directas, impactantes y con enfoque en logros y valor aportado.
2. Evita clichés genéricos ("motivado", "orientado a resultados"). Usar palabras de acción.
3. Devuelve los resultados en JSON estructurado.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  style: { type: Type.STRING },
                  text: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });
    return JSON.parse(response.text || "{}");
  });
});

router.post("/enhance-bullet", async (req: AuthedRequest, res) => {
  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ error: "GEMINI_API_KEY no configurada." });

  const { bullet, jobTitle, company, language = "es" } = req.body;
  const langInstruction = language === "es" ? "en español" : "in English";

  return withCredit(req, res, async () => {
    const prompt = `Mejora la siguiente viñeta / logro de experiencia laboral para un CV ${langInstruction}:
Puesto: ${jobTitle || "Profesional"} en ${company || "Empresa"}
Viñeta original: "${bullet}"

Genera 3 versiones mejoradas utilizando la metodología de impacto + acción + métrica o resultado esperable (fórmula STAR/Google ATS). Devuelve el resultado en JSON.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  bulletText: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });
    return JSON.parse(response.text || "{}");
  });
});

router.post("/ats-check", async (req: AuthedRequest, res) => {
  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ error: "GEMINI_API_KEY no configurada." });

  const { cvData, targetJobDescription, language = "es" } = req.body;
  const langInstruction = language === "es" ? "en español" : "in English";

  return withCredit(req, res, async () => {
    const prompt = `Evalúa el siguiente CV para compatibilidad con sistemas ATS y relevancia para la oferta.
Idioma de respuesta: ${langInstruction}.

CV Data:
${JSON.stringify(cvData, null, 2)}

Descripción del trabajo objetivo:
"${targetJobDescription || "Analizar compatibilidad general para mercado laboral moderno"}"

Proporciona análisis JSON con: score (0-100), strengths, missingKeywords, formatFeedback, quickActionItems.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            formatFeedback: { type: Type.ARRAY, items: { type: Type.STRING } },
            quickActionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    });
    return JSON.parse(response.text || "{}");
  });
});

router.post("/translate", async (req: AuthedRequest, res) => {
  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ error: "GEMINI_API_KEY no configurada." });

  const { text, targetLang = "en" } = req.body;

  return withCredit(req, res, async () => {
    const prompt = `Traduce el siguiente texto profesional para CV al ${targetLang === "en" ? "Inglés" : "Español"}. Mantén tono profesional. Devuelve JSON {"translatedText":"..."}.

Texto:
"${text}"`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING },
          },
        },
      },
    });
    const parsed = JSON.parse(response.text || "{}");
    return { translatedText: parsed.translatedText || text };
  });
});

router.post("/generate-cv", async (req: AuthedRequest, res) => {
  const ai = getGeminiClient();
  if (!ai) return res.status(503).json({ error: "GEMINI_API_KEY no configurada." });

  const { jobHint, language = "es", masterOverride } = req.body;
  const langInstruction = language === "es" ? "español" : "English";

  let master = masterOverride;
  if (!master && req.idToken && req.uid !== "local-dev") {
    const user = await getOrInitUserEconomy(req.uid!, req.idToken);
    master = user.profile;
  }

  if (!master) {
    return res.status(400).json({
      error: "No hay Master Profile. Enviá masterOverride o guardá el perfil en Firestore.",
    });
  }

  return withCredit(req, res, async () => {
    const prompt = `Sos un experto en CVs ATS. A partir del MASTER PROFILE del candidato y la ayuda/requisitos del llamado, generá un CV adaptado en ${langInstruction}.

MASTER PROFILE (fuente de verdad — podés omitir u ordenar, no inventar empleadores falsos):
${JSON.stringify(master, null, 2)}

AYUDA / JOB HINT / REQUIREMENTS:
${jobHint || "Adaptar de forma general al mercado actual"}

Devolvé JSON con esta forma exacta:
{
  "title": "título corto del CV",
  "data": {
    "personalInfo": { ... mismos campos del master, title adaptado al puesto },
    "summary": "string",
    "experience": [...],
    "education": [...],
    "skillCategories": [...],
    "projects": [...],
    "certifications": [...],
    "references": [...],
    "customSections": [...],
    "sectionOrder": ["summary","experience","education","skills","projects","certifications","references","custom"]
  }
}

Reglas: no inventes empresas ni títulos académicos. Priorizá relevancia al hint. Bullets con impacto.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    const parsed = JSON.parse(response.text || "{}");
    return {
      title: parsed.title || "CV adaptado",
      data: parsed.data || parsed,
    };
  });
});

export default router;
