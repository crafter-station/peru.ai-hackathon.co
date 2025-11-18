"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4Schema, type Step4Data } from "@/lib/validations/onboarding";
import { useParticipant } from "@/hooks/use-participant";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Step4Legal() {
  const { participant, updateParticipant, isUpdating } = useParticipant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
      router.push("/onboarding/complete");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    updateParticipant({ currentStep: 3 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 4: Términos y Condiciones</CardTitle>
        <CardDescription>
          Lee y acepta los términos para completar tu registro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rulesAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Acepto las reglas del hackathon
                    </FormLabel>
                    <FormDescription>
                      He leído y acepto seguir todas las reglas del evento
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Acepto los términos y condiciones
                    </FormLabel>
                    <FormDescription>
                      Acepto los términos de participación del evento
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataConsentAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Autorizo el uso de mis datos
                    </FormLabel>
                    <FormDescription>
                      Autorizo compartir mis datos con sponsors del evento
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mediaReleaseAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Autorizo el uso de fotos y videos
                    </FormLabel>
                    <FormDescription>
                      Autorizo el uso de mi imagen en fotos/videos del evento
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ageVerified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Confirmo que tengo 18+ años
                    </FormLabel>
                    <FormDescription>
                      Declaro que soy mayor de 18 años
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                className="flex-1"
              >
                Atrás
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || isUpdating}
              >
                {isSubmitting || isUpdating ? "Enviando..." : "Completar Registro"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
