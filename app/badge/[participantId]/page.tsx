"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PixelButton } from "@/components/ui/pixel-button";
import { RetroCard, RetroCardContent } from "@/components/ui/retro-card";
import { Download, Share2, ArrowLeft, Sparkles } from "lucide-react";
import type { Participant } from "@/lib/schema";
import { BadgePreview } from "@/components/badge/badge-preview";
import { motion } from "framer-motion";

export default function SharedBadgePage() {
  const params = useParams();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const participantId = params.participantId as string;

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const response = await fetch(`/api/badge/participant/${participantId}`);
        if (!response.ok) {
          throw new Error("Badge not found");
        }
        const data = await response.json();
        setParticipant(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading badge");
      } finally {
        setLoading(false);
      }
    };

    if (participantId) {
      fetchParticipant();
    }
  }, [participantId]);

  const downloadBadge = useCallback(async () => {
    if (!svgRef.current || !participant) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1440;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        alert("Canvas not supported");
        return;
      }

      ctx.fillStyle = "#0C0C0E";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const baseImg = new Image();
      baseImg.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        baseImg.onload = () => {
          ctx.drawImage(baseImg, 0, 0, 1080, 1440);
          resolve();
        };
        baseImg.onerror = () => {
          reject(new Error("Failed to load base image"));
        };
        baseImg.src = "/onboarding/THC-IA HACK PE-ID-Participante.svg";
      });

      const aiPhotoUrl = participant.profilePhotoAiUrl || participant.profilePhotoUrl;
      if (aiPhotoUrl) {
        try {
          const avatarImg = new Image();
          avatarImg.crossOrigin = "anonymous";
          
          await new Promise<void>((resolve) => {
            avatarImg.onload = () => {
              const tempCanvas = document.createElement("canvas");
              tempCanvas.width = 700;
              tempCanvas.height = 700;
              const tempCtx = tempCanvas.getContext("2d");
              
              if (tempCtx) {
                tempCtx.filter = "grayscale(100%)";
                tempCtx.drawImage(avatarImg, 0, 0, 700, 700);
                ctx.drawImage(tempCanvas, 45.842790213430476, 265.46173867777236, 700, 700);
              }
              resolve();
            };
            avatarImg.onerror = () => {
              console.warn("Failed to load avatar, continuing without it");
              resolve();
            };
            avatarImg.src = aiPhotoUrl;
          });
        } catch (error) {
          console.warn("Error loading avatar:", error);
        }
      }

      const svg = svgRef.current.cloneNode(true) as SVGSVGElement;
      const imageElement = svg.querySelector("image");
      if (imageElement) {
        imageElement.remove();
      }
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgWithFonts = svgData.replace(
        /font-family="[^"]*"/g,
        (match) => {
          if (match.includes("Adelle Mono")) {
            return `font-family="'Adelle Mono'"`;
          }
          return match;
        }
      );

      const svgBlob = new Blob([svgWithFonts], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      const overlayImg = new Image();
      await new Promise<void>((resolve, reject) => {
        overlayImg.onload = () => {
          ctx.drawImage(overlayImg, 0, 0, 1080, 1440);
          URL.revokeObjectURL(svgUrl);
          resolve();
        };
        overlayImg.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          reject(new Error("Failed to load overlay"));
        };
        overlayImg.src = svgUrl;
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `ia-hack-badge-${participant.participantNumber}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png", 1.0);
    } catch (error) {
      console.error("Error downloading badge:", error);
      alert("Error downloading badge. Please try again.");
    }
  }, [participant]);

  const handleShare = async () => {
    if (!participant) return;

    const shareUrl = `${window.location.origin}/badge/${participant.id}`;
    const shareText = `🎉 ¡Estoy registrado para IA Hackathon Peru 2025! Badge #${String(participant.participantNumber).padStart(4, "0")}

📅 29-30 de Noviembre
📍 Universidad Peruana Cayetano Heredia

#IAHackathonPeru #AI #Hackathon`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${participant.fullName} - IA Hackathon Peru`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        alert("¡Enlace copiado al portapapeles!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="size-3 bg-terminal-green"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <RetroCard className="max-w-md">
          <RetroCardContent className="text-center py-12">
            <h1 className="text-2xl font-adelle-mono font-bold mb-4 uppercase">BADGE_NOT_FOUND</h1>
            <p className="text-muted-foreground mb-8 font-adelle-mono text-sm uppercase">
              THE_BADGE_YOU_ARE_LOOKING_FOR_DOES_NOT_EXIST
            </p>
            <Link href="/">
              <PixelButton>
                <Sparkles className="size-4 mr-2" />
                GO_HOME
              </PixelButton>
            </Link>
          </RetroCardContent>
        </RetroCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-10">
        <Link href="/">
          <PixelButton variant="ghost" size="sm">
            <ArrowLeft className="size-4 mr-2" />
            HOME
          </PixelButton>
        </Link>
      </div>

      <div className="fixed top-4 right-4 z-10">
        <Link href="/onboarding">
          <PixelButton size="sm">
            <Sparkles className="size-4 mr-2" />
            REGISTER
          </PixelButton>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-20">
        <div className="max-w-lg w-full">
          <RetroCard>
            <RetroCardContent className="space-y-6">
              {/* Badge Preview */}
              <div className="text-center">
                <h2 className="font-adelle-mono font-bold text-lg uppercase mb-2">
                  PARTICIPANT_BADGE
                </h2>
                <p className="font-adelle-mono text-sm text-muted-foreground uppercase mb-4">
                  #{String(participant.participantNumber || 0).padStart(4, "0")}
                </p>
                <div className="relative w-full max-w-md mx-auto border-4 border-foreground">
                  <BadgePreview
                    ref={svgRef}
                    profilePictureUrl={participant.profilePhotoAiUrl || participant.profilePhotoUrl}
                    participantNumber={`#${String(participant.participantNumber || 0).padStart(3, "0")}`}
                    firstName={participant.fullName?.split(" ")[0] || "PARTICIPANT"}
                    lastName={participant.fullName?.split(" ").slice(1).join(" ") || ""}
                    role="HACKER"
                  />
                  <div className="absolute inset-0 scanlines pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <PixelButton onClick={downloadBadge} size="lg" className="w-full">
                  <Download className="size-4" />
                  DOWNLOAD_BADGE
                </PixelButton>

                <PixelButton
                  onClick={handleShare}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  <Share2 className="size-4" />
                  SHARE_BADGE
                </PixelButton>
              </div>

              {/* Event Info */}
              <div className="border-2 border-foreground/50 p-4 space-y-2 font-adelle-mono text-xs uppercase">
                <p><span className="text-muted-foreground">EVENT:</span> IA_HACKATHON_PERU_2025</p>
                <p><span className="text-muted-foreground">DATE:</span> 29-30_NOV_2025</p>
                <p><span className="text-muted-foreground">LOCATION:</span> UPCH_LA_MOLINA</p>
              </div>
            </RetroCardContent>
          </RetroCard>
        </div>
      </div>
    </div>
  );
}

