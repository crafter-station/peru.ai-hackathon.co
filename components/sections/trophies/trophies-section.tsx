"use client";

import TrophyViewer3D from "./trophy-viewer-3d";

const TROPHY_STL_URL = "/api/trophy/stl";

export default function TrophiesSection() {
  return (
    <section
      id="trophies"
      className="bg-background dither-bg border-t min-h-screen px-4 md:px-6 relative overflow-hidden flex items-center"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-brand-red/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-brand-red/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-red/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full py-8 md:py-12 lg:py-20">
        {/* Section Title */}
        <div className="text-center mb-6 md:mb-8 lg:mb-12 px-2">
          <div className="inline-flex items-center gap-2 md:gap-3 mb-1">
            <div className="h-px bg-brand-red/40 w-12 md:w-16 lg:w-24"></div>
            <span className="text-brand-red text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
              TROFEO
            </span>
            <div className="h-px bg-brand-red/40 w-12 md:w-16 lg:w-24"></div>
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight leading-tight md:leading-none uppercase text-white mb-2 px-2">
            TROFEO IA HACKATHON PERÚ 2025
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xs md:text-sm lg:text-base px-4 leading-relaxed">
            Explora el trofeo diseñado especialmente para los ganadores del IA
            Hackathon Perú 2025
          </p>
        </div>

        {/* 3D Trophy Viewer */}
        <div className="mb-8 md:mb-12 lg:mb-16 px-2">
          <div className="relative aspect-square max-w-3xl mx-auto overflow-hidden border-2 border-brand-red/20 bg-black/50 group touch-none">
            <div className="absolute inset-0">
              <TrophyViewer3D
                stlUrl={TROPHY_STL_URL}
                className="w-full h-full"
              />
            </div>

            {/* Corner accents - smaller on mobile */}
            <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-brand-red/40 pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-brand-red/40 pointer-events-none z-10" />
            <div className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-brand-red/40 pointer-events-none z-10" />
            <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-brand-red/40 pointer-events-none z-10" />

            {/* Instructions overlay - mobile-friendly */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 border border-brand-red/30 pointer-events-none z-10 max-w-[90%] md:max-w-none">
              <p className="text-[10px] md:text-xs text-white/90 text-center leading-tight">
                <span className="hidden md:inline">Arrastra para rotar • Rueda del mouse para acercar/alejar</span>
                <span className="md:hidden">Toca y arrastra para rotar • Pellizca para acercar/alejar</span>
              </p>
            </div>
          </div>
        </div>

        {/* Trophy Story & Provider */}
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 px-2">
          {/* Trophy Story */}
          <div className="bg-gradient-to-br from-background/90 to-background/50 border-2 border-foreground/10 backdrop-blur-sm p-5 md:p-6 lg:p-8 relative overflow-hidden group hover:border-brand-red/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-red/5 blur-3xl opacity-50" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3 md:mb-4 lg:mb-6">
                <span className="text-[10px] md:text-xs font-mono tracking-widest text-brand-red/60 uppercase">
                  Historia del Diseño
                </span>
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-brand-red/10 border-2 border-brand-red/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shrink-0 ml-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-brand-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-base md:text-lg lg:text-xl font-bold text-white mb-3 md:mb-4 leading-tight">
                Alpaca Tech: Más que un Trofeo
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4 leading-relaxed italic">
                En una Hackatón de Inteligencia Artificial, donde el código construye el futuro, no podíamos entregar una copa genérica. Queríamos un símbolo que representara quiénes somos y hacia dónde vamos. Así nació el trofeo <strong className="text-white not-italic">"Alpaca Tech"</strong>.
              </p>
              
              <div className="space-y-3 md:space-y-4">
                <div>
                  <h4 className="text-white font-semibold text-xs md:text-sm mb-1.5 md:mb-2">
                    ¿Por qué una Alpaca?
                  </h4>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    Porque es <strong className="text-white">resistencia, adaptación y orgullo peruano</strong>. Pero esta no es una alpaca común. Diseñada bajo una estética <strong className="text-white">Low-Poly</strong> (baja poligonización), sus facetas angulares representan los datos y algoritmos que estructuran la IA.
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold text-xs md:text-sm mb-1.5 md:mb-2">
                    El Diseño
                  </h4>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                    La figura se mantiene firme, equipada con un <strong className="text-white">casco tecnológico futurista</strong> que simboliza la visión y la protección de las nuevas ideas. Fabricado mediante <strong className="text-white">impresión 3D de alta precisión</strong>, este trofeo es una pieza de ingeniería en sí misma: sólida, geométrica y sin partes frágiles.
                  </p>
                </div>

                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed pt-2 border-t border-foreground/10">
                  Este galardón no es solo un objeto decorativo; es la <strong className="text-white">prueba física de que la innovación global puede tener, y tiene, ADN peruano</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Provider Acknowledgment */}
          <div className="bg-gradient-to-br from-background/90 to-background/50 border-2 border-foreground/10 backdrop-blur-sm p-5 md:p-6 lg:p-8 relative overflow-hidden group hover:border-brand-red/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-red/5 blur-3xl opacity-50" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3 md:mb-4 lg:mb-6">
                <span className="text-[10px] md:text-xs font-mono tracking-widest text-brand-red/60 uppercase">
                  Diseño & Impresión 3D
                </span>
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-brand-red/10 border-2 border-brand-red/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shrink-0 ml-2">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-brand-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-base md:text-lg lg:text-xl font-bold text-white mb-2 md:mb-3 leading-tight">
                Diseñado y Fabricado por{" "}
                <a
                  href="https://rincon3d.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red hover:text-brand-red/80 transition-colors underline decoration-brand-red/50 hover:decoration-brand-red touch-manipulation"
                >
                  Rincón 3D
                </a>
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
                Agradecemos a{" "}
                <a
                  href="https://rincon3d.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red hover:text-brand-red/80 transition-colors font-medium touch-manipulation"
                >
                  Rincón 3D
                </a>{" "}
                por su excelente trabajo en el diseño y fabricación de estos
                trofeos únicos. Su dedicación y atención al detalle han resultado
                en piezas excepcionales que honran a nuestros ganadores.
              </p>
              <a
                href="https://rincon3d.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-red font-medium text-xs md:text-sm group-hover:gap-3 transition-all touch-manipulation min-h-[44px] md:min-h-0"
              >
                <span>Visitar Rincón 3D</span>
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

