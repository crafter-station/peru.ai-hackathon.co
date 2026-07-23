"use client";

import { useEffect } from "react";
import { isChunkLoadError, recoverFromChunkLoadError } from "@/lib/chunk-error";

/**
 * Listens for unhandled chunk-load failures (which are reported with
 * `handled: false` in error tracking and therefore never reach a React error
 * boundary) and performs a one-time reload to recover the page. Mounted once in
 * the root layout so it protects every route, including the public
 * `/p/[number]` profile pages where the failure was observed.
 */
export function ChunkErrorHandler() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (isChunkLoadError(event.error) || isChunkLoadError(event.message)) {
        recoverFromChunkLoadError();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadError(event.reason)) {
        recoverFromChunkLoadError();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
