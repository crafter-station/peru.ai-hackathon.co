"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileData } from "@/lib/validations/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RetroInput } from "@/components/ui/retro-input";
import { RetroTextarea } from "@/components/ui/retro-textarea";
import { PixelButton } from "@/components/ui/pixel-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRetroSounds } from "@/hooks/use-click-sound";
import {
  Linkedin,
  Instagram,
  Twitter,
  Github,
  Globe,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    bio?: string | null;
    linkedinUrl?: string | null;
    instagramUrl?: string | null;
    twitterUrl?: string | null;
    githubUrl?: string | null;
    websiteUrl?: string | null;
  };
  onSuccess?: () => void;
}

export function ProfileEditModal({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: ProfileEditModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { playSuccess, playError } = useRetroSounds();

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: initialData?.bio || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      instagramUrl: initialData?.instagramUrl || "",
      twitterUrl: initialData?.twitterUrl || "",
      githubUrl: initialData?.githubUrl || "",
      websiteUrl: initialData?.websiteUrl || "",
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        bio: initialData.bio || "",
        linkedinUrl: initialData.linkedinUrl || "",
        instagramUrl: initialData.instagramUrl || "",
        twitterUrl: initialData.twitterUrl || "",
        githubUrl: initialData.githubUrl || "",
        websiteUrl: initialData.websiteUrl || "",
      });
      setErrorMessage(null);
    }
  }, [open, initialData, form]);

  const onSubmit = async (data: ProfileData) => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      playSuccess();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      playError();
      setErrorMessage("Error al guardar el perfil. Inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "border-2 border-foreground bg-background",
        "max-h-[90vh] overflow-y-auto",
        "sm:max-w-[600px]"
      )}>
        <DialogHeader>
          <DialogTitle className="font-adelle-mono font-bold uppercase tracking-wider text-foreground">
            EDIT_PROFILE
          </DialogTitle>
          <DialogDescription className="font-adelle-mono text-xs uppercase text-muted-foreground">
            UPDATE_YOUR_BIO_AND_SOCIAL_LINKS
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider mb-2 text-foreground">
                  BIO
                </label>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RetroTextarea
                          placeholder="TELL_OTHERS_ABOUT_YOURSELF..."
                          className="min-h-[120px]"
                          maxLength={500}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between mt-1">
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                        <span className="font-adelle-mono text-[10px] text-muted-foreground uppercase">
                          {field.value?.length || 0}/500
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider mb-2 text-foreground">
                  SOCIAL_LINKS
                </label>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
                            <RetroInput
                              placeholder="https://linkedin.com/in/username"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagramUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
                            <RetroInput
                              placeholder="https://instagram.com/username"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
                            <RetroInput
                              placeholder="https://x.com/username"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
                            <RetroInput
                              placeholder="https://github.com/username"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground z-10" />
                            <RetroInput
                              placeholder="https://yourwebsite.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="text-center font-adelle-mono text-xs uppercase text-destructive">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <PixelButton
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                <X className="size-4" />
                CANCEL
              </PixelButton>
              <PixelButton
                type="submit"
                loading={isSaving}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                <Save className="size-4" />
                SAVE_CHANGES
              </PixelButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

