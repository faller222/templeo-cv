# Arquitectura Zero-Trust

## Principio

El frontend **nunca** habla con Gemini ni guarda credenciales de IA. Solo Firebase Auth + llamadas a nuestra API (`/api/*`) con `Authorization: Bearer <ID token>`.

```
React → api.ts (+ ID token) → Cloud Functions / bridge local → Gemini + Firestore
```

## Componentes

| Pieza | Rol |
|-------|-----|
| Firebase Auth | Google + LinkedIn OIDC |
| Firestore | `users` (master + economía), `cv_instances` |
| Cloud Functions (Express) | IA, REST perfil/CVs, claim de créditos |
| Secret Manager / `.env` | `GEMINI_API_KEY` solo en servidor |
| Bridge `server.ts` | Dev: Vite + misma API que Functions |

## REST (Templeo y cliente)

- `GET /api/profile` — exporta master profile (no una instancia CV)
- `GET /api/cvs` — lista instancias del usuario
- `POST /api/cvs` — crea/pushea instancia (otros módulos Templeo)
- `POST /api/ai/*` — enhance-summary, enhance-bullet, ats-check, translate, generate-cv
- `POST /api/economy/claim-ad-token` — stub de farmeo

Templeo (mismo proyecto Firebase) puede leer Firestore directamente; REST existe para escritura controlada e IA.

## Dev local

Preferir emuladores Firebase. En prod, Admin SDK verifica tokens automáticamente en Functions.
