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
              <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
                con el apoyo de
              </span>
              <div className="h-px bg-brand-red w-8 md:w-24"></div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight bg-gradient-to-r from-foreground via-foreground to-brand-red/80 bg-clip-text text-transparent">
              {/* PATROCINADORES */}
            </h2>
          </div>
        </div>

        {/* Main Sponsors - Featured prominently */}
        <div className="mb-10 md:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center justify-items-center max-w-3xl mx-auto">
            {/* Sponsor - Cayetano */}
            <a
              href="https://cayetano.edu.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-5 rounded-xl border border-brand-red/20 bg-gradient-to-br from-brand-red/5 via-white/[0.02] to-transparent hover:border-brand-red/40 hover:from-brand-red/8 hover:shadow-md hover:shadow-brand-red/10 transition-all duration-300 w-full flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <Image
                src="/logo_cayetano_BN_1.png"
                alt="Cayetano"
                width={400}
                height={400}
                quality={100}
                className="w-full h-28 md:h-36 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
              />
            </a>

            {/* Sponsor - Bioincuba */}
            <a
              href="https://bioincuba.cayetano.pe/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-5 rounded-xl border border-brand-red/20 bg-gradient-to-br from-brand-red/5 via-white/[0.02] to-transparent hover:border-brand-red/40 hover:from-brand-red/8 hover:shadow-md hover:shadow-brand-red/10 transition-all duration-300 w-full flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <Image
                src="/logo_bioincuba_BN_1.png"
                alt="Bioincuba"
                width={400}
                height={400}
                quality={100}
                className="w-full h-28 md:h-36 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
              />
            </a>
          </div>
        </div>

        {/* Premium sponsor grid with perfect spacing - 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center justify-items-center max-w-6xl mx-auto">
          {/* Sponsor 1 - Yavendió */}
          <a
            href="https://www.yavendio.com/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/1.png"
              alt="Yavendió"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-cover object-center relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 2 - ElevenLabs */}
          <a
            href="https://elevenlabs.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/2.png"
              alt="ElevenLabs"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-cover object-center relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 3 - forHuman */}
          <a
            href="https://en.forhuman.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/3.png"
              alt="forHuman"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 4 - Cursor */}
          <a
            href="https://cursor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/logo_cursor.svg"
              alt="Cursor"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 5 - Lovable */}
          <a
            href="https://lovable.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/logo_lovable.svg"
              alt="Lovable"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 9 - Leasy */}
          <a
            href="https://v0.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/v0-logo-dark.png"
              alt="v0"
              width={150}
              height={150}
              quality={100}
              className="w-3/4 h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 6 - Repensar */}
          <a
            href="https://repensar.la"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/logo_repensar_logo.png"
              alt="Repensar"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 7 - Valtec */}
          <a
            href="https://www.valtecconsultores.com.pe/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/_logo_logo-valtec.png"
              alt="Valtec"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 8 - Nutriera */}
          <a
            href="https://www.linkedin.com/company/nutriera/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/_logo_logo nutriera.png"
              alt="Nutriera"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 9 - Leasy */}
          <a
            href="https://leasyauto.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/_logo_Logo Leasy.png"
              alt="Leasy"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 10 - Finity */}
          <a
            href="https://www.finity.com.co/es"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/_logo_logo finity.png"
              alt="Finity"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 11 - Cloud Forge AI */}
          <a
            href="https://www.cloud-forge-ai.com/en"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/_logo_logo cloud forge ai.png"
              alt="Cloud Forge AI"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 12 - Jesus Velez Santiago */}
          <a
            href="https://jvelezmagic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/_logo_jesus  velez santiago.png"
              alt="Jesus Velez Santiago"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 13 - Huawei */}
          <a
            href="https://www.huawei.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center md:col-start-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/_logo_Logo-Huawei.png"
              alt="Huawei"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 14 - Clerk */}
          <a
            href="https://clerk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/_logo_Logo-Clerk.png"
              alt="Clerk"
              width={300}
              height={300}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
            />
          </a>

          {/* Sponsor 9 - Leasy */}
          <a
            href="https://pe.littlecaesars.com/es-pe/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-4 py-3 rounded-xl border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:border-white/10 hover:from-white/[0.04] transition-all duration-300 w-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <Image
              src="/logo-little-caesars.png"
              alt="Little Caesars"
              width={250}
              height={250}
              quality={100}
              className="w-full h-20 md:h-24 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300 invert-100"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
