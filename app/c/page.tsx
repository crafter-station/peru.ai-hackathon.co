"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface CopyButtonProps {
  text: string;
  label: string;
}

function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full bg-white/5 border border-white/10 p-4 sm:p-5 hover:bg-white/10 hover:border-white/20 active:bg-white/15 transition-all duration-200 text-left min-h-[72px] sm:min-h-[auto]"
    >
      <div className="flex-1 min-w-0">
        <p className="text-white/60 text-xs sm:text-sm mb-2 sm:mb-1 font-medium">
          {label}
        </p>
        <p className="text-brand-red font-mono text-base sm:text-lg md:text-xl font-bold break-all sm:break-normal">
          {text}
        </p>
      </div>
      <div className="flex-shrink-0 self-start sm:self-auto">
        {copied ? (
          <div className="flex items-center gap-1.5 sm:gap-2 text-green-400">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-xs sm:text-sm font-semibold">Copiado</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 text-white/60 group-hover:text-white transition-colors">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs sm:text-sm font-medium">Copiar</span>
          </div>
        )}
      </div>
    </button>
  );
}

export default function CreditsPage() {
  // DEBUG: Set to true to preview the credits content
  const [isVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();

      setCurrentTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Bogota",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(now)
      );

      // DEBUG: Commented out for preview - uncomment for production
      // const colombiaTime = new Intl.DateTimeFormat("en-US", {
      //   timeZone: "America/Bogota",
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   hour12: false,
      // }).format(now);
      // const [hours] = colombiaTime.split(":").map(Number);
      // const currentHour = hours;
      // if (currentHour >= 10) {
      //   setIsVisible(true);
      // } else {
      //   setIsVisible(false);
      // }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-start sm:items-center justify-center relative overflow-hidden py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      {/* Background Image */}
      <div className="absolute inset-0 z-10">
        <Image
          src="https://26evcbcedv5nczlx.public.blob.vercel-storage.com/machu-picchu-darker-low-1x-B.jpeg"
          alt="Machu Picchu Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/80 z-15" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 z-20" />
      <div
        className="absolute inset-0 z-20"
        style={{
          background:
            "linear-gradient(135deg, #B91F2E15 0%, rgba(185, 31, 46, 0.08) 30%, transparent 50%, rgba(185, 31, 46, 0.08) 70%, #B91F2E15 100%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Content */}
      <div className="relative z-50 w-full max-w-4xl mx-auto pointer-events-auto my-6 sm:my-0">
        {/* Logo */}
        <div className="mb-6 sm:mb-8 md:mb-12 text-center">
          <Image
            src="/IA_HACK_BRAND.svg"
            alt="IA HACKATHON"
            width={200}
            height={80}
            className="h-10 sm:h-12 md:h-16 w-auto mx-auto"
            priority
          />
        </div>

        {!isVisible ? (
          <div className="space-y-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Créditos & WiFi
            </h1>
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 sm:p-8 md:p-12">
              <p className="text-white/80 text-base sm:text-lg md:text-xl mb-4 leading-relaxed">
                Esta información estará disponible a las 10:00 AM (hora de Colombia)
              </p>
              {currentTime && (
                <p className="text-white/60 text-sm sm:text-base">
                  Hora actual en Colombia: {currentTime}
                </p>
              )}
            </div>
            <Link
              href="/"
              className="inline-block text-brand-red hover:text-brand-red/80 transition-colors text-sm sm:text-base py-2"
            >
              ← Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 drop-shadow-lg text-center">
              Créditos & WiFi
            </h1>

            <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 sm:space-y-8">
              {/* WiFi */}
              <div className="space-y-3 sm:space-y-4">
                <div className="mb-2 sm:mb-3 flex justify-center sm:justify-start">
                  <svg
                    className="h-12 w-12 sm:h-16 sm:w-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                    />
                  </svg>
                </div>
                <div className="space-y-2.5 sm:space-y-3">
                  <CopyButton
                    text="Invitados"
                    label="Nombre de red"
                  />
                  <CopyButton
                    text="YOCAYETANO"
                    label="Contraseña"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-4 sm:my-6" />

              {/* v0 Credit */}
              <div className="space-y-3 sm:space-y-4">
                <div className="mb-2 sm:mb-3">
                  <Image
                    src="/v0-logo-dark.png"
                    alt="v0"
                    width={60}
                    height={60}
                    className="h-12 w-12 sm:h-16 sm:w-16 object-contain mx-auto sm:mx-0"
                  />
                </div>
                <CopyButton
                  text="IA-HACKATHON-V0"
                  label="Código para $10 en v0"
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-4 sm:my-6" />

              {/* Lovable Credit */}
              <div className="space-y-3 sm:space-y-4">
                <div className="mb-2 sm:mb-3">
                  <Image
                    src="/logo_lovable.svg"
                    alt="Lovable"
                    width={60}
                    height={60}
                    className="h-12 w-12 sm:h-16 sm:w-16 object-contain mx-auto sm:mx-0"
                  />
                </div>
                <CopyButton
                  text="STARTHackLima"
                  label="Primeras 100 personas"
                />
              </div>

              {/* Divider */}
              {/* <div className="h-px bg-white/10 my-4 sm:my-6" /> */}

              {/* Cursor Credit */}
              {/* <div className="space-y-3 sm:space-y-4">
                <div className="mb-2 sm:mb-3">
                  <Image
                    src="/logo_cursor.svg"
                    alt="Cursor"
                    width={60}
                    height={60}
                    className="h-12 w-12 sm:h-16 sm:w-16 object-contain mx-auto sm:mx-0"
                  />
                </div>
                <div className="bg-white/5 border border-white/10 p-4 sm:p-5">
                  <p className="text-white/60 text-sm sm:text-base md:text-lg">TBD</p>
                </div>
              </div> */}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/"
                className="inline-block text-brand-red hover:text-brand-red/80 transition-colors text-sm sm:text-base py-2"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
