"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4Schema, type Step4Data } from "@/lib/validations/onboarding";
import { useParticipant } from "@/hooks/use-participant";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PixelButton } from "@/components/ui/pixel-button";
import {
  RetroCard,
  RetroCardContent,
  RetroCardHeader,
  RetroCardTitle,
  RetroCardDescription,
} from "@/components/ui/retro-card";
import { PixelCheckbox } from "@/components/ui/pixel-checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRetroSounds } from "@/hooks/use-click-sound";
import {
  HACKATHON_RULES,
  TERMS_AND_CONDITIONS,
  DATA_CONSENT,
  MEDIA_RELEASE,
  AGE_VERIFICATION,
} from "@/lib/constants/legal";

function LegalDialog({ title, content }: { title: string; content: string }) {
  const { playClick } = useRetroSounds();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          onClick={() => playClick()}
          className="font-adelle-mono text-[10px] uppercase underline text-brand-red hover:text-brand-red/80"
        >
          [LEER_DOCUMENTO]
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border border-brand-red bg-black/95 backdrop-blur-sm text-white">
        <DialogHeader className="border-b border-brand-red/30 pb-4">
          <DialogTitle className="font-adelle-mono uppercase tracking-wider flex items-center gap-2 text-white">
            <span className="text-brand-red">&gt;_</span>
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="font-adelle-mono text-sm space-y-2">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-lg font-bold mt-4 mb-2 uppercase">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-base font-semibold mt-3 mb-1 uppercase">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="ml-4 text-xs">{line.replace('- ', '')}</li>;
              }
              if (line.match(/^\d+\.\s\*\*/)) {
                const text = line.replace(/^\d+\.\s\*\*/, '').replace(/\*\*/, '');
                return <p key={i} className="font-semibold mt-2 text-xs">{text}</p>;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              return <p key={i} className="text-xs opacity-80">{line}</p>;
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function Step4Legal() {
  const { participant, updateParticipant, isUpdating, refetch } = useParticipant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { playSuccess, playError, playClick } = useRetroSounds();

  const form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      allTermsAccepted: 
        participant?.rulesAccepted && 
        participant?.termsAccepted && 
        participant?.dataConsentAccepted && 
        participant?.mediaReleaseAccepted && 
        participant?.ageVerified || false,
    },
  });

  const onSubmit = async (data: Step4Data) => {
    setIsSubmitting(true);
    try {
      // Update participant status
      updateParticipant({
        rulesAccepted: data.allTermsAccepted,
        termsAccepted: data.allTermsAccepted,
        dataConsentAccepted: data.allTermsAccepted,
        mediaReleaseAccepted: data.allTermsAccepted,
        ageVerified: data.allTermsAccepted,
        registrationStatus: "completed",
        completedAt: new Date(),
      });
      
      // Wait a moment for the update to process, then check for badge
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Poll for badge completion (max 8 seconds)
      if (participant?.id && participant?.profilePhotoAiUrl) {
        let attempts = 0;
        const maxAttempts = 16; // 8 seconds max (500ms * 16)
        
        while (attempts < maxAttempts) {
          await refetch();
          const checkResponse = await fetch("/api/onboarding");
          const updatedParticipant = await checkResponse.json();
          
          if (updatedParticipant.badgeBlobUrl) {
            console.log("[onboarding] Badge ready, navigating to complete");
            playSuccess();
            router.push("/onboarding/complete");
            return;
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }
        
        // If badge not ready after max attempts, navigate anyway
        // Badge will generate in background
        console.log("[onboarding] Badge not ready yet, navigating anyway");
      }
      
      playSuccess();
      router.push("/onboarding/complete");
    } catch {
      playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    playClick();
    updateParticipant({ currentStep: 1 });
  };

  const allTermsContent = `${HACKATHON_RULES}\n\n${TERMS_AND_CONDITIONS}\n\n${DATA_CONSENT}\n\n${MEDIA_RELEASE}\n\n${AGE_VERIFICATION}`;

  return (
    <RetroCard>
      <RetroCardHeader>
        <RetroCardTitle>TÉRMINOS.accept()</RetroCardTitle>
        <RetroCardDescription>
          PASO_FINAL_REQUERIDO
        </RetroCardDescription>
      </RetroCardHeader>
      <RetroCardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
              name="allTermsAccepted"
                  render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 border border-brand-red/30 p-4">
                      <FormControl>
                        <PixelCheckbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                  <div className="space-y-2 leading-none font-adelle-mono flex-1">
                    <label className="text-sm uppercase font-bold text-white block">
                      ACEPTAR_TODOS_LOS_TÉRMINOS
                        </label>
                    <p className="text-xs text-white/80 uppercase">
                      Al marcar esta casilla, aceptas las reglas del hackathon, términos y condiciones, 
                      consentimiento de datos, autorización de medios y verificas que tienes 18+ años.
                        </p>
                    <LegalDialog title="TÉRMINOS_Y_CONDICIONES_COMPLETOS" content={allTermsContent} />
                    <FormMessage className="font-adelle-mono text-xs uppercase mt-2" />
                      </div>
                    </FormItem>
                  )}
                />

            <div className="flex gap-3 pt-4">
              <PixelButton
                type="button"
                variant="secondary"
                onClick={goBack}
                className="flex-1"
              >
                &lt;&lt; ATRÁS
              </PixelButton>
              <PixelButton
                type="submit"
                className="flex-1"
                variant="terminal"
                loading={isSubmitting || isUpdating}
              >
                &gt;&gt; COMPLETAR &lt;&lt;
              </PixelButton>
            </div>
          </form>
        </Form>
      </RetroCardContent>
    </RetroCard>
  );
}
