"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSound from "use-sound";

export default function WorkshopsHeroSection() {
  const [play] = useSound("/sounds/bite.mp3", { volume: 0.5 });

  return (
    <section className="min-h-[40vh] flex items-center justify-center relative overflow-hidden py-8 md:py-12">
      {/* Background Image */}
      <div className="absolute inset-0 z-10">
        <Image
          src="https://26evcbcedv5nczlx.public.blob.vercel-storage.com/machu-picchu-darker-low-1x-B.jpeg"
          alt="Machu Picchu Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/80 z-15" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 z-20" />
      <div
        className="absolute inset-0 z-20"
        style={{
          background:
            "linear-gradient(135deg, #B91F2E15 0%, rgba(185, 31, 46, 0.08) 30%, transparent 50%, rgba(185, 31, 46, 0.08) 70%, #B91F2E15 100%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Content */}
      <div className="relative z-50 text-center px-4 md:px-8 max-w-4xl mx-auto pointer-events-none my-8 md:my-0">
        {/* Main Title */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px bg-brand-red/30 w-8"></div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              IA HACKATHON PERÚ 2025
            </span>
            <div className="h-px bg-brand-red/30 w-8"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight uppercase text-white">
            WORKSHOPS Y TALLERES
          </h1>
          <p className="text-lg md:text-xl text-white leading-relaxed mb-2 drop-shadow-lg max-w-2xl mx-auto">
            Aprende de los expertos en sesiones prácticas que te prepararán para
            el hackathon
          </p>
          <p className="text-base md:text-lg text-gray-200 drop-shadow-lg">
            Del 18 al 28 de Noviembre • Online y Gratuito
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
          <Button
            asChild
            size="lg"
            onClick={() => play()}
            className="w-full sm:w-auto px-8 py-4 bg-brand-red text-white font-bold text-lg border-0 rounded-none hover:bg-brand-red/90"
            style={{ pointerEvents: "auto" }}
          >
            <Link href="/" className="flex items-center justify-center gap-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="tracking-wide uppercase text-sm font-black">
                Volver al inicio
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
