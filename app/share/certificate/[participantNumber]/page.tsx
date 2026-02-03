import { Metadata } from "next";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { CertificatePreview } from "@/components/certificate/certificate-preview";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ participantNumber: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const participantNum = parseInt(resolvedParams.participantNumber, 10);

  if (isNaN(participantNum) || !db) {
    return {
      title: "Certificado - IA Hackathon Perú",
      description: "Certificado de participación de la IA Hackathon Perú 2025",
    };
  }

  const participant = await db.query.participants.findFirst({
    where: eq(participants.participantNumber, participantNum),
  });

  if (!participant) {
    return {
      title: "Certificado - IA Hackathon Perú",
      description: "Certificado de participación de la IA Hackathon Perú 2025",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.peru.ai-hackathon.co";
  const shareUrl = `${baseUrl}/share/certificate/${participantNum}`;
  const ogImageUrl = `${baseUrl}/api/certificate/og/${participantNum}`;
  const participantName =
    participant.fullName || `Participante #${participantNum}`;

  const socialDescription = `24 horas creando el futuro con IA. ${participantName} completó la IA Hackathon Perú 2025 - el evento de inteligencia artificial más grande del país.`;
  const twitterDescription = `24h de código, café e inteligencia artificial. Completé la IA Hackathon Perú 2025 - el hackathon de IA más grande del país.`;

  return {
    title: `${participantName} | IA Hackathon Perú 2025`,
    description: socialDescription,
    openGraph: {
      type: "website",
      url: shareUrl,
      title: `${participantName} sobrevivió 24 horas de IA`,
      description: socialDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1920,
          height: 1080,
          alt: `Certificado de ${participantName} - IA Hackathon Perú 2025`,
        },
      ],
      siteName: "IA Hackathon Perú",
      locale: "es_PE",
    },
    twitter: {
      card: "summary_large_image",
      title: `${participantName} | IA Hackathon Perú 2025`,
      description: twitterDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: shareUrl,
    },
  };
}

export default async function ShareCertificatePage({ params }: Props) {
  const resolvedParams = await params;
  const participantNum = parseInt(resolvedParams.participantNumber, 10);

  if (isNaN(participantNum) || !db) {
    notFound();
  }

  const participant = await db.query.participants.findFirst({
    where: eq(participants.participantNumber, participantNum),
  });

  if (!participant || !participant.fullName) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-2">
          <p className="font-adelle-mono text-sm uppercase tracking-widest text-[#B91F2E]">
            24 horas de innovación
          </p>
          <h1 className="font-bomstad text-3xl md:text-4xl text-white">
            IA Hackathon Perú 2025
          </h1>
        </div>

        <CertificatePreview
          fullName={participant.fullName}
          participantNumber={participantNum}
        />

        <div className="space-y-4 pt-4">
          <p className="font-adelle-mono text-lg text-white">
            {participant.fullName}
          </p>
          <p className="font-adelle-mono text-sm text-white/60 max-w-md mx-auto">
            Completó exitosamente 24 horas de código, creatividad e inteligencia artificial
            en el hackathon de IA más grande del Perú.
          </p>
          <p className="font-adelle-mono text-xs text-white/40 uppercase tracking-wider">
            29-30 Noviembre 2025 • UPCH La Molina, Lima
          </p>
        </div>
      </div>
    </div>
  );
}
