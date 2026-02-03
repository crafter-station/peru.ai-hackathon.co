import { cn } from "@/lib/utils";
import QRCode from "qrcode";

interface CertificatePreviewProps {
  fullName: string;
  participantNumber: number;
  className?: string;
}

// Certificate canvas dimensions (matches ia-hack-pe-certificate.svg)
export const CERTIFICATE_WIDTH = 1920;
export const CERTIFICATE_HEIGHT = 1080;

// Name text area coordinates from the design
// Area: x=622, y=478, width=1109, height=100
export const NAME_X = 622;
export const NAME_CENTER_Y = 478 + 100 / 2; // 528

// QR code position (right side, upper area)
export const QR_X = 1620;
export const QR_Y = 750;
export const QR_SIZE = 160;

export async function CertificatePreview({
  fullName,
  participantNumber,
  className,
}: CertificatePreviewProps) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.peru.ai-hackathon.co";
  const qrUrl = `${baseUrl}/p/${participantNumber}`;

  const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
    width: QR_SIZE,
    margin: 0,
    color: {
      dark: "#FFFFFF",
      light: "#00000000",
    },
  });

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative w-full"
        style={{ aspectRatio: `${CERTIFICATE_WIDTH}/${CERTIFICATE_HEIGHT}` }}
      >
        <svg
          width={CERTIFICATE_WIDTH}
          height={CERTIFICATE_HEIGHT}
          viewBox={`0 0 ${CERTIFICATE_WIDTH} ${CERTIFICATE_HEIGHT}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Certificate background template */}
          <image
            href="/ia-hack-pe-certificate.svg"
            x="0"
            y="0"
            width={CERTIFICATE_WIDTH}
            height={CERTIFICATE_HEIGHT}
          />

          {/* Participant Name - positioned in the designated area, left-aligned */}
          <text
            x={NAME_X}
            y={NAME_CENTER_Y}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize="64"
            fontWeight="700"
            fill="#FFFFFF"
            fontFamily="bomstad-display, sans-serif"
            letterSpacing="0.06em"
          >
            {fullName.toUpperCase()}
          </text>

          {/* QR Code */}
          <image
            href={qrCodeDataUrl}
            x={QR_X}
            y={QR_Y}
            width={QR_SIZE}
            height={QR_SIZE}
          />
        </svg>
      </div>
    </div>
  );
}
