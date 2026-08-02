# TempleoCV

Módulo 1 de Templeo: generador y gestor de CVs con IA (Gemini), Firebase Auth/Firestore y exportación PDF.

Documentación completa: [`.doc/00-INDICE.md`](.doc/00-INDICE.md)

## Setup local

1. `npm install`
2. Copiá `.env.example` → `.env` y completá `GEMINI_API_KEY` + `VITE_FIREBASE_*`
3. `npm run dev` — Vite + API bridge en http://localhost:3000

## Scripts

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Dev server (Express + Vite) |
| `npm run build` | Build frontend + server |
| `npm run lint` | `tsc --noEmit` |
| `npx firebase emulators:start` | Emuladores Auth/Firestore/Functions |
| `npx firebase deploy` | Deploy (requiere login) |

## Auth

Google + LinkedIn (OIDC). Ajustá `VITE_FIREBASE_LINKEDIN_PROVIDER_ID` al providerId exacto de la consola Firebase.
