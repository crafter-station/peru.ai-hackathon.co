"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import QRCode from "qrcode";
import {
  CERTIFICATE_WIDTH,
  CERTIFICATE_HEIGHT,
  NAME_X,
  NAME_CENTER_Y,
  QR_X,
  QR_Y,
  QR_SIZE,
} from "./certificate-preview";

interface CertificatePreviewClientProps {
  fullName: string;
  participantNumber: number;
  className?: string;
}

export function CertificatePreviewClient({
  fullName,
  participantNumber,
  className,
}: CertificatePreviewClientProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrUrl = `${window.location.origin}/p/${participantNumber}`;
        const qrDataUrl = await QRCode.toDataURL(qrUrl, {
          width: QR_SIZE,
          margin: 0,
          color: {
            dark: "#FFFFFF",
            light: "#00000000",
          },
        });
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQR();
  }, [participantNumber]);

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
          {qrCodeDataUrl && (
            <image
              href={qrCodeDataUrl}
              x={QR_X}
              y={QR_Y}
              width={QR_SIZE}
              height={QR_SIZE}
            />
          )}
        </svg>
      </div>
    </div>
  );
}
