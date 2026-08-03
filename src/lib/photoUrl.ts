/** Google sirve s96 por defecto; para CV pedimos más resolución. */
export function normalizePhotoUrl(url: string): string {
  if (!url) return url;
  if (url.includes("googleusercontent.com")) {
    return url.replace(/=s\d+(-c)?/, "=s400$1");
  }
  return url;
}
