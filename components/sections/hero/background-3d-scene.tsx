"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

/**
 * 3D Background Scene with auto-rotating environment - simplified and non-interactive
 */
export const Background3DScene = ({ onLoad }: { onLoad?: () => void }) => {
  const orbitControlsRef = useRef<React.ElementRef<typeof OrbitControls>>(null);
  const frameCount = useRef(0);

  // Set default tilt to 60 degrees
  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.setPolarAngle(Math.PI / 2.5); // ~60 degrees to show Machu Picchu better
    }
  }, []);

  // Use frame hook to detect when scene is ready
  useFrame(() => {
    frameCount.current += 1;
    // After a few frames, consider the scene loaded
    if (frameCount.current === 5 && onLoad) {
      onLoad();
    }
  });

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate={true}
        autoRotateSpeed={0.25}
        enableDamping={true}
        dampingFactor={0.05}
      />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />

      <Environment
        files="https://26evcbcedv5nczlx.public.blob.vercel-storage.com/machu-picchu-darker-low-1x-B.jpeg"
        background
      />
    </>
  );
};
