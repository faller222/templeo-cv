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
| `npm run deploy:hosting` | Build Vite + deploy Firebase Hosting |
| `npm run deploy` | Hosting + Functions + Firestore |
| `npx firebase deploy` | Deploy manual |

## Auth

Google + LinkedIn (OIDC). LinkedIn no usa el handler nativo de Firebase (bug de `client_secret`); el front abre OAuth, nuestra API hace el exchange y luego `signInWithCredential`.

1. LinkedIn App → Authorized redirect URLs:
   - `https://templeo-cv.web.app/auth/linkedin`
   - `http://localhost:3000/auth/linkedin` (local)
2. Secret Functions: `LINKEDIN_CLIENT_SECRET` (client id público ya está en el repo)
3. Firebase OIDC provider sigue activo (`oidc.linkedin`) para validar el `id_token`
