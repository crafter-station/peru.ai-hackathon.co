"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function JudgesSection() {
  return (
    <section id="judges" className="min-h-screen py-20 px-4 md:px-8 bg-background dither-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Jurado
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expertos en inteligencia artificial y tecnología evaluarán los proyectos
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-2 border-dashed border-muted-foreground/30">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Próximamente
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Estamos confirmando un increíble panel de jueces expertos en IA, machine learning, 
                startups y tecnología que evaluarán los proyectos del hackathon.
              </p>
              <div className="mt-8 space-y-3">
                <p className="text-sm text-muted-foreground font-medium">Los jueces evaluarán:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-brand-red/10 text-brand-red text-sm rounded-full">
                    Innovación
                  </span>
                  <span className="px-3 py-1 bg-brand-red/10 text-brand-red text-sm rounded-full">
                    Impacto Social
                  </span>
                  <span className="px-3 py-1 bg-brand-red/10 text-brand-red text-sm rounded-full">
                    Viabilidad Técnica
                  </span>
                  <span className="px-3 py-1 bg-brand-red/10 text-brand-red text-sm rounded-full">
                    Presentación
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for Future Judges Grid */}
        <div className="hidden">
          {/* This will be revealed once judges are confirmed */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="text-2xl bg-brand-red/10 text-brand-red">
                      ?
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-bold text-lg text-foreground mb-1">Por Confirmar</h4>
                  <p className="text-brand-red font-medium mb-2">Experto en IA</p>
                  <p className="text-sm text-muted-foreground">
                    Detalles próximamente
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
