"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Experience } from "@/components/profile/experience";
import { Overview } from "@/components/profile/overview";
import { ProfileCover } from "@/components/profile/profile-cover";
import { ProfileHeader } from "@/components/profile/profile-header";
import { Separator } from "@/components/profile/separator";
import { SocialLinks } from "@/components/profile/social-links";
import { TechStack } from "@/components/profile/tech-stack";

interface PublicProfile {
  fullName: string | null;
  organization: string | null;
  participantNumber: number | null;
  profilePhotoUrl: string | null;
  badgeBlobUrl: string | null;
  profilePhotoAiUrl: string | null;
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

  const number = params.number as string;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile/${number}`);
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

    if (number) {
      fetchProfile();
    }
  }, [number]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="flex gap-1 justify-center mb-4">
                {[0, 1, 2].map((i) => (
              <div
                    key={i}
                className="size-3 bg-foreground animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
          <p className="font-mono text-sm text-muted-foreground">Loading...</p>
            </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The profile you are looking for does not exist or has not completed registration.
            </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline"
          >
                <ArrowLeft className="size-4" />
            Return Home
              </Link>
        </div>
      </div>
    );
  }

  const avatar =
    profile.profilePhotoAiUrl ||
    profile.badgeBlobUrl ||
    profile.profilePhotoUrl ||
    null;

  return (
    <div className="mx-auto md:max-w-3xl">
      <ProfileCover />
      <ProfileHeader
        displayName={profile.fullName || "Participant"}
        avatar={avatar}
        bio={profile.bio}
      />
      <Separator />

      <Overview
        organization={profile.organization}
        websiteUrl={profile.websiteUrl}
        participantNumber={profile.participantNumber}
                    />
      <Separator />

      <SocialLinks
        linkedinUrl={profile.linkedinUrl}
        instagramUrl={profile.instagramUrl}
        twitterUrl={profile.twitterUrl}
        githubUrl={profile.githubUrl}
        websiteUrl={profile.websiteUrl}
      />
      <Separator />

      <Experience />
      <Separator />

      <TechStack techStack={profile.techStack} />
      <Separator />
    </div>
  );
}
