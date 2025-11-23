"use client";

/**
 * Prizes section displaying hackathon rewards
 */
export default function PrizesSection() {
  return (
    <section className="bg-background dither-bg border-t py-6 md:py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px bg-brand-red/30 w-12"></div>
            <span className="text-brand-red text-xs font-bold uppercase tracking-widest">
              AL GANADOR
            </span>
            <div className="h-px bg-brand-red/30 w-12"></div>
          </div>
          <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tight leading-tight uppercase">
            PREMIOS
          </h2>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4">
            {/* Prize 1 - Cash */}
            <div>
              <h3 className="text-3xl md:text-5xl font-black mb-2">
                <span className="text-brand-red">USD $1,500</span> en cash
              </h3>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px bg-border w-16"></div>
              <span className="text-muted-foreground text-sm">+</span>
              <div className="h-px bg-border w-16"></div>
            </div>

            {/* Prize 2 - Switzerland */}
            <div>
              <h3 className="text-xl md:text-2xl font-black mb-3 leading-tight">
                Invitación a representar Perú en{" "}
                <a
                  href="https://www.startglobal.org/start-hack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red underline"
                >
                  START Hack
                </a>{" "}
                (Suiza)
              </h3>
              <p className="text-sm text-muted-foreground">
                *Incluye estadía y alimentación durante toda la hackathon*
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
