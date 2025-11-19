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
import { Download, Sparkles, Copy } from "lucide-react";
import Image from "next/image";
import { useBadgeGeneration } from "@/hooks/use-badge-generation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRetroSounds } from "@/hooks/use-click-sound";

export default function CompletePage() {
  const { participant } = useParticipant();
  const { generateBadge, isGenerating, error } = useBadgeGeneration();
  const [countdown, setCountdown] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  const { playSuccess, playClick } = useRetroSounds();

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
      participant.registrationStatus === "completed" &&
      !participant.badgeBlobUrl &&
      !isGenerating
    ) {
      generateBadge(participant.id).catch((err) => {
        console.error("Auto badge generation failed:", err);
      });
    }
  }, [participant?.id, participant?.registrationStatus, participant?.badgeBlobUrl, isGenerating, generateBadge]);

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
      playSuccess();
    } catch (err) {
      console.error("Badge generation error:", err);
      alert(error || "Error generando badge. Por favor, intenta de nuevo.");
    }
  };

  const canGenerate = countdown === 0 && !isGenerating;

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

          {participant.badgeBlobUrl ? (
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
                <div className="relative w-full max-w-3xl mx-auto border-4 border-foreground">
                  <Image
                    src={participant.badgeBlobUrl}
                    alt="Participant Badge"
                    width={1600}
                    height={900}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 scanlines pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <PixelButton
                  onClick={() => {
                    playClick();
                    const link = document.createElement("a");
                    link.href = participant.badgeBlobUrl!;
                    link.download = `ia-hack-badge-${participant.participantNumber}.jpg`;
                    link.click();
                  }}
                  size="lg"
                  className="w-full"
                >
                  <Download className="size-4" />
                  DOWNLOAD_BADGE
                </PixelButton>

                <PixelButton
                  onClick={handleGenerateBadge}
                  variant="secondary"
                  disabled={!canGenerate}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <span className="loading-dots">GENERATING</span>
                    </>
                  ) : countdown > 0 ? (
                    `WAIT_${countdown}s`
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      REGENERATE_BADGE
                    </>
                  )}
                </PixelButton>

                <p className="text-[10px] font-adelle-mono text-muted-foreground text-center uppercase">
                  SHARE_WITH #IAHACKATHONPERU
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center py-8 space-y-4"
            >
              <p className="font-adelle-mono text-sm text-muted-foreground uppercase">
                BADGE_NOT_GENERATED
              </p>
              <PixelButton 
                onClick={handleGenerateBadge} 
                size="lg"
                disabled={!canGenerate}
                variant="terminal"
              >
                {isGenerating ? (
                  <span className="loading-dots">GENERATING</span>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    GENERATE_BADGE.exe
                  </>
                )}
              </PixelButton>
              {error && (
                <p className="text-xs font-adelle-mono text-destructive uppercase">{error}</p>
              )}
            </motion.div>
          )}

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
