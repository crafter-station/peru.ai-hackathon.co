"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/profile/profile-header";
import { Overview } from "@/components/profile/overview";
import { SocialLinks } from "@/components/profile/social-links";
import { TechStack } from "@/components/profile/tech-stack";
import { Separator } from "@/components/profile/separator";
import { Achievements } from "@/components/profile/achievements";
import { Certificates } from "@/components/profile/certificates";

type ParticipantCard = {
  id: string;
  fullName: string | null;
  organization: string | null;
  role: string | null;
  profilePhotoAiUrl: string | null;
  participantNumber: number | null;
  bio?: string | null;
  techStack?: string[] | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
  cursorCode?: string | null;
  badgeBlobUrl?: string | null;
  profilePhotoUrl?: string | null;
};

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: ParticipantCard[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  gridColumns?: number;
}

export function ParticipantModal({
  isOpen,
  onClose,
  participants,
  currentIndex,
  onIndexChange,
  gridColumns = 6,
}: ParticipantModalProps) {
  const [profile, setProfile] = useState<ParticipantCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentParticipant = participants[currentIndex];

  useEffect(() => {
    if (!isOpen || !currentParticipant) return;

    const fetchFullProfile = async () => {
      if (!currentParticipant.participantNumber) return;

      setIsTransitioning(true);
      setLoading(true);

      try {
        const response = await fetch(`/api/profile/${currentParticipant.participantNumber}`);
        if (response.ok) {
          const data = await response.json();
          setProfile({
            ...currentParticipant,
            ...data,
          });
        } else {
          setProfile(currentParticipant);
        }
      } catch {
        setProfile(currentParticipant);
      } finally {
        setLoading(false);
        setTimeout(() => setIsTransitioning(false), 150);
      }
    };

    fetchFullProfile();
  }, [isOpen, currentParticipant, currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < participants.length - 1) {
      onIndexChange(currentIndex + 1);
    }
  };

  const handleUp = () => {
    const newIndex = Math.max(0, currentIndex - gridColumns);
    if (newIndex !== currentIndex) {
      onIndexChange(newIndex);
    }
  };

  const handleDown = () => {
    const newIndex = Math.min(participants.length - 1, currentIndex + gridColumns);
    if (newIndex !== currentIndex) {
      onIndexChange(newIndex);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (currentIndex > 0) {
            onIndexChange(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (currentIndex < participants.length - 1) {
            onIndexChange(currentIndex + 1);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          const upIndex = Math.max(0, currentIndex - gridColumns);
          if (upIndex !== currentIndex) {
            onIndexChange(upIndex);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          const downIndex = Math.min(participants.length - 1, currentIndex + gridColumns);
          if (downIndex !== currentIndex) {
            onIndexChange(downIndex);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, participants.length, gridColumns, onClose, onIndexChange]);

  if (!currentParticipant) return null;

  const displayProfile = profile || currentParticipant;
  const avatar =
    displayProfile.profilePhotoAiUrl ||
    displayProfile.badgeBlobUrl ||
    displayProfile.profilePhotoUrl ||
    null;

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < participants.length - 1;
  const canGoUp = currentIndex >= gridColumns;
  const canGoDown = currentIndex < participants.length - gridColumns;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="!w-[95vw] !max-w-7xl max-h-[90vh] overflow-hidden p-0 flex flex-col sm:!max-w-7xl"
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">
          {displayProfile.fullName || "Participant"} Profile
        </DialogTitle>
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden transition-opacity duration-150 ${
            isTransitioning ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="p-6 w-full max-w-full overflow-x-hidden">
            <div className="w-full overflow-x-hidden">
              <ProfileHeader
                displayName={displayProfile.fullName || "Participant"}
                avatar={avatar}
                bio={displayProfile.bio}
              />
            </div>
            <Separator />

            <div className="w-full overflow-x-hidden">
              <Overview
                organization={displayProfile.organization}
                websiteUrl={displayProfile.websiteUrl}
                participantNumber={displayProfile.participantNumber}
                cursorCode={displayProfile.cursorCode}
                isLoggedIn={false}
                profileNumber={displayProfile.participantNumber}
              />
            </div>
            <Separator />

            <div className="w-full overflow-x-hidden">
              <SocialLinks
                linkedinUrl={displayProfile.linkedinUrl}
                instagramUrl={displayProfile.instagramUrl}
                twitterUrl={displayProfile.twitterUrl}
                githubUrl={displayProfile.githubUrl}
                websiteUrl={displayProfile.websiteUrl}
              />
            </div>
            <Separator />

            <div className="w-full overflow-x-hidden">
              <Achievements
                badgeBlobUrl={displayProfile.badgeBlobUrl}
                participantNumber={displayProfile.participantNumber}
              />
            </div>
            <Separator />

            <div className="w-full overflow-x-hidden">
              <Certificates
                fullName={displayProfile.fullName}
                participantNumber={displayProfile.participantNumber}
              />
            </div>
            <Separator />

            <div className="w-full overflow-x-hidden">
              <TechStack techStack={displayProfile.techStack} />
            </div>
            <Separator />

            {displayProfile.participantNumber && (
              <div className="w-full flex justify-center py-4">
                <Button asChild variant="outline" className="font-mono">
                  <Link href={`/p/${displayProfile.participantNumber}`}>
                    <ExternalLink className="size-4 mr-2" />
                    Ver perfil completo
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="size-3 bg-foreground animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {canGoPrevious && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
            aria-label="Previous participant"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {canGoNext && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
            aria-label="Next participant"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {canGoUp && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUp}
            className="absolute left-1/2 -translate-x-1/2 top-2 z-20 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
            aria-label="Previous row"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        )}

        {canGoDown && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDown}
            className="absolute left-1/2 -translate-x-1/2 bottom-14 z-20 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm"
            aria-label="Next row"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded text-white text-xs font-mono">
          {currentIndex + 1} / {participants.length}
        </div>
      </DialogContent>
    </Dialog>
  );
}

