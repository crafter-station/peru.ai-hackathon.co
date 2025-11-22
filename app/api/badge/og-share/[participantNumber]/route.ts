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

    // Fetch the badge image
    const badgeResponse = await fetch(participant.badgeBlobUrl);
    const badgeBuffer = Buffer.from(await badgeResponse.arrayBuffer());

    // OG image dimensions: 1200x630 (standard OG image size)
    const ogWidth = 1200;
    const ogHeight = 630;
    const padding = 40;
    const holderPadding = 20;
    
    // Calculate badge dimensions to fit within OG image with holder effect
    const maxBadgeWidth = ogWidth - (padding * 2) - (holderPadding * 2);
    const maxBadgeHeight = ogHeight - (padding * 2) - (holderPadding * 2);
    
    // Badge aspect ratio is 1080:1440 = 0.75
    const badgeAspectRatio = 1080 / 1440;
    
    let badgeWidth = maxBadgeWidth;
    let badgeHeight = badgeWidth / badgeAspectRatio;
    
    if (badgeHeight > maxBadgeHeight) {
      badgeHeight = maxBadgeHeight;
      badgeWidth = badgeHeight * badgeAspectRatio;
    }

    // Resize badge
    const resizedBadge = await sharp(badgeBuffer)
      .resize(Math.round(badgeWidth), Math.round(badgeHeight), {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    // Create dark holder frame SVG
    const holderWidth = badgeWidth + (holderPadding * 2);
    const holderHeight = badgeHeight + (holderPadding * 2);
    const holderX = (ogWidth - holderWidth) / 2;
    const holderY = (ogHeight - holderHeight) / 2;

    const holderSvg = `
      <svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="holderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(0,0,0,0.8);stop-opacity:1" />
            <stop offset="100%" style="stop-color:rgba(20,20,20,0.9);stop-opacity:1" />
          </linearGradient>
          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
            <feOffset dx="0" dy="20" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Dark background -->
        <rect width="${ogWidth}" height="${ogHeight}" fill="#0a0a0a"/>
        
        <!-- Holder frame (dark acrylic effect) -->
        <rect 
          x="${holderX}" 
          y="${holderY}" 
          width="${holderWidth}" 
          height="${holderHeight}" 
          rx="12"
          fill="url(#holderGradient)"
          filter="url(#shadow)"
          stroke="rgba(255,255,255,0.1)"
          stroke-width="1"
        />
        
        <!-- Inner shadow for depth -->
        <rect 
          x="${holderX + holderPadding}" 
          y="${holderY + holderPadding}" 
          width="${badgeWidth}" 
          height="${badgeHeight}" 
          rx="8"
          fill="none"
          stroke="rgba(0,0,0,0.5)"
          stroke-width="2"
        />
      </svg>
    `;

    // Composite everything
    const ogImage = await sharp({
      create: {
        width: ogWidth,
        height: ogHeight,
        channels: 4,
        background: { r: 10, g: 10, b: 10, alpha: 1 },
      },
    })
      .composite([
        {
          input: Buffer.from(holderSvg),
          top: 0,
          left: 0,
        },
        {
          input: resizedBadge,
          top: Math.round(holderY + holderPadding),
          left: Math.round(holderX + holderPadding),
        },
      ])
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

