"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, type Step2Data } from "@/lib/validations/onboarding";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import heic2any from "heic2any";

export function Step2Security() {
  const { participant, updateParticipant, isUpdating } = useParticipant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    participant?.profilePhotoUrl || null
  );

  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      profilePhotoUrl: participant?.profilePhotoUrl || undefined,
      hasLaptop: participant?.hasLaptop || false,
      laptopBrand: participant?.laptopBrand || undefined,
      laptopModel: participant?.laptopModel || undefined,
      laptopSerialNumber: participant?.laptopSerialNumber || undefined,
    },
  });

  const hasLaptop = form.watch("hasLaptop");

  const convertToWebFormat = useCallback(async (file: File): Promise<File> => {
    if (!file.name.toLowerCase().match(/\.(heic|heif)$/)) {
      return file;
    }

    try {
      setIsConverting(true);
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/png",
        quality: 0.9,
      });

      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      const convertedFile = new File(
        [blob],
        file.name.replace(/\.(heic|heif)$/i, ".png"),
        { type: "image/png" }
      );

      return convertedFile;
    } catch (error) {
      console.error("HEIC conversion failed:", error);
      throw new Error("No se pudo convertir la imagen. Intenta con JPG o PNG.");
    } finally {
      setIsConverting(false);
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const processedFile = await convertToWebFormat(file);
      
      const formData = new FormData();
      formData.append("file", processedFile);

      const response = await fetch("/api/onboarding/upload-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      const { url } = await response.json();
      
      form.setValue("profilePhotoUrl", url);
      setPhotoPreview(url);
      
      updateParticipant({
        profilePhotoUrl: url,
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error al subir la foto. Por favor intenta de nuevo.";
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [form, updateParticipant, convertToWebFormat]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".heic", ".heif"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const removePhoto = () => {
    form.setValue("profilePhotoUrl", undefined);
    setPhotoPreview(null);
    updateParticipant({
      profilePhotoUrl: null,
    });
  };

  const onSubmit = async (data: Step2Data) => {
    setIsSubmitting(true);
    try {
      updateParticipant({
        ...data,
        currentStep: 3,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    updateParticipant({ currentStep: 1 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paso 2: Seguridad y Equipos</CardTitle>
        <CardDescription>
          Información requerida por el venue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormLabel>Foto de Perfil</FormLabel>
              <FormDescription>
                Tu foto aparecerá en tu badge de participante
              </FormDescription>
              
              {!photoPreview ? (
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-colors
                    ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
                    ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}
                  `}
                >
                  <input {...getInputProps()} disabled={isUploading} />
                  <Upload className="size-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {isConverting ? "Convirtiendo imagen..." : isUploading ? "Subiendo..." : isDragActive ? "Suelta la imagen aquí" : "Arrastra una imagen o haz clic"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG, WEBP o HEIC (máx. 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative inline-block">
                  <div className="relative size-32 rounded-lg overflow-hidden border">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 size-6 rounded-full"
                    onClick={removePhoto}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="hasLaptop"
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
                      Traeré mi laptop al evento
                    </FormLabel>
                    <FormDescription>
                      Requerido por seguridad del venue
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {hasLaptop && (
              <>
                <FormField
                  control={form.control}
                  name="laptopBrand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca de Laptop</FormLabel>
                      <FormControl>
                        <Input placeholder="HP, Dell, Apple, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="laptopModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="EliteBook 840, MacBook Pro, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="laptopSerialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Serie</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC123XYZ" {...field} />
                      </FormControl>
                      <FormDescription>
                        Requerido por seguridad del venue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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
