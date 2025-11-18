"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step3Schema, type Step3Data } from "@/lib/validations/onboarding";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const DIETARY_OPTIONS = [
  { id: "vegetarian", label: "Vegetariano" },
  { id: "vegan", label: "Vegano" },
  { id: "gluten-free", label: "Sin Gluten" },
  { id: "lactose-free", label: "Sin Lactosa" },
  { id: "none", label: "Ninguna" },
];

export function Step3Preferences() {
  const { participant, updateParticipant, isUpdating } = useParticipant();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      dietaryPreferences: participant?.dietaryPreferences || [],
      foodAllergies: participant?.foodAllergies || "",
      tshirtSize: participant?.tshirtSize as Step3Data["tshirtSize"] || "M",
      techStack: participant?.techStack || [],
      experienceLevel: participant?.experienceLevel as Step3Data["experienceLevel"] || "intermediate",
    },
  });

  const onSubmit = async (data: Step3Data) => {
    setIsSubmitting(true);
    try {
      updateParticipant({
        ...data,
        currentStep: 4,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    updateParticipant({ currentStep: 2 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 3: Preferencias del Evento</CardTitle>
        <CardDescription>
          Ayúdanos a preparar mejor el evento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="dietaryPreferences"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Preferencias Dietéticas
                    </FormLabel>
                    <FormDescription>
                      Selecciona todas las que apliquen
                    </FormDescription>
                  </div>
                  {DIETARY_OPTIONS.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="dietaryPreferences"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="foodAllergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alergias Alimentarias</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe cualquier alergia alimentaria que tengas..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Opcional - Ayúdanos a cuidarte mejor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tshirtSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Talla de Camiseta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu talla" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="XS">XS</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                      <SelectItem value="XXL">XXL</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Nivel de Experiencia en Programación</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="beginner" />
                        </FormControl>
                        <Label className="font-normal">
                          Principiante - Estoy empezando
                        </Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="intermediate" />
                        </FormControl>
                        <Label className="font-normal">
                          Intermedio - Tengo algo de experiencia
                        </Label>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="advanced" />
                        </FormControl>
                        <Label className="font-normal">
                          Avanzado - Tengo mucha experiencia
                        </Label>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
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
                {isSubmitting || isUpdating ? "Guardando..." : "Siguiente"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
