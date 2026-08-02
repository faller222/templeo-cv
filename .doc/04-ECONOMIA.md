# Economía de tokens IA

## Idea

Costo Gemini no puede superar ingresos. Modelo: **farmeo de tokens por atención** (AdSense Active View) con validación backend.

## Flujo objetivo

1. Frontend mide visibilidad real del anuncio (`IntersectionObserver`) — sin tracking de mouse ilegal.
2. Reporta claim a `POST /api/economy/claim-ad-token`.
3. Backend valida timestamps (`ultimaRecarga`); rechaza si es físicamente imposible.
4. Incrementa `creditosIa`.
5. Cada llamada IA consume 1+ créditos; si `creditosIa === 0`, 402/403.

## Estado actual del código

- Campos `creditosIa` / `ultimaRecarga` en user doc.
- Decremento en rutas IA.
- Claim stub con validación de cooldown (sin AdSense real).
- UI muestra créditos.

## Deploy

- Plan Blaze (activo en `templeo-cv`).
- Alerta de presupuesto baja al inicio.
- `GEMINI_API_KEY` en Secret Manager para Functions.
