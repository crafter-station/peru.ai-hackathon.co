"use client";

import { useParticipant } from "@/hooks/use-participant";
import { PixelButton } from "@/components/ui/pixel-button";
import {
  RetroCard,
  RetroCardContent,
  RetroCardHeader,
  RetroCardTitle,
} from "@/components/ui/retro-card";
import { PixelConfetti } from "@/components/ui/pixel-confetti";
import { GlitchText } from "@/components/ui/terminal-text";
import Link from "next/link";
import { Download, Copy, Share2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRetroSounds } from "@/hooks/use-click-sound";
import { BadgePreview } from "@/components/badge/badge-preview";

export default function CompletePage() {
  const { participant } = useParticipant();
  const [showConfetti, setShowConfetti] = useState(true);
  const { playSuccess, playClick } = useRetroSounds();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (showConfetti) {
      playSuccess();
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, playSuccess]);

  const downloadBadge = useCallback(async () => {
    if (!svgRef.current || !participant) return;

    try {
      playClick();
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

      // Load base badge image
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

      // Load and draw AI avatar if available
      const aiPhotoUrl = participant.profilePhotoAiUrl || participant.profilePhotoUrl;
      if (aiPhotoUrl) {
        try {
          const avatarImg = new Image();
          avatarImg.crossOrigin = "anonymous";
          
          await new Promise<void>((resolve) => {
            avatarImg.onload = () => {
              // Apply grayscale filter
              const tempCanvas = document.createElement("canvas");
              tempCanvas.width = 700;
              tempCanvas.height = 700;
              const tempCtx = tempCanvas.getContext("2d");
              
              if (tempCtx) {
                tempCtx.filter = "grayscale(100%)";
                tempCtx.drawImage(avatarImg, 0, 0, 700, 700);
                
                // Draw the grayscale image on main canvas
                ctx.drawImage(tempCanvas, 45.842790213430476, 265.46173867777236, 700, 700);
              }
              resolve();
            };
            avatarImg.onerror = () => {
              console.warn("Failed to load avatar, continuing without it");
              resolve(); // Don't reject, just continue
            };
            avatarImg.src = aiPhotoUrl;
          });
        } catch (error) {
          console.warn("Error loading avatar:", error);
        }
      }

      // Clone and process SVG
      const svg = svgRef.current.cloneNode(true) as SVGSVGElement;
      
      // Remove profile image element from SVG since we already drew it on canvas
      const imageElements = svg.querySelectorAll("image");
      imageElements.forEach((imgEl) => {
        // Only remove the profile photo, keep the QR code
        const href = imgEl.getAttribute("href") || "";
        if (href && !href.startsWith("data:image/png;base64")) {
          imgEl.remove();
        }
      });
      
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
  }, [participant, playClick]);

  const handleShare = useCallback(async () => {
    if (!participant) return;

    const shareUrl = `${window.location.origin}/badge/${participant.id}`;
    const shareText = `🎉 ¡Estoy registrado para IA Hackathon Peru 2025! Badge #${String(participant.participantNumber).padStart(4, "0")}

📅 29-30 de Noviembre
📍 Universidad Peruana Cayetano Heredia

#IAHackathonPeru #AI #Hackathon`;

    try {
      playClick();
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
  }, [participant, playClick]);

  if (!participant || participant.registrationStatus !== "completed") {
    return (
      <RetroCard className="max-w-2xl mx-auto">
        <RetroCardContent className="py-12 text-center">
          <p className="font-adelle-mono text-sm uppercase text-muted-foreground">
            REGISTRATION_NOT_COMPLETE
          </p>
          <PixelButton asChild className="mt-4">
            <Link href="/onboarding">RETURN_TO_REGISTRATION</Link>
          </PixelButton>
        </RetroCardContent>
      </RetroCard>
    );
  }

  const shareText = `🚀 ¡He sido satisfactoriamente registrado como participante en la IA Hackathon Peru 2025!

Me emociona ser parte de este evento donde crearemos soluciones innovadoras con inteligencia artificial.

📅 29-30 de Noviembre
📍 Universidad Peruana Cayetano Heredia

#IAHackathonPeru #AI #Hackathon #Peru #Innovation`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PixelConfetti isActive={showConfetti} particleCount={60} />

      <RetroCard>
        <RetroCardHeader className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="text-4xl mb-4"
          >
            🏆
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <div className="inline-block border-2 border-terminal-green bg-black px-4 py-2">
              <span className="font-adelle-mono text-2xl text-terminal-green font-bold">
                #{String(participant.participantNumber || 0).padStart(4, "0")}
              </span>
            </div>
            
            <RetroCardTitle className="justify-center text-lg">
              <GlitchText>ACHIEVEMENT_UNLOCKED!</GlitchText>
            </RetroCardTitle>
          </motion.div>
        </RetroCardHeader>

        <RetroCardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="font-adelle-mono text-sm uppercase">
              REGISTRATION_COMPLETE
            </p>
            <p className="font-adelle-mono text-xs text-muted-foreground mt-1">
              IA_HACKATHON_PERU_2025
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="text-center">
              <h3 className="font-adelle-mono font-bold text-lg uppercase mb-4">
                YOUR_BADGE_PREVIEW
              </h3>
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
              {participant.profilePhotoAiUrl && (
                <p className="text-[10px] font-adelle-mono text-terminal-green uppercase mt-2">
                  ✓ AI_AVATAR_LOADED
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <PixelButton
                onClick={downloadBadge}
                size="lg"
                className="w-full"
              >
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

              <p className="text-[10px] font-adelle-mono text-muted-foreground text-center uppercase">
                SHARE_WITH #IAHACKATHONPERU
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="border-2 border-foreground/50 p-4 space-y-2 font-adelle-mono"
          >
            <h3 className="font-bold text-sm uppercase">EVENT_DETAILS</h3>
            <div className="space-y-1 text-xs uppercase">
              <p>
                <span className="text-muted-foreground">DATE:</span> 29-30_NOV_2025
              </p>
              <p>
                <span className="text-muted-foreground">LOCATION:</span> UPCH_LA_MOLINA
              </p>
              <p>
                <span className="text-muted-foreground">CHECK_IN:</span> 08:00_AM
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="border-2 border-foreground/50 p-4 space-y-2 font-adelle-mono"
          >
            <h3 className="font-bold text-sm uppercase">WHAT_TO_BRING</h3>
            <ul className="space-y-1 text-xs uppercase">
              <li className="flex items-center gap-2">
                <span className="text-terminal-green">✓</span> LAPTOP_+_CHARGER
              </li>
              <li className="flex items-center gap-2">
                <span className="text-terminal-green">✓</span> DNI_OR_ID
              </li>
              <li className="flex items-center gap-2">
                <span className="text-terminal-green">✓</span> WATER_BOTTLE
              </li>
              <li className="flex items-center gap-2">
                <span className="text-terminal-green">✓</span> NOTEBOOK_+_PEN
              </li>
              <li className="flex items-center gap-2">
                <span className="text-terminal-green">✓</span> COMFORTABLE_CLOTHES
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="border-2 border-terminal-green/50 bg-terminal-green/5 p-4 space-y-2 font-adelle-mono"
          >
            <h3 className="font-bold text-sm uppercase text-terminal-green">IMPORTANT_REMINDERS</h3>
            <ul className="space-y-1 text-xs uppercase">
              <li>
                <span className="text-muted-foreground">•</span> ARRIVE_EARLY_FOR_CHECK_IN
              </li>
              <li>
                <span className="text-muted-foreground">•</span> BRING_THIS_BADGE_(PRINTED_OR_PHONE)
              </li>
              <li>
                <span className="text-muted-foreground">•</span> FOOD_AND_DRINKS_PROVIDED
              </li>
              <li>
                <span className="text-muted-foreground">•</span> TEAMS_FORMED_ON_SITE
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="border-2 border-foreground/50 p-4 space-y-3"
          >
            <h3 className="font-adelle-mono font-bold text-sm uppercase">SHARE_NEWS</h3>
            
            <div className="bg-black p-3 border border-terminal-green/50 font-adelle-mono text-xs text-terminal-green whitespace-pre-line">
              {shareText}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <PixelButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  playClick();
                  navigator.clipboard.writeText(shareText);
                }}
              >
                <Copy className="size-3" />
                COPY
              </PixelButton>
              
              <PixelButton
                variant="secondary"
                size="sm"
                asChild
              >
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://iahackathon.pe")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LINKEDIN
                </a>
              </PixelButton>
              
              <PixelButton
                variant="secondary"
                size="sm"
                asChild
              >
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X_TWITTER
                </a>
              </PixelButton>
              
              <PixelButton
                variant="secondary"
                size="sm"
                asChild
              >
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WHATSAPP
                </a>
              </PixelButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center py-4"
          >
            <p className="font-adelle-mono text-lg uppercase font-bold text-terminal-green mb-2">
              SEE_YOU_THERE!
            </p>
            <p className="font-adelle-mono text-xs text-muted-foreground uppercase">
              GET_READY_TO_BUILD_SOMETHING_AMAZING
            </p>
          </motion.div>

          <PixelButton asChild variant="ghost" className="w-full">
            <Link href="/">&lt;&lt; RETURN_HOME</Link>
          </PixelButton>
        </RetroCardContent>
      </RetroCard>
    </div>
  );
}
