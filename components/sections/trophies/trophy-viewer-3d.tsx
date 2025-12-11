"use client";

import { Suspense, useMemo, useState, useEffect, ErrorInfo, Component } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";

type TrophyViewer3DProps = {
  stlUrl: string;
  className?: string;
};

class TrophyErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[TrophyViewer] Error loading trophy:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function TrophyModel({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);

  geometry.computeVertexNormals();

  const scale = useMemo(() => {
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

function Scene({ stlUrl }: { stlUrl: string }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      <TrophyModel url={stlUrl} />
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

export default function TrophyViewer3D({
  stlUrl,
  className = "",
}: TrophyViewer3DProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const errorFallback = (
    <div className="w-full h-full flex items-center justify-center bg-black/50">
      <div className="text-center p-4">
        <p className="text-white/60 text-sm">No se pudo cargar el modelo 3D</p>
      </div>
    </div>
  );

  return (
    <div className={`w-full h-full ${className}`}>
      <TrophyErrorBoundary fallback={errorFallback}>
        <Canvas
          className="w-full h-full touch-none"
          gl={{ antialias: !isMobile, alpha: true }}
          dpr={isMobile ? 1 : [1, 2]}
        >
          <Suspense
            fallback={
              <>
                <ambientLight intensity={0.5} />
                <mesh>
                  <boxGeometry args={[2, 2, 2]} />
                  <meshStandardMaterial color="#333" wireframe />
                </mesh>
              </>
            }
          >
            <Scene stlUrl={stlUrl} />
          </Suspense>
        </Canvas>
      </TrophyErrorBoundary>
    </div>
  );
}

