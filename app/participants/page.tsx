import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { asc, isNotNull } from "drizzle-orm";
import { ParticipantGrid } from "@/components/participants/participant-grid";

export const revalidate = 60;

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
