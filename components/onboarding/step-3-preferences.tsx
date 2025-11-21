"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema, type Step3Data } from "@/lib/validations/onboarding";
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
import { RetroTextarea } from "@/components/ui/retro-textarea";
import { RetroRadioGroup, RetroRadioGroupItem } from "@/components/ui/retro-radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRetroSounds } from "@/hooks/use-click-sound";

export function Step3Preferences() {
  const { participant, updateParticipant, isUpdating } = useParticipant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { playSuccess, playError, playClick } = useRetroSounds();

  const form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      techStack: participant?.techStack || [],
      experienceLevel: participant?.experienceLevel as Step3Data["experienceLevel"] || "intermediate",
      gender: participant?.gender as Step3Data["gender"] || undefined,
      additionalNotes: participant?.additionalNotes || "",
    },
  });

  const onSubmit = async (data: Step3Data) => {
    setIsSubmitting(true);
    try {
      updateParticipant({
        ...data,
        currentStep: 4,
      });
      playSuccess();
    } catch {
      playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    playClick();
    updateParticipant({ currentStep: 2 });
  };

  return (
    <RetroCard>
      <RetroCardHeader>
        <RetroCardTitle>CONFIG_USUARIO.set()</RetroCardTitle>
        <RetroCardDescription>
          INFORMACIÓN_OPCIONAL
        </RetroCardDescription>
      </RetroCardHeader>
      <RetroCardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider text-white/80">
                      NIVEL_DE_EXPERIENCIA
                    </label>
                    <FormControl>
                      <RetroRadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RetroRadioGroupItem value="beginner" />
                          </FormControl>
                          <Label className="font-adelle-mono text-sm uppercase text-white">
                            NIV_1 - PRINCIPIANTE
                          </Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RetroRadioGroupItem value="intermediate" />
                          </FormControl>
                          <Label className="font-adelle-mono text-sm uppercase text-white">
                            NIV_2 - INTERMEDIO
                          </Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RetroRadioGroupItem value="advanced" />
                          </FormControl>
                          <Label className="font-adelle-mono text-sm uppercase text-white">
                            NIV_3 - AVANZADO
                          </Label>
                        </FormItem>
                      </RetroRadioGroup>
                    </FormControl>
                    <FormMessage className="font-adelle-mono text-xs uppercase" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider text-white/80">
                      GÉNERO [OPCIONAL]
                    </label>
                    <FormControl>
                      <RetroRadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RetroRadioGroupItem value="male" />
                          </FormControl>
                          <Label className="font-adelle-mono text-sm uppercase text-white">
                            MASCULINO
                          </Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RetroRadioGroupItem value="female" />
                          </FormControl>
                          <Label className="font-adelle-mono text-sm uppercase text-white">
                            FEMENINO
                          </Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RetroRadioGroupItem value="other" />
                          </FormControl>
                          <Label className="font-adelle-mono text-sm uppercase text-white">
                            OTRO
                          </Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RetroRadioGroupItem value="prefer-not-to-say" />
                          </FormControl>
                          <Label className="font-adelle-mono text-sm uppercase text-white">
                            PREFIERO_NO_DECIR
                          </Label>
                        </FormItem>
                      </RetroRadioGroup>
                    </FormControl>
                    <FormMessage className="font-adelle-mono text-xs uppercase" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider mb-1 text-white/80">
                      NOTAS_ADICIONALES [OPCIONAL]
                    </label>
                    <FormControl>
                      <RetroTextarea
                        placeholder="¿ALGUNA_INFO_PARA_ORGANIZADORES?"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <p className="text-[10px] font-adelle-mono text-white/60 uppercase mt-1">
                      RESTRICCIONES_ALIMENTARIAS, NECESIDADES_ACCESIBILIDAD, ETC
                    </p>
                    <FormMessage className="font-adelle-mono text-xs uppercase" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 pt-4"
            >
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
                loading={isSubmitting || isUpdating}
              >
                SIGUIENTE_NIVEL &gt;&gt;
              </PixelButton>
            </motion.div>
          </form>
        </Form>
      </RetroCardContent>
    </RetroCard>
  );
}
