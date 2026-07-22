"use client";

import { Suspense, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";

type TrophyViewer3DProps = {
  stlUrl: string;
  className?: string;
};

const MAX_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 20000;
const RETRY_BASE_DELAY_MS = 1000;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Fetches and parses the trophy STL ourselves instead of relying on
 * `useLoader(STLLoader, url)`. `useLoader` rethrows fetch failures through
 * React Suspense, which lets transient mobile-network errors ("Failed to
 * fetch" / "Load failed") escape as unhandled exceptions and leaves the
 * viewer permanently broken. Owning the fetch lets us retry flaky mobile
 * connections and surface a recoverable UI without an unhandled rejection.
 */
async function fetchStlGeometry(
  url: string,
  signal: AbortSignal
): Promise<THREE.BufferGeometry> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    const attemptController = new AbortController();
    const onAbort = () => attemptController.abort();
    signal.addEventListener("abort", onAbort);
    const timeout = setTimeout(() => attemptController.abort(), ATTEMPT_TIMEOUT_MS);

    try {
      const response = await fetch(url, { signal: attemptController.signal });
      if (!response.ok) {
        throw new Error(`Trophy STL request failed with status ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return new STLLoader().parse(arrayBuffer);
    } catch (error) {
      lastError = error;
      // Caller-initiated abort (unmount / manual retry): stop, don't retry.
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_BASE_DELAY_MS * attempt);
      }
    } finally {
      clearTimeout(timeout);
      signal.removeEventListener("abort", onAbort);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to load trophy STL");
}

type LoadState =
  | { status: "loading" }
  | { status: "ready"; geometry: THREE.BufferGeometry }
  | { status: "error" };

function useStlGeometry(url: string) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [attemptKey, setAttemptKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let geometry: THREE.BufferGeometry | null = null;

    setState({ status: "loading" });

    fetchStlGeometry(url, controller.signal)
      .then((loaded) => {
        if (controller.signal.aborted) {
          loaded.dispose();
          return;
        }
        geometry = loaded;
        setState({ status: "ready", geometry: loaded });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("[TrophyViewer] Could not load trophy STL:", error);
        setState({ status: "error" });
      });

    return () => {
      controller.abort();
      geometry?.dispose();
    };
  }, [url, attemptKey]);

  const retry = useCallback(() => setAttemptKey((key) => key + 1), []);

  return { state, retry };
}

function TrophyModel({ geometry }: { geometry: THREE.BufferGeometry }) {
  const scale = useMemo(() => {
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return 1;

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2.5;
    const scaleFactor = targetSize / maxDim;

    const center = new THREE.Vector3();
    box.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);

    return scaleFactor;
  }, [geometry]);

  return (
    <mesh
      geometry={geometry}
      scale={[scale, scale, scale]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      />
    </mesh>
  );
}

function Scene({ geometry }: { geometry: THREE.BufferGeometry }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      <TrophyModel geometry={geometry} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={2.5}
        maxDistance={6}
        autoRotate={true}
        autoRotateSpeed={1}
        dampingFactor={0.05}
        enableDamping={true}
        rotateSpeed={0.5}
        touches={{
          ONE: 0,
          TWO: 2,
        }}
        zoomSpeed={0.8}
      />
    </>
  );
}

function LoadingOverlay() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/50">
      <div className="text-center p-4">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-brand-red/30 border-t-brand-red" />
        <p className="text-white/60 text-sm">Cargando modelo 3D…</p>
      </div>
    </div>
  );
}

function ErrorOverlay({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/50">
      <div className="text-center p-4">
        <p className="text-white/60 text-sm mb-3">No se pudo cargar el modelo 3D</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 border border-brand-red/40 bg-brand-red/10 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-red/20 touch-manipulation min-h-[44px]"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export default function TrophyViewer3D({
  stlUrl,
  className = "",
}: TrophyViewer3DProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { state, retry } = useStlGeometry(stlUrl);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      {state.status === "loading" && <LoadingOverlay />}
      {state.status === "error" && <ErrorOverlay onRetry={retry} />}
      {state.status === "ready" && (
        <Canvas
          className="w-full h-full touch-none"
          gl={{ antialias: !isMobile, alpha: true }}
          dpr={isMobile ? 1 : [1, 2]}
        >
          <Suspense fallback={null}>
            <Scene geometry={state.geometry} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
