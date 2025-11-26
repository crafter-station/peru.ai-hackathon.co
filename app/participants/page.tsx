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
