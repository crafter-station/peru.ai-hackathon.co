"use client";

import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { isMobile } from "../../../lib/utils";

/**
 * 3D Background Scene with rotating environment
 */
export const Background3DScene = ({ onLoad, enableControls }: { onLoad?: () => void; enableControls: boolean }) => {
  const orbitControlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const frameCount = useRef(0);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  // Use frame hook to detect when scene is ready
  useFrame(() => {
    frameCount.current += 1;
    // After a few frames, consider the scene loaded
    if (frameCount.current === 10 && onLoad) {
      onLoad();
    }
  });

  return (
    <>
        <OrbitControls
          ref={orbitControlsRef}
          enableZoom={enableControls}
          enablePan={enableControls}
          enableRotate={enableControls}
          autoRotate={true}
          autoRotateSpeed={isMobileDevice ? 0.2 : 0.3}
          minDistance={3}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          dampingFactor={isMobileDevice ? 0.08 : 0.05}
          enableDamping={true}
          zoomSpeed={isMobileDevice ? 0.6 : 0.8}
          panSpeed={isMobileDevice ? 0.6 : 0.8}
          rotateSpeed={isMobileDevice ? 0.4 : 0.5}
        />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />

      <Environment
        // files="https://26evcbcedv5nczlx.public.blob.vercel-storage.com/machu-picchu-darker-low-1x.jpg"
        files="https://26evcbcedv5nczlx.public.blob.vercel-storage.com/machu-picchu-1X.jpg"
        // files="https://26evcbcedv5nczlx.public.blob.vercel-storage.com/machu-pichu-dark-1x-low.jpg"
        background
      />
    </>
  );
};
