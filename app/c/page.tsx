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
      className="group relative flex items-center gap-2 w-full bg-white/5 border border-white/10 p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-left"
    >
      <div className="flex-1">
        <p className="text-white/60 text-sm mb-1">{label}</p>
        <p className="text-brand-red font-mono text-lg md:text-xl font-bold">
          {text}
        </p>
      </div>
      <div className="flex-shrink-0">
        {copied ? (
          <div className="flex items-center gap-2 text-green-400">
            <svg
              className="w-5 h-5"
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
            <span className="text-sm font-medium">Copiado</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
            <svg
              className="w-5 h-5"
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
            <span className="text-sm">Copiar</span>
          </div>
        )}
      </div>
    </button>
  );
}

export default function CreditsPage() {
  // DEBUG: Set to true to preview the credits content
  const [isVisible, setIsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const colombiaTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Bogota",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);

      const [hours, minutes] = colombiaTime.split(":").map(Number);
      const currentHour = hours;
      const currentMinute = minutes;

      setCurrentTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Bogota",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(now)
      );

      // DEBUG: Commented out for preview - uncomment for production
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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-8 md:py-12">
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
      <div className="relative z-50 text-center px-4 md:px-8 max-w-4xl mx-auto pointer-events-auto">
        {/* Logo */}
        <div className="mb-8 md:mb-12">
          <Image
            src="/IA_HACK_BRAND.svg"
            alt="IA HACKATHON"
            width={200}
            height={80}
            className="h-12 md:h-16 w-auto mx-auto"
            priority
          />
        </div>

        {!isVisible ? (
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Créditos y WiFi
            </h1>
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-8 md:p-12">
              <p className="text-white/80 text-lg md:text-xl mb-4">
                Esta información estará disponible a las 10:00 AM (hora de Colombia)
              </p>
              {currentTime && (
                <p className="text-white/60 text-sm md:text-base">
                  Hora actual en Colombia: {currentTime}
                </p>
              )}
            </div>
            <Link
              href="/"
              className="inline-block text-brand-red hover:text-brand-red/80 transition-colors text-sm md:text-base"
            >
              ← Volver al inicio
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg">
              Créditos y WiFi
            </h1>

            <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-8 md:p-12 space-y-6">
              {/* WiFi */}
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  WiFi
                </h2>
                <div className="space-y-3">
                  <CopyButton
                    text="NETWORK_NAME"
                    label="Nombre de red"
                  />
                  <CopyButton
                    text="PASSWORD"
                    label="Contraseña"
                  />
                </div>
              </div>

              {/* v0 Credit */}
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  v0
                </h2>
                <CopyButton
                  text="IA-HACKATHON-V0"
                  label="Código para $10 en v0"
                />
              </div>

              {/* Lovable Credit */}
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Lovable
                </h2>
                <CopyButton
                  text="STARTHackLima"
                  label="Primeras 100 personas"
                />
              </div>

              {/* Cursor Credit */}
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Cursor
                </h2>
                <div className="bg-white/5 border border-white/10 p-4">
                  <p className="text-white/60 text-base md:text-lg">TBD</p>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="inline-block text-brand-red hover:text-brand-red/80 transition-colors text-sm md:text-base"
            >
              ← Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
