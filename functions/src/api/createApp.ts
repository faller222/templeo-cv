import express from "express";
import aiRoutes from "./routes/ai";
import profileRoutes from "./routes/profile";
import cvsRoutes from "./routes/cvs";
import economyRoutes from "./routes/economy";
import authRoutes from "./routes/auth";

/** Shared Express API used by local bridge and Cloud Functions */
export function createApiApp() {
  const app = express();
  app.use(express.json({ limit: "5mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "templeo-cv" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/cvs", cvsRoutes);
  app.use("/api/economy", economyRoutes);

  return app;
}
