import { getIdToken, isFirebaseConfigured } from "./firebase";
import type { AtsResult, CvData, MasterProfile } from "../types";

async function authHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (isFirebaseConfigured) {
    try {
      const token = await getIdToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      /* local without auth */
    }
  }
  return headers;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(await authHeaders()),
      ...(init?.headers || {}),
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Error ${res.status} en ${path}`);
  }
  return body as T;
}

export const api = {
  enhanceSummary(payload: {
    jobTitle: string;
    summary: string;
    skills: string[];
    language: string;
  }) {
    return apiFetch<{ options: { style: string; text: string }[] }>(
      "/api/ai/enhance-summary",
      { method: "POST", body: JSON.stringify(payload) }
    );
  },

  enhanceBullet(payload: {
    bullet: string;
    jobTitle: string;
    company: string;
    language: string;
  }) {
    return apiFetch<{
      suggestions: { type: string; bulletText: string }[];
    }>("/api/ai/enhance-bullet", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  atsCheck(payload: {
    cvData: CvData;
    targetJobDescription: string;
    language: string;
  }) {
    return apiFetch<AtsResult>("/api/ai/ats-check", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  translate(payload: { text: string; targetLang: string }) {
    return apiFetch<{ translatedText: string }>("/api/ai/translate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  generateCv(payload: {
    jobHint: string;
    language?: string;
    masterOverride?: MasterProfile;
  }) {
    return apiFetch<{ data: CvData; title: string; creditosIa?: number }>(
      "/api/ai/generate-cv",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  getProfile() {
    return apiFetch<{ profile: MasterProfile; economy: { creditosIa: number; ultimaRecarga: number | null } }>(
      "/api/profile"
    );
  },

  listCvs() {
    return apiFetch<{ items: unknown[] }>("/api/cvs");
  },

  createCv(payload: unknown) {
    return apiFetch<{ id: string }>("/api/cvs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  claimAdToken() {
    return apiFetch<{ creditosIa: number; granted: boolean }>(
      "/api/economy/claim-ad-token",
      { method: "POST", body: JSON.stringify({}) }
    );
  },
};
