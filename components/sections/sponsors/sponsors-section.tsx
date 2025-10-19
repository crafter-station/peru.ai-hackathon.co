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

        {/* Premium sponsor grid with perfect spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-center justify-items-center max-w-5xl mx-auto">
          {/* Sponsor 1 - Yavendió */}
          <a
            href="https://www.yavendio.com/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/1.png"
              alt="Yavendió"
              width={400}
              height={400}
              quality={100}
              className="w-full h-24 md:h-32 object-cover object-center relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 2 - ElevenLabs */}
          <a
            href="https://elevenlabs.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/2.png"
              alt="ElevenLabs"
              width={400}
              height={400}
              quality={100}
              className="w-full h-24 md:h-32 object-cover object-center relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 3 - forHuman */}
          <a
            href="https://en.forhuman.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/3.png"
              alt="forHuman"
              width={400}
              height={400}
              quality={100}
              className="w-full h-24 md:h-32 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
