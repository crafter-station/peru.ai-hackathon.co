import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { join } from "path";
import QRCode from "qrcode";
import satori from "satori";

// Certificate dimensions
const WIDTH = 1920;
const HEIGHT = 1080;

// Name position
const NAME_X = 622;
const NAME_Y = 528;

// QR code position
const QR_X = 1620;
const QR_Y = 750;
const QR_SIZE = 160;

let fontCache: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;

  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  const response = await fetch(`${baseUrl}/fonts/AdelleMono-Bold.ttf`);
  fontCache = await response.arrayBuffer();
  return fontCache;
}

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
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const participant = await db.query.participants.findFirst({
      where: eq(participants.participantNumber, participantNum),
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    if (!participant.fullName) {
      return NextResponse.json(
        { error: "Participant name not found" },
        { status: 404 }
      );
    }

    // Load font
    const fontData = await getFont();

    // Generate QR code
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.peru.ai-hackathon.co";
    const qrUrl = `${baseUrl}/p/${participantNum}`;
    const qrCodeBuffer = await QRCode.toBuffer(qrUrl, {
      width: QR_SIZE,
      margin: 0,
      color: {
        dark: "#FFFFFF",
        light: "#00000000",
      },
    });

    // Create text overlay using satori (embeds font data in SVG)
    const textOverlay = (
      <div
        style={{
          display: "flex",
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          position: "relative",
        }}
      >
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
          }}
        >
          {participant.fullName.toUpperCase()}
        </div>
      </div>
    );

    const textSvg = await satori(textOverlay, {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Adelle Mono",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    });

    // Load certificate template
    const templatePath = join(
      process.cwd(),
      "public",
      "ia-hack-pe-certificate.svg"
    );

    // Convert template to PNG
    const templatePng = await sharp(templatePath)
      .resize(WIDTH, HEIGHT)
      .png()
      .toBuffer();

    // Composite: template + text + QR code
    const pngBuffer = await sharp(templatePng)
      .composite([
        {
          input: Buffer.from(textSvg),
          top: 0,
          left: 0,
        },
        {
          input: qrCodeBuffer,
          top: QR_Y,
          left: QR_X,
        },
      ])
      .png()
      .toBuffer();

    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[certificate-og] Error:", error);
    return NextResponse.json(
      {
        error: "Error generating image",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
