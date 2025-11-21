"use client";

import { useUser } from "@clerk/nextjs";
import { useParticipant } from "@/hooks/use-participant";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Step1Combined } from "@/components/onboarding/step-1-combined";
// CONFIG step no longer needed - commented out
// import { Step3Preferences } from "@/components/onboarding/step-3-preferences";
import { Step4Legal } from "@/components/onboarding/step-4-legal";
import { RetroCard, RetroCardContent } from "@/components/ui/retro-card";
import { RetroProgressBar } from "@/components/ui/retro-progress-bar";
import { GlitchText } from "@/components/ui/terminal-text";

function LoadingState() {
  return (
    <RetroCard className="max-w-2xl mx-auto">
      <RetroCardContent className="py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="size-3 bg-brand-red animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
          <p className="font-adelle-mono text-sm uppercase tracking-wider">
            CARGANDO<span className="loading-dots"></span>
           ]</p>
        </div>
      </RetroCardContent>
    </RetroCard>
  );
}

export default function OnboardingPage() {
  const { isLoaded } = useUser();
  const router = useRouter();
  const { participant, isLoading } = useParticipant();

  useEffect(() => {
    if (!isLoaded || isLoading) return;

    if (participant?.registrationStatus === "completed") {
      router.push("/onboarding/complete");
    }
  }, [isLoaded, isLoading, participant, router]);

  if (!isLoaded || isLoading) {
    return <LoadingState />;
  }

  if (!participant) {
    return <LoadingState />;
  }

  const currentStep = participant.currentStep || 1;
  const stepLabels = ["ONBOARDING", "TÉRMINOS"];

  return (
    <div className="space-y-3">
      <div className="text-center space-y-1">
        <h1 className="text-2xl md:text-3xl font-adelle-mono font-bold uppercase tracking-wider pixel-shadow text-white">
          <GlitchText>IA_HACKATHON.exe</GlitchText>
        </h1>
        <p className="font-adelle-mono text-xs text-white/60 uppercase tracking-wider">
          PROTOCOLO_ONBOARDING_v2025
         ]</p>
      </div>

      <RetroProgressBar
        currentStep={currentStep}
        totalSteps={2}
        labels={stepLabels}
        className="max-w-md mx-auto"
      />

      <div>
        {currentStep === 1 && <Step1Combined />}
        {/* CONFIG step no longer needed - commented out */}
        {/* {currentStep === 3 && <Step3Preferences />} */}
        {currentStep === 2 && <Step4Legal />}
      </div>

      <div className="text-center font-adelle-mono text-xs text-white/60 uppercase tracking-wider space-y-1">
        <p>FECHA_EVENTO: 29-30 NOV 2025 ]</p>
        <p>UBICACIÓN: UPCH_LA_MOLINA ]</p>
      </div>
    </div>
  );
}

