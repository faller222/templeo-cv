# Estado del repo (post-refactor)

## Hecho

- Docs en `.doc/`; `contexto.md` eliminado.
- `.gitignore` + `.env` normalizado (fuera del index).
- Dominio: `MasterProfile` / `CvInstance` / economía en `src/types.ts`.
- API compartida en `functions/src/api/` montada por bridge `server.ts` y Cloud Function `api`.
- Auth cliente: Google + LinkedIn OIDC (`src/lib/firebase.ts`).
- Verificación de tokens en servidor vía JWKS (`jose`) — sin service account.
- Multi-CV UI: Mis CVs, clonar, generate-cv con hint, → Master.
- PDF: `@react-pdf/renderer` (`CvPdfDocument`); print HTML como fallback.
- Créditos: consume en rutas IA + `POST /api/economy/claim-ad-token` (stub cooldown).
- `normalize.css` cargado en `main.tsx`.
- `firebase-tools` en devDependencies; proyecto `.firebaserc` → `templeo-cv`.

## Pendiente operativo (vos)

1. **Cuenta Firebase incorrecta en CLI:** `faller222@gmail.com` solo ve `agro-notas` / `agro-notas-staging`. El config apunta a `templeo-cv`, que **no aparece** en esa sesión. Hacé `npx firebase logout` + `npx firebase login` con la cuenta dueña de `templeo-cv`, o agregá este usuario al proyecto.
2. Confirmar `VITE_FIREBASE_LINKEDIN_PROVIDER_ID` exacto en consola.
3. Deploy rules: `npm run deploy:rules`
4. Secret Gemini: `npx firebase functions:secrets:set GEMINI_API_KEY`
5. Deploy functions: `npm run deploy:functions`
6. Rotar Gemini key si `.env` llegó a un remote alguna vez.

## Deuda conocida

- Translate sigue siendo N+1 calls (consume muchos créditos).
- Un solo template PDF bridge (no los 8 HTML).
- AdSense real no implementado.
- `ALLOW_UNAUTHENTICATED_AI=true` solo en bridge local.
