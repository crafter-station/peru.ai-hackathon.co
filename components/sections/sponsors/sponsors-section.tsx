"use client";

import Image from "next/image";

/**
 * Clean sponsors section with amazing logo presentation
 */
export default function SponsorsSection() {
  return (
    <section className="bg-background dither-bg border-t py-6 md:py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="relative mb-8">
          {/* Background decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-32 h-32 bg-brand-red rounded-full blur-3xl"></div>
          </div>

          {/* Title with red accents */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-px bg-brand-red w-8 md:w-24"></div>
              <div className="px-3 py-1 bg-gradient-to-r from-brand-red/10 to-brand-red/5 border border-brand-red/20 rounded">
                <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
                  POWERED BY
                </span>
              </div>
              <div className="h-px bg-brand-red w-8 md:w-24"></div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight bg-gradient-to-r from-foreground via-foreground to-brand-red/80 bg-clip-text text-transparent">
              PATROCINADORES
            </h2>
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href="https://elevenlabs.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/elevenlabs-logo-white.png"
              alt="ElevenLabs"
              width={240}
              height={80}
              quality={100}
              className="h-8 md:h-10 w-auto"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
