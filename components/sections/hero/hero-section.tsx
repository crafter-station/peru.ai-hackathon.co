"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import useSound from "use-sound";
import { Button } from "@/components/ui/button";
import { Background3DScene } from "./background-3d-scene";
import { LoadingOverlay } from "./loading-overlay";

/**
 * Hero section with Peruvian-themed IA HACKATHON display
 */
export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scene3DLoaded, setScene3DLoaded] = useState(false);
  const [enableControls, setEnableControls] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Button click sound
  const [play] = useSound("/sounds/bite.mp3", { volume: 0.5 });

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

  // Handle scroll detection to disable 3D controls during scrolling
  useEffect(() => {
    const handleScrollEvent = () => {
      // Disable controls when scrolling
      setEnableControls(false);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Re-enable controls after scrolling stops (300ms delay for responsiveness)
      scrollTimeoutRef.current = setTimeout(() => {
        setEnableControls(true);
      }, 300);
    };

    // Add both scroll and wheel listeners for comprehensive scroll detection
    window.addEventListener('scroll', handleScrollEvent, { passive: true });
    window.addEventListener('wheel', handleScrollEvent, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScrollEvent);
      window.removeEventListener('wheel', handleScrollEvent);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 3D Background with Machu Picchu environment */}
      <div 
        className="absolute inset-0 z-10 transition-all duration-200" 
        style={{ pointerEvents: enableControls ? 'auto' : 'none' }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Background3DScene onLoad={handle3DLoad} enableControls={enableControls} />
        </Canvas>
      </div>

      {/* Loading overlay */}
      <LoadingOverlay isLoading={isLoading} />

      {/* Enhanced overlay for better contrast and visual depth - non-interactive */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 pointer-events-none z-20" />

      {/* Subtle brand gradient overlay with improved vibrancy - non-interactive */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/15 via-transparent to-red-900/15 pointer-events-none z-20"
           style={{
             background: 'linear-gradient(135deg, #B91F2E15 0%, rgba(185, 31, 46, 0.08) 30%, transparent 50%, rgba(185, 31, 46, 0.08) 70%, #B91F2E15 100%)',
             mixBlendMode: 'overlay'
           }} />

      {/* Top section with Peru flag */}
      {/* <div className="absolute top-6 left-6 z-20">
        <div className={`
          transition-all duration-1000 transform
          ${isVisible ? 'opacity-40 translate-x-0' : 'opacity-0 -translate-x-4'}
        `} style={{ transitionDelay: '300ms' }}>
          <Image 
            src="/PE_FLAG.svg" 
            alt="Perú" 
            width={40}
            height={24}
            className="w-8 h-5 md:w-10 md:h-6 drop-shadow-sm hover:opacity-60 transition-opacity duration-300"
          />
        </div>
      </div> */}

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
              className="w-full max-w-2xl h-auto drop-shadow-2xl transition-opacity duration-300"
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
                className="transition-opacity duration-300 hover:opacity-80"
                style={{ pointerEvents: 'auto' }}
              >
                <Image
                  src="/BY_THC.svg"
                  alt="By The Hackathon Company"
                  width={120}
                  height={40}
                  className="h-8 md:h-10 w-auto transition-all duration-300 cursor-pointer"
                  style={{
                    filter: 'brightness(1.1) contrast(1.2) drop-shadow(0 0 12px rgba(255, 255, 255, 0.4)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                    opacity: '0.95'
                  }}
                />
              </a>
            </div>
            
            {/* Partnership with MAKERS */}
            <div className="flex items-center">
              <a 
                href="https://makers.ngo/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-opacity duration-300 hover:opacity-80"
                style={{ pointerEvents: 'auto' }}
              >
                <Image
                  src="/In_partnership_with_ MAKERS.svg"
                  alt="In partnership with MAKERS"
                  width={180}
                  height={32}
                  className="h-6 md:h-8 w-auto transition-all duration-300 cursor-pointer"
                  style={{
                    filter: 'brightness(1.1) contrast(1.2) drop-shadow(0 0 12px rgba(255, 255, 255, 0.4)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                    opacity: '0.95'
                  }}
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
          <p className="text-lg md:text-xl text-white leading-relaxed mb-6 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
            Únete al evento de inteligencia artificial más importante del Perú
          </p>
          <p className="text-base md:text-lg text-gray-200 drop-shadow-lg" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)' }}>
            Innovación • Tecnología • Futuro
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`
          flex flex-col sm:flex-row gap-4 justify-center items-center
          transition-all duration-1000 transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `} style={{ transitionDelay: '1.6s' }}>
          <Button
            asChild
            size="lg"
            onClick={() => play()}
            className="px-8 py-4 min-h-[44px] min-w-[44px] bg-brand-red text-white font-bold text-lg hover:bg-brand-red/90 transition-colors duration-300 shadow-lg"
            style={{ pointerEvents: 'auto' }}
          >
            <a
              href="https://chat.whatsapp.com/H6RV2cFfL47CCXVzVmHedR?mode=ems_share_t"
              target="_blank"
              rel="noopener noreferrer"
            >
              Únete al WhatsApp
            </a>
          </Button>
          <Button
            size="lg"
            onClick={() => {
              play();
              const detailsSection = document.getElementById('details');
              if (detailsSection) {
                detailsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-4 min-h-[44px] min-w-[44px] !bg-white !text-brand-red font-bold text-lg border-2 !border-brand-red hover:!bg-red-50 transition-colors duration-300 shadow-lg"
            style={{ pointerEvents: 'auto', backgroundColor: '#ffffff', color: 'var(--brand-red)', borderColor: 'var(--brand-red)' }}
          >
            Ver Detalles
          </Button>
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