"use client";

import { useParticipant } from "@/hooks/use-participant";
import { useBadgeGeneration } from "@/hooks/use-badge-generation";
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
import { useState, useEffect, useCallback } from "react";
import { Download, Copy, User, ExternalLink, RefreshCw } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRetroSounds } from "@/hooks/use-click-sound";

export default function CompletePage() {
  const { participant, refetch } = useParticipant();
  const {
    generateBadge,
    isGenerating,
    error: badgeError,
  } = useBadgeGeneration();
  const [showConfetti, setShowConfetti] = useState(true);
  const { playSuccess, playClick, playError } = useRetroSounds();
  const [isInitialGeneration, setIsInitialGeneration] = useState(false);

  useEffect(() => {
    if (showConfetti) {
      playSuccess();
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, playSuccess]);

  useEffect(() => {
    if (
      participant?.id &&
      !participant.badgeBlobUrl &&
      !isGenerating &&
      !isInitialGeneration
    ) {
      setIsInitialGeneration(true);
      generateBadge(participant.id)
        .then(() => {
          refetch();
        })
        .catch((err) => {
          console.error("Initial badge generation failed:", err);
        })
        .finally(() => {
          setIsInitialGeneration(false);
        });
    }
  }, [
    participant?.id,
    participant?.badgeBlobUrl,
    isGenerating,
    isInitialGeneration,
    generateBadge,
    refetch,
  ]);

  const handleRegenerateBadge = useCallback(async () => {
    if (!participant?.id) return;

    playClick();
    try {
      await generateBadge(participant.id);
      await refetch();
      playSuccess();
    } catch (err) {
      console.error("Badge regeneration failed:", err);
      playError();
    }
  }, [
    participant?.id,
    generateBadge,
    refetch,
    playClick,
    playSuccess,
    playError,
  ]);

  const downloadBadge = useCallback(async () => {
    if (!participant?.badgeBlobUrl) return;

    try {
      playClick();
      const response = await fetch(participant.badgeBlobUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ia-hack-badge-${participant.participantNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading badge:", error);
      alert("Error downloading badge. Please try again.");
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

  const shareText = `🚀 ¡Ya estoy dentro! Me registré para la IA Hackathon Peru 2025 y no puedo estar más emocionado/a.

Este 29 y 30 de noviembre estaré en la Universidad Peruana Cayetano Heredia junto a otros developers, diseñadores y entusiastas de la tecnología creando soluciones con inteligencia artificial. Van a ser 2 días intensos de código, creatividad y mucho café ☕

Gracias a The Hackathon Company, Makers, Crafter Station y AI Playgrounds por organizar este evento 🙌

📅 29-30 de Noviembre
📍 Universidad Peruana Cayetano Heredia, La Molina
🔗 iahackathon.pe

#IAHackathonPeru #AI #Hackathon #Peru #Innovation #Tech`;

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
                YOUR_BADGE
              </h3>
              <div className="relative w-full max-w-md mx-auto border-4 border-foreground">
                {isGenerating || isInitialGeneration ? (
                  <div className="aspect-[1080/1440] bg-black flex items-center justify-center">
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-center p-8"
                    >
                      <RefreshCw className="size-8 mx-auto mb-4 text-terminal-green animate-spin" />
                      <p className="font-adelle-mono text-sm text-terminal-green uppercase">
                        GENERATING_BADGE...
                      </p>
                      <p className="font-adelle-mono text-xs text-muted-foreground uppercase mt-2">
                        CREATING_AI_AVATAR
                      </p>
                    </motion.div>
                  </div>
                ) : participant.badgeBlobUrl ? (
                  <Image
                    src={participant.badgeBlobUrl}
                    alt="Your Badge"
                    width={1080}
                    height={1440}
                    className="w-full h-auto"
                    priority
                  />
                ) : (
                  <div className="aspect-[1080/1440] bg-black flex items-center justify-center">
                    <div className="text-center p-8">
                      <p className="font-adelle-mono text-sm text-muted-foreground uppercase">
                        BADGE_NOT_GENERATED
                      </p>
                      {badgeError && (
                        <p className="font-adelle-mono text-xs text-red-500 uppercase mt-2">
                          {badgeError}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 scanlines pointer-events-none" />
              </div>
              {participant.profilePhotoAiUrl && (
                <p className="text-[10px] font-adelle-mono text-terminal-green uppercase mt-2">
                  ✓ AI_AVATAR_GENERATED
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <PixelButton
                onClick={downloadBadge}
                size="lg"
                className="w-full"
                disabled={!participant.badgeBlobUrl || isGenerating}
              >
                <Download className="size-4" />
                DOWNLOAD_BADGE
              </PixelButton>

              <PixelButton
                onClick={handleRegenerateBadge}
                variant="terminal"
                size="lg"
                className="w-full"
                loading={isGenerating}
                disabled={isGenerating}
              >
                <RefreshCw className="size-4" />
                REGENERATE_BADGE
              </PixelButton>

            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="border-2 border-foreground/50 p-4 space-y-3"
            >
              <h3 className="font-adelle-mono font-bold text-sm uppercase">
                SHARE_NEWS
              </h3>

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

                <PixelButton variant="secondary" size="sm" asChild>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://iahackathon.pe")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LINKEDIN
                  </a>
                </PixelButton>

                <PixelButton variant="secondary" size="sm" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X_TWITTER
                  </a>
                </PixelButton>

                <PixelButton variant="secondary" size="sm" asChild>
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
                <span className="text-muted-foreground">DATE:</span>{" "}
                29-30_NOV_2025
              </p>
              <p>
                <span className="text-muted-foreground">LOCATION:</span>{" "}
                UPCH_LA_MOLINA
              </p>
              <p>
                <span className="text-muted-foreground">CHECK_IN:</span>{" "}
                08:00_AM
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
                <span className="text-terminal-green">✓</span>{" "}
                COMFORTABLE_CLOTHES
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="border-2 border-terminal-green/50 bg-terminal-green/5 p-4 space-y-2 font-adelle-mono"
          >
            <h3 className="font-bold text-sm uppercase text-terminal-green">
              IMPORTANT_REMINDERS
            </h3>
            <ul className="space-y-1 text-xs uppercase">
              <li>
                <span className="text-muted-foreground">•</span>{" "}
                ARRIVE_EARLY_FOR_CHECK_IN
              </li>
              <li>
                <span className="text-muted-foreground">•</span>{" "}
                BRING_THIS_BADGE_(PRINTED_OR_PHONE)
              </li>
              <li>
                <span className="text-muted-foreground">•</span>{" "}
                FOOD_AND_DRINKS_PROVIDED
              </li>
              <li>
                <span className="text-muted-foreground">•</span>{" "}
                TEAMS_FORMED_ON_SITE
              </li>
            </ul>
          </motion.div>

          {participant.participantNumber && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88 }}
              className="border-2 border-terminal-green/50 bg-terminal-green/5 p-4 space-y-3"
            >
              <h3 className="font-adelle-mono font-bold text-sm uppercase text-terminal-green">
                YOUR_PROFILE
              </h3>
              <p className="font-adelle-mono text-xs text-muted-foreground uppercase">
                SHARE_YOUR_PROFILE_FOR_NETWORKING
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <PixelButton
                  asChild
                  variant="terminal"
                  size="sm"
                  className="flex-1"
                >
                  <Link
                    href={`/p/${participant.participantNumber}`}
                    target="_blank"
                  >
                    <ExternalLink className="size-3" />
                    VIEW_PROFILE
                  </Link>
                </PixelButton>
                <PixelButton
                  asChild
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <Link href="/profile">
                    <User className="size-3" />
                    EDIT_PROFILE
                  </Link>
                </PixelButton>
              </div>
            </motion.div>
          )}

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
