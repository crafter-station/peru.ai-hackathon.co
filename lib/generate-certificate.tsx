import sharp from "sharp";
import path from "path";
import QRCode from "qrcode";
import satori from "satori";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";

let fontsCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;

function getBaseUrl() {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

async function getFonts() {
  if (!fontsCache) {
    const baseUrl = getBaseUrl();
    const [regular, bold] = await Promise.all([
      fetch(`${baseUrl}/fonts/AdelleMono-Regular.ttf`).then((res) =>
        res.arrayBuffer()
      ),
      fetch(`${baseUrl}/fonts/AdelleMono-Bold.ttf`).then((res) =>
        res.arrayBuffer()
      ),
    ]);
    fontsCache = { regular, bold };
  }
  return fontsCache;
}

// Certificate dimensions (1920x1080)
const CERTIFICATE_WIDTH = 1920;
const CERTIFICATE_HEIGHT = 1080;

// Name position (from design)
const NAME_X = 622;
const NAME_Y = 528;

// QR code position
const QR_X = 1620;
const QR_Y = 750;
const QR_SIZE = 160;

export async function generateCertificate(participantId: string) {
  if (!db) {
    console.error("[certificate] Database not configured");
    return { success: false, error: "Database not configured" };
  }

  try {
    const participant = await db.query.participants.findFirst({
      where: eq(participants.id, participantId),
    });

    if (!participant) {
      console.error("[certificate] Participant not found:", participantId);
      return { success: false, error: "Participant not found" };
    }

    if (!participant.fullName) {
      console.error(
        "[certificate] Full name not found for participant:",
        participantId
      );
      return { success: false, error: "Participant name not found" };
    }

    if (typeof participant.participantNumber !== "number") {
      console.error("[certificate] No participant number for:", participantId);
      return { success: false, error: "Participant number not found" };
    }

    console.log(
      "[certificate] Generating certificate for participant",
      participant.participantNumber
    );

    // Get domain for QR code
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

    // Load fonts and generate QR code
    const [fonts, qrCodeBuffer] = await Promise.all([
      getFonts(),
      QRCode.toBuffer(profileUrl, {
        errorCorrectionLevel: "M",
        type: "png",
        width: QR_SIZE,
        margin: 0,
        color: {
          dark: "#FFFFFF",
          light: "#00000000",
        },
      }),
    ]);

    const { bold: adelleMonoBold } = fonts;

    // Create the text overlay using satori
    const textElement = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: `${CERTIFICATE_WIDTH}px`,
          height: `${CERTIFICATE_HEIGHT}px`,
          position: "relative",
        }}
      >
        {/* Participant Name */}
        <div
          style={{
            position: "absolute",
            top: `${NAME_Y - 32}px`,
            left: `${NAME_X}px`,
            color: "white",
            fontSize: "64px",
            fontFamily: "Adelle Mono",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {participant.fullName.toUpperCase()}
        </div>
      </div>
    );

    // Render text to SVG using satori
    const svgText = await satori(textElement, {
      width: CERTIFICATE_WIDTH,
      height: CERTIFICATE_HEIGHT,
      fonts: [
        {
          name: "Adelle Mono",
          data: adelleMonoBold,
          weight: 700,
          style: "normal",
        },
      ],
    });

    // Load the certificate template
    const templatePath = path.join(
      process.cwd(),
      "public",
      "ia-hack-pe-certificate.svg"
    );

    // Convert template SVG to PNG first
    const templatePng = await sharp(templatePath)
      .resize(CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT)
      .png()
      .toBuffer();

    // Resize QR code
    const qrCodeResized = await sharp(qrCodeBuffer)
      .resize(QR_SIZE, QR_SIZE)
      .png()
      .toBuffer();

    // Composite everything together
    const certificateBuffer = await sharp(templatePng)
      .composite([
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
        {
          input: qrCodeResized,
          top: QR_Y,
          left: QR_X,
        },
      ])
      .png({ quality: 90 })
      .toBuffer();

    console.log(
      "[certificate] Certificate composed, uploading to Vercel Blob"
    );

    // Upload to Vercel Blob
    const timestamp = Date.now();
    const certificateBlobResult = await put(
      `certificates/${participantId}-${timestamp}.png`,
      certificateBuffer,
      {
        access: "public",
        contentType: "image/png",
      }
    );

    console.log(
      "[certificate] Certificate uploaded:",
      certificateBlobResult.url
    );

    // Update participant record
    await db
      .update(participants)
      .set({
        certificateBlobUrl: certificateBlobResult.url,
        certificateGeneratedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(participants.id, participantId));

    console.log("[certificate] Certificate generation completed");

    return {
      success: true,
      url: certificateBlobResult.url,
    };
  } catch (error) {
    console.error("[certificate] Error in certificate generation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
