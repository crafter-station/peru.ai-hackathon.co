import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/schema";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import path from "path";
import QRCode from "qrcode";

function getBadgeTemplatePath(role: string | null | undefined, extension: "png" | "svg" = "svg"): string {
  const roleMap: Record<string, string> = {
    STAFF: "THC-IA HACK PE-ID-Staff",
    ORGANIZATION: "THC-IA HACK PE-ID-Organizacion",
    MENTOR: "THC-IA HACK PE-ID-Mentor",
    JURADO: "THC-IA HACK PE-ID-Jurado",
    PARTICIPANTE: "THC-IA HACK PE-ID-Participante",
  };

  const templateName = roleMap[role || "PARTICIPANTE"] || roleMap.PARTICIPANTE;
  return path.join(process.cwd(), "public/onboarding", `${templateName}.${extension}`);
}

function getRoleDisplayText(role: string | null | undefined, organization: string | null | undefined): string {
  const roleTextMap: Record<string, string> = {
    STAFF: "STAFF",
    ORGANIZATION: organization?.toUpperCase() || "ORGANIZACIÓN",
    MENTOR: "MENTOR",
    JURADO: "JURADO",
    PARTICIPANTE: "HACKER",
  };

  return roleTextMap[role || "PARTICIPANTE"] || roleTextMap.PARTICIPANTE;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ participantId: string }> }
) {
  try {
    const { participantId } = await params;
    const participant = await db?.query.participants.findFirst({
      where: eq(participants.id, participantId),
    });

    if (!participant) {
      return new Response("Participant not found", { status: 404 });
    }

    const bgPath = getBadgeTemplatePath(participant.role, "svg");

    const badge = sharp(bgPath).resize(1080, 1440);

    const participantNumber = `#${String(participant.participantNumber || 0).padStart(3, "0")}`;
    const firstName = participant.fullName?.split(" ")[0] || "PARTICIPANT";
    const lastName = participant.fullName?.split(" ").slice(1).join(" ") || "";

    // Generate QR code
    const numberOnly = String(participant.participantNumber || 0).padStart(3, "0");
    const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://ia-hack-pe.vercel.app"}/p/${numberOnly}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 179,
      margin: 0,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    const svg = `
      <svg width="1080" height="1440" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="grayscale">
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
        ${
          participant.profilePhotoAiUrl || participant.profilePhotoUrl
            ? `<image href="${participant.profilePhotoAiUrl || participant.profilePhotoUrl}" 
                      x="45.842790213430476" y="265.46173867777236" 
                      width="700" height="700" 
                      filter="url(#grayscale)"/>`
            : ""
        }
        <text x="407.8021863612701" y="343.34721499219154" text-anchor="middle" 
              font-size="32" font-weight="400" fill="rgba(246, 246, 246, 0.09)" 
              font-family="'Adelle Mono'" letter-spacing="0.34em" 
              style="text-transform: uppercase;">
          ${participantNumber.toUpperCase()} * ${participantNumber.toUpperCase()} * ${participantNumber.toUpperCase()}
        </text>
        <text x="411.5190005205624" y="1031.5543987506467" text-anchor="middle" 
              font-size="32" font-weight="400" fill="rgba(246, 246, 246, 0.09)" 
              font-family="'Adelle Mono'" letter-spacing="0.34em" 
              style="text-transform: uppercase;">
          ${participantNumber.toUpperCase()} * ${participantNumber.toUpperCase()} * ${participantNumber.toUpperCase()}
        </text>
        <text x="473.5817012876032" y="1198.84882384131" text-anchor="middle" 
              font-size="60" font-weight="700" fill="#FFFFFF" 
              font-family="bomstad-display, sans-serif" letter-spacing="0.08em">
          ${firstName.toUpperCase()}
        </text>
        <text x="458.33774981191004" y="1256.790067915308" text-anchor="middle" 
              font-size="60" font-weight="700" fill="#FFFFFF" 
              font-family="bomstad-display, sans-serif" letter-spacing="0.08em">
          ${lastName.toUpperCase()}
        </text>
        <text x="467.92609730627487" y="1317.076218001156" text-anchor="middle" 
              font-size="40" font-weight="400" fill="#FFFFFF" 
              font-family="'Adelle Mono'">
          ${getRoleDisplayText(participant.role, participant.organization)}
        </text>
        <image href="${qrCodeDataUrl}" x="107.5300849661869" y="1152.0579656293544" width="179" height="169.05"/>
      </svg>
    `;

    const composited = await badge
      .composite([
        {
          input: Buffer.from(svg),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    return new Response(new Uint8Array(composited), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating image", { status: 500 });
  }
}

