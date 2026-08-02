import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth";
import { getOrInitUserEconomy } from "../economy";
import { setDocument } from "../firestoreRest";

const router = Router();

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const user = await getOrInitUserEconomy(
      req.uid!,
      req.idToken,
      req.body?.profile
    );
    return res.json({
      profile: user.profile,
      economy: user.economy,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "Error leyendo perfil" });
  }
});

router.put("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: "profile requerido" });
    }
    if (!req.idToken || req.uid === "local-dev") {
      return res.json({ ok: true, local: true, profile });
    }
    const existing = await getOrInitUserEconomy(req.uid!, req.idToken, profile);
    const now = Date.now();
    await setDocument(
      `users/${req.uid}`,
      {
        profile,
        economy: existing.economy,
        createdAt: (existing as any).createdAt || now,
        updatedAt: now,
      },
      req.idToken
    );
    return res.json({ ok: true, profile });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "Error guardando perfil" });
  }
});

export default router;
