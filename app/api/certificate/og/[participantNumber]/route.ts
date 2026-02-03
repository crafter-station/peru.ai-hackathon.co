import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { readFile } from "fs/promises";
import { join } from "path";
import QRCode from "qrcode";

// Name text area coordinates (from ia-hack-pe-certificate.svg design)
// Area: x=622, y=478, width=1109, height=100
const NAME_X = 622;
const NAME_CENTER_Y = 478 + 100 / 2; // 528

// QR code position (right side, upper area)
const QR_X = 1620;
const QR_Y = 750;
const QR_SIZE = 160;

// Cache font data to avoid reading file on every request
let fontBase64Cache: string | null = null;

async function loadFontBase64(): Promise<string> {
  if (fontBase64Cache) return fontBase64Cache;

  const fontPath = join(process.cwd(), "app/fonts/Adelle Mono/AdelleMono-Bold.ttf");
  const fontBuffer = await readFile(fontPath);
  fontBase64Cache = fontBuffer.toString("base64");
  return fontBase64Cache;
}

async function generateCertificateSVG(
  fullName: string,
  participantNumber: number,
  qrCodeDataUrl: string
): Promise<string> {
  // Read the base certificate SVG
  const svgPath = join(process.cwd(), "public", "ia-hack-pe-certificate.svg");
  const baseSvg = await readFile(svgPath, "utf-8");

  // Load font as base64
  const fontBase64 = await loadFontBase64();

  // Create style with embedded font
  const fontStyle = `
    <defs>
      <style type="text/css">
        @font-face {
          font-family: 'AdelleMono';
          src: url('data:font/truetype;base64,${fontBase64}') format('truetype');
          font-weight: 700;
          font-style: normal;
        }
      </style>
    </defs>
  `;

  // Create overlay elements: name and QR code
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
      font-family="AdelleMono, Arial, sans-serif"
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

  // Insert the font style after the opening <svg> tag and overlay elements before closing </svg>
  let modifiedSvg = baseSvg.replace(/<svg([^>]*)>/, `<svg$1>${fontStyle}`);
  modifiedSvg = modifiedSvg.replace("</svg>", `${overlayElements}</svg>`);

  return modifiedSvg;
}

// Escape special XML characters to prevent injection
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
      console.error("[certificate-og] Database not configured");
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const participant = await db.query.participants.findFirst({
      where: eq(participants.participantNumber, participantNum),
    });

    if (!participant) {
      console.error("[certificate-og] Participant not found:", participantNum);
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    if (!participant.fullName) {
      console.error("[certificate-og] Full name not found for participant:", participantNum);
      return NextResponse.json(
        { error: "Participant name not found" },
        { status: 404 }
      );
    }

    // Generate QR code linking to participant profile
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.peru.ai-hackathon.co";
    const qrUrl = `${baseUrl}/p/${participantNum}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      width: QR_SIZE,
      margin: 0,
      color: {
        dark: "#FFFFFF",
        light: "#00000000",
      },
    });

    // Generate SVG with name and QR code overlaid on certificate template
    const svgContent = await generateCertificateSVG(
      participant.fullName,
      participantNum,
      qrCodeDataUrl
    );

    // Convert SVG to PNG
    const pngBuffer = await sharp(Buffer.from(svgContent))
      .png()
      .toBuffer();

    console.log("[certificate-og] Certificate image generated, size:", pngBuffer.length, "bytes");

    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": pngBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("[certificate-og] Error generating certificate image:", error);
    return NextResponse.json(
      { error: "Error generating image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
