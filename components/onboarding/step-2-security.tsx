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
      laptopModel: participant?.laptopModel || "",
      laptopSerialNumber: participant?.laptopSerialNumber || "",
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
        throw new Error("Failed to upload photo");
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
        <RetroCardTitle>SECURITY_CHECK.run()</RetroCardTitle>
        <RetroCardDescription>
          VENUE_REQUIRED_DATA
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
                    <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider text-muted-foreground">
                      PROFILE_PHOTO
                    </label>
                    <p className="text-[10px] font-adelle-mono text-muted-foreground uppercase">
                      WILL_APPEAR_ON_BADGE
                    </p>
                    
                    {!photoPreview ? (
                      <div
                        {...getRootProps()}
                        className={`
                          border-2 border-dashed p-8 text-center cursor-pointer
                          transition-colors font-adelle-mono
                          ${isDragActive ? "border-terminal-green bg-terminal-green/5" : "border-foreground/50"}
                          ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-terminal-green"}
                        `}
                      >
                        <input {...getInputProps()} disabled={isUploading} />
                        <Upload className="size-8 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-xs uppercase">
                          {isConverting ? "CONVERTING_IMAGE..." : isUploading ? "UPLOADING..." : isDragActive ? "DROP_FILE_HERE" : "DRAG_FILE.exe"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2 uppercase">
                          PNG, JPG, WEBP, HEIC (MAX 5MB)
                        </p>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative inline-block"
                      >
                        <div className="relative size-32 border-2 border-foreground overflow-hidden">
                          <Image
                            src={photoPreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <PixelButton
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 size-6"
                          onClick={removePhoto}
                        >
                          <X className="size-3" />
                        </PixelButton>
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 border-2 border-foreground/50 p-4">
                    <FormControl>
                      <PixelCheckbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none font-adelle-mono">
                      <label className="text-sm uppercase font-bold">
                        BRINGING_LAPTOP
                      </label>
                      <p className="text-[10px] text-muted-foreground uppercase">
                        REQUIRED_BY_VENUE_SECURITY
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
                            label="LAPTOP_BRAND"
                            placeholder="HP, DELL, APPLE, ETC"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="laptopModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RetroInput
                            label="LAPTOP_MODEL"
                            placeholder="MACBOOK_PRO, ELITEBOOK_840"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="laptopSerialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RetroInput
                            label="SERIAL_NUMBER"
                            placeholder="ABC123XYZ"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-[10px] font-adelle-mono text-muted-foreground uppercase mt-1">
                          REQUIRED_FOR_SECURITY_CHECK
                        </p>
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
                &lt;&lt; BACK
              </PixelButton>
              <PixelButton
                type="submit"
                className="flex-1"
                loading={isSubmitting || isUpdating}
              >
                NEXT_LEVEL &gt;&gt;
              </PixelButton>
            </motion.div>
          </form>
        </Form>
      </RetroCardContent>
    </RetroCard>
  );
}
