import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { readFile } from "fs/promises";
import { join } from "path";
import QRCode from "qrcode";

// Name text area coordinates (from ia-hack-pe-certificate.svg design)
const NAME_X = 622;
const NAME_CENTER_Y = 528;

// QR code position
const QR_X = 1620;
const QR_Y = 750;
const QR_SIZE = 160;

async function generateCertificateSVG(
  fullName: string,
  qrCodeDataUrl: string
): Promise<string> {
  // Read the base certificate SVG
  const svgPath = join(process.cwd(), "public", "ia-hack-pe-certificate.svg");
  const baseSvg = await readFile(svgPath, "utf-8");

  // Create overlay elements with system fonts (Arial works everywhere)
  const overlayElements = `
    <!-- Participant Name -->
    <text
      x="${NAME_X}"
      y="${NAME_CENTER_Y}"
      text-anchor="start"
      dominant-baseline="middle"
      font-size="64"
      font-weight="700"
      fill="#FFFFFF"
      font-family="Arial, Helvetica, sans-serif"
      letter-spacing="0.06em"
    >${escapeXml(fullName.toUpperCase())}</text>

    <!-- QR Code -->
    <image
      href="${qrCodeDataUrl}"
      x="${QR_X}"
      y="${QR_Y}"
      width="${QR_SIZE}"
      height="${QR_SIZE}"
    />
  `;

  // Insert overlay elements before closing </svg>
  const modifiedSvg = baseSvg.replace("</svg>", `${overlayElements}</svg>`);

  return modifiedSvg;
}

// Escape special XML characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

    // Generate QR code
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.peru.ai-hackathon.co";
    const qrUrl = `${baseUrl}/p/${participantNum}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      width: QR_SIZE,
      margin: 0,
      color: {
        dark: "#FFFFFF",
        light: "#00000000",
      },
    });

    // Generate SVG with name and QR code
    const svgContent = await generateCertificateSVG(
      participant.fullName,
      qrCodeDataUrl
    );

    // Convert SVG to PNG
    const pngBuffer = await sharp(Buffer.from(svgContent)).png().toBuffer();

    return new NextResponse(new Uint8Array(pngBuffer), {
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
