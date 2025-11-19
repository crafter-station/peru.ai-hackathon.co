"use client";

import { useParticipant } from "@/hooks/use-participant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle2, Download, Sparkles, Copy, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import { useBadgeGeneration } from "@/hooks/use-badge-generation";
import { useState, useEffect } from "react";

export default function CompletePage() {
  const { participant } = useParticipant();
  const { generateBadge, isGenerating, error } = useBadgeGeneration();
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!participant?.lastBadgeGenerationAt) return;

    const checkCooldown = () => {
      const lastGen = new Date(participant.lastBadgeGenerationAt!).getTime();
      const now = Date.now();
      const elapsed = (now - lastGen) / 1000;
      const remaining = Math.max(0, 10 - elapsed);

      setCountdown(Math.ceil(remaining));

      if (remaining > 0) {
        setTimeout(checkCooldown, 1000);
      }
    };

    checkCooldown();
  }, [participant?.lastBadgeGenerationAt]);

  const handleGenerateBadge = async () => {
    if (!participant?.id || countdown > 0) return;

    try {
      await generateBadge(participant.id);
      window.location.reload();
    } catch (err) {
      console.error("Badge generation error:", err);
      alert(error || "Error generando badge. Por favor, intenta de nuevo.");
    }
  };

  const canGenerate = countdown === 0 && !isGenerating;

  if (!participant || participant.registrationStatus !== "completed") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Aún no has completado tu registro.
          </p>
          <Button asChild className="mt-4">
            <Link href="/onboarding">Volver al registro</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }



  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="size-16 text-green-500" />
          </div>
          <div className="flex justify-center gap-2 mb-2">
            <Badge variant="secondary" className="text-2xl px-4 py-2">
              #{String(participant.participantNumber || 0).padStart(4, "0")}
            </Badge>
          </div>
          <CardTitle className="text-3xl">
            ¡Registro Completado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg">
              Tu registro para el IA Hackathon Peru 2025 ha sido completado
              exitosamente.
            </p>
          </div>



          <div className="bg-muted p-6 rounded-lg space-y-2">
            <h3 className="font-bold text-lg">Detalles del Evento</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Fecha:</span> 29-30 de Noviembre
                2025
              </p>
              <p>
                <span className="font-medium">Lugar:</span> Universidad Peruana
                Cayetano Heredia - La Molina
              </p>
              <p>
                <span className="font-medium">Hora:</span> 9:00 AM
              </p>
            </div>
          </div>

          <div className="bg-muted p-6 rounded-lg space-y-4">
            <h3 className="font-bold text-lg">¡Comparte la noticia!</h3>
            
            <div className="bg-background p-4 rounded-md border text-sm whitespace-pre-line">
              🚀 ¡He sido satisfactoriamente registrado como participante en la IA Hackathon Peru 2025!

Me emociona ser parte de este evento donde crearemos soluciones innovadoras con inteligencia artificial.

📅 29-30 de Noviembre
📍 Universidad Peruana Cayetano Heredia

#IAHackathonPeru #AI #Hackathon #Peru #Innovation
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    "🚀 ¡He sido satisfactoriamente registrado como participante en la IA Hackathon Peru 2025!\n\nMe emociona ser parte de este evento donde crearemos soluciones innovadoras con inteligencia artificial.\n\n📅 29-30 de Noviembre\n📍 Universidad Peruana Cayetano Heredia\n\n#IAHackathonPeru #AI #Hackathon #Peru #Innovation"
                  );
                }}
              >
                <Copy className="size-4 mr-2" />
                Copiar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://iahackathon.pe")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="size-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("🚀 ¡He sido satisfactoriamente registrado como participante en la IA Hackathon Peru 2025!\n\nMe emociona ser parte de este evento donde crearemos soluciones innovadoras con inteligencia artificial.\n\n📅 29-30 de Noviembre\n📍 Universidad Peruana Cayetano Heredia\n\n#IAHackathonPeru #AI #Hackathon #Peru #Innovation")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="size-4 mr-2" />
                  X (Twitter)
                </a>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Para Instagram: copia el texto y pégalo en tu historia o publicación
            </p>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/">Volver al inicio</Link>
          </Button>

          {participant.badgeBlobUrl ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-bold text-2xl mb-6">Tu Badge de Participante</h3>
                <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden border-2 border-primary/20 shadow-xl">
                  <Image
                    src={participant.badgeBlobUrl}
                    alt="Participant Badge"
                    width={1600}
                    height={900}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = participant.badgeBlobUrl!;
                    link.download = `ia-hack-badge-${participant.participantNumber}.jpg`;
                    link.click();
                  }}
                  size="lg"
                  className="w-full"
                >
                  <Download className="size-4 mr-2" />
                  Descargar Badge
                </Button>

                <Button
                  onClick={handleGenerateBadge}
                  variant="outline"
                  disabled={!canGenerate}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Generando Badge...
                    </>
                  ) : countdown > 0 ? (
                    `Espera ${countdown}s para regenerar`
                  ) : (
                    <>
                      <Sparkles className="size-4 mr-2" />
                      Regenerar Badge
                    </>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Comparte tu badge en redes sociales con #IAHackathonPeru
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground">
                Tu badge aún no ha sido generado.
              </p>
              <Button 
                onClick={handleGenerateBadge} 
                size="lg"
                disabled={!canGenerate}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin size-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Generando Badge...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 mr-2" />
                    Generar Mi Badge
                  </>
                )}
              </Button>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
