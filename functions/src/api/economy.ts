import type { AuthedRequest } from "./middleware/auth";
import { getDocument, setDocument } from "./firestoreRest";

const DEFAULT_CREDITS = 5;
const CLAIM_COOLDOWN_MS = 30_000;
const CLAIM_GRANT = 1;

export async function getOrInitUserEconomy(
  uid: string,
  idToken: string | undefined,
  masterFallback?: unknown
) {
  if (!idToken || uid === "local-dev") {
    return {
      profile: masterFallback || null,
      economy: { creditosIa: DEFAULT_CREDITS, ultimaRecarga: null },
      local: true as const,
    };
  }

  const existing = await getDocument(`users/${uid}`, idToken);
  if (existing) {
    return {
      profile: existing.profile,
      economy: existing.economy || {
        creditosIa: DEFAULT_CREDITS,
        ultimaRecarga: null,
      },
      local: false as const,
    };
  }

  const now = Date.now();
  const doc = {
    profile: masterFallback || null,
    economy: { creditosIa: DEFAULT_CREDITS, ultimaRecarga: null },
    createdAt: now,
    updatedAt: now,
  };
  await setDocument(`users/${uid}`, doc, idToken);
  return { ...doc, local: false as const };
}

/** In-memory credit ledger for local-dev without Firestore */
const localCredits = new Map<string, { creditosIa: number; ultimaRecarga: number | null }>();

export async function consumeCredit(req: AuthedRequest, cost = 1) {
  const uid = req.uid!;
  if (!req.idToken || uid === "local-dev") {
    const cur = localCredits.get(uid) || {
      creditosIa: DEFAULT_CREDITS,
      ultimaRecarga: null,
    };
    if (cur.creditosIa < cost) {
      return { ok: false as const, creditosIa: cur.creditosIa };
    }
    cur.creditosIa -= cost;
    localCredits.set(uid, cur);
    return { ok: true as const, creditosIa: cur.creditosIa };
  }

  const user = await getOrInitUserEconomy(uid, req.idToken);
  const economy = user.economy;
  if ((economy.creditosIa ?? 0) < cost) {
    return { ok: false as const, creditosIa: economy.creditosIa ?? 0 };
  }
  economy.creditosIa -= cost;
  await setDocument(
    `users/${uid}`,
    {
      profile: user.profile,
      economy,
      createdAt: (user as any).createdAt || Date.now(),
      updatedAt: Date.now(),
    },
    req.idToken
  );
  return { ok: true as const, creditosIa: economy.creditosIa };
}

export async function claimAdToken(req: AuthedRequest) {
  const uid = req.uid!;
  const now = Date.now();

  if (!req.idToken || uid === "local-dev") {
    const cur = localCredits.get(uid) || {
      creditosIa: DEFAULT_CREDITS,
      ultimaRecarga: null,
    };
    if (cur.ultimaRecarga && now - cur.ultimaRecarga < CLAIM_COOLDOWN_MS) {
      return { granted: false, creditosIa: cur.creditosIa, reason: "cooldown" };
    }
    cur.creditosIa += CLAIM_GRANT;
    cur.ultimaRecarga = now;
    localCredits.set(uid, cur);
    return { granted: true, creditosIa: cur.creditosIa };
  }

  const user = await getOrInitUserEconomy(uid, req.idToken);
  const economy = user.economy;
  if (economy.ultimaRecarga && now - economy.ultimaRecarga < CLAIM_COOLDOWN_MS) {
    return { granted: false, creditosIa: economy.creditosIa, reason: "cooldown" };
  }
  economy.creditosIa = (economy.creditosIa || 0) + CLAIM_GRANT;
  economy.ultimaRecarga = now;
  await setDocument(
    `users/${uid}`,
    {
      profile: user.profile,
      economy,
      createdAt: (user as any).createdAt || now,
      updatedAt: now,
    },
    req.idToken
  );
  return { granted: true, creditosIa: economy.creditosIa };
}
