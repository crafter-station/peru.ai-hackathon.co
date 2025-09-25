"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CountdownState = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isPast: boolean;
};

function calculateTimeLeft(target: number): CountdownState {
  const now = Date.now();
  const distance = target - now;

  if (distance <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      isPast: true,
    };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    isPast: false,
  };
}

export default function DetailsSection() {
  const eventTimestamp = useRef<number>(
    new Date("2025-11-29T09:00:00-05:00").getTime()
  );
  const [timeLeft, setTimeLeft] = useState<CountdownState>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isPast: false,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const updateCountdown = () => calculateTimeLeft(eventTimestamp.current);

    setTimeLeft(updateCountdown());

    const timerId = window.setInterval(() => {
      setTimeLeft((current) => {
        const next = updateCountdown();
        if (!current.isPast && next.isPast) {
          clearInterval(timerId);
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <section
      id="details"
      className="min-h-screen py-20 px-4 md:px-8 bg-background dither-bg relative"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Detalles del Evento
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre el IA Hackathon Peru 2025
          </p>
        </div>

        {isClient && !timeLeft.isPast && (
          <div className="flex justify-center mb-14">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 rounded-2xl bg-brand-red/5 backdrop-blur-sm border border-brand-red/20 shadow-lg">
              <span className="text-xs uppercase tracking-[0.3em] text-brand-red/80">
                Cuenta regresiva
              </span>
              <div className="flex gap-4">
                {[
                  {
                    label: "Días",
                    value: timeLeft.days,
                  },
                  {
                    label: "Horas",
                    value: timeLeft.hours,
                  },
                  {
                    label: "Minutos",
                    value: timeLeft.minutes,
                  },
                  {
                    label: "Segundos",
                    value: timeLeft.seconds,
                  },
                ].map((segment) => (
                  <div key={segment.label} className="text-center">
                    <div className="text-3xl font-semibold text-foreground">
                      {segment.value}
                    </div>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {segment.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Event Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Date and Time */}
          <Card className="border-2 hover:border-brand-red/50 transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-brand-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Fechas
                </h3>
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="text-brand-red border-brand-red"
                  >
                    29 - 30 Noviembre 2025
                  </Badge>
                  <p className="text-muted-foreground">Viernes y Sábado</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-2 hover:border-brand-red/50 transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-brand-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Ubicación
                </h3>
                <p className="text-muted-foreground">Lima, Perú</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ubicación exacta por confirmar
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Information */}
        <Card className="border-2">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-brand-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-1">Duración</h4>
                <p className="text-muted-foreground text-sm">
                  24 horas de innovación
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-brand-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-1">Enfoque</h4>
                <p className="text-muted-foreground text-sm">
                  Inteligencia Artificial
                </p>
              </div>

              <div>
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-brand-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-foreground mb-1">Premios</h4>
                <p className="text-muted-foreground text-sm">Por confirmar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            ¿Listo para ser parte de la innovación en IA?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-brand-red text-white font-semibold hover:bg-brand-red/90 transition-colors duration-300"
            >
              <a
                href="https://chat.whatsapp.com/H6RV2cFfL47CCXVzVmHedR?mode=ems_share_t"
                target="_blank"
                rel="noopener noreferrer"
              >
                Únete al WhatsApp
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const faqSection = document.getElementById("faq");
                if (faqSection) {
                  faqSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="border-2 border-brand-red text-brand-red font-semibold hover:bg-brand-red/5 transition-colors duration-300"
            >
              Más Información
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
