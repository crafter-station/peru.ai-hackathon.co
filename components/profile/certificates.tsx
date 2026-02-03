"use client";

import { Award, Copy, Share2, ExternalLink, Download } from "lucide-react";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";

interface CertificatesProps {
  fullName?: string | null;
  participantNumber?: number | null;
  certificateBlobUrl?: string | null;
}

export function Certificates({
  fullName,
  participantNumber,
  certificateBlobUrl: initialCertificateUrl,
}: CertificatesProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState(initialCertificateUrl);
  const hasTriggeredGeneration = useRef(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    setCertificateUrl(initialCertificateUrl);
  }, [initialCertificateUrl]);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://www.peru.ai-hackathon.co";
  const shareUrl = participantNumber
    ? `${baseUrl}/share/certificate/${participantNumber}`
    : "https://www.peru.ai-hackathon.co/";

  const shareText = `🎓 ¡Lo logré! Completé 24 horas de código, creatividad e IA en la IA Hackathon Peru 2025 🚀

📅 29-30 Nov | 📍 UPCH La Molina
💻 El hackathon de inteligencia artificial más grande del Perú

🔗 ${shareUrl}

#IAHackathonPeru #AI #Hackathon #Peru`;

  const handleDownload = async () => {
    if (!certificateUrl) return;

    try {
      const response = await fetch(certificateUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado-ia-hackathon-${participantNumber}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading certificate:", error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Certificado - IA Hackathon Perú 2025",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      handleCopy();
    }
  };

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#B91F2E", "#FFFFFF", "#FFD700"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#B91F2E", "#FFFFFF", "#FFD700"],
      });
    }, 250);
  }, []);

  const handleGenerateCertificate = useCallback(async () => {
    if (!participantNumber) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/certificate/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantNumber }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate certificate");
      }

      const data = await response.json();
      setCertificateUrl(data.url);

      // Trigger confetti celebration only for new certificates!
      if (!data.cached) {
        triggerConfetti();
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [participantNumber, triggerConfetti]);

  // Auto-generate certificate when page loads if not already generated
  useEffect(() => {
    if (
      !certificateUrl &&
      participantNumber &&
      fullName &&
      !isGenerating &&
      !hasTriggeredGeneration.current
    ) {
      hasTriggeredGeneration.current = true;
      handleGenerateCertificate();
    }
  }, [certificateUrl, participantNumber, fullName, isGenerating, handleGenerateCertificate]);

  if (!fullName || !participantNumber) {
    return null;
  }

  return (
    <Panel id="certificates">
      <PanelHeader>
        <PanelTitle className="flex items-center gap-3">
          <Award className="size-6 text-brand-red" />
          Certificados
        </PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-6">
        <div className="flex flex-col items-center gap-6">
          {/* Certificate Preview */}
          {certificateUrl ? (
            <div className="w-full relative aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={certificateUrl}
                alt={`Certificado de ${fullName}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-lg border-2 border-dashed border-edge flex flex-col items-center justify-center gap-4 bg-muted/30">
              <div className="flex gap-1 justify-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="size-3 bg-foreground animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <p className="font-mono text-sm text-muted-foreground">
                Generando certificado...
              </p>
            </div>
          )}

          {certificateUrl && (
            <>
              <div className="text-center space-y-2">
                <p className="font-mono text-sm font-semibold text-foreground">
                  Certificado de Participación
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  24 horas de innovación con IA
                </p>
              </div>

              <div className="w-full space-y-3 pt-2 border-t border-edge border-t-[1.5px] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-edge/50 before:to-transparent">
                <p className="font-mono text-xs text-muted-foreground text-center uppercase tracking-wider">
                  Compartir certificado
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="font-mono text-xs"
                  >
                    <Download className="size-3" />
                    Descargar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="font-mono text-xs"
                  >
                    <Copy className="size-3" />
                    {copied ? "Copiado" : "Copiar"}
                  </Button>

                  {canShare && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="font-mono text-xs"
                    >
                      <Share2 className="size-3" />
                      Compartir
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="font-mono text-xs"
                  >
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="font-mono text-xs"
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      X / Twitter
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="font-mono text-xs"
                  >
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="font-mono text-xs"
                  >
                    <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-3" />
                      Ver página
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </PanelContent>
    </Panel>
  );
}
