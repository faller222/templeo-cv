import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createApiApp } from "./functions/src/api/createApp";

dotenv.config();

// Local bridge: allow AI without Firebase token until Auth UI is used
if (process.env.ALLOW_UNAUTHENTICATED_AI === undefined) {
  process.env.ALLOW_UNAUTHENTICATED_AI = "true";
}

const app = createApiApp();
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TempleoCV bridge on http://0.0.0.0:${PORT}`);
  });
}

startServer();
