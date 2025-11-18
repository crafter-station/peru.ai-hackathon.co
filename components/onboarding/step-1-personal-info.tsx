"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, type Step1Data } from "@/lib/validations/onboarding";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";

export function Step1PersonalInfo() {
  const { participant, updateParticipant, isUpdating } = useParticipant();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: participant?.fullName || "",
      dni: participant?.dni || "",
      dateOfBirth: participant?.dateOfBirth
        ? new Date(participant.dateOfBirth)
        : undefined,
      phoneNumber: participant?.phoneNumber || "",
    },
  });

  const onSubmit = async (data: Step1Data) => {
    setIsSubmitting(true);
    try {
      updateParticipant({
        fullName: data.fullName,
        dni: data.dni,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        currentStep: 2,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 1: Información Personal</CardTitle>
        <CardDescription>
          Completa tus datos personales para el evento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez García" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tu nombre completo como aparece en tu DNI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="12345678"
                      maxLength={8}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Documento Nacional de Identidad (8 dígitos)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Debes tener 18+ años para participar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Teléfono (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+51987654321"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Formato: +51 seguido de 9 dígitos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || isUpdating}
              >
                {isSubmitting || isUpdating ? "Guardando..." : "Siguiente"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
