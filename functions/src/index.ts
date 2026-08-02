import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { createApiApp } from "./api/createApp";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

const app = createApiApp();

export const api = onRequest(
  {
    secrets: [geminiApiKey],
    cors: true,
    region: "us-central1",
    memory: "512MiB",
    timeoutSeconds: 120,
  },
  (req, res) => {
    process.env.GEMINI_API_KEY = geminiApiKey.value();
    process.env.ALLOW_UNAUTHENTICATED_AI = "false";
    process.env.GCLOUD_PROJECT =
      process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || "templeo-cv";
    return app(req, res);
  }
);
