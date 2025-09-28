import { createHash } from "crypto";
import { nanoid } from "nanoid";

export function createAnonymousUserId(
  ip: string | null,
  userAgent: string | null,
  acceptLanguage: string | null,
  acceptEncoding: string | null,
  authHashKey: string = process.env.AUTH_HASH_KEY || "default-secret"
): string {
  // Create deterministic ID from client fingerprint as fallback
  const clientFingerprint = [
    authHashKey,                    // Server secret (ENV variable)
    ip || "unknown",               // x-forwarded-for, x-real-ip, cf-connecting-ip
    userAgent || "unknown",        // browser signature
    acceptLanguage || "unknown",   // language preferences  
    acceptEncoding || "unknown",   // compression preferences
  ].join("|");

  const hash = createHash("sha256").update(clientFingerprint).digest("hex");
  return `user_${hash.substring(0, 16)}`;
}

export function getClientIP(headers: Headers): string | null {
  // Check various headers for the real IP
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("x-client-ip") ||
    null
  );
}

export function generateRandomAnonId(): string {
  return `anon_${nanoid()}`;
}
