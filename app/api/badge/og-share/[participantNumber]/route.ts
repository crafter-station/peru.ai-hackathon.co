import { type NextRequest } from "next/server";
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
      return new Response("Invalid participant number", { status: 400 });
    }

    const participant = await db?.query.participants.findFirst({
      where: eq(participants.participantNumber, participantNum),
    });

    if (!participant || !participant.badgeBlobUrl) {
      return new Response("Badge not found", { status: 404 });
    }

    // Fetch the generated badge image
    const badgeResponse = await fetch(participant.badgeBlobUrl);
    if (!badgeResponse.ok) {
      return new Response("Failed to fetch badge image", { status: 500 });
    }
    const badgeBuffer = Buffer.from(await badgeResponse.arrayBuffer());

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

    return new Response(new Uint8Array(ogImage), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG share image:", error);
    return new Response("Error generating image", { status: 500 });
  }
}

