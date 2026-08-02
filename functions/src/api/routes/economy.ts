import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth";
import { claimAdToken, getOrInitUserEconomy } from "../economy";

const router = Router();

router.get("/credits", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const user = await getOrInitUserEconomy(req.uid!, req.idToken);
    return res.json({ economy: user.economy });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message });
  }
});

router.post("/claim-ad-token", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const result = await claimAdToken(req);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message });
  }
});

export default router;
