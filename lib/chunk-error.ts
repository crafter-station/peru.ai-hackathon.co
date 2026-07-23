/**
 * Detection + one-time recovery for webpack/Next.js chunk-load failures.
 *
 * When a new version is deployed, or the CDN is momentarily slow, a client that
 * still holds the previous HTML tries to fetch chunk URLs that have either been
 * replaced (404) or time out. These surface as an unhandled `ChunkLoadError`
 * ("Loading chunk NNNN failed"), which leaves public pages like `/p/[number]`
 * blank because their JavaScript never boots. A single reload fetches fresh
 * HTML pointing at the current chunks and recovers the page.
 */

// Only reload once within this window to avoid an infinite reload loop when the
// failure is persistent (e.g. a genuinely missing chunk on the CDN).
const RELOAD_COOLDOWN_MS = 10_000;
const RELOAD_STORAGE_KEY = "chunk-load-reloaded-at";

/**
 * Returns true when the given value looks like a webpack/Next.js chunk-load
 * failure, covering JS chunks, CSS chunks and dynamically imported modules.
 */
export function isChunkLoadError(value: unknown): boolean {
  if (!value) return false;

  const name =
    typeof value === "object" && value !== null && "name" in value
      ? String((value as { name?: unknown }).name)
      : "";

  const message =
    typeof value === "string"
      ? value
      : typeof value === "object" && value !== null && "message" in value
        ? String((value as { message?: unknown }).message)
        : "";

  if (name === "ChunkLoadError") return true;

  return (
    /Loading chunk [^\s]+ failed/i.test(message) ||
    /Loading CSS chunk [^\s]+ failed/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    /(error )?loading dynamically imported module/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message)
  );
}

/**
 * Triggers a one-time page reload to recover from a stale/failed chunk load.
 * Returns true if a reload was scheduled, false if it was suppressed to avoid
 * a reload loop. Safe to call multiple times.
 */
export function recoverFromChunkLoadError(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const last = Number(
      window.sessionStorage.getItem(RELOAD_STORAGE_KEY) ?? "0",
    );
    if (Number.isFinite(last) && Date.now() - last < RELOAD_COOLDOWN_MS) {
      // Already reloaded recently — the failure is persistent, so stop retrying
      // and let the error surface rather than loop forever.
      return false;
    }
    window.sessionStorage.setItem(RELOAD_STORAGE_KEY, String(Date.now()));
  } catch {
    // sessionStorage can be unavailable (private mode, blocked cookies). Fall
    // through and still attempt a single reload.
  }

  window.location.reload();
  return true;
}
