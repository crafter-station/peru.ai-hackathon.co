import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    const imageId = resolvedParams.imageId;
    
    if (!imageId || typeof imageId !== 'string') {
      return NextResponse.json(
        { error: "Invalid image ID" },
        { status: 400 }
      );
    }

    const [image] = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, imageId))
      .limit(1);

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Create shareable metadata
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://peru.ai-hackathon.co';
    const shareUrl = `${baseUrl}/i/${image.id}`;
    const imageUrl = image.blobUrl || image.imageUrl;

    const shareData = {
      id: image.id,
      title: `"${image.prompt}" - AI Alpaca | IA Hackathon Perú`,
      description: `Amazing AI-generated alpaca: "${image.prompt}". Create yours at IA Hackathon Perú!`,
      imageUrl: imageUrl,
      shareUrl: shareUrl,
      prompt: image.prompt,
      createdAt: image.createdAt,
      socialSharing: {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`¡Mira esta alpaca generada con IA! "${image.prompt}" #IAHackathonPeru`)}&url=${encodeURIComponent(shareUrl)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Mira esta alpaca generada con IA! "${image.prompt}" ${shareUrl} #IAHackathonPeru`)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`¡Mira esta alpaca generada con IA! "${image.prompt}" #IAHackathonPeru`)}`,
      },
      meta: {
        ogTitle: `"${image.prompt}" - AI Alpaca | IA Hackathon Perú`,
        ogDescription: `Amazing AI-generated alpaca: "${image.prompt}". Create yours at IA Hackathon Perú!`,
        ogImage: imageUrl,
        ogUrl: shareUrl,
        twitterCard: "summary_large_image",
        twitterTitle: `"${image.prompt}" - AI Alpaca`,
        twitterDescription: `Amazing AI-generated alpaca: "${image.prompt}". Create yours at IA Hackathon Perú!`,
        twitterImage: imageUrl,
      }
    };

    return NextResponse.json(shareData);
  } catch (error) {
    console.error("Error fetching share data:", error);
    return NextResponse.json(
      { error: "Failed to fetch share data" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { platform, referrer } = body;

    // Track sharing analytics here if needed
    console.log(`Image ${resolvedParams.imageId} shared on ${platform} from ${referrer}`);

    return NextResponse.json({ 
      success: true, 
      message: "Share tracked successfully" 
    });
  } catch (error) {
    console.error("Error tracking share:", error);
    return NextResponse.json(
      { error: "Failed to track share" },
      { status: 500 }
    );
  }
}
