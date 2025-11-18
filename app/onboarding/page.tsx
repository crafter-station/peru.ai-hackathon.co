"use client";

import { useUser } from "@clerk/nextjs";
import { useParticipant } from "@/hooks/use-participant";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Step1PersonalInfo } from "@/components/onboarding/step-1-personal-info";
import { Step2Security } from "@/components/onboarding/step-2-security";
import { Step3Preferences } from "@/components/onboarding/step-3-preferences";
import { Step4Legal } from "@/components/onboarding/step-4-legal";
import { Card, CardContent } from "@/components/ui/card";

function LoadingState() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </CardContent>
    </Card>
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-black mb-2">
          IA Hackathon Peru 2025
        </h1>
        <p className="text-muted-foreground">
          Completa tu registro para el evento
        </p>
      </div>

      {currentStep === 1 && (
        <div>
          <Step1PersonalInfo />
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <Step2Security />
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <Step3Preferences />
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <Step4Legal />
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <p>29-30 de Noviembre 2025</p>
        <p>Universidad Peruana Cayetano Heredia - La Molina</p>
      </div>
    </div>
  );
}
