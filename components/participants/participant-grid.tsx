"use client";

import { useState } from "react";
import Image from "next/image";
import { ParticipantModal } from "./participant-modal";

type ParticipantCard = {
  id: string;
  fullName: string | null;
  organization: string | null;
  role: string | null;
  profilePhotoAiUrl: string | null;
  participantNumber: number | null;
};

interface ParticipantGridProps {
  items: ParticipantCard[];
  gridColumns?: number;
}

export function ParticipantGrid({ items, gridColumns = 6 }: ParticipantGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleParticipantClick = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((participant, index) => (
          <button
            key={participant.id}
            onClick={() => handleParticipantClick(index)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            aria-label={`View ${participant.fullName || "Participant"}'s profile`}
          >
            {participant.profilePhotoAiUrl && (
              <Image
                src={participant.profilePhotoAiUrl}
                alt={participant.fullName || "Participant"}
                fill
                className="object-cover"
                unoptimized
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
              <p className="text-white text-sm font-medium leading-tight truncate">
                {participant.fullName || "Participante"}
              </p>
              <p className="text-white/60 text-xs">
                #{String(participant.participantNumber || 0).padStart(4, "0")}
              </p>
              {participant.organization && (
                <p className="text-white/50 text-xs truncate">
                  {participant.organization}
                </p>
              )}
              {participant.role && participant.role !== "PARTICIPANTE" && (
                <span className="text-terminal-green text-xs font-mono mt-1">
                  {participant.role}
                </span>
              )}
            </div>
            <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-white text-xs font-mono">
              #{String(participant.participantNumber || 0).padStart(4, "0")}
            </div>
          </button>
        ))}
      </div>

      <ParticipantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        participants={items}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        gridColumns={gridColumns}
      />
    </>
  );
}

