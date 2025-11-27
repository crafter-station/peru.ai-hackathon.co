import { Metadata } from "next";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq, and, isNotNull } from "drizzle-orm";

const BASE_URL = "https://peru.ai-hackathon.co";

interface Props {
  params: Promise<{ number: string }>;
  children: React.ReactNode;
}

async function getParticipant(number: string) {
  const participantNumber = parseInt(number, 10);
  if (isNaN(participantNumber)) return null;

  return db.query.participants.findFirst({
    where: and(
      eq(participants.participantNumber, participantNumber),
      eq(participants.registrationStatus, "completed"),
      isNotNull(participants.participantNumber)
    ),
    columns: {
      fullName: true,
      organization: true,
      participantNumber: true,
      profilePhotoAiUrl: true,
      badgeBlobUrl: true,
      profilePhotoUrl: true,
      bio: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  const participant = await getParticipant(number);

  if (!participant) {
    return {
      title: "Participante no encontrado | IA Hackathon Perú 2025",
    };
  }

  const name = participant.fullName || `Participante #${participant.participantNumber}`;
  const title = `${name} | IA Hackathon Perú 2025`;
  const description = participant.bio
    ? `${participant.bio.slice(0, 150)}${participant.bio.length > 150 ? "..." : ""}`
    : `Perfil de ${name}${participant.organization ? ` de ${participant.organization}` : ""} en IA Hackathon Perú 2025`;

  const image =
    participant.profilePhotoAiUrl ||
    participant.badgeBlobUrl ||
    participant.profilePhotoUrl ||
    `${BASE_URL}/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/p/${participant.participantNumber}`,
      siteName: "IA Hackathon Perú 2025",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
      locale: "es_PE",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `${BASE_URL}/p/${participant.participantNumber}`,
    },
  };
}

export default function ParticipantLayout({ children }: Props) {
  return children;
}
