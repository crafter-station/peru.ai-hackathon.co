import type { Metadata } from "next";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";

type Props = {
  params: Promise<{ participantId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { participantId } = await params;
    const participant = await db?.query.participants.findFirst({
      where: eq(participants.id, participantId),
    });

    if (!participant) {
      return {
        title: "Badge Not Found | IA Hackathon Peru",
      };
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://iahackathon.pe'}/badge/${participant.id}`;
    const badgeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://iahackathon.pe'}/api/badge/og/${participant.id}`;

    return {
      title: `${participant.fullName} - IA Hackathon Peru 2025`,
      description: `Badge #${String(participant.participantNumber).padStart(4, "0")} - IA Hackathon Peru 2025. Join us on November 29-30 at UPCH La Molina!`,
      openGraph: {
        title: `${participant.fullName} - IA Hackathon Peru 2025`,
        description: `Badge #${String(participant.participantNumber).padStart(4, "0")} - Registered participant for IA Hackathon Peru 2025`,
        url: shareUrl,
        siteName: "IA Hackathon Peru",
        images: [
          {
            url: badgeUrl,
            width: 1080,
            height: 1440,
            alt: `${participant.fullName} - IA Hackathon Peru Badge`,
          },
        ],
        locale: "es_PE",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${participant.fullName} - IA Hackathon Peru 2025`,
        description: `Badge #${String(participant.participantNumber).padStart(4, "0")} - Join the AI revolution!`,
        images: [badgeUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "IA Hackathon Peru 2025",
    };
  }
}

export default function BadgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

