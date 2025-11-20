import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";
import * as falStorage from "@fal-ai/serverless-client";
import satori from "satori";

falStorage.config({
  credentials: process.env.FAL_API_KEY,
});

const RATE_LIMIT_SECONDS = 10;

let fontsCache: { regular: Buffer; bold: Buffer } | null = null;

async function getFonts() {
  if (!fontsCache) {
    const [regular, bold] = await Promise.all([
      fs.readFile(
        path.join(
          process.cwd(),
          "app/fonts/Adelle Mono/AdelleMono-Regular.ttf",
        ),
      ),
      fs.readFile(
        path.join(process.cwd(), "app/fonts/Adelle Mono/AdelleMono-Bold.ttf"),
      ),
    ]);
    fontsCache = { regular, bold };
  }
  return fontsCache;
}

const BADGE_CONFIG = {
  profilePicture: {
    x: 130,
    y: 393,
    width: 574,
    height: 574,
  },
  participantNumber: {
    x: 150.8021863612701,
    y: 313.34721499219154,
    fontSize: 32,
    color: "rgba(246, 246, 246, 0.09)",
  },
  participantNumber2: {
    x: 150.8021863612701,
    y: 1001.5543987506467,
    fontSize: 32,
    color: "rgba(246, 246, 246, 0.09)",
  },
  firstName: {
    y: 1198.84882384131,
  },
  lastName: {
    y: 1256.790067915308,
  },
  role: {
    y: 1317.076218001156,
  },
  qrCode: {
    x: 115.5300849661869,
    y: 1139.0579656293544,
    width: 179,
    height: 179,
  },
};

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

    console.log("[badge-ai] STEP 1: Generating pixel art portrait");

    let processedPixelArt: Buffer;

    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      console.log(
        "[badge-ai] DEV MODE: Using test image instead of AI generation",
      );
      const testImagePath = path.join(process.cwd(), "public", "test-img.png");
      const testImageBuffer = await fs.readFile(testImagePath);

      processedPixelArt = await sharp(testImageBuffer)
        .resize(
          BADGE_CONFIG.profilePicture.width,
          BADGE_CONFIG.profilePicture.height,
          { fit: "cover" },
        )
        .grayscale()
        .png()
        .toBuffer();

      console.log("[badge-ai] Using local test image");
    } else {
      const prompt =
        "8-bit pixel art portrait, chest-up view. Simple solid background for easy cutout. Flat grayscale shading with four tones. Printed, cartoonish, and cute. Preserve facial structure. The character should fit entirely within the frame, without labels or text.";

      console.log(
        "[badge-ai] Calling qwen-image-edit with profile photo URL directly",
      );
      const pixelArtResult = (await falStorage.subscribe(
        "fal-ai/qwen-image-edit",
        {
          input: {
            prompt,
            image_url: participant.profilePhotoUrl,
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

      const bgRemovalResult = (await falStorage.subscribe(
        "fal-ai/birefnet/v2",
        {
          input: {
            image_url: pixelArtImageUrl,
          },
          logs: true,
          onQueueUpdate: (update: QueueUpdate) => {
            if (update.status === "IN_PROGRESS" && update.logs) {
              update.logs.map((log) => log.message).forEach(console.log);
            }
          },
        },
      )) as { data?: { image?: { url: string } }; image?: { url: string } };

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

      processedPixelArt = await sharp(pixelArtBuffer)
        .resize(
          BADGE_CONFIG.profilePicture.width,
          BADGE_CONFIG.profilePicture.height,
          { fit: "cover" },
        )
        .grayscale()
        .png()
        .toBuffer();
    }

    console.log("[badge-ai] STEP 2: Composing badge with sharp");

    let domain = "peru.ai-hackathon.co";

    switch (process.env.VERCEL_ENV) {
      case "production":
        if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
          domain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
        }
        break;
      case "preview":
        if (process.env.VERCEL_BRANCH_URL) {
          domain = process.env.VERCEL_BRANCH_URL;
        }
        break;
    }

    const profileUrl = `https://${domain}/p/${participant.participantNumber}`;

    console.log("[badge-ai] Loading fonts, generating QR code in parallel");

    const templatePath = path.join(
      process.cwd(),
      "public/onboarding/THC-IA HACK PE-ID-Participante.png",
    );

    const [fonts, qrCodeBuffer] = await Promise.all([
      getFonts(),
      QRCode.toBuffer(profileUrl, {
        errorCorrectionLevel: "M",
        type: "png",
        width: 60,
        margin: 0,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }),
    ]);

    const { regular: adelleMonoRegular, bold: adelleMonoBold } = fonts;

    const numberText = `#${String(participant.participantNumber).padStart(3, "0")} * #${String(participant.participantNumber).padStart(3, "0")} * #${String(participant.participantNumber).padStart(3, "0")}`;
    const nameParts = (participant.fullName || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const qrCode = await sharp(qrCodeBuffer)
      .resize(BADGE_CONFIG.qrCode.width, BADGE_CONFIG.qrCode.height)
      .toBuffer();

    const numbersElement = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1080px",
          height: "1440px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${BADGE_CONFIG.participantNumber.y}px`,
            left: `${BADGE_CONFIG.participantNumber.x}px`,
            color: BADGE_CONFIG.participantNumber.color,
            fontSize: `${BADGE_CONFIG.participantNumber.fontSize}px`,
            fontFamily: "Adelle Mono",
            fontWeight: 400,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
          }}
        >
          {numberText}
        </div>
        <div
          style={{
            position: "absolute",
            top: `${BADGE_CONFIG.participantNumber2.y}px`,
            left: `${BADGE_CONFIG.participantNumber2.x}px`,
            color: BADGE_CONFIG.participantNumber2.color,
            fontSize: `${BADGE_CONFIG.participantNumber2.fontSize}px`,
            fontFamily: "Adelle Mono",
            fontWeight: 400,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
          }}
        >
          {numberText}
        </div>
      </div>
    );

    const textElement = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1080px",
          height: "1440px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${BADGE_CONFIG.firstName.y - 60}px`,
            left: "0",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            color: "white",
            fontSize: "60px",
            fontFamily: "Adelle Mono",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {firstName}
        </div>
        <div
          style={{
            position: "absolute",
            top: `${BADGE_CONFIG.lastName.y - 60}px`,
            left: "0",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            color: "white",
            fontSize: "60px",
            fontFamily: "Adelle Mono",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {lastName}
        </div>
        <div
          style={{
            position: "absolute",
            top: `${BADGE_CONFIG.role.y - 40}px`,
            left: "0",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            color: "white",
            fontSize: "40px",
            fontFamily: "Adelle Mono",
            fontWeight: 400,
            textTransform: "uppercase",
          }}
        >
          {participant.organization?.toUpperCase() || "HACKER"}
        </div>
      </div>
    );

    const svgNumbers = await satori(numbersElement, {
      width: 1080,
      height: 1440,
      fonts: [
        {
          name: "Adelle Mono",
          data: adelleMonoRegular,
          weight: 400,
          style: "normal",
        },
      ],
    });

    const svgText = await satori(textElement, {
      width: 1080,
      height: 1440,
      fonts: [
        {
          name: "Adelle Mono",
          data: adelleMonoRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Adelle Mono",
          data: adelleMonoBold,
          weight: 700,
          style: "normal",
        },
      ],
    });

    const badgeBuffer = await sharp(templatePath)
      .resize(1080, 1440, { fit: "fill" })
      .composite([
        {
          input: processedPixelArt,
          top: Math.round(BADGE_CONFIG.profilePicture.y),
          left: Math.round(BADGE_CONFIG.profilePicture.x),
        },
        {
          input: Buffer.from(svgNumbers),
          top: 0,
          left: 0,
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

    console.log(
      "[badge-ai] Badge composed, uploading badge and pixel art to Vercel Blob in parallel",
    );

    const timestamp = Date.now();

    const uploadPromises: [Promise<{ url: string }>, Promise<{ url: string }>] =
      [
        put(`badges/${participantId}-${timestamp}.png`, badgeBuffer, {
          access: "public",
          contentType: "image/png",
        }),
        isDev
          ? Promise.resolve({ url: "/test-img.png" })
          : put(
              `ai-profile-photos/${participantId}-${timestamp}.png`,
              processedPixelArt,
              { access: "public", contentType: "image/png" },
            ),
      ];

    const [blobResult, pixelArtBlobResultFinal] =
      await Promise.all(uploadPromises);

    console.log("[badge-ai] Uploaded to Vercel Blob:", blobResult.url);
    console.log(
      "[badge-ai] Pixel art uploaded to Vercel Blob:",
      pixelArtBlobResultFinal.url,
    );

    await db
      .update(participants)
      .set({
        badgeBlobUrl: blobResult.url,
        profilePhotoAiUrl: pixelArtBlobResultFinal.url,
        badgeGeneratedAt: new Date(),
        lastBadgeGenerationAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(participants.id, participantId));

    console.log("[badge-ai] Badge generated successfully");

    return NextResponse.json({
      participantNumber: participant.participantNumber,
      badgeUrl: blobResult.url,
      profilePhotoAiUrl: pixelArtBlobResultFinal.url,
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
