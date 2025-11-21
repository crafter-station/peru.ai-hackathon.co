"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, type Step1Data } from "@/lib/validations/onboarding";
import { useParticipant } from "@/hooks/use-participant";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RetroInput } from "@/components/ui/retro-input";
import { PixelButton } from "@/components/ui/pixel-button";
import {
  RetroCard,
  RetroCardContent,
  RetroCardHeader,
  RetroCardTitle,
  RetroCardDescription,
} from "@/components/ui/retro-card";
import {
  RetroSelect,
  RetroSelectContent,
  RetroSelectItem,
  RetroSelectTrigger,
  RetroSelectValue,
} from "@/components/ui/retro-select";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRetroSounds } from "@/hooks/use-click-sound";

export function Step1PersonalInfo() {
  const { participant, updateParticipant, isUpdating } = useParticipant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { playSuccess, playError } = useRetroSounds();

  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: participant?.fullName || "",
      organization: participant?.organization || "",
      dni: participant?.dni || "",
      ageRange: participant?.ageRange as Step1Data["ageRange"] || undefined,
      phoneNumber: participant?.phoneNumber || "",
      emergencyContactName: participant?.emergencyContactName || "",
      emergencyContactPhone: participant?.emergencyContactPhone || "",
      emergencyContactRelationship: participant?.emergencyContactRelationship as Step1Data["emergencyContactRelationship"] || undefined,
    },
  });

  const onSubmit = async (data: Step1Data) => {
    setIsSubmitting(true);
    try {
      updateParticipant({
        fullName: data.fullName,
        organization: data.organization,
        dni: data.dni,
        ageRange: data.ageRange,
        phoneNumber: data.phoneNumber,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelationship: data.emergencyContactRelationship,
        currentStep: 2,
      });
      playSuccess();
    } catch {
      playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    playError();
  };

  const formFields = [
    { name: "fullName", label: "NOMBRE_COMPLETO", placeholder: "JUAN_PEREZ_GARCIA", maxLength: undefined },
    { name: "organization", label: "ORGANIZACIÓN", placeholder: "EMPRESA_O_UNIVERSIDAD", maxLength: undefined },
    { name: "dni", label: "NÚMERO_DNI", placeholder: "DNI, PASAPORTE, OTRO", maxLength: 50 },
    { name: "phoneNumber", label: "TELÉFONO_WHATSAPP", placeholder: "+51987654321, +1234567890", maxLength: 20 },
  ];

  return (
    <RetroCard>
      <RetroCardHeader>
        <RetroCardTitle>DATOS_PARTICIPANTE.init()</RetroCardTitle>
        <RetroCardDescription>
          INGRESA_TU_INFORMACIÓN_PERSONAL
        </RetroCardDescription>
      </RetroCardHeader>
      <RetroCardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
            {formFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FormField
                  control={form.control}
                  name={field.name as keyof Step1Data}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormControl>
                        <RetroInput
                          label={field.label}
                          placeholder={field.placeholder}
                          maxLength={field.maxLength}
                          {...formField}
                          value={formField.value as string}
                        />
                      </FormControl>
                      <FormMessage className="font-adelle-mono text-xs uppercase" />
                    </FormItem>
                  )}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FormField
                control={form.control}
                name="ageRange"
                render={({ field }) => (
                  <FormItem>
                    <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider mb-1 text-white/80">
                      RANGO_DE_EDAD
                    </label>
                    <RetroSelect onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <RetroSelectTrigger>
                          <RetroSelectValue placeholder="SELECCIONA_TU_EDAD" />
                        </RetroSelectTrigger>
                      </FormControl>
                      <RetroSelectContent>
                        <RetroSelectItem value="18-24">18-24 AÑOS</RetroSelectItem>
                        <RetroSelectItem value="25-34">25-34 AÑOS</RetroSelectItem>
                        <RetroSelectItem value="35-44">35-44 AÑOS</RetroSelectItem>
                        <RetroSelectItem value="45+">45+ AÑOS</RetroSelectItem>
                      </RetroSelectContent>
                    </RetroSelect>
                    <p className="text-[10px] font-adelle-mono text-white/60 uppercase mt-1">
                      DEBES_TENER_18+_AÑOS_PARA_PARTICIPAR
                    </p>
                    <FormMessage className="font-adelle-mono text-xs uppercase" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-4 border-t border-brand-red/30"
            >
              <h3 className="font-adelle-mono font-bold text-sm uppercase tracking-wider mb-4">
                CONTACTO_DE_EMERGENCIA
              </h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RetroInput
                          label="NOMBRE_CONTACTO"
                          placeholder="MARIA_GARCIA_LOPEZ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-adelle-mono text-xs uppercase" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RetroInput
                          label="TELÉFONO_CONTACTO"
                          placeholder="+51987654321, +1234567890"
                          maxLength={20}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="font-adelle-mono text-xs uppercase" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider mb-1 text-white/80">
                        RELACIÓN
                      </label>
                      <RetroSelect onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <RetroSelectTrigger>
                            <RetroSelectValue placeholder="SELECCIONA_RELACIÓN" />
                          </RetroSelectTrigger>
                        </FormControl>
                        <RetroSelectContent>
                          <RetroSelectItem value="parent">PADRE/MADRE</RetroSelectItem>
                          <RetroSelectItem value="sibling">HERMANO/A</RetroSelectItem>
                          <RetroSelectItem value="spouse">CÓNYUGE</RetroSelectItem>
                          <RetroSelectItem value="friend">AMIGO/A</RetroSelectItem>
                          <RetroSelectItem value="other">OTRO</RetroSelectItem>
                        </RetroSelectContent>
                      </RetroSelect>
                      <FormMessage className="font-adelle-mono text-xs uppercase" />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <PixelButton
                type="submit"
                className="w-full"
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
