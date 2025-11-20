"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RetroCard,
  RetroCardContent,
  RetroCardHeader,
  RetroCardTitle,
} from "@/components/ui/retro-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { GlitchText } from "@/components/ui/terminal-text";
import {
  Share2,
  Linkedin,
  Instagram,
  Twitter,
  Github,
  Globe,
  Check,
  ArrowLeft,
} from "lucide-react";

interface PublicProfile {
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
}

export default function PublicProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const slug = params.slug as string;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${slug}`);
        if (!response.ok) {
          throw new Error("Profile not found");
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/p/${profile?.participantNumber}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile?.fullName} - IA Hackathon Peru 2025`,
          text: `Check out ${profile?.fullName}'s profile from IA Hackathon Peru 2025!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const socialLinks = [
    { url: profile?.linkedinUrl, icon: Linkedin, label: "LinkedIn" },
    { url: profile?.instagramUrl, icon: Instagram, label: "Instagram" },
    { url: profile?.twitterUrl, icon: Twitter, label: "X/Twitter" },
    { url: profile?.githubUrl, icon: Github, label: "GitHub" },
    { url: profile?.websiteUrl, icon: Globe, label: "Website" },
  ].filter((link) => link.url);

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-black retro-grid flex items-center justify-center">
        <RetroCard className="max-w-sm">
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
                LOADING_PROFILE<span className="loading-dots"></span>
              </p>
            </div>
          </RetroCardContent>
        </RetroCard>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background dark:bg-black retro-grid flex items-center justify-center p-4">
        <RetroCard className="max-w-md">
          <RetroCardHeader>
            <RetroCardTitle>ERROR_404</RetroCardTitle>
          </RetroCardHeader>
          <RetroCardContent className="text-center py-8 space-y-4">
            <p className="font-adelle-mono text-sm uppercase">
              PROFILE_NOT_FOUND
            </p>
            <p className="font-adelle-mono text-xs text-muted-foreground uppercase">
              The profile you are looking for does not exist or has not completed registration.
            </p>
            <PixelButton asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
                RETURN_HOME
              </Link>
            </PixelButton>
          </RetroCardContent>
        </RetroCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black retro-grid">
      <div className="fixed top-0 left-0 right-0 h-8 bg-foreground text-background flex items-center px-4 font-adelle-mono text-xs uppercase tracking-wider z-50">
        <Link href="/" className="flex items-center gap-2 hover:text-terminal-green transition-colors">
          <ArrowLeft className="size-3" />
          <span>IA_HACKATHON_2025</span>
        </Link>
        <span className="ml-auto opacity-60">PARTICIPANT_PROFILE</span>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RetroCard>
            <RetroCardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                className="inline-block border-2 border-terminal-green bg-black px-4 py-2 mb-2"
              >
                <span className="font-adelle-mono text-2xl text-terminal-green font-bold">
                  #{String(profile.participantNumber || 0).padStart(4, "0")}
                </span>
              </motion.div>
              <RetroCardTitle className="justify-center text-lg">
                <GlitchText>PARTICIPANT_PROFILE</GlitchText>
              </RetroCardTitle>
            </RetroCardHeader>

            <RetroCardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                {profile.pixelArtUrl ? (
                  <div className="relative w-48 h-48 md:w-64 md:h-64 border-4 border-foreground overflow-hidden">
                    <Image
                      src={profile.pixelArtUrl}
                      alt={profile.fullName || "Participant"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 scanlines pointer-events-none" />
                  </div>
                ) : profile.badgeBlobUrl ? (
                  <div className="relative w-48 h-48 md:w-64 md:h-64 border-4 border-foreground overflow-hidden">
                    <Image
                      src={profile.badgeBlobUrl}
                      alt={profile.fullName || "Participant"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 scanlines pointer-events-none" />
                  </div>
                ) : profile.profilePhotoUrl ? (
                  <div className="relative w-48 h-48 md:w-64 md:h-64 border-4 border-foreground overflow-hidden">
                    <Image
                      src={profile.profilePhotoUrl}
                      alt={profile.fullName || "Participant"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 scanlines pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-48 h-48 md:w-64 md:h-64 border-4 border-foreground bg-muted flex items-center justify-center">
                    <span className="font-adelle-mono text-4xl text-muted-foreground">
                      ?
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <h1 className="font-adelle-mono text-xl md:text-2xl font-bold uppercase tracking-wider">
                  {profile.fullName || "ANONYMOUS_PARTICIPANT"}
                </h1>
                {profile.organization && (
                  <p className="font-adelle-mono text-xs text-muted-foreground uppercase mt-1">
                    {profile.organization}
                  </p>
                )}
              </motion.div>

              {profile.bio && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="border-2 border-foreground/50 p-4"
                >
                  <h3 className="font-adelle-mono font-bold text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    ABOUT_ME
                  </h3>
                  <p className="font-adelle-mono text-sm">
                    {profile.bio}
                  </p>
                </motion.div>
              )}

              {profile.techStack && profile.techStack.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <h3 className="font-adelle-mono font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    TECH_STACK
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 border-2 border-terminal-green bg-terminal-green/10 font-adelle-mono text-xs uppercase text-terminal-green"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {socialLinks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <h3 className="font-adelle-mono font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    CONNECT
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {socialLinks.map((link, index) => (
                      <PixelButton
                        key={index}
                        variant="secondary"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <a
                          href={link.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <link.icon className="size-3" />
                          {link.label}
                        </a>
                      </PixelButton>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-4 border-t-2 border-foreground/20"
              >
                <PixelButton
                  onClick={handleShare}
                  variant="terminal"
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <Check className="size-4" />
                      LINK_COPIED!
                    </>
                  ) : (
                    <>
                      <Share2 className="size-4" />
                      SHARE_PROFILE
                    </>
                  )}
                </PixelButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center"
              >
                <p className="font-adelle-mono text-[10px] text-muted-foreground uppercase">
                  IA_HACKATHON_PERU_2025 | 29-30_NOV
                </p>
              </motion.div>
            </RetroCardContent>
          </RetroCard>
        </motion.div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-6 bg-foreground/5 border-t border-foreground/10 flex items-center px-4 font-adelle-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>PROFILE_VIEW</span>
        <span className="ml-auto">
          <span className="text-terminal-green">●</span> ONLINE
        </span>
      </div>
    </div>
  );
}
