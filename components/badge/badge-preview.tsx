"use client";

import { forwardRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import QRCode from "qrcode";

interface BadgePreviewProps {
  profilePictureUrl?: string | null;
  participantNumber: string;
  firstName: string;
  lastName: string;
  role: string;
  className?: string;
}

const BADGE_CONFIG = {
  profilePicture: {
    x: 45.842790213430476,
    y: 265.46173867777236,
    width: 700,
    height: 700,
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
    fontFamily: "bomstad-display, sans-serif",
    letterSpacing: "0.08em",
  },
  lastName: {
    x: 458.33774981191004,
    y: 1256.790067915308,
    fontSize: 60,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "bomstad-display, sans-serif",
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

export const BadgePreview = forwardRef<SVGSVGElement, BadgePreviewProps>(
  function BadgePreview(
    {
      profilePictureUrl,
      participantNumber,
      firstName,
      lastName,
      role,
      className,
    },
    ref
  ) {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

    useEffect(() => {
      const generateQR = async () => {
        try {
          // Extract just the number from participantNumber (e.g., "#001" -> "001")
          const numberOnly = participantNumber.replace("#", "");
          const qrUrl = `${window.location.origin}/p/${numberOnly}`;
          
          const qrDataUrl = await QRCode.toDataURL(qrUrl, {
            width: 179,
            margin: 0,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
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
        <div className="relative w-full" style={{ aspectRatio: "1080/1440" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src="/onboarding/THC-IA HACK PE-ID-Participante.svg"
                alt="Badge Base"
                fill
                className="object-contain pointer-events-none"
                sizes="(max-width: 1080px) 100vw, 1080px"
              />
              <svg
                ref={ref}
                width="1080"
                height="1440"
                viewBox="0 0 1080 1440"
                className="absolute top-0 left-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
              <defs>
                <filter id="grayscale-filter">
                  <feColorMatrix
                    type="matrix"
                    values="0.2126 0.7152 0.0722 0 0
                            0.2126 0.7152 0.0722 0 0
                            0.2126 0.7152 0.0722 0 0
                            0 0 0 1 0"
                  />
                </filter>
              </defs>

              {profilePictureUrl && (
                <image
                  href={profilePictureUrl}
                  x={BADGE_CONFIG.profilePicture.x}
                  y={BADGE_CONFIG.profilePicture.y}
                  width={BADGE_CONFIG.profilePicture.width}
                  height={BADGE_CONFIG.profilePicture.height}
                  filter="url(#grayscale-filter)"
                />
              )}

              <text
                x={BADGE_CONFIG.participantNumber.x}
                y={BADGE_CONFIG.participantNumber.y}
                textAnchor="middle"
                fontSize="32"
                fontWeight="400"
                fill="rgba(246, 246, 246, 0.09)"
                fontFamily="'Adelle Mono'"
                letterSpacing="0.34em"
                className="select-none"
                style={{
                  textTransform: "uppercase",
                  lineHeight: "47px",
                }}
              >
                {`${participantNumber.toUpperCase()} * ${participantNumber.toUpperCase()} * ${participantNumber.toUpperCase()}`}
              </text>

              <text
                x={BADGE_CONFIG.participantNumber2.x}
                y={BADGE_CONFIG.participantNumber2.y}
                textAnchor="middle"
                fontSize="32"
                fontWeight="400"
                fill="rgba(246, 246, 246, 0.09)"
                fontFamily="'Adelle Mono'"
                letterSpacing="0.34em"
                className="select-none"
                style={{
                  textTransform: "uppercase",
                  lineHeight: "47px",
                }}
              >
                {`${participantNumber.toUpperCase()} * ${participantNumber.toUpperCase()} * ${participantNumber.toUpperCase()}`}
              </text>

              <text
                x={BADGE_CONFIG.firstName.x}
                y={BADGE_CONFIG.firstName.y}
                textAnchor="middle"
                fontSize={BADGE_CONFIG.firstName.fontSize}
                fontWeight={BADGE_CONFIG.firstName.fontWeight}
                fill={BADGE_CONFIG.firstName.color}
                fontFamily={BADGE_CONFIG.firstName.fontFamily}
                letterSpacing={BADGE_CONFIG.firstName.letterSpacing}
                className="select-none"
                style={{ textTransform: "uppercase" }}
              >
                {firstName.toUpperCase()}
              </text>

              <text
                x={BADGE_CONFIG.lastName.x}
                y={BADGE_CONFIG.lastName.y}
                textAnchor="middle"
                fontSize={BADGE_CONFIG.lastName.fontSize}
                fontWeight={BADGE_CONFIG.lastName.fontWeight}
                fill={BADGE_CONFIG.lastName.color}
                fontFamily={BADGE_CONFIG.lastName.fontFamily}
                letterSpacing={BADGE_CONFIG.lastName.letterSpacing}
                className="select-none"
                style={{ textTransform: "uppercase" }}
              >
                {lastName.toUpperCase()}
              </text>

              <text
                x={BADGE_CONFIG.role.x}
                y={BADGE_CONFIG.role.y}
                textAnchor="middle"
                fontSize={BADGE_CONFIG.role.fontSize}
                fontWeight={BADGE_CONFIG.role.fontWeight}
                fill={BADGE_CONFIG.role.color}
                fontFamily={BADGE_CONFIG.role.fontFamily}
                className="select-none"
                style={{ textTransform: "uppercase" }}
              >
                {role.toUpperCase()}
              </text>

              {/* QR Code */}
              {qrCodeDataUrl && (
                <image
                  href={qrCodeDataUrl}
                  x={BADGE_CONFIG.qrCode.x}
                  y={BADGE_CONFIG.qrCode.y}
                  width={BADGE_CONFIG.qrCode.width}
                  height={BADGE_CONFIG.qrCode.height}
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});

