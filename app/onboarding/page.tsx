"use client";

import { useUser } from "@clerk/nextjs";
import { useParticipant } from "@/hooks/use-participant";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Step1PersonalInfo } from "@/components/onboarding/step-1-personal-info";
import { Step2Security } from "@/components/onboarding/step-2-security";
import { Step3Preferences } from "@/components/onboarding/step-3-preferences";
import { Step4Legal } from "@/components/onboarding/step-4-legal";
import { RetroCard, RetroCardContent } from "@/components/ui/retro-card";
import { RetroProgressBar } from "@/components/ui/retro-progress-bar";
import { GlitchText } from "@/components/ui/terminal-text";
import { motion, AnimatePresence } from "framer-motion";

function LoadingState() {
  return (
    <RetroCard className="max-w-2xl mx-auto">
      <RetroCardContent className="py-12">
        <div className="flex flex-col items-center justify-center gap-4">
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
          <p className="font-adelle-mono text-sm uppercase tracking-wider">
            LOADING<span className="loading-dots"></span>
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
  const stepLabels = ["INFO", "SECURITY", "CONFIG", "TERMS"];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-adelle-mono font-bold uppercase tracking-wider pixel-shadow">
          <GlitchText>IA_HACKATHON.exe</GlitchText>
        </h1>
        <p className="font-adelle-mono text-sm text-muted-foreground uppercase tracking-wider">
          {/* // */}REGISTRATION_PROTOCOL_v2025
         ]</p>
      </div>

      <RetroProgressBar
        currentStep={currentStep}
        totalSteps={4}
        labels={stepLabels}
        className="max-w-md mx-auto"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && <Step1PersonalInfo />}
          {currentStep === 2 && <Step2Security />}
          {currentStep === 3 && <Step3Preferences />}
          {currentStep === 4 && <Step4Legal />}
        </motion.div>
      </AnimatePresence>

      <div className="text-center font-adelle-mono text-xs text-muted-foreground uppercase tracking-wider space-y-1">
        <p>EVENT_DATE: 29-30 NOV 2025 ]</p>
        <p>LOCATION: UPCH_LA_MOLINA ]</p>
      </div>
    </div>
  );
}
