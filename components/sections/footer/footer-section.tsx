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
              AI Hackathon Colombia
            </a>{" "}
            y{" "}
            <a
              href="https://www.colombiatechfest.ai-hackathon.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:underline"
            >
              AI Hackathon en Colombia Tech Week
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 IA Hackathon Peru. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
