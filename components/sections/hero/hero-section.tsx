"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import useSound from "use-sound";
import { Button } from "@/components/ui/button";
import { Background3DScene } from "./background-3d-scene";
import { LoadingOverlay } from "./loading-overlay";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Hero section with Peruvian-themed IA HACKATHON display
 */
export default function HeroSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [scene3DLoaded, setScene3DLoaded] = useState(false);
  const [enableControls, setEnableControls] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [backdropOpacity, setBackdropOpacity] = useState(0.8);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Button click sound
  const [play] = useSound("/sounds/bite.mp3", { volume: 0.5 });

  // Scroll to next section
  const scrollToNextSection = () => {
    play();
    const nextSection = document.querySelector('footer');
    if (nextSection) {
      nextSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handle3DLoad = () => {
    setScene3DLoaded(true);
  };

  useEffect(() => {
    if (scene3DLoaded) {
      // Wait a moment after 3D loads, then hide loading and show content
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 50);

      const visibilityTimer = setTimeout(() => {
        setIsVisible(true);
      }, 50);

      return () => {
        clearTimeout(loadingTimer);
        clearTimeout(visibilityTimer);
      };
    }
  }, [scene3DLoaded]);

  // Handle scroll detection to disable 3D controls during scrolling (desktop only)
  useEffect(() => {
    // Skip scroll detection on mobile - let touch events handle 3D interaction
    if (isMobile) return;

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

    // Add scroll listeners for desktop only
    window.addEventListener("scroll", handleScrollEvent, { passive: true });
    window.addEventListener("wheel", handleScrollEvent, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
      window.removeEventListener("wheel", handleScrollEvent);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMobile]);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 3D Background with Machu Picchu environment */}
      <div
        className="absolute inset-0 z-10 transition-all duration-200"
        style={{
          pointerEvents: isMobile ? "none" : enableControls ? "auto" : "none",
          touchAction: isMobile ? "pan-y" : "none",
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ touchAction: isMobile ? "pan-y" : "none" }}
        >
          <Background3DScene
            onLoad={handle3DLoad}
            enableControls={isMobile ? false : enableControls}
          />
        </Canvas>
      </div>

      {/* Loading overlay */}
      <LoadingOverlay isLoading={isLoading} />

      {/* Custom dark backdrop for 3D scene - adjustable opacity */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-15"
        style={{ opacity: backdropOpacity }}
      />

      {/* Enhanced overlay for better contrast and visual depth - non-interactive */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 pointer-events-none z-20" />

      {/* Subtle brand gradient overlay with improved vibrancy - non-interactive */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-red-900/15 via-transparent to-red-900/15 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(135deg, #B91F2E15 0%, rgba(185, 31, 46, 0.08) 30%, transparent 50%, rgba(185, 31, 46, 0.08) 70%, #B91F2E15 100%)",
          mixBlendMode: "overlay",
        }}
      />

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
      <div className="relative z-50 text-center px-4 md:px-8 max-w-6xl mx-auto pointer-events-none">
        {/* Interactive elements will use inline style for pointer-events: auto */}
        {/* Main logo: IA HACKATHON Brand - Always visible in exact same position */}
        <div className="mb-8 md:mb-12 opacity-100">
          <div className="flex justify-center items-center">
            <Image
              src="/IA_HACK_BRAND.svg"
              alt="IA HACKATHON"
              width={800}
              height={200}
              className="w-full max-w-xl h-auto"
              priority
            />
          </div>
        </div>

        {/* Organizer and Partnership logos */}
        <div
          className={`
          mb-8 md:mb-12 transition-all duration-300 transform
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        `}
          style={{ transitionDelay: "100ms" }}
        >
          {/* The Hackathon Company */}
          <div className="flex justify-center items-center mb-4">
            <a
              href="https://hackathon.lat/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity duration-300 hover:opacity-80"
              style={{ pointerEvents: "auto" }}
            >
              <Image
                src="/THC-BRAND-WHITE.svg"
                alt="By The Hackathon Company"
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto transition-all duration-300 cursor-pointer"
                style={{
                  filter: "brightness(1.1) contrast(1.2)",
                  opacity: "0.95",
                }}
              />
            </a>
          </div>

          {/* Partnership with MAKERS */}
          <div className="flex justify-center items-center">
            <a
              href="https://makers.ngo/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity duration-300 hover:opacity-80"
              style={{ pointerEvents: "auto" }}
            >
              <Image
                src="/partner_makers.svg"
                alt="In partnership with MAKERS"
                width={180}
                height={32}
                className="h-6 md:h-8 w-auto transition-all duration-300 cursor-pointer"
                style={{
                  filter: "brightness(1.1) contrast(1.2)",
                  opacity: "0.95",
                }}
              />
            </a>
          </div>
        </div>

        {/* Description */}
        <div
          className={`
          max-w-xl mx-auto mb-8 transition-all duration-300 transform
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
          style={{ transitionDelay: "150ms" }}
        >
          <p
            className="text-lg md:text-xl text-white leading-relaxed mb-2 drop-shadow-lg"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
          >
            Únete al evento de inteligencia artificial más importante del Perú
          </p>
          <p
            className="text-base md:text-lg text-gray-200 drop-shadow-lg"
            style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)" }}
          >
            Innovación • Tecnología • Futuro
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className={`
          flex flex-col gap-4 justify-center items-center
          transition-all duration-300 transform
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
          style={{ transitionDelay: "200ms" }}
        >
          <Button
            asChild
            size="lg"
            onClick={() => play()}
            className="px-8 py-4 bg-brand-red text-white font-bold text-lg border-0 rounded-none hover:bg-brand-red/90"
            style={{ pointerEvents: "auto" }}
          >
            <a
              href="https://chat.whatsapp.com/H6RV2cFfL47CCXVzVmHedR?mode=ems_share_t"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <div className="flex items-center justify-center w-6 h-6 bg-white/10 rounded-sm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" />
                </svg>
              </div>
              <span className="tracking-wide uppercase text-sm font-black">
                Únete al WhatsApp
              </span>
            </a>
          </Button>

          <Button
            size="lg"
            onClick={scrollToNextSection}
            className="px-8 py-4 text-white font-bold text-lg bg-transparent border-0 rounded-none hover:bg-white/5 transition-all duration-300 group"
            style={{ pointerEvents: "auto" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 transition-transform duration-300 group-hover:translate-y-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="m7 13 5 5 5-5" />
                  <path d="m7 6 5 5 5-5" />
                </svg>
              </div>
              <span className="tracking-wide uppercase text-sm font-black">
                Ver más
              </span>
            </div>
          </Button>
        </div>
      </div>

      {/* Opacity Control Panel - Commented out, using 70% default */}
      {/* <div className="absolute top-6 right-6 z-40 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="text-white text-sm font-medium mb-2">Backdrop Opacity</div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={backdropOpacity}
            onChange={(e) => setBackdropOpacity(parseFloat(e.target.value))}
            className="w-32 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{ pointerEvents: 'auto' }}
          />
          <span className="text-white text-sm font-mono min-w-[3rem] text-right">
            {Math.round(backdropOpacity * 100)}%
          </span>
        </div>
      </div> */}
    </section>
  );
}
