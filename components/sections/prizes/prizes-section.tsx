"use client";

import { MoneyIcon, PlaneIcon } from "@/components/icons/prize-icons";

/**
 * Prizes section displaying hackathon rewards
 */
export default function PrizesSection() {
  return (
    <section className="bg-background dither-bg border-t min-h-screen px-4 md:px-6 relative overflow-hidden flex items-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-brand-red/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-brand-red/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full py-12 md:py-20">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
            <span className="text-brand-red text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
              AL GANADOR
            </span>
            <div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
          </div>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none uppercase text-white">
            PREMIOS
          </h2>
        </div>

        {/* Prizes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Main Prize - Cash */}
          <div className="lg:col-span-5 group relative overflow-hidden bg-gradient-to-br from-red-950/40 via-background/90 to-background/50 border-2 border-brand-red/30 backdrop-blur-sm p-10 hover:border-brand-red/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <span className="text-xs font-mono tracking-widest text-brand-red/70 uppercase">
                  Premio Principal
                </span>
                <div className="w-14 h-14 bg-brand-red/15 border-2 border-brand-red/30 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <MoneyIcon className="w-7 h-7 text-brand-red" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-brand-red/70 text-xl font-medium mb-2">USD</p>
                  <h3 className="text-7xl md:text-8xl font-bold bg-gradient-to-br from-red-200 via-brand-red to-red-600 bg-clip-text text-transparent tracking-tight">
                    $1,500
                  </h3>
                </div>
                <p className="text-zinc-300 text-lg font-light">en cash</p>
              </div>
            </div>
          </div>

          {/* International Experience - Switzerland */}
          <div className="lg:col-span-7 group relative overflow-hidden bg-gradient-to-br from-background/90 to-background/50 border-2 border-foreground/10 backdrop-blur-sm p-10 hover:border-brand-red/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-red/5 blur-3xl opacity-50" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <span className="text-xs font-mono tracking-widest text-brand-red/60 uppercase">
                  Experiencia Internacional
                </span>
                <div className="w-14 h-14 bg-brand-red/10 border-2 border-brand-red/20 flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
                  <PlaneIcon className="w-7 h-7 text-brand-red" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight text-balance">
                  Invitación a representar Perú en{" "}
                  <a
                    href="https://www.startglobal.org/start-hack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-red-200 via-brand-red to-red-600 bg-clip-text text-transparent hover:from-red-300 hover:via-red-400 hover:to-red-700 transition-all inline-flex items-baseline gap-1"
                  >
                    START Hack
                    <svg className="w-5 h-5 inline-block text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </h3>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/20 border-2 border-red-500/30 flex items-center justify-center">
                    <span className="text-lg">🇨🇭</span>
                  </div>
                  <p className="text-xl text-zinc-300 font-medium">Suiza</p>
                </div>

                <div className="flex items-start gap-3 pt-4">
                  <div className="w-5 h-5 bg-brand-red/20 border-2 border-brand-red/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 bg-brand-red" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Incluye estadía y alimentación durante toda la hackathon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-red/30 bg-brand-red/5 hover:bg-brand-red/10 transition-colors">
            <svg className="w-5 h-5 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-sm md:text-base font-semibold text-foreground/80">
              Un premio que cambia tu carrera
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
