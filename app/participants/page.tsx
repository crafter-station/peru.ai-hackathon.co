import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { asc, isNotNull } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

type ParticipantCard = {
  id: string;
  fullName: string | null;
  organization: string | null;
  role: string | null;
  profilePhotoAiUrl: string | null;
  participantNumber: number | null;
};

function ParticipantGrid({ items }: { items: ParticipantCard[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((participant) => (
        <Link
          key={participant.id}
          href={`/p/${participant.participantNumber}`}
          className="group relative aspect-square overflow-hidden rounded-lg bg-muted transition-transform hover:scale-[1.02] active:scale-[0.98]"
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
        </Link>
      ))}
    </div>
  );
}

function TeamHeader({ items }: { items: ParticipantCard[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-black text-white py-12 px-4 mb-12 rounded-xl border border-white/10 shadow-2xl">
      <div className="flex flex-col items-center">

        <div className="flex flex-col items-center mb-10 gap-2">
          <a
            href="https://crafterstation.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity duration-300 hover:opacity-100"
            style={{ pointerEvents: "auto" }}
          >
            <Image
              src="/crafter-logotipo.svg"
              alt="Crafter Station"
              width={120}
              height={40}
              className="h-5 md:h-6 w-auto"
            />
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-10 md:gap-x-10 max-w-6xl">
          {items.map((participant) => (
            <Link
              key={participant.id}
              href={`/p/${participant.participantNumber}`}
              className="flex flex-col items-center group cursor-pointer"
            >
              <span className="mb-3 text-sm md:text-base font-bold font-mono tracking-wider uppercase text-white/90 group-hover:text-terminal-green transition-colors">
                {participant.fullName?.split(" ")[0] || "MEMBER"}
              </span>
              
              <div className="relative w-24 h-24 md:w-28 md:h-28 border-2 border-[#E5E5E5] bg-[#1a1a1a] transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {participant.profilePhotoAiUrl ? (
                  <Image
                    src={participant.profilePhotoAiUrl}
                    alt={participant.fullName || "Team Member"}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    // Mantiene el estilo pixel art si las imágenes son de baja res/pixeladas
                    style={{ imageRendering: "pixelated" }} 
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700 font-mono text-xs">
                    No hay imagen, mi king
                  </div>
                )}
              </div>
              
              {participant.organization && (
                <span className="mt-2 text-xs text-white/60 font-mono text-center max-w-[120px] truncate">
                  {participant.organization}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ParticipantsPage() {
  const allParticipants = await db
    .select({
      id: participants.id,
      fullName: participants.fullName,
      organization: participants.organization,
      role: participants.role,
      profilePhotoAiUrl: participants.profilePhotoAiUrl,
      participantNumber: participants.participantNumber,
    })
    .from(participants)
    .where(isNotNull(participants.profilePhotoAiUrl))
    .orderBy(asc(participants.participantNumber));

  const regularParticipants = allParticipants.filter(
    (p) => p.role === "PARTICIPANT" || !p.role,
  );
  const staff = allParticipants
    .filter((p) => p.role && p.role !== "PARTICIPANT")
    .toSorted(
      (a, b) => (b.participantNumber ?? 0) - (a.participantNumber ?? 0),
    );
    
  const CRAFTER_NUMBERS = [
    404, // christian
    111, // railly
    101, // shiara
    100, // edward
    96, // carlos
    95, // ignacio
    0, // cueva
  ];
  
  const crafterPeople = allParticipants.filter(
    (p) => CRAFTER_NUMBERS.includes(p.participantNumber)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-adelle-mono uppercase tracking-wider">
            AI Hackathon People
          </h1>
          <p className="text-muted-foreground font-adelle-mono text-sm mt-2">
            Hello world!
          </p>
        </div>
        
        <TeamHeader items={crafterPeople}/>

        {regularParticipants.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold font-adelle-mono uppercase tracking-wider mb-4">
              Participantes ({regularParticipants.length})
            </h2>
            <ParticipantGrid items={regularParticipants} />
          </section>
        )}

        {staff.length > 0 && (
          <section>
            <h2 className="text-xl font-bold font-adelle-mono uppercase tracking-wider mb-4">
              Mentores, Organización y Staff ({staff.length})
            </h2>
            <ParticipantGrid items={staff} />
          </section>
        )}

        {allParticipants.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-adelle-mono">
              No hay participantes con fotos AI generadas aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
