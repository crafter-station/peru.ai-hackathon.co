"use client";

import { useEffect } from "react";
import { isChunkLoadError, recoverFromChunkLoadError } from "@/lib/chunk-error";

/**
 * Root error boundary. Catches errors that bubble up through the React tree,
 * including chunk-load failures thrown during rendering/hydration. For a
 * chunk-load error we attempt a single automatic reload to fetch fresh assets;
 * for anything else (or a persistent chunk failure) we show a minimal fallback
 * with a manual retry so the page never stays blank.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const chunkError = isChunkLoadError(error);

  useEffect(() => {
    if (chunkError) {
      recoverFromChunkLoadError();
    }
  }, [chunkError]);

  return (
    <html lang="es-PE">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            {chunkError ? "Actualizando… 🦙" : "Algo salió mal 🦙"}
          </h1>
          <p style={{ color: "#a1a1aa", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
            {chunkError
              ? "Estamos recargando la página para obtener la última versión."
              : "Ocurrió un error inesperado. Vuelve a intentarlo."}
          </p>
          <button
            type="button"
            onClick={() =>
              chunkError ? window.location.reload() : reset()
            }
            style={{
              cursor: "pointer",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              color: "#fafafa",
              backgroundColor: "transparent",
              border: "1px solid #3f3f46",
              borderRadius: "0.375rem",
            }}
          >
            Recargar
          </button>
        </div>
      </body>
    </html>
  );
}
