"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Image from "next/image";

// Import the block letter components from ia-hackathon-blocks
/**
 * Block-style letter component to simulate Minecraft/3D block font
 */
const BlockLetter = ({ letter, size = 'large' }: { letter: string; size?: 'large' | 'small' }) => {
  const getLetterBlocks = (letter: string) => {
    const patterns: Record<string, number[][]> = {
      A: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
      ],
      I: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
      ],
      H: [
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
      ],
      C: [
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 1, 1, 1],
      ],
      K: [
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 0],
        [1, 0, 1, 0],
        [1, 0, 0, 1],
      ],
      T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
      O: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0],
      ],
      N: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
      ],
    };
    return patterns[letter] || patterns['A'];
  };

  const pattern = getLetterBlocks(letter);
  const blockSize = size === 'large' ? 'w-3 h-3 md:w-4 md:h-4' : 'w-2 h-2 md:w-3 md:h-3';
  
  return (
    <div className="inline-block mx-1">
      {pattern.map((row, rowIndex) => (
        <div key={`${letter}-r${rowIndex}-${row.join('')}`} className="flex">
          {row.map((block, colIndex) => (
            <div
              key={`${letter}-b${rowIndex}${colIndex}-${block}`}
              className={`${blockSize} ${block ? 'bg-white' : 'bg-transparent'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * 3D Background Scene with rotating environment
 */
const Background3DScene = ({ onLoad }: { onLoad?: () => void }) => {
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
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={3}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          dampingFactor={0.05}
          enableDamping={true}
          zoomSpeed={0.8}
          panSpeed={0.8}
          rotateSpeed={0.5}
        />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />

      <Environment
        files={
          isMobileDevice
            ? "https://26evcbcedv5nczlx.public.blob.vercel-storage.com/machu-picchu-1X.jpg"
            : "https://26evcbcedv5nczlx.public.blob.vercel-storage.com/machu-picchu-1X.jpg"
        }
        background
      />
    </>
  );
};

/**
 * Loading component that shows 2D "IA HACKATHON" text while 3D model loads
 */
const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className={`
      absolute inset-0 z-40 flex items-center justify-center bg-background
      transition-all duration-500 transform
      ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <div className="text-center">
        {/* IA text using block letters */}
        <div className="flex justify-center items-center mb-6">
          <BlockLetter letter="I" size="large" />
          <BlockLetter letter="A" size="large" />
        </div>
        
        {/* HACKATHON text using block letters */}
        <div className="flex justify-center items-center flex-wrap mb-6">
          <BlockLetter letter="H" size="small" />
          <BlockLetter letter="A" size="small" />
          <BlockLetter letter="C" size="small" />
          <BlockLetter letter="K" size="small" />
          <BlockLetter letter="A" size="small" />
          <BlockLetter letter="T" size="small" />
          <BlockLetter letter="H" size="small" />
          <BlockLetter letter="O" size="small" />
          <BlockLetter letter="N" size="small" />
        </div>
        
        {/* Simple loading indicator */}
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-white animate-pulse"></div>
          <div className="w-2 h-2 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Hero section with Peruvian-themed IA HACKATHON display
 */
export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scene3DLoaded, setScene3DLoaded] = useState(false);

  const handle3DLoad = () => {
    setScene3DLoaded(true);
  };

  useEffect(() => {
    if (scene3DLoaded) {
      // Wait a moment after 3D loads, then hide loading and show content
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      const visibilityTimer = setTimeout(() => {
        setIsVisible(true);
      }, 800);

      return () => {
        clearTimeout(loadingTimer);
        clearTimeout(visibilityTimer);
      };
    }
  }, [scene3DLoaded]);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 3D Background with Machu Picchu environment */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Background3DScene onLoad={handle3DLoad} />
        </Canvas>
      </div>

      {/* Loading overlay */}
      <LoadingOverlay isLoading={isLoading} />

      {/* Dark overlay for better text readability - non-interactive */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-20" />
      
      {/* Subtle gradient overlay with brand colors - non-interactive */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-900/20 pointer-events-none z-20" 
           style={{ background: 'linear-gradient(135deg, #B91F2E20 0%, transparent 40%, #B91F2E20 100%)' }} />

      {/* Top section with Peru flag */}
      <div className="absolute top-6 left-6 z-20">
        <div className={`
          transition-all duration-1000 transform
          ${isVisible ? 'opacity-40 translate-x-0' : 'opacity-0 -translate-x-4'}
        `} style={{ transitionDelay: '300ms' }}>
          <Image 
            src="/PE_FLAG.svg" 
            alt="Perú" 
            width={40}
            height={24}
            className="w-8 h-5 md:w-10 md:h-6 drop-shadow-sm hover:opacity-60 hover:scale-105 transition-all duration-300"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-30 text-center px-4 md:px-8 max-w-6xl mx-auto pointer-events-none">
        {/* Interactive elements will use inline style for pointer-events: auto */}
        {/* Main logo: IA HACKATHON Brand */}
        <div className={`
          mb-8 md:mb-12 transition-all duration-1000 transform
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
        `} style={{ transitionDelay: '500ms' }}>
          <div className="flex justify-center items-center">
            <Image 
              src="/IA_HACK_BRAND.svg" 
              alt="IA HACKATHON" 
              width={800}
              height={200}
              className="w-full max-w-2xl h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))' }}
              priority
            />
          </div>
        </div>

        {/* Organizer and Partnership logos */}
        <div className={`
          mb-8 md:mb-12 transition-all duration-1000 transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `} style={{ transitionDelay: '800ms' }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
            {/* The Hackathon Company */}
            <div className="flex items-center">
              <a 
                href="https://hackathon.lat/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-105"
                style={{ pointerEvents: 'auto' }}
              >
                <Image 
                  src="/BY_THC.svg" 
                  alt="By The Hackathon Company" 
                  width={120}
                  height={40}
                  className="h-8 md:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.2))' }}
                />
              </a>
            </div>
            
            {/* Partnership with MAKERS */}
            <div className="flex items-center">
              <a 
                href="https://makers.ngo/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform duration-300 hover:scale-105"
                style={{ pointerEvents: 'auto' }}
              >
                <Image 
                  src="/In_partnership_with_ MAKERS.svg" 
                  alt="In partnership with MAKERS" 
                  width={180}
                  height={32}
                  className="h-6 md:h-8 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.2))' }}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={`
          max-w-2xl mx-auto mb-12 transition-all duration-1000 transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `} style={{ transitionDelay: '1.2s' }}>
          <p className="text-lg md:text-xl text-white leading-relaxed mb-6 drop-shadow-lg">
            Únete al evento de inteligencia artificial más importante del Perú
          </p>
          <p className="text-base md:text-lg text-gray-200 drop-shadow-lg">
            Innovación • Tecnología • Futuro
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`
          flex flex-col sm:flex-row gap-4 justify-center items-center
          transition-all duration-1000 transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `} style={{ transitionDelay: '1.6s' }}>
          <button 
            className="px-8 py-4 bg-brand-red text-white font-bold text-lg rounded-lg hover:bg-brand-red-dark transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ pointerEvents: 'auto' }}
          >
            Registrarse Ahora
          </button>
          <button 
            className="px-8 py-4 bg-white text-brand-red font-bold text-lg rounded-lg border-2 border-brand-red hover:bg-red-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ pointerEvents: 'auto' }}
          >
            Ver Detalles
          </button>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center shadow-lg">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
