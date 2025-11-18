"use client";

import Image from "next/image";

export default function FooterSection() {
  return (
    <footer className="bg-background dither-bg border-t py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="text-center mb-12">
          {/* Logo and Description */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/IA_HACK_BRAND.svg"
                alt="IA HACKATHON"
                width={150}
                height={10}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
              24 horas de innovación y tecnología.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Image
                src="/PE_FLAG.svg"
                alt="Perú"
                width={24}
                height={16}
                className="w-6 h-4"
              />
              <span className="text-sm text-muted-foreground">Lima, Perú</span>
            </div>
          </div>
        </div>

        {/* Organizers */}
        <div className="border-t pt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Organizado por
              </p>
              <a
                href="https://hackathon.lat/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity duration-200"
              >
                <Image
                  src="/BY_THC.svg"
                  alt="The Hackathon Company"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </a>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                En alianza con
              </p>
              <a
                href="https://makers.ngo/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity duration-200"
              >
                <Image
                  src="/In_partnership_with_ MAKERS.svg"
                  alt="MAKERS"
                  width={140}
                  height={32}
                  className="h-6 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Community Partners */}
        <div className="border-t pt-8 mb-8">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-6">Apoyados por:</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 items-center justify-items-center max-w-4xl mx-auto">
              {/* Partner 1 - IEEE USIL */}
              <a
                href="https://edu.ieee.org/pe-usil/ieee-usil-nosotros/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-2 py-1.5 rounded-md bg-gradient-to-br from-white/[0.01] to-transparent hover:from-white/[0.02] transition-all duration-300 w-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                <Image
                  src="/ieee_usil.png"
                  alt="IEEE USIL"
                  width={150}
                  height={60}
                  quality={100}
                  className="w-full h-8 md:h-10 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
                />
              </a>

              {/* Partner 2 - Hackeando Productos */}
              <a
                href="https://hackeandoproductos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-2 py-1.5 rounded-md bg-gradient-to-br from-white/[0.01] to-transparent hover:from-white/[0.02] transition-all duration-300 w-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                <Image
                  src="/HackeandoProductos.svg"
                  alt="Hackeando Productos"
                  width={150}
                  height={75}
                  quality={100}
                  className="w-full h-8 md:h-10 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
                />
              </a>

              {/* Partner 3 - Utec Ventures */}
              <a
                href="https://utecventures.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-2 py-1.5 rounded-md bg-gradient-to-br from-white/[0.01] to-transparent hover:from-white/[0.02] transition-all duration-300 w-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                <Image
                  src="/utecventures.png"
                  alt="Utec Ventures"
                  width={150}
                  height={60}
                  quality={100}
                  className="w-full h-8 md:h-10 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
                />
              </a>

              {/* Partner 4 - AI Playgrounds */}
              <a
                href="https://www.linkedin.com/company/ai-playgrounds-tech/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-2 py-1.5 rounded-md bg-gradient-to-br from-white/[0.01] to-transparent hover:from-white/[0.02] transition-all duration-300 w-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                <Image
                  src="/ai-playgrounds-logo.png"
                  alt="AI Playgrounds"
                  width={150}
                  height={60}
                  quality={95}
                  className="w-full h-7 md:h-9 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
                />
              </a>

              {/* Partner 5 - Crafter */}
              <a
                href="https://crafterstation.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-2 py-1.5 rounded-md bg-gradient-to-br from-white/[0.01] to-transparent hover:from-white/[0.02] transition-all duration-300 w-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                <Image
                  src="/crafter-logotipo.svg"
                  alt="Crafter"
                  width={150}
                  height={60}
                  quality={100}
                  className="w-full h-7 md:h-9 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
                />
              </a>

              {/* Partner 6 - KEBO */}
              <a
                href="https://kebo.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-2 py-1.5 rounded-md bg-gradient-to-br from-white/[0.01] to-transparent hover:from-white/[0.02] transition-all duration-300 w-full flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                <Image
                  src="/KEBO-Brand-WhitePurple.svg"
                  alt="KEBO"
                  width={150}
                  height={60}
                  quality={100}
                  className="w-full h-7 md:h-9 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
                />
              </a>

              {/* Partner 7 - START Lima */}
              <a
                href="https://www.linkedin.com/company/start-lima/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-2 py-1.5 rounded-md bg-gradient-to-br from-white/[0.01] to-transparent hover:from-white/[0.02] transition-all duration-300 w-full flex items-center justify-center md:col-start-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                <Image
                  src="/START-lima.png"
                  alt="START Lima"
                  width={150}
                  height={60}
                  quality={95}
                  className="w-full h-8 md:h-10 object-contain relative z-10 brightness-90 group-hover:brightness-100 transition-all duration-300"
                />
              </a>
            </div>
          </div>
        </div>


        {/* Copyright */}
        <div className="border-t pt-8 text-center mb-8">
          <p className="text-sm text-muted-foreground mb-3">
            De los mismos creadores de:{" "}
            <a
              href="https://www.ai-hackathon.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:underline"
            >
              IA Hackathon Colombia
            </a>{" "}
            y{" "}
            <a
              href="https://www.colombiatechfest.ai-hackathon.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:underline"
            >
              IA Hackathon en Colombia Tech Week
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 IA Hackathon Peru. Todos los derechos reservados.
          </p>

          {/* Contribute Link */}
          <div className="mt-4">
            <a
              href="https://github.com/crafter-station/peru.ai-hackathon.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-brand-red transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-github w-3 h-3"
                aria-hidden="true"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              contribute
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
