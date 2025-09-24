"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="min-h-screen py-20 px-4 md:px-8 bg-muted/30 dither-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Patrocinadores
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empresas e instituciones que apoyan la innovación en inteligencia artificial
          </p>
        </div>

        {/* Current Partners */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8">Organizadores</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12">
            {/* The Hackathon Company */}
            <div className="flex flex-col items-center">
              <div className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-300">
                <Image 
                  src="/BY_THC.svg" 
                  alt="The Hackathon Company" 
                  width={120}
                  height={64}
                  className="h-12 md:h-16 w-auto opacity-90"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Organizador Principal</p>
            </div>
            
            {/* MAKERS Partnership */}
            <div className="flex flex-col items-center">
              <div className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-300">
                <Image 
                  src="/In_partnership_with_ MAKERS.svg" 
                  alt="MAKERS Partnership" 
                  width={180}
                  height={48}
                  className="h-10 md:h-12 w-auto opacity-90"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">En Alianza Con</p>
            </div>
          </div>
        </div>

        {/* Current Sponsors */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Patrocinadores Principales</h3>
          <div className="flex justify-center">
            <Card className="border-2 hover:border-brand-red/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="bg-black rounded-lg p-6 mb-4 transition-opacity duration-300 hover:opacity-80">
                    <Image 
                      src="https://11labs-nonprd-15f22c1d.s3.eu-west-3.amazonaws.com/0b9cd3e1-9fad-4a5b-b3a0-c96b0a1f1d2b/elevenlabs-logo-white.png"
                      alt="ElevenLabs" 
                      width={200}
                      height={48}
                      className="h-12 w-auto mx-auto"
                    />
                  </div>
                  <p className="text-sm font-medium text-brand-red">Patrocinador Oficial de IA</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* More Sponsors Coming */}
        <div className="text-center">
          <Card className="max-w-xl mx-auto border-2 border-dashed border-muted-foreground/30">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                Más Patrocinadores Próximamente
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Estamos trabajando con más empresas líderes en tecnología y IA para hacer 
                de este hackathon una experiencia increíble.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Become a Sponsor */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-bold text-foreground mb-4">
            ¿Quieres ser patrocinador?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Apoya la innovación en IA y conecta con los mejores talentos tecnológicos del Perú
          </p>
          <a 
            href="https://chat.whatsapp.com/H6RV2cFfL47CCXVzVmHedR?mode=ems_share_t"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-brand-red/90 transition-colors duration-300"
          >
            Información de Patrocinio
          </a>
        </div>
      </div>
    </section>
  );
}
