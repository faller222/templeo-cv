# TempleoCV — Índice de documentación

Orden de lectura para humanos e IAs:

1. [01-PRODUCTO.md](./01-PRODUCTO.md) — qué es TempleoCV y el alcance del Módulo 1
2. [02-ARQUITECTURA.md](./02-ARQUITECTURA.md) — Zero-Trust, Firebase, REST
3. [03-MODELO-DATOS.md](./03-MODELO-DATOS.md) — Master Profile vs CV instances
4. [04-ECONOMIA.md](./04-ECONOMIA.md) — tokens IA ↔ atención/ads
5. [05-ESTADO-ACTUAL.md](./05-ESTADO-ACTUAL.md) — auditoría del repo
6. [06-ROADMAP-IA.md](./06-ROADMAP-IA.md) — plan de ejecución y master prompt

## Stack

- Frontend: React 19 + Vite + TypeScript + Tailwind
- Backend: Firebase Cloud Functions (Express) + bridge local en `server.ts`
- Datos: Firestore
- Auth: Firebase Auth — Google + LinkedIn (OIDC)
- IA: Gemini vía Functions/bridge (nunca en el cliente)
- PDF: `@react-pdf/renderer` (ATS-friendly)

## Reglas no negociables

1. Cero API keys de Gemini en el bundle del cliente.
2. Master Profile ≠ instancia de CV.
3. Respuestas de IA en JSON estricto (`responseMimeType: application/json`).
4. `.env` nunca se commitea (ver `.gitignore` + `.env.example`).

Proyecto Firebase: `templeo-cv` (Blaze).
