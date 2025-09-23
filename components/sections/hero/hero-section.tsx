"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * 3D Background Scene with rotating environment
 */
const Background3DScene = () => {
  const orbitControlsRef = useRef<any>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.5}
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
 * Block-style letter component using Peruvian flag colors
 */
const BlockLetter = ({ 
  letter, 
  size = 'large',
  colorScheme = 'red' 
}: { 
  letter: string; 
  size?: 'large' | 'medium' | 'small';
  colorScheme?: 'red' | 'white';
}) => {
  const getLetterBlocks = (letter: string) => {
    const patterns: Record<string, number[][]> = {
      I: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 1],
      ],
      A: [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
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
  
  // Size configurations
  const sizeClasses = {
    large: 'w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8',
    medium: 'w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5',
    small: 'w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4'
  };

  // Peruvian flag colors
  const colorClasses = {
    red: 'bg-red-600 shadow-red-800/50',
    white: 'bg-white shadow-gray-400/50 border border-gray-200'
  };
  
  return (
    <div className="inline-block mx-1 md:mx-2">
      {pattern.map((row, rowIndex) => (
        <div key={`${letter}-r${rowIndex}`} className="flex">
          {row.map((block, colIndex) => (
            <div
              key={`${letter}-b${rowIndex}${colIndex}`}
              className={`
                ${sizeClasses[size]} 
                ${block ? `${colorClasses[colorScheme]} shadow-lg` : 'bg-transparent'}
                transition-all duration-300 hover:scale-110
              `}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Animated text component that reveals letters sequentially
 */
const AnimatedText = ({ 
  text, 
  size = 'large',
  colorScheme = 'red',
  delay = 0 
}: { 
  text: string; 
  size?: 'large' | 'medium' | 'small';
  colorScheme?: 'red' | 'white';
  delay?: number;
}) => {
  const [visibleLetters, setVisibleLetters] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleLetters(prev => {
          if (prev < text.length) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 150);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text.length, delay]);

  return (
    <div className="flex justify-center items-center flex-wrap">
      {text.split('').map((letter, index) => (
        <div
          key={`${letter}-${index}`}
          className={`
            transition-all duration-500 transform
            ${index < visibleLetters 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-4 scale-95'
            }
          `}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          {letter === ' ' ? (
            <div className="w-4 md:w-6 lg:w-8" />
          ) : (
            <BlockLetter letter={letter} size={size} colorScheme={colorScheme} />
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Hero section with Peruvian-themed IA HACKATHON display
 */
export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 3D Background with Machu Picchu environment */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Background3DScene />
        </Canvas>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Subtle gradient overlay with Peruvian colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-900/20" />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 md:px-8 max-w-6xl mx-auto">
        {/* Main title: IA */}
        <div className={`
          mb-8 md:mb-12 transition-all duration-1000 transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
          <AnimatedText text="IA" size="large" colorScheme="red" delay={500} />
        </div>

        {/* Subtitle: HACKATHON */}
        <div className={`
          mb-12 md:mb-16 transition-all duration-1000 transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
          <AnimatedText text="HACKATHON" size="medium" colorScheme="white" delay={1500} />
        </div>

        {/* Description */}
        <div className={`
          max-w-2xl mx-auto mb-12 transition-all duration-1000 transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `} style={{ transitionDelay: '2.5s' }}>
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
        `} style={{ transitionDelay: '3s' }}>
          <button className="
            px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-lg
            hover:bg-red-700 transform hover:scale-105 transition-all duration-300
            shadow-lg hover:shadow-xl
          ">
            Registrarse Ahora
          </button>
          <button className="
            px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-lg border-2 border-red-600
            hover:bg-red-50 transform hover:scale-105 transition-all duration-300
            shadow-lg hover:shadow-xl
          ">
            Ver Detalles
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-4 md:left-8 opacity-30">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
        </div>
        <div className="absolute bottom-1/4 right-4 md:right-8 opacity-30">
          <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-full animate-pulse shadow-lg shadow-white/50" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-20">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50" style={{ animationDelay: '2s' }} />
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
