/** Usuario cerró el popup / canceló OAuth — no es un fallo para mostrar. */
export class AuthCancelledError extends Error {
  constructor(message = "cancelled") {
    super(message);
    this.name = "AuthCancelledError";
  }
}

export function isAuthCancelled(error: unknown): boolean {
  if (error instanceof AuthCancelledError) return true;
  if (!error || typeof error !== "object") return false;

  const e = error as { name?: string; code?: string; message?: string };
  if (e.name === "AuthCancelledError") return true;
  if (
    e.code === "auth/popup-closed-by-user" ||
    e.code === "auth/cancelled-popup-request"
  ) {
    return true;
  }

  const msg = (e.message || "").toLowerCase();
  return (
    msg.includes("access_denied") ||
    msg.includes("user_cancelled") ||
    msg.includes("user_canceled")
  );
}
