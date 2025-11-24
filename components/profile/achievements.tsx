"use client";

import { TrophyIcon, Copy, Share2, ExternalLink } from "lucide-react";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel";
import { BadgePreview3D } from "@/components/badge/badge-preview-3d";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface AchievementsProps {
  badgeBlobUrl?: string | null;
  participantNumber?: number | null;
}

export function Achievements({
  badgeBlobUrl,
  participantNumber,
}: AchievementsProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://www.peru.ai-hackathon.co";
  const shareUrl = participantNumber
    ? `${baseUrl}/share/badge/${participantNumber}`
    : "https://www.peru.ai-hackathon.co/";

  const shareText = `🚀 ¡Ya estoy dentro! Me registré para la IA Hackathon Peru 2025 🎯

📅 29-30 Nov | 📍 UPCH La Molina
💻 2 días de código, creatividad y soluciones con IA

🔗 ${shareUrl}

#IAHackathonPeru #AI #Hackathon #Peru`;

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
          title: "IA Hackathon Perú 2025",
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

  return (
    <Panel id="achievements">
      <PanelHeader>
        <PanelTitle className="flex items-center gap-3">
          <TrophyIcon className="size-6 text-brand-red" />
          Achievements
        </PanelTitle>
      </PanelHeader>
      <PanelContent className="space-y-6">
        {badgeBlobUrl ? (
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-sm">
              <BadgePreview3D
                badgeUrl={badgeBlobUrl}
                participantNumber={participantNumber?.toString() || null}
              />
            </div>
            <div className="text-center space-y-2">
              <p className="font-mono text-sm font-semibold text-foreground">
                IA Hackathon Perú 2025
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                Credencial de participante
              </p>
            </div>

            <div className="w-full space-y-3 pt-2 border-t border-edge border-t-[1.5px] relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-edge/50 before:to-transparent">
              <p className="font-mono text-xs text-muted-foreground text-center uppercase tracking-wider">
                Compartir logro
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
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
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-3" />
                    Ver página
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted/50 mb-4">
              <TrophyIcon className="size-8 text-muted-foreground" />
            </div>
            <p className="font-mono text-sm text-muted-foreground">
              No hay logros disponibles aún
            </p>
          </div>
        )}
      </PanelContent>
    </Panel>
  );
}

