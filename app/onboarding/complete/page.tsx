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
import { BadgePreview3D } from "@/components/badge/badge-preview-3d";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Download, Copy, User, ExternalLink } from "lucide-react";
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
  const [isInitialGeneration, setIsInitialGeneration] = useState(false);
  const { playSuccess, playClick } = useRetroSounds();

  useEffect(() => {
    if (showConfetti) {
      playSuccess();
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti, playSuccess]);

  // Badge should already be generated before reaching this page
  // Only generate if somehow it's missing (fallback)
  useEffect(() => {
    if (
      participant?.id &&
      participant.registrationStatus === "completed" &&
      participant.profilePhotoAiUrl &&
      !participant.badgeBlobUrl &&
      !isGenerating &&
      !isInitialGeneration
    ) {
      // Wait a bit to see if badge appears (might be generating)
      const timeout = setTimeout(() => {
        if (!participant.badgeBlobUrl) {
          setIsInitialGeneration(true);
          generateBadge(participant.id)
            .then(() => {
              refetch();
            })
            .catch((err) => {
              console.error("[complete] Fallback badge generation failed:", err);
            })
            .finally(() => {
              setIsInitialGeneration(false);
            });
        }
      }, 2000); // Wait 2 seconds before fallback generation
      
      return () => clearTimeout(timeout);
    }
  }, [
    participant?.id,
    participant?.badgeBlobUrl,
    participant?.registrationStatus,
    participant?.profilePhotoAiUrl,
    isGenerating,
    isInitialGeneration,
    generateBadge,
    refetch,
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
      alert("Error al descargar la credencial. Por favor intenta de nuevo.");
    }
  }, [participant, playClick]);

  const handleRegenerateBadge = useCallback(async () => {
    if (!participant?.id) return;

    playClick();
    try {
      await generateBadge(participant.id);
      await refetch();
      playSuccess();
    } catch (err) {
      console.error("[complete] Badge regeneration failed:", err);
    }
  }, [participant?.id, generateBadge, refetch, playClick, playSuccess]);

  if (!participant || participant.registrationStatus !== "completed") {
    return (
      <RetroCard className="max-w-2xl mx-auto">
        <RetroCardContent className="py-12 text-center">
          <p className="font-adelle-mono text-sm uppercase text-white/60">
            ONBOARDING_NO_COMPLETADO
          </p>
          <PixelButton asChild className="mt-4">
            <Link href="/onboarding">VOLVER_AL_ONBOARDING</Link>
          </PixelButton>
        </RetroCardContent>
      </RetroCard>
    );
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://www.peru.ai-hackathon.co";
  const shareUrl = participant?.participantNumber
    ? `${baseUrl}/share/badge/${participant.participantNumber}`
    : "https://www.peru.ai-hackathon.co/";

  const shareText = `🚀 ¡Ya estoy dentro! Me registré para la IA Hackathon Peru 2025 🎯

📅 29-30 Nov | 📍 UPCH La Molina
💻 2 días de código, creatividad y soluciones con IA

🔗 ${shareUrl}

#IAHackathonPeru #AI #Hackathon #Peru`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-8">
      <div className="fixed top-0 left-0 right-0 h-6 bg-black/40 backdrop-blur-sm border-b border-brand-red/20 flex items-center px-4 font-adelle-mono text-[10px] uppercase tracking-wider text-white/80 z-50">
        <span>SYSTEM_BOOT / IA_HACKATHON_2025.exe</span>
        <span className="ml-auto">
          <span className="text-brand-red">●</span> SYSTEM ONLINE
        </span>
      </div>
      <PixelConfetti isActive={showConfetti} particleCount={60} />

      <RetroCard>
        <RetroCardHeader className="text-center pb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <span className="text-xl">🏆</span>
            <div className="border border-brand-red bg-black/60 backdrop-blur-sm px-2 py-1">
              <span className="font-adelle-mono text-sm text-brand-red font-bold">
                #{String(participant.participantNumber || 0).padStart(4, "0")}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <RetroCardTitle className="justify-center text-xs">
              <GlitchText>¡LOGRO_DESBLOQUEADO!</GlitchText>
            </RetroCardTitle>
          </motion.div>
        </RetroCardHeader>

        <RetroCardContent className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
          <p className="font-adelle-mono text-xs uppercase text-white/80">
            ONBOARDING_COMPLETO
          </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <div className="text-center">
              <div className="relative w-full flex items-center justify-center">
                <BadgePreview3D
                  badgeUrl={participant.badgeBlobUrl || null}
                  isGenerating={(isGenerating || isInitialGeneration) && !participant.badgeBlobUrl}
                  participantNumber={participant.participantNumber?.toString() || null}
                />
                {badgeError && (
                  <p className="font-adelle-mono text-xs text-brand-red uppercase mt-2 absolute -bottom-6 left-1/2 -translate-x-1/2">
                    {badgeError}
                  </p>
                )}
              </div>
              {participant.profilePhotoAiUrl && (
                <p className="text-[10px] font-adelle-mono text-brand-red uppercase mt-4">
                  ✓ AVATAR_IA_GENERADO
                </p>
              )}
            </div>

            {participant.badgeBlobUrl ? (
              <PixelButton
                onClick={downloadBadge}
                size="lg"
                className="w-full"
              >
                <Download className="size-4" />
                DESCARGAR_CREDENCIAL
              </PixelButton>
            ) : (
              <PixelButton
                onClick={handleRegenerateBadge}
                variant="terminal"
                size="lg"
                className="w-full"
                loading={isGenerating || isInitialGeneration}
                disabled={isGenerating || isInitialGeneration || !participant?.id || !participant?.profilePhotoAiUrl}
              >
                {isGenerating || isInitialGeneration ? "GENERANDO_CREDENCIAL..." : "GENERAR_CREDENCIAL"}
              </PixelButton>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="border border-brand-red/30 p-4 space-y-3"
            >
              <h3 className="font-adelle-mono font-bold text-sm uppercase text-white">
                COMPARTE_EN_REDES
              </h3>

              <div className="bg-black/60 backdrop-blur-sm p-3 border border-brand-red/50 font-adelle-mono text-xs text-brand-red whitespace-pre-line">
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
                  COPIAR
                </PixelButton>

                <PixelButton variant="secondary" size="sm" asChild>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LINKEDIN
                  </a>
                </PixelButton>

                <PixelButton variant="secondary" size="sm" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
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
              className="border border-brand-red/30 p-4 space-y-2 font-adelle-mono"
            >
              <h3 className="font-bold text-sm uppercase text-white">DETALLES_DEL_EVENTO</h3>
              <div className="space-y-1 text-xs uppercase">
                <p className="text-white">
                  <span className="text-white/60">FECHA:</span>{" "}
                  29-30_NOV_2025
                </p>
                <p className="text-white">
                  <span className="text-white/60">UBICACIÓN:</span>{" "}
                  UPCH_LA_MOLINA
                </p>
                <p className="text-white">
                  <span className="text-white/60">CHECK_IN:</span>{" "}
                  08:00_AM
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="border border-brand-red/30 p-4 space-y-2 font-adelle-mono"
            >
              <h3 className="font-bold text-sm uppercase text-white">QUÉ_TRAER</h3>
              <ul className="space-y-1 text-xs uppercase text-white">
                <li className="flex items-center gap-2">
                  <span className="text-brand-red">✓</span> LAPTOP_+_CARGADOR
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-red">✓</span> DNI_O_IDENTIFICACIÓN
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-red">✓</span> BOTELLA_DE_AGUA
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-red">✓</span> CUADERNO_+_LÁPIZ
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-brand-red">✓</span>{" "}
                  ROPA_CÓMODA
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="border border-brand-red/50 bg-brand-red/10 p-4 space-y-2 font-adelle-mono"
            >
              <h3 className="font-bold text-sm uppercase text-brand-red">
                RECORDATORIOS_IMPORTANTES
              </h3>
              <ul className="space-y-1 text-xs uppercase text-white">
                <li>
                  <span className="text-white/60">•</span>{" "}
                  LLEGAR_TEMPRANO_PARA_CHECK_IN
                </li>
                <li>
                  <span className="text-white/60">•</span>{" "}
                  TRAER_ESTA_CREDENCIAL_(IMPRESA_O_EN_TELÉFONO)
                </li>
                <li>
                  <span className="text-white/60">•</span>{" "}
                  COMIDA_Y_BEBIDAS_INCLUIDAS
                </li>
                <li>
                  <span className="text-white/60">•</span>{" "}
                  EQUIPOS_FORMADOS_EN_EL_LUGAR
                </li>
              </ul>
            </motion.div>

          {participant.participantNumber && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88 }}
              className="border border-brand-red/50 bg-brand-red/10 p-4 space-y-3"
            >
              <h3 className="font-adelle-mono font-bold text-sm uppercase text-brand-red">
                TU_PERFIL
              </h3>
              <p className="font-adelle-mono text-xs text-white/60 uppercase">
                COMPARTE_TU_PERFIL_PARA_NETWORKING
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
                    VER_PERFIL
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
                    EDITAR_PERFIL
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
            <p className="font-adelle-mono text-lg uppercase font-bold text-brand-red mb-2">
              ¡NOS_VEMOS_ALLÍ!
            </p>
            <p className="font-adelle-mono text-xs text-white/60 uppercase">
              PREPÁRATE_PARA_CONSTRUIR_ALGO_INCREÍBLE
            </p>
          </motion.div>

          <PixelButton asChild variant="ghost" className="w-full">
            <Link href="/">&lt;&lt; VOLVER_AL_INICIO</Link>
          </PixelButton>
        </RetroCardContent>
      </RetroCard>
    </div>
  );
}
