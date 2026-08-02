import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth";
import {
  createDocument,
  getDocument,
  listDocuments,
  setDocument,
} from "../firestoreRest";

const router = Router();

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.idToken || req.uid === "local-dev") {
      return res.json({ items: [], local: true });
    }
    const items = await listDocuments("cv_instances", req.idToken, {
      field: "userId",
      value: req.uid!,
    });
    return res.json({ items });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "Error listando CVs" });
  }
});

router.get("/:id", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.idToken || req.uid === "local-dev") {
      return res.status(404).json({ error: "Not found (local mode)" });
    }
    const doc = await getDocument(`cv_instances/${req.params.id}`, req.idToken);
    if (!doc || doc.userId !== req.uid) {
      return res.status(404).json({ error: "CV no encontrado" });
    }
    return res.json({ id: req.params.id, ...doc });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Error" });
  }
});

/** POST: crear / pushear instancia (Templeo u otros módulos) */
router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const {
      title,
      data,
      theme,
      sourceJobHint,
      templateId,
      clonedFrom,
      id,
    } = req.body;

    if (!data) {
      return res.status(400).json({ error: "data (CvData) requerido" });
    }

    const now = Date.now();
    const payload = {
      userId: req.uid!,
      title: title || "CV",
      sourceJobHint: sourceJobHint || "",
      templateId: templateId || theme?.templateId || "modern",
      data,
      theme: theme || null,
      clonedFrom: clonedFrom || null,
      createdAt: now,
      updatedAt: now,
    };

    if (!req.idToken || req.uid === "local-dev") {
      return res.status(201).json({
        id: id || `local-${now}`,
        ...payload,
        local: true,
      });
    }

    if (id) {
      await setDocument(`cv_instances/${id}`, payload, req.idToken);
      return res.status(201).json({ id, ...payload });
    }

    const created = await createDocument("cv_instances", payload, req.idToken);
    return res.status(201).json({ id: created.id, ...payload });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || "Error creando CV" });
  }
});

export default router;
