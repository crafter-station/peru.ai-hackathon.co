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
import {
  HACKATHON_RULES,
  TERMS_AND_CONDITIONS,
  DATA_CONSENT,
  MEDIA_RELEASE,
  AGE_VERIFICATION,
} from "@/lib/constants/legal";

function LegalDialog({ title, content }: { title: string; content: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-xs underline">
          Leer documento completo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-semibold mt-3 mb-1">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
              }
              if (line.match(/^\d+\.\s\*\*/)) {
                const text = line.replace(/^\d+\.\s\*\*/, '').replace(/\*\*/, '');
                return <p key={i} className="font-semibold mt-2">{text}</p>;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              return <p key={i} className="my-1">{line}</p>;
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
                    <LegalDialog title="Reglas del Hackathon" content={HACKATHON_RULES} />
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
                    <LegalDialog title="Términos y Condiciones" content={TERMS_AND_CONDITIONS} />
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
                    <LegalDialog title="Autorización de Uso de Datos" content={DATA_CONSENT} />
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
                    <LegalDialog title="Autorización de Uso de Imagen" content={MEDIA_RELEASE} />
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
                    <LegalDialog title="Declaración de Mayoría de Edad" content={AGE_VERIFICATION} />
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
