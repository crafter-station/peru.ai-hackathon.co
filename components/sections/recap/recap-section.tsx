"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const VIDEO_URL =
  "https://26evcbcedv5nczlx.public.blob.vercel-storage.com/PE-AI-HACK-RecapVideo-1920X1080.mp4";
const PHOTOS_URL = "https://photos.app.goo.gl/QYqbFy4FB4r16adv6";
const SUBMISSIONS_URL = "https://www.letsacc.com/challenges/peru-ia-hackathon-2025";

export default function RecapSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Extract a frame from the video at 2 seconds as thumbnail
  useEffect(() => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = VIDEO_URL;
    video.muted = true;
    
    video.addEventListener("loadeddata", () => {
      video.currentTime = 2; // Seek to 2 seconds for a better frame
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL("image/jpeg", 0.8));
      }
      video.remove();
    });

    video.load();

    return () => {
      video.remove();
    };
  }, []);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section id="recap" className="bg-background dither-bg border-t min-h-screen px-4 md:px-6 relative overflow-hidden flex items-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-brand-red/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-brand-red/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-red/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full pb-12 md:pb-20">
        {/* Section Title */}
        <div className="text-center mb-2 md:mb-4">
          <div className="inline-flex items-center gap-3 mb-1">
            <div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
            <span className="text-brand-red text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
              ¡GRACIAS POR PARTICIPAR!
            </span>
            <div className="h-px bg-brand-red/40 w-16 md:w-24"></div>
          </div>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-none uppercase text-white">
            RECAP DEL EVENTO
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Revive los mejores momentos del IA Hackathon Perú 2025
          </p>
        </div>

        {/* Video Section */}
        <div className="mb-12 md:mb-16">
          <div className="relative aspect-video max-w-5xl mx-auto overflow-hidden border-2 border-brand-red/20 bg-black/50 group">
            {/* Loading shimmer while thumbnail generates */}
            {!thumbnail && !isPlaying && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-white/5 to-black/50 animate-pulse" />
            )}
            
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              controls={isPlaying}
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              poster={thumbnail || undefined}
            >
              <source src={VIDEO_URL} type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>

            {/* Play Button Overlay */}
            {!isPlaying && (
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors cursor-pointer group"
                aria-label="Reproducir video"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-red/90 hover:bg-brand-red flex items-center justify-center transition-all group-hover:scale-110">
                  <svg
                    className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-red/40 pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-red/40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-red/40 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-red/40 pointer-events-none" />
          </div>
        </div>

        {/* CTA Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Photos Card */}
          <a
            href={PHOTOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden bg-gradient-to-br from-background/90 to-background/50 border-2 border-foreground/10 backdrop-blur-sm p-6 md:p-8 hover:border-brand-red/30 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-red/5 blur-3xl opacity-50" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <span className="text-xs font-mono tracking-widest text-brand-red/60 uppercase">
                  Galería
                </span>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-red/10 border-2 border-brand-red/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-brand-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                Fotos del Evento
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm mb-4">
                Explora todas las fotos capturadas durante el hackathon
              </p>

              <div className="flex items-center gap-2 text-brand-red font-medium text-sm group-hover:gap-3 transition-all">
                <span>Ver galería</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          </a>

          {/* Participants Card */}
          <Link
            href="/participants"
            className="group relative overflow-hidden bg-gradient-to-br from-background/90 to-background/50 border-2 border-foreground/10 backdrop-blur-sm p-6 md:p-8 hover:border-brand-red/30 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-red/5 blur-3xl opacity-50" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <span className="text-xs font-mono tracking-widest text-brand-red/60 uppercase">
                  Comunidad
                </span>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-red/10 border-2 border-brand-red/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-brand-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                Participantes
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm mb-4">
                Conoce a todos los participantes del hackathon
              </p>

              <div className="flex items-center gap-2 text-brand-red font-medium text-sm group-hover:gap-3 transition-all">
                <span>Ver participantes</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Submissions Card */}
          <a
            href={SUBMISSIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden bg-gradient-to-br from-red-950/40 via-background/90 to-background/50 border-2 border-brand-red/30 backdrop-blur-sm p-6 md:p-8 hover:border-brand-red/50 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-red/5 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4 md:mb-6">
                <span className="text-xs font-mono tracking-widest text-brand-red/70 uppercase">
                  Proyectos
                </span>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-red/15 border-2 border-brand-red/30 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-brand-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                Ver Proyectos
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm mb-4">
                Descubre los proyectos presentados
              </p>

              <div className="flex items-center gap-2 text-brand-red font-medium text-sm group-hover:gap-3 transition-all">
                <span>Ver submissions</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Bottom message */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-red/30 bg-brand-red/5">
            <svg
              className="w-5 h-5 text-brand-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm md:text-base font-semibold text-foreground/80">
              ¡Nos vemos en la próxima edición!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
