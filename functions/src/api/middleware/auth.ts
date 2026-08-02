import type { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

export type AuthedRequest = Request & {
  uid?: string;
  idToken?: string;
};

const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

function projectId() {
  return (
    process.env.VITE_FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    process.env.FIREBASE_PROJECT_ID ||
    "templeo-cv"
  );
}

/**
 * Verifies Firebase ID tokens via Google JWKS — no service account required.
 * Local unauthenticated access only if ALLOW_UNAUTHENTICATED_AI=true (dev).
 */
export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    if (process.env.ALLOW_UNAUTHENTICATED_AI === "true") {
      req.uid = "local-dev";
      return next();
    }
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const pid = projectId();
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${pid}`,
      audience: pid,
    });
    if (!payload.sub) {
      return res.status(401).json({ error: "Invalid token subject" });
    }
    req.uid = payload.sub;
    req.idToken = token;
    return next();
  } catch (err: any) {
    console.error("Auth verify failed:", err?.message);
    if (process.env.ALLOW_UNAUTHENTICATED_AI === "true") {
      req.uid = "local-dev";
      return next();
    }
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
