"use client";

/**
 * Challenge section explaining the hackathon format
 */
export default function ChallengeSection() {
  return (
    <section className="bg-background dither-bg border-t py-6 md:py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px bg-brand-red/30 w-12"></div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              FORMATO ABIERTO
            </span>
            <div className="h-px bg-brand-red/30 w-12"></div>
          </div>
          <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight leading-tight uppercase">
            CONSTRUYE ALGO
            <br />
            INCREÍBLE
          </h2>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-base md:text-lg leading-relaxed mb-6">
              <span className="font-bold text-foreground">IA HACKATHON</span> es
              de carácter abierto. No hay un problema específico por resolver,
              eres libre de explorar los problemas e ideas que más te apasionen.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Queremos ver productos increíbles empujados por un equipos
              completamente apasionados y obsesionados.
            </p>
          </div>

          {/* Registration CTA */}
          <div className="border-t pt-8 mt-8 text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <a
                href="https://luma.com/slqfykte"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-3 bg-brand-red text-white font-bold text-lg border-0 rounded-none hover:bg-brand-red/90"
              >
                <div className="flex items-center justify-center w-6 h-2 bg-white/10 rounded-sm">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
                <span className="tracking-wide uppercase text-sm font-black">
                  REGISTRARSE AHORA
                </span>
              </a>
              <p className="text-muted-foreground text-xs max-w-xs">
                Las inscripciones son{" "}
                <span className="font-medium">individuales</span>. Los
                participantes que sean aceptados formarán grupos de máximo 5
                personas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
