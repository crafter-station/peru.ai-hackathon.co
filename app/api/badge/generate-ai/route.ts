import { type NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import path from "path";
import sharp from "sharp";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import * as falStorage from "@fal-ai/serverless-client";

fal.config({
  credentials: process.env.FAL_API_KEY,
});

falStorage.config({
  credentials: process.env.FAL_API_KEY,
});

const RATE_LIMIT_SECONDS = 10;

const BADGE_CONFIG = {
  profilePicture: {
    x: 125,
    y: 393,
    width: 574,
    height: 574,
  },
  participantNumber: {
    x: 407.8021863612701,
    y: 343.34721499219154,
    fontSize: 32,
    fontWeight: "400",
    color: "rgba(246, 246, 246, 0.09)",
    fontFamily: "'Adelle Mono'",
  },
  participantNumber2: {
    x: 411.5190005205624,
    y: 1031.5543987506467,
    fontSize: 32,
    fontWeight: "400",
    color: "rgba(246, 246, 246, 0.09)",
    fontFamily: "'Adelle Mono'",
  },
  firstName: {
    x: 473.5817012876032,
    y: 1198.84882384131,
    fontSize: 60,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "sans-serif",
    letterSpacing: "0.08em",
  },
  lastName: {
    x: 458.33774981191004,
    y: 1256.790067915308,
    fontSize: 60,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "sans-serif",
    letterSpacing: "0.08em",
  },
  role: {
    x: 467.92609730627487,
    y: 1317.076218001156,
    fontSize: 40,
    fontWeight: "400",
    color: "#FFFFFF",
    fontFamily: "'Adelle Mono'",
  },
  qrCode: {
    x: 107.5300849661869,
    y: 1152.0579656293544,
    width: 179,
    height: 169.05,
  },
};

function base64ToFile(base64String: string, filename = "upload.jpg"): File {
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mimeType });
}

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

    if (!participant.profilePhotoUrl) {
      return NextResponse.json(
        { error: "Profile photo required for badge generation" },
        { status: 400 },
      );
    }

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

    const participantNumberFormatted = `#${String(participant.participantNumber).padStart(3, "0")}`;
    const firstName =
      participant.fullName?.split(" ")[0]?.toUpperCase() || "PARTICIPANT";
    const lastName =
      participant.fullName?.split(" ").slice(1).join(" ")?.toUpperCase() || "";

    console.log("[badge-ai] STEP 1: Generating pixel art portrait");

    const photoResponse = await fetch(participant.profilePhotoUrl);
    const photoBuffer = Buffer.from(await photoResponse.arrayBuffer());
    const photoBase64 = `data:image/jpeg;base64,${photoBuffer.toString("base64")}`;

    console.log(
      "[badge-ai] Converting base64 to File and uploading to fal.storage",
    );
    const imageFile = base64ToFile(photoBase64, "profile-photo.jpg");
    const uploadedImageUrl = await falStorage.storage.upload(imageFile);
    console.log("[badge-ai] Image uploaded to fal.storage:", uploadedImageUrl);

    const prompt =
      "8-bit pixel art portrait, chest-up view. Simple solid background for easy cutout. Flat grayscale shading with four tones. Printed, cartoonish, and cute. Preserve facial structure. The character should fit entirely within the frame, without labels or text.";

    console.log("[badge-ai] Calling qwen-image-edit with uploaded image URL");
    const pixelArtResult = (await falStorage.subscribe(
      "fal-ai/qwen-image-edit",
      {
        input: {
          prompt,
          image_url: uploadedImageUrl,
        },
      },
    )) as {
      data?: { images?: Array<{ url: string }>; image?: { url: string } };
      images?: Array<{ url: string }>;
      image?: { url: string };
    };

    console.log("[badge-ai] FAL result received");

    let pixelArtImageUrl: string | undefined;

    if (
      pixelArtResult.data?.images &&
      Array.isArray(pixelArtResult.data.images) &&
      pixelArtResult.data.images.length > 0
    ) {
      pixelArtImageUrl = pixelArtResult.data.images[0].url;
    } else if (
      pixelArtResult.images &&
      Array.isArray(pixelArtResult.images) &&
      pixelArtResult.images.length > 0
    ) {
      pixelArtImageUrl = pixelArtResult.images[0].url;
    } else if (pixelArtResult.data?.image?.url) {
      pixelArtImageUrl = pixelArtResult.data.image.url;
    } else if (pixelArtResult.image?.url) {
      pixelArtImageUrl = pixelArtResult.image.url;
    }

    if (!pixelArtImageUrl) {
      console.error("[badge-ai] Could not find image URL in result");
      throw new Error("No pixel art image generated by FAL AI");
    }

    console.log("[badge-ai] Pixel art generated:", pixelArtImageUrl);

    console.log("[badge-ai] Removing background from pixel art");

    interface QueueUpdate {
      status: string;
      logs?: Array<{ message: string }>;
    }

    const bgRemovalResult = (await falStorage.subscribe("fal-ai/birefnet/v2", {
      input: {
        image_url: pixelArtImageUrl,
      },
      logs: true,
      onQueueUpdate: (update: QueueUpdate) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    })) as { data?: { image?: { url: string } }; image?: { url: string } };

    let transparentImageUrl: string | undefined;

    if (bgRemovalResult.data?.image?.url) {
      transparentImageUrl = bgRemovalResult.data.image.url;
      console.log(
        "[badge-ai] Background removed successfully:",
        transparentImageUrl,
      );
    } else if (bgRemovalResult.image?.url) {
      transparentImageUrl = bgRemovalResult.image.url;
      console.log(
        "[badge-ai] Background removed successfully:",
        transparentImageUrl,
      );
    } else {
      console.warn(
        "[badge-ai] Could not remove background, using original image",
      );
      transparentImageUrl = pixelArtImageUrl;
    }

    const finalPixelArtUrl = transparentImageUrl || pixelArtImageUrl;

    const pixelArtResponse = await fetch(finalPixelArtUrl);
    const pixelArtBuffer = Buffer.from(await pixelArtResponse.arrayBuffer());

    const processedPixelArt = await sharp(pixelArtBuffer)
      .resize(
        BADGE_CONFIG.profilePicture.width,
        BADGE_CONFIG.profilePicture.height,
        { fit: "cover" },
      )
      .grayscale()
      .png()
      .toBuffer();

    const pixelArtTimestamp = Date.now();
    const pixelArtBlobResult = await put(
      `ai-profile-photos/${participantId}-${pixelArtTimestamp}.png`,
      processedPixelArt,
      { access: "public", contentType: "image/png" },
    );
    console.log(
      "[badge-ai] Pixel art uploaded to Vercel Blob:",
      pixelArtBlobResult.url,
    );

    console.log("[badge-ai] STEP 2: Composing badge with sharp");

    const templatePath = path.join(
      process.cwd(),
      "public",
      "onboarding",
      "THC-IA HACK PE-ID-Participante.png",
    );

    const profileUrl = `https://peru.ai-hackathon.co/p/${participant.participantNumber}`;

    console.log("[badge-ai] Generating QR code for:", profileUrl);

    const qrCodeBuffer = await QRCode.toBuffer(profileUrl, {
      errorCorrectionLevel: "M",
      type: "png",
      width: Math.round(BADGE_CONFIG.qrCode.width),
      margin: 0,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    const qrCode = await sharp(qrCodeBuffer)
      .resize(
        Math.round(BADGE_CONFIG.qrCode.width),
        Math.round(BADGE_CONFIG.qrCode.height),
      )
      .toBuffer();

    const numberText = `${participantNumberFormatted.toUpperCase()} * ${participantNumberFormatted.toUpperCase()} * ${participantNumberFormatted.toUpperCase()}`;

    const svgText = `
      <svg width="1080" height="1440">
        <style>
          .number {
            fill: rgba(246, 246, 246, 0.09);
            font-size: 32px;
            font-weight: 400;
            font-family: monospace;
            letter-spacing: 0.34em;
            text-transform: uppercase;
          }
          .firstName {
            fill: white;
            font-size: 60px;
            font-weight: 700;
            font-family: sans-serif;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .lastName {
            fill: white;
            font-size: 60px;
            font-weight: 700;
            font-family: sans-serif;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .role {
            fill: white;
            font-size: 40px;
            font-weight: 400;
            font-family: monospace;
            text-transform: uppercase;
          }
        </style>
        <text x="${BADGE_CONFIG.participantNumber.x}" y="${BADGE_CONFIG.participantNumber.y}" text-anchor="middle" class="number">${numberText}</text>
        <text x="${BADGE_CONFIG.participantNumber2.x}" y="${BADGE_CONFIG.participantNumber2.y}" text-anchor="middle" class="number">${numberText}</text>
        <text x="${BADGE_CONFIG.firstName.x}" y="${BADGE_CONFIG.firstName.y}" text-anchor="middle" class="firstName">${firstName}</text>
        <text x="${BADGE_CONFIG.lastName.x}" y="${BADGE_CONFIG.lastName.y}" text-anchor="middle" class="lastName">${lastName}</text>
        <text x="${BADGE_CONFIG.role.x}" y="${BADGE_CONFIG.role.y}" text-anchor="middle" class="role">HACKER</text>
      </svg>
    `;

    const badgeBuffer = await sharp(templatePath)
      .composite([
        {
          input: processedPixelArt,
          top: Math.round(BADGE_CONFIG.profilePicture.y),
          left: Math.round(BADGE_CONFIG.profilePicture.x),
        },
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
        {
          input: qrCode,
          top: Math.round(BADGE_CONFIG.qrCode.y),
          left: Math.round(BADGE_CONFIG.qrCode.x),
        },
      ])
      .png({ quality: 90 })
      .toBuffer();

    console.log("[badge-ai] Badge composed, uploading to Vercel Blob");

    const timestamp = Date.now();
    const blobResult = await put(
      `badges/${participantId}-${timestamp}.png`,
      badgeBuffer,
      { access: "public", contentType: "image/png" },
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
