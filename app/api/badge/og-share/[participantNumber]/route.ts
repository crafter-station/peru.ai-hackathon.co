import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import sharp from "sharp";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ participantNumber: string }> }
) {
  try {
    const { participantNumber } = await params;
    const participantNum = parseInt(participantNumber, 10);

    if (isNaN(participantNum)) {
      return NextResponse.json(
        { error: "Invalid participant number" },
        { status: 400 }
      );
    }

    if (!db) {
      console.error("[og-share] Database not configured");
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const participant = await db.query.participants.findFirst({
      where: eq(participants.participantNumber, participantNum),
    });

    if (!participant) {
      console.error("[og-share] Participant not found:", participantNum);
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    if (!participant.badgeBlobUrl) {
      console.error("[og-share] Badge not found for participant:", participantNum);
      return NextResponse.json(
        { error: "Badge not found" },
        { status: 404 }
      );
    }

    console.log("[og-share] Fetching badge from:", participant.badgeBlobUrl);

    // Fetch the generated badge image
    const badgeResponse = await fetch(participant.badgeBlobUrl, {
      cache: "no-store",
    });

    if (!badgeResponse.ok) {
      console.error(
        "[og-share] Failed to fetch badge image:",
        badgeResponse.status,
        badgeResponse.statusText
      );
      return NextResponse.json(
        { error: "Failed to fetch badge image" },
        { status: 500 }
      );
    }

    const badgeBuffer = Buffer.from(await badgeResponse.arrayBuffer());
    console.log("[og-share] Badge fetched, size:", badgeBuffer.length, "bytes");

    // OG image dimensions: 1200x630 (standard OG image size)
    const ogWidth = 1200;
    const ogHeight = 630;
    
    // Resize the badge to fit OG dimensions while maintaining aspect ratio
    // Badge is 1080x1440 (portrait), OG is 1200x630 (landscape)
    // We'll center the badge on a dark background
    const ogImage = await sharp(badgeBuffer)
      .resize(ogWidth, ogHeight, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 1 },
      })
      .png()
      .toBuffer();

    console.log("[og-share] OG image generated, size:", ogImage.length, "bytes");

    return new NextResponse(ogImage, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": ogImage.length.toString(),
      },
    });
  } catch (error) {
    console.error("[og-share] Error generating OG share image:", error);
    return NextResponse.json(
      { error: "Error generating image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

