import { GoogleGenAI } from "@google/genai";

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "templeo-cv",
      },
    },
  });
}

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
