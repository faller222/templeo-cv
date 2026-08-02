import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini API client lazily/safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// AI Endpoints
app.post("/api/ai/enhance-summary", async (req, res) => {
  try {
    const { jobTitle, summary, skills, language = "es" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY no está configurada.",
      });
    }

    const langInstruction = language === "es" ? "en español" : "in English";

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
      model: "gemini-3.6-flash",
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
                  style: { type: Type.STRING, description: "Ej: Ejecutivo, Técnico, Directo" },
                  text: { type: Type.STRING, description: "El texto del resumen" },
                },
              },
            },
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error in enhance-summary:", err);
    return res.status(500).json({ error: err?.message || "Error procesando solicitud con IA" });
  }
});

app.post("/api/ai/enhance-bullet", async (req, res) => {
  try {
    const { bullet, jobTitle, company, language = "es" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({ error: "GEMINI_API_KEY no está configurada." });
    }

    const langInstruction = language === "es" ? "en español" : "in English";

    const prompt = `Mejora la siguiente viñeta / logro de experiencia laboral para un CV ${langInstruction}:
Puesto: ${jobTitle || "Profesional"} en ${company || "Empresa"}
Viñeta original: "${bullet}"

Genera 3 versiones mejoradas utilizando la metodología de impacto + acción + métrica o resultado esperable (fórmula STAR/Google ATS). Devuelve el resultado en JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
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
                  type: { type: Type.STRING, description: "Ej: Orientado a logros, Liderazgo, Optimización" },
                  bulletText: { type: Type.STRING, description: "Viñeta mejorada" },
                },
              },
            },
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error in enhance-bullet:", err);
    return res.status(500).json({ error: err?.message || "Error al mejorar la viñeta" });
  }
});

app.post("/api/ai/ats-check", async (req, res) => {
  try {
    const { cvData, targetJobDescription, language = "es" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({ error: "GEMINI_API_KEY no está configurada." });
    }

    const langInstruction = language === "es" ? "en español" : "in English";

    const prompt = `Evalúa el siguiente CV para compatibilidad con sistemas ATS (Applicant Tracking Systems) y relevancia para la oferta de empleo provista.
Idioma de respuesta: ${langInstruction}.

CV Data:
${JSON.stringify(cvData, null, 2)}

Descripción del trabajo objetivo (Job Description):
"${targetJobDescription || "Analizar compatibilidad general para mercado laboral moderno"}"

Proporciona un análisis exhaustivo en formato JSON con:
1. score: Puntuación de 0 a 100 basada en formato, claridad, palabras clave, densidad de logros.
2. strengths: Lista de 3 a 5 fortalezas clave.
3. missingKeywords: Lista de palabras clave o competencias recomendadas que faltan o podrían reforzarse.
4. formatFeedback: Lista de 2 a 4 consejos de formato o estilo.
5. quickActionItems: 3 acciones prioritarias para subir el puntaje de inmediato.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
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

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error in ats-check:", err);
    return res.status(500).json({ error: err?.message || "Error evaluando ATS" });
  }
});

app.post("/api/ai/translate", async (req, res) => {
  try {
    const { text, targetLang = "en" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({ error: "GEMINI_API_KEY no está configurada." });
    }

    const prompt = `Traduce el siguiente texto profesional para CV de su idioma actual al ${targetLang === "en" ? "Inglés" : "Español"}. Mantén el tono profesional corporativo y terminología adecuada para currículums. Devuelve solo el texto traducido.

Texto:
"${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({ translatedText: response.text?.trim() || text });
  } catch (err: any) {
    console.error("Error in translate:", err);
    return res.status(500).json({ error: err?.message || "Error en traducción" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
