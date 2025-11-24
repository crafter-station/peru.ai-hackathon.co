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
import { PixelCheckbox } from "@/components/ui/pixel-checkbox";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRetroSounds } from "@/hooks/use-click-sound";

export function Step1Combined() {
  const { participant, updateParticipant, isUpdating } = useParticipant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    participant?.profilePhotoUrl || null
  );
  const { playSuccess, playError, playClick } = useRetroSounds();

  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: participant?.fullName || "",
      organization: participant?.organization || "",
      dni: participant?.dni || "",
      ageRange: participant?.ageRange as Step1Data["ageRange"] || undefined,
      phoneNumber: participant?.phoneNumber || "",
      profilePhotoUrl: participant?.profilePhotoUrl || "",
      hasLaptop: participant?.hasLaptop || false,
      laptopBrand: participant?.laptopBrand || "",
    },
  });

  const hasLaptop = form.watch("hasLaptop");

  // Badge generation is handled server-side in the API route
  // when required fields (fullName, dni, profilePhotoAiUrl) are complete

  const convertToWebFormat = useCallback(async (file: File): Promise<File> => {
    if (!file.name.toLowerCase().match(/\.(heic|heif)$/)) {
      return file;
    }

    try {
      setIsConverting(true);
      const heic2any = (await import("heic2any")).default;
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
        throw new Error("Error al subir la foto");
      }

      const { url } = await response.json();
      
      form.setValue("profilePhotoUrl", url);
      setPhotoPreview(url);
      
      updateParticipant({
        profilePhotoUrl: url,
      });
      playSuccess();
    } catch (error) {
      console.error("Error uploading photo:", error);
      playError();
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error al subir la foto. Por favor intenta de nuevo.";
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [form, updateParticipant, convertToWebFormat, playSuccess, playError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".heic", ".heif"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const removePhoto = () => {
    playClick();
    form.setValue("profilePhotoUrl", "");
    setPhotoPreview(null);
    updateParticipant({
      profilePhotoUrl: null,
    });
  };

  const onSubmit = async (data: Step1Data) => {
    setIsSubmitting(true);
    try {
      updateParticipant({
        ...data,
        currentStep: 2,
      });
      playSuccess();
    } catch {
      playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RetroCard>
      <RetroCardHeader>
        <RetroCardTitle>ONBOARDING.init()</RetroCardTitle>
        <RetroCardDescription>
          COMPLETA_TU_INFORMACIÓN_PERSONAL
        </RetroCardDescription>
      </RetroCardHeader>
      <RetroCardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Photo Upload - Full Width */}
            <FormField
              control={form.control}
              name="profilePhotoUrl"
              render={() => (
                <FormItem>
                  <div className="space-y-1">
                    <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider text-white/80">
                      {/* AI_AVATAR */}
                    </label>
                    
                    {!photoPreview ? (
                      <div
                        {...getRootProps()}
                        className={`
                          border border-dashed p-4 text-center cursor-pointer
                          transition-colors font-adelle-mono
                          ${isDragActive ? "border-brand-red bg-brand-red/10" : "border-brand-red/50"}
                          ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-brand-red"}
                        `}
                      >
                        <input {...getInputProps()} disabled={isUploading} />
                        <Upload className="size-8 mx-auto mb-3 text-white/60" />
                        <p className="text-xs uppercase text-white">
                          {isConverting ? "CONVIRTIENDO_IMAGEN..." : isUploading ? "SUBIENDO..." : isDragActive ? "SUELTA_ARCHIVO_AQUÍ" : "ARRastra_ARCHIVO.exe"}
                        </p>
                        <p className="text-[10px] text-white/60 mt-2 uppercase">
                          PNG, JPG, WEBP, HEIC (MÁX 5MB)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <p className="text-xs font-adelle-mono text-brand-red uppercase text-center">
                            FOTO_SUBIDA
                          </p>
                          <div className="relative w-full max-w-xs h-48 mx-auto border-2 border-brand-red overflow-hidden shadow-lg">
                            <Image
                              src={photoPreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[10px] font-adelle-mono text-white/60 uppercase text-center">
                            {/* TU_AVATAR_IA_SE_GENERARÁ_EN_SEGUNDO_PLANO */}
                          </p>
                        </div>
                        
                        <div className="flex justify-center">
                          <PixelButton
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removePhoto}
                          >
                            <X className="size-3 mr-1" />
                            ELIMINAR_FOTO
                          </PixelButton>
                        </div>
                      </div>
                    )}
                  </div>
                  <FormMessage className="font-adelle-mono text-xs uppercase" />
                </FormItem>
              )}
            />

            {/* Two Column Grid - Tab order: left to right, top to bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Left Column */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RetroInput
                          label="NOMBRE_COMPLETO"
                          placeholder="JUAN_PEREZ_GARCIA"
                          tabIndex={1}
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                      <FormMessage className="font-adelle-mono text-xs uppercase" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dni"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RetroInput
                          label="NÚMERO_DNI"
                          placeholder="DNI, PASAPORTE, OTRO"
                          maxLength={50}
                          tabIndex={3}
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                      <FormMessage className="font-adelle-mono text-xs uppercase" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RetroInput
                          label="TELÉFONO_WHATSAPP"
                          placeholder="+51987654321, +1234567890"
                          maxLength={20}
                          tabIndex={5}
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                      <FormMessage className="font-adelle-mono text-xs uppercase" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RetroInput
                          label="ORGANIZACIÓN"
                          placeholder="EMPRESA_O_UNIVERSIDAD"
                          tabIndex={2}
                          {...field}
                          value={field.value as string}
                        />
                      </FormControl>
                      <FormMessage className="font-adelle-mono text-xs uppercase" />
                    </FormItem>
                  )}
                />

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
                          <RetroSelectTrigger tabIndex={4}>
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
              </div>
            </div>

            {/* Laptop Section - Below Grid */}
            <div className="pt-3 border-t border-brand-red/30">
              <FormField
                control={form.control}
                name="hasLaptop"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border border-brand-red/30 p-3">
                    <FormControl>
                      <PixelCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none font-adelle-mono">
                      <label className="text-sm uppercase font-bold text-white">
                        TRAERÉ_LAPTOP
                      </label>
                      <p className="text-[10px] text-white/60 uppercase">
                        REQUERIDO_POR_SEGURIDAD_DEL_VENUE
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {hasLaptop && (
                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="laptopBrand"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RetroInput
                            label="MARCA_LAPTOP"
                            placeholder="HP, DELL, APPLE, ETC"
                            {...field}
                            value={field.value as string}
                          />
                        </FormControl>
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="pt-2">
              <PixelButton
                type="submit"
                className="w-full"
                loading={isSubmitting || isUpdating}
                disabled={!photoPreview}
              >
                SIGUIENTE_NIVEL &gt;&gt;
              </PixelButton>
            </div>
          </form>
        </Form>
      </RetroCardContent>
    </RetroCard>
  );
}

