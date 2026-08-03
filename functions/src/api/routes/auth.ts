import { Router } from "express";

const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
/** Public LinkedIn OAuth client id (override with LINKEDIN_CLIENT_ID if needed). */
const DEFAULT_LINKEDIN_CLIENT_ID = "77sth81lkh6wes";

const ALLOWED_REDIRECT_URIS = new Set([
  "https://templeo-cv.web.app/auth/linkedin",
  "https://templeo-cv.firebaseapp.com/auth/linkedin",
  "http://localhost:3000/auth/linkedin",
  "http://127.0.0.1:3000/auth/linkedin",
]);

const router = Router();

/**
 * Exchanges a LinkedIn OAuth authorization code for tokens.
 * Firebase's built-in OIDC token exchange omits client_secret for LinkedIn;
 * we do the exchange ourselves and return id_token for signInWithCredential.
 */
router.post("/linkedin/exchange", async (req, res) => {
  try {
    const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
    const redirectUri =
      typeof req.body?.redirectUri === "string" ? req.body.redirectUri.trim() : "";

    if (!code || !redirectUri) {
      return res.status(400).json({ error: "code y redirectUri son requeridos" });
    }
    if (!ALLOWED_REDIRECT_URIS.has(redirectUri)) {
      return res.status(400).json({ error: "redirectUri no permitido" });
    }

    const clientId =
      process.env.LINKEDIN_CLIENT_ID?.trim() || DEFAULT_LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET?.trim();
    if (!clientSecret) {
      return res.status(503).json({
        error: "LINKEDIN_CLIENT_SECRET no configurado",
      });
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const tokenRes = await fetch(LINKEDIN_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const raw = await tokenRes.text();
    let data: Record<string, unknown> = {};
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      /* LinkedIn sometimes returns form-encoded errors */
    }

    if (!tokenRes.ok) {
      const desc =
        (typeof data.error_description === "string" && data.error_description) ||
        (typeof data.error === "string" && data.error) ||
        raw.slice(0, 200) ||
        `LinkedIn token error ${tokenRes.status}`;
      console.error("LinkedIn token exchange failed:", desc);
      return res.status(400).json({ error: desc });
    }

    const idToken = data.id_token;
    if (typeof idToken !== "string" || !idToken) {
      return res.status(502).json({
        error: "LinkedIn no devolvió id_token (¿OIDC habilitado en la app?)",
      });
    }

    return res.json({ idToken });
  } catch (err: any) {
    console.error("LinkedIn exchange error:", err?.message);
    return res.status(500).json({ error: err?.message || "Error en exchange" });
  }
});

export default router;
