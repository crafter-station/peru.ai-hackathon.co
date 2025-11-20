import { type NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import path from "path";
import sharp from "sharp";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";

fal.config({
  credentials: process.env.FAL_API_KEY,
});

const RATE_LIMIT_SECONDS = 10;

export async function POST(request: NextRequest) {
  try {
    const { participantId } = await request.json();

    if (!participantId) {
      return NextResponse.json(
        { error: "Participant ID required" },
        { status: 400 },
      );
    }

    if (!db) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    const participant = await db.query.participants.findFirst({
      where: eq(participants.id, participantId),
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 },
      );
    }

    if (!participant.participantNumber) {
      return NextResponse.json(
        { error: "Participant number not assigned" },
        { status: 400 },
      );
    }

    if (!participant.profilePhotoAiUrl && !participant.profilePhotoUrl) {
      return NextResponse.json(
        { error: "Profile photo required for badge generation" },
        { status: 400 },
      );
    }

    // Use AI-generated photo if available, otherwise fallback to original
    const photoUrl = participant.profilePhotoAiUrl || participant.profilePhotoUrl;

    if (participant.lastBadgeGenerationAt) {
      const lastGenerationTime = new Date(
        participant.lastBadgeGenerationAt,
      ).getTime();
      const now = Date.now();
      const timeSinceLastGeneration = (now - lastGenerationTime) / 1000;

      if (timeSinceLastGeneration < RATE_LIMIT_SECONDS) {
        const secondsRemaining = Math.ceil(
          RATE_LIMIT_SECONDS - timeSinceLastGeneration,
        );
        return NextResponse.json(
          {
            error: `Debes esperar ${secondsRemaining} segundo${secondsRemaining !== 1 ? "s" : ""} antes de regenerar el badge`,
          },
          { status: 429 },
        );
      }
    }

    console.log(
      "[badge-ai] Generating AI badge for participant",
      participant.participantNumber,
    );

    const participantNumberFormatted = `#${String(participant.participantNumber).padStart(4, "0")}`;
    const participantName =
      participant.fullName?.toUpperCase() || "PARTICIPANT";

    const photoResponse = await fetch(photoUrl!);
    const photoBuffer = Buffer.from(await photoResponse.arrayBuffer());
    const photoBase64 = `data:image/jpeg;base64,${photoBuffer.toString("base64")}`;

    const bgPath = path.join(process.cwd(), "public", "pp-bg.png");
    const bgBuffer = await sharp(bgPath).toBuffer();
    const bgBase64 = `data:image/png;base64,${bgBuffer.toString("base64")}`;

    const pixelArtPrompt = `Create an anime-inspired 8-bit pixel art character based on this person's photo, drawn on top of the provided background image.

STYLE - ANIME 8-BIT FUSION:
- Retro JRPG character portrait (Final Fantasy, Chrono Trigger, Fire Emblem style)
- Anime/manga aesthetic with expressive eyes and stylized features
- Pixelated but with character depth and personality
- Mix of cute chibi proportions with detailed pixel shading
- NOT flat 2D - use pixel shading to create dimension and form
- Think classic SNES RPG character portraits with personality

PIXEL ART EXECUTION:
- Large visible pixels with intentional pixel placement
- Dithering and pixel patterns for texture and depth
- Anime-style large expressive eyes (simplified but with life)
- Detailed pixel work for hair strands and highlights
- Strategic use of pixels to show volume and form
- Retro game character portrait quality

CHARACTER DESIGN:
- Chest-up portrait view
- Anime-influenced facial features (larger eyes, stylized nose/mouth)
- Expressive and characterful pose
- Hair with volume and pixel-shaded highlights
- Clothing/outfit suggested with pixel details
- Cute but with depth and dimension

SHADING & DEPTH:
- Grayscale only: 4 tones (black #000000, dark gray #555555, light gray #AAAAAA, white #FFFFFF)
- Use dithering patterns to create mid-tones and texture
- Pixel-based shading to show facial contours and depth
- Highlights on hair, face, and clothing for dimension
- Cell-shaded anime approach adapted to pixel art
- NOT flat - use strategic pixel placement for 3D form

TECHNICAL SPECS:
- KEEP the provided background image exactly as-is
- Draw the pixel art character ON TOP of this background
- Character centered, fully visible
- Sharp pixel edges and clean silhouette
- No text, watermarks, or labels
- Square format 500x500px

OUTPUT GOAL:
An anime-style 8-bit character portrait with personality, depth, and charm - like a beloved JRPG character sprite with expressive features and dimensional pixel shading, drawn on top of the provided background.`;

    console.log("[badge-ai] STEP 1: Generating pixel art portrait");

    const pixelArtResult = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: pixelArtPrompt,
        image_urls: [bgBase64, photoBase64],
        num_images: 1,
        output_format: "png",
      },
    });

    if (
      !pixelArtResult.data ||
      !pixelArtResult.data.images ||
      pixelArtResult.data.images.length === 0
    ) {
      throw new Error("No pixel art image generated by FAL AI");
    }

    const pixelArtImageUrl = pixelArtResult.data.images[0].url;
    console.log("[badge-ai] Pixel art generated:", pixelArtImageUrl);

    const pixelArtResponse = await fetch(pixelArtImageUrl);
    const pixelArtBuffer = Buffer.from(await pixelArtResponse.arrayBuffer());

    const pixelArtTimestamp = Date.now();
    const pixelArtBlobResult = await put(
      `pixel-art/${participantId}-${pixelArtTimestamp}.png`,
      pixelArtBuffer,
      { access: "public", contentType: "image/png" },
    );
    console.log("[badge-ai] Pixel art uploaded to Vercel Blob:", pixelArtBlobResult.url);

    console.log("[badge-ai] STEP 2: Composing badge with sharp");

    const templatePath = path.join(process.cwd(), "public", "badge-base.jpg");

    const pixelArt = await sharp(pixelArtBuffer)
      .resize(500, 500, { fit: "cover" })
      .ensureAlpha()
      .toBuffer();

    const templateWidth = 1080;
    const pixelArtSize = 500;
    const pixelArtX = Math.floor((templateWidth - pixelArtSize) / 2);
    const pixelArtY = 450;

    const profileUrl = `https://peru.ai-hackathon.co/p/${participant.participantNumber}`;
    
    console.log("[badge-ai] Generating QR code for:", profileUrl);
    
    const qrCodeBuffer = await QRCode.toBuffer(profileUrl, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 120,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    const qrCode = await sharp(qrCodeBuffer)
      .resize(120, 120)
      .toBuffer();

    const svgText = `
      <svg width="1080" height="1265">
        <style>
          .number { fill: white; font-size: 48px; font-weight: bold; font-family: sans-serif; }
          .name { fill: white; font-size: 36px; font-weight: bold; font-family: sans-serif; }
        </style>
        <text x="540" y="370" text-anchor="middle" class="number">${participantNumberFormatted}</text>
        <text x="540" y="1000" text-anchor="middle" class="name">${participantName}</text>
      </svg>
    `;

    const badgeBuffer = await sharp(templatePath)
      .composite([
        {
          input: pixelArt,
          top: pixelArtY,
          left: pixelArtX,
        },
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
        {
          input: qrCode,
          top: 1120,
          left: 930,
        },
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    console.log("[badge-ai] Badge composed, uploading to Vercel Blob");

    const timestamp = Date.now();
    const blobResult = await put(
      `badges/${participantId}-${timestamp}.jpg`,
      badgeBuffer,
      { access: "public", contentType: "image/jpeg" },
    );

    console.log("[badge-ai] Uploaded to Vercel Blob:", blobResult.url);

    await db
      .update(participants)
      .set({
        badgeBlobUrl: blobResult.url,
        profilePhotoAiUrl: pixelArtBlobResult.url,
        badgeGeneratedAt: new Date(),
        lastBadgeGenerationAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(participants.id, participantId));

    console.log("[badge-ai] Badge generated successfully");

    return NextResponse.json({
      participantNumber: participant.participantNumber,
      badgeUrl: blobResult.url,
      profilePhotoAiUrl: pixelArtBlobResult.url,
    });
  } catch (error) {
    console.error("[badge-ai] Error generating badge:", error);
    return NextResponse.json(
      {
        error: "Failed to generate badge",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
