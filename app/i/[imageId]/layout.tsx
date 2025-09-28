import { Metadata } from "next";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface Props {
  params: Promise<{ imageId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const imageId = resolvedParams.imageId;
  
  if (!imageId || typeof imageId !== 'string' || !db) {
    return {
      title: "IA Hackathon Perú - AI Generated Alpaca",
      description: "Create your own AI-generated alpaca at IA Hackathon Perú",
    };
  }

  try {
    const [image] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, imageId))
      .limit(1);

    if (!image) {
      return {
        title: "Image Not Found - IA Hackathon Perú",
        description: "The image you're looking for doesn't exist. Create your own AI-generated alpaca!",
      };
    }

    const imageUrl = image.blobUrl || image.imageUrl;
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://peru.ai-hackathon.co'}/i/${image.id}`;
    
    return {
      title: `"${image.prompt}" - AI Alpaca | IA Hackathon Perú`,
      description: `Check out this amazing AI-generated alpaca: "${image.prompt}". Create your own at IA Hackathon Perú!`,
      keywords: ["AI", "artificial intelligence", "alpaca", "image generation", "hackathon", "peru", "IA"],
      authors: [{ name: "IA Hackathon Perú" }],
      creator: "IA Hackathon Perú",
      publisher: "IA Hackathon Perú",
      openGraph: {
        type: "website",
        url: shareUrl,
        title: `"${image.prompt}" - AI Alpaca | IA Hackathon Perú`,
        description: `Amazing AI-generated alpaca: "${image.prompt}". Create yours at IA Hackathon Perú!`,
        images: [
          {
            url: imageUrl,
            width: image.width || 512,
            height: image.height || 512,
            alt: image.prompt,
          },
        ],
        siteName: "IA Hackathon Perú",
        locale: "es_PE",
      },
      twitter: {
        card: "summary_large_image",
        site: "@IAHackathonPeru",
        creator: "@IAHackathonPeru",
        title: `"${image.prompt}" - AI Alpaca`,
        description: `Amazing AI-generated alpaca: "${image.prompt}". Create yours at IA Hackathon Perú!`,
        images: [imageUrl],
      },
      alternates: {
        canonical: shareUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "IA Hackathon Perú - AI Generated Alpaca",
      description: "Create your own AI-generated alpaca at IA Hackathon Perú",
    };
  }
}

export default function ImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
