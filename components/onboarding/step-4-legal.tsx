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
import { motion } from "framer-motion";
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
          className="font-adelle-mono text-[10px] uppercase underline text-terminal-green hover:text-terminal-green/80"
        >
          [READ_DOCUMENT]
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-2 border-foreground">
        <DialogHeader className="border-b-2 border-foreground pb-4">
          <DialogTitle className="font-adelle-mono uppercase tracking-wider flex items-center gap-2">
            <span className="text-terminal-green">&gt;_</span>
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
  const { participant, updateParticipant, isUpdating } = useParticipant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { playSuccess, playError, playClick } = useRetroSounds();

  const form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      rulesAccepted: participant?.rulesAccepted || false,
      termsAccepted: participant?.termsAccepted || false,
      dataConsentAccepted: participant?.dataConsentAccepted || false,
      mediaReleaseAccepted: participant?.mediaReleaseAccepted || false,
      ageVerified: participant?.ageVerified || false,
    },
  });

  const onSubmit = async (data: Step4Data) => {
    setIsSubmitting(true);
    try {
      updateParticipant({
        ...data,
        registrationStatus: "completed",
        completedAt: new Date(),
      });
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
    updateParticipant({ currentStep: 3 });
  };

  const legalItems = [
    {
      name: "rulesAccepted" as const,
      label: "HACKATHON_RULES",
      description: "ACCEPT_EVENT_RULES",
      dialogTitle: "HACKATHON_RULES",
      dialogContent: HACKATHON_RULES,
    },
    {
      name: "termsAccepted" as const,
      label: "TERMS_AND_CONDITIONS",
      description: "ACCEPT_PARTICIPATION_TERMS",
      dialogTitle: "TERMS_AND_CONDITIONS",
      dialogContent: TERMS_AND_CONDITIONS,
    },
    {
      name: "dataConsentAccepted" as const,
      label: "DATA_CONSENT",
      description: "ALLOW_DATA_SHARING_WITH_SPONSORS",
      dialogTitle: "DATA_CONSENT",
      dialogContent: DATA_CONSENT,
    },
    {
      name: "mediaReleaseAccepted" as const,
      label: "MEDIA_RELEASE",
      description: "ALLOW_PHOTO_VIDEO_USAGE",
      dialogTitle: "MEDIA_RELEASE",
      dialogContent: MEDIA_RELEASE,
    },
    {
      name: "ageVerified" as const,
      label: "AGE_VERIFICATION",
      description: "CONFIRM_18+_YEARS_OLD",
      dialogTitle: "AGE_VERIFICATION",
      dialogContent: AGE_VERIFICATION,
    },
  ];

  return (
    <RetroCard>
      <RetroCardHeader>
        <RetroCardTitle>TERMS.accept()</RetroCardTitle>
        <RetroCardDescription>
          FINAL_STEP_REQUIRED
        </RetroCardDescription>
      </RetroCardHeader>
      <RetroCardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {legalItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FormField
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 border-2 border-foreground/50 p-3">
                      <FormControl>
                        <PixelCheckbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none font-adelle-mono flex-1">
                        <label className="text-xs uppercase font-bold">
                          {item.label}
                        </label>
                        <p className="text-[10px] text-muted-foreground uppercase">
                          {item.description}
                        </p>
                        <LegalDialog title={item.dialogTitle} content={item.dialogContent} />
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                      </div>
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3 pt-4"
            >
              <PixelButton
                type="button"
                variant="secondary"
                onClick={goBack}
                className="flex-1"
              >
                &lt;&lt; BACK
              </PixelButton>
              <PixelButton
                type="submit"
                className="flex-1"
                variant="terminal"
                loading={isSubmitting || isUpdating}
              >
                &gt;&gt; COMPLETE &lt;&lt;
              </PixelButton>
            </motion.div>
          </form>
        </Form>
      </RetroCardContent>
    </RetroCard>
  );
}
