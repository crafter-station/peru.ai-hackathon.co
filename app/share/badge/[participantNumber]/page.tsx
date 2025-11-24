import { Metadata } from "next";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { BadgePreview3D } from "@/components/badge/badge-preview-3d";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ participantNumber: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const participantNum = parseInt(resolvedParams.participantNumber, 10);

  if (isNaN(participantNum) || !db) {
    return {
      title: "Badge - IA Hackathon Perú",
      description: "Comparte tu credencial de la IA Hackathon Perú 2025",
    };
  }

  const participant = await db.query.participants.findFirst({
    where: eq(participants.participantNumber, participantNum),
  });

  if (!participant || !participant.badgeBlobUrl) {
    return {
      title: "Badge - IA Hackathon Perú",
      description: "Comparte tu credencial de la IA Hackathon Perú 2025",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.peru.ai-hackathon.co";
  const shareUrl = `${baseUrl}/share/badge/${participantNum}`;
  const ogImageUrl = `${baseUrl}/api/badge/og-share/${participantNum}`;
  const participantName =
    participant.fullName || `Participante #${participantNum}`;

  return {
    title: `${participantName} - Credencial IA Hackathon Perú 2025`,
    description: `🚀 ¡Ya estoy dentro! Me registré para la IA Hackathon Peru 2025. 📅 29-30 Nov | 📍 UPCH La Molina`,
    openGraph: {
      type: "website",
      url: shareUrl,
      title: `${participantName} - Credencial IA Hackathon Perú 2025`,
      description: `🚀 ¡Ya estoy dentro! Me registré para la IA Hackathon Peru 2025. 📅 29-30 Nov | 📍 UPCH La Molina`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Credencial de ${participantName} - IA Hackathon Perú 2025`,
        },
      ],
      siteName: "IA Hackathon Perú",
      locale: "es_PE",
    },
    twitter: {
      card: "summary_large_image",
      title: `${participantName} - Credencial IA Hackathon Perú 2025`,
      description: `🚀 ¡Ya estoy dentro! Me registré para la IA Hackathon Peru 2025`,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: shareUrl,
    },
  };
}

export default async function ShareBadgePage({ params }: Props) {
  const resolvedParams = await params;
  const participantNum = parseInt(resolvedParams.participantNumber, 10);

  if (isNaN(participantNum) || !db) {
    notFound();
  }

  const participant = await db.query.participants.findFirst({
    where: eq(participants.participantNumber, participantNum),
  });

  if (!participant || !participant.badgeBlobUrl) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="font-adelle-mono text-2xl uppercase text-white mb-8">
          IA Hackathon Perú 2025
        </h1>
        <BadgePreview3D
          badgeUrl={participant.badgeBlobUrl}
          participantNumber={participant.participantNumber?.toString() || null}
        />
        <p className="font-adelle-mono text-sm text-white/60 mt-8">
          {participant.fullName || `Participante #${participantNum}`}
        </p>
      </div>
    </div>
  );
}
