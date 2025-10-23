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
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-4">Apoyados por:</p>
            <div className="flex items-end justify-center gap-3 sm:gap-6 flex-wrap">
              <a
                href="https://www.linkedin.com/company/ai-playgrounds-tech/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity duration-200"
              >
                <Image
                  src="/ai-playgrounds-logo.png"
                  alt="AI Playgrounds"
                  width={120}
                  height={48}
                  quality={95}
                  className="h-7 sm:h-8 w-auto"
                />
              </a>
              <a
                href="https://chat.whatsapp.com/LDLugaQtGknIKoAGXb3m61"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity duration-200"
              >
                <Image
                  src="/crafter-logotipo.svg"
                  alt="Crafter"
                  width={120}
                  height={48}
                  className="h-7 sm:h-8 w-auto"
                />
              </a>
              <a
                href="https://chat.whatsapp.com/GdmSNdGpqDW33fiYI0XPef"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity duration-200 mt-1 p-2 -ml-2 sm:-ml-5"
              >
                <Image
                  src="/KEBO-Brand-WhitePurple.svg"
                  alt="KEBO"
                  width={120}
                  height={48}
                  className="h-7 sm:h-8 w-auto"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/start-lima/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-80 transition-opacity duration-200"
              >
                <Image
                  src="/START-lima.png"
                  alt="START Lima"
                  width={150}
                  height={60}
                  quality={95}
                  className="h-10 sm:h-11 w-auto"
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
