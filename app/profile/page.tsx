"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { profileSchema, type ProfileData } from "@/lib/validations/profile";
import {
  RetroCard,
  RetroCardContent,
  RetroCardHeader,
  RetroCardTitle,
  RetroCardDescription,
} from "@/components/ui/retro-card";
import { RetroInput } from "@/components/ui/retro-input";
import { RetroTextarea } from "@/components/ui/retro-textarea";
import { PixelButton } from "@/components/ui/pixel-button";
import { GlitchText } from "@/components/ui/terminal-text";
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
  ExternalLink,
  Save,
  ArrowLeft,
} from "lucide-react";

interface ProfileResponse {
  fullName: string | null;
  organization: string | null;
  participantNumber: number | null;
  profilePhotoUrl: string | null;
  badgeBlobUrl: string | null;
  pixelArtUrl: string | null;
  bio: string | null;
  techStack: string[] | null;
  experienceLevel: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  registrationStatus: string | null;
}

export default function ProfileEditPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const { playSuccess, playError } = useRetroSounds();

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      linkedinUrl: "",
      instagramUrl: "",
      twitterUrl: "",
      githubUrl: "",
      websiteUrl: "",
    },
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/sign-in");
            return;
          }
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data);

        form.reset({
          bio: data.bio || "",
          linkedinUrl: data.linkedinUrl || "",
          instagramUrl: data.instagramUrl || "",
          twitterUrl: data.twitterUrl || "",
          githubUrl: data.githubUrl || "",
          websiteUrl: data.websiteUrl || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchProfile();
    }
  }, [isLoaded, isSignedIn, router, form]);

  const onSubmit = async (data: ProfileData) => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const updated = await response.json();
      setProfile(updated);
      playSuccess();
      setSaveMessage("PROFILE_SAVED_SUCCESSFULLY");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      playError();
      setSaveMessage("ERROR_SAVING_PROFILE");
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-background retro-grid">
        <div className="fixed top-0 left-0 right-0 h-8 bg-foreground text-background flex items-center px-4 font-adelle-mono text-xs uppercase tracking-wider z-50">
          <span className="text-terminal-green mr-2">&gt;</span>
          <span>PROFILE_EDITOR</span>
        </div>
        <div className="max-w-3xl mx-auto py-8 px-4 pt-16">
          <RetroCard>
            <RetroCardContent className="py-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="size-3 bg-terminal-green"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <p className="font-adelle-mono text-sm uppercase tracking-wider">
                  LOADING<span className="loading-dots"></span>
                </p>
              </div>
            </RetroCardContent>
          </RetroCard>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background retro-grid">
        <div className="fixed top-0 left-0 right-0 h-8 bg-foreground text-background flex items-center px-4 font-adelle-mono text-xs uppercase tracking-wider z-50">
          <span className="text-terminal-green mr-2">&gt;</span>
          <span>PROFILE_EDITOR</span>
        </div>
        <div className="max-w-3xl mx-auto py-8 px-4 pt-16">
          <RetroCard>
            <RetroCardContent className="py-12 text-center">
              <p className="font-adelle-mono text-sm uppercase">
                PROFILE_NOT_FOUND
              </p>
              <PixelButton asChild className="mt-4">
                <Link href="/onboarding">COMPLETE_REGISTRATION</Link>
              </PixelButton>
            </RetroCardContent>
          </RetroCard>
        </div>
      </div>
    );
  }

  if (profile.registrationStatus !== "completed") {
    return (
      <div className="min-h-screen bg-background retro-grid">
        <div className="fixed top-0 left-0 right-0 h-8 bg-foreground text-background flex items-center px-4 font-adelle-mono text-xs uppercase tracking-wider z-50">
          <span className="text-terminal-green mr-2">&gt;</span>
          <span>PROFILE_EDITOR</span>
        </div>
        <div className="max-w-3xl mx-auto py-8 px-4 pt-16">
          <RetroCard>
            <RetroCardContent className="py-12 text-center">
              <p className="font-adelle-mono text-sm uppercase">
                REGISTRATION_NOT_COMPLETE
              </p>
              <p className="font-adelle-mono text-xs text-muted-foreground uppercase mt-2">
                Complete your registration to edit your profile
              </p>
              <PixelButton asChild className="mt-4">
                <Link href="/onboarding">CONTINUE_REGISTRATION</Link>
              </PixelButton>
            </RetroCardContent>
          </RetroCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background retro-grid">
      <div className="fixed top-0 left-0 right-0 h-8 bg-foreground text-background flex items-center px-4 font-adelle-mono text-xs uppercase tracking-wider z-50">
        <Link href="/onboarding/complete" className="flex items-center gap-2 hover:text-terminal-green transition-colors">
          <ArrowLeft className="size-3" />
          <span>BACK</span>
        </Link>
        <span className="mx-2">/</span>
        <span>PROFILE_EDITOR</span>
        <span className="ml-auto opacity-60">v1.0.0</span>
      </div>

      <div className="max-w-3xl mx-auto py-8 px-4 pt-16 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-adelle-mono font-bold uppercase tracking-wider pixel-shadow">
            <GlitchText>EDIT_PROFILE</GlitchText>
          </h1>
          <p className="font-adelle-mono text-sm text-muted-foreground uppercase tracking-wider">
            CUSTOMIZE_YOUR_PUBLIC_PROFILE
          </p>
        </div>

        <RetroCard>
          <RetroCardHeader>
            <RetroCardTitle>PROFILE_PREVIEW</RetroCardTitle>
            <RetroCardDescription>
              YOUR_PUBLIC_PROFILE_INFO
            </RetroCardDescription>
          </RetroCardHeader>
          <RetroCardContent>
            <div className="flex flex-col md:flex-row items-center gap-4">
              {profile.pixelArtUrl ? (
                <div className="relative w-24 h-24 border-2 border-foreground overflow-hidden flex-shrink-0">
                  <Image
                    src={profile.pixelArtUrl}
                    alt={profile.fullName || "Profile"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : profile.badgeBlobUrl ? (
                <div className="relative w-24 h-24 border-2 border-foreground overflow-hidden flex-shrink-0">
                  <Image
                    src={profile.badgeBlobUrl}
                    alt={profile.fullName || "Profile"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-24 h-24 border-2 border-foreground bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="font-adelle-mono text-2xl text-muted-foreground">?</span>
                </div>
              )}
              <div className="text-center md:text-left">
                <p className="font-adelle-mono font-bold uppercase">
                  {profile.fullName || "PARTICIPANT"}
                </p>
                <p className="font-adelle-mono text-sm text-terminal-green">
                  #{String(profile.participantNumber || 0).padStart(4, "0")}
                </p>
                {profile.participantNumber && (
                  <PixelButton
                    variant="ghost"
                    size="sm"
                    asChild
                    className="mt-2"
                  >
                    <Link href={`/p/${profile.participantNumber}`} target="_blank">
                      <ExternalLink className="size-3" />
                      VIEW_PUBLIC_PROFILE
                    </Link>
                  </PixelButton>
                )}
              </div>
            </div>
          </RetroCardContent>
        </RetroCard>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <RetroCard>
              <RetroCardHeader>
                <RetroCardTitle>ABOUT_ME</RetroCardTitle>
                <RetroCardDescription>
                  TELL_OTHERS_ABOUT_YOURSELF
                </RetroCardDescription>
              </RetroCardHeader>
              <RetroCardContent>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RetroTextarea
                          placeholder="WRITE_YOUR_BIO_HERE..."
                          className="min-h-[120px]"
                          maxLength={500}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between">
                        <FormMessage className="font-adelle-mono text-xs uppercase" />
                        <span className="font-adelle-mono text-[10px] text-muted-foreground uppercase">
                          {field.value?.length || 0}/500
                        </span>
                      </div>
                    </FormItem>
                  )}
                />
              </RetroCardContent>
            </RetroCard>

            <RetroCard>
              <RetroCardHeader>
                <RetroCardTitle>SOCIAL_LINKS</RetroCardTitle>
                <RetroCardDescription>
                  ADD_YOUR_SOCIAL_PROFILES
                </RetroCardDescription>
              </RetroCardHeader>
              <RetroCardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
                          <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
                          <Github className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
              </RetroCardContent>
            </RetroCard>

            <div className="space-y-4">
              {saveMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-center font-adelle-mono text-sm uppercase ${
                    saveMessage.includes("ERROR")
                      ? "text-destructive"
                      : "text-terminal-green"
                  }`}
                >
                  {saveMessage}
                </motion.div>
              )}

              <PixelButton
                type="submit"
                className="w-full"
                loading={isSaving}
                disabled={isSaving}
              >
                <Save className="size-4" />
                SAVE_PROFILE
              </PixelButton>
            </div>
          </form>
        </Form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-6 bg-foreground/5 border-t border-foreground/10 flex items-center px-4 font-adelle-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>PROFILE_EDITOR</span>
        <span className="ml-auto">
          <span className="text-terminal-green">●</span> SYSTEM ONLINE
        </span>
      </div>
    </div>
  );
}
