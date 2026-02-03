import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { join } from "path";
import QRCode from "qrcode";
import satori from "satori";

// Certificate dimensions
const CERTIFICATE_WIDTH = 1920;
const CERTIFICATE_HEIGHT = 1080;

// Name position
const NAME_X = 622;
const NAME_Y = 528;

// QR code position
const QR_X = 1620;
const QR_Y = 750;
const QR_SIZE = 160;

// Cache for font
let fontCache: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;

  // Fetch Inter Bold from Google Fonts
  const fontUrl =
    "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff";
  const response = await fetch(fontUrl);
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

    // Create text overlay with satori
    const textElement = (
      <div
        style={{
          display: "flex",
          width: `${CERTIFICATE_WIDTH}px`,
          height: `${CERTIFICATE_HEIGHT}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `${NAME_Y - 32}px`,
            left: `${NAME_X}px`,
            color: "#FFFFFF",
            fontSize: "64px",
            fontFamily: "Inter",
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
    const textSvg = await satori(textElement, {
      width: CERTIFICATE_WIDTH,
      height: CERTIFICATE_HEIGHT,
      fonts: [
        {
          name: "Inter",
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
      .resize(CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT)
      .png()
      .toBuffer();

    // Resize QR code
    const qrCodeResized = await sharp(qrCodeBuffer)
      .resize(QR_SIZE, QR_SIZE)
      .png()
      .toBuffer();

    // Composite everything together
    const finalImage = await sharp(templatePng)
      .composite([
        {
          input: Buffer.from(textSvg),
          top: 0,
          left: 0,
        },
        {
          input: qrCodeResized,
          top: QR_Y,
          left: QR_X,
        },
      ])
      .png()
      .toBuffer();

    return new NextResponse(new Uint8Array(finalImage), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[certificate-og] Error:", error);
    return NextResponse.json(
      { error: "Error generating image" },
      { status: 500 }
    );
  }
}
