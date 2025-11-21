"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, type Step2Data } from "@/lib/validations/onboarding";
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
import { PixelCheckbox } from "@/components/ui/pixel-checkbox";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRetroSounds } from "@/hooks/use-click-sound";

export function Step2Security() {
  const { participant, updateParticipant, isUpdating } = useParticipant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    participant?.profilePhotoUrl || null
  );
  const { playSuccess, playError, playClick } = useRetroSounds();

  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      profilePhotoUrl: participant?.profilePhotoUrl || "",
      hasLaptop: participant?.hasLaptop || false,
      laptopBrand: participant?.laptopBrand || "",
    },
  });

  const hasLaptop = form.watch("hasLaptop");

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

  const onSubmit = async (data: Step2Data) => {
    setIsSubmitting(true);
    try {
      updateParticipant({
        ...data,
        currentStep: 3,
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
    updateParticipant({ currentStep: 1 });
  };

  return (
    <RetroCard>
      <RetroCardHeader>
        <RetroCardTitle>VERIFICACIÓN_SEGURIDAD.run()</RetroCardTitle>
        <RetroCardDescription>
          DATOS_REQUERIDOS_POR_EL_VENUE
        </RetroCardDescription>
      </RetroCardHeader>
      <RetroCardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="profilePhotoUrl"
              render={() => (
                <FormItem>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider text-white/80">
                      FOTO_DE_PERFIL
                    </label>
                    <p className="text-[10px] font-adelle-mono text-white/60 uppercase">
                      APARECERÁ_EN_LA_CREDENCIAL
                    </p>
                    
                    {!photoPreview ? (
                      <div
                        {...getRootProps()}
                        className={`
                          border border-dashed p-8 text-center cursor-pointer
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
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-3"
                      >
                        <div className="space-y-2">
                          <p className="text-xs font-adelle-mono text-brand-red uppercase text-center">
                            FOTO_SUBIDA
                          </p>
                          <div className="relative w-64 h-64 mx-auto border-2 border-brand-red overflow-hidden shadow-lg">
                            <Image
                              src={photoPreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-[10px] font-adelle-mono text-white/60 uppercase text-center">
                            TU_AVATAR_IA_SE_GENERARÁ_EN_SEGUNDO_PLANO
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
                      </motion.div>
                    )}
                  </motion.div>
                  <FormMessage className="font-adelle-mono text-xs uppercase" />
                </FormItem>
              )}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="hasLaptop"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border border-brand-red/30 p-4">
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
            </motion.div>

            <AnimatePresence>
              {hasLaptop && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
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
                            />
                        </FormControl>
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
                disabled={!photoPreview}
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
