"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const targetDate = new Date("2025-11-29T09:00:00-05:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black" />
      
      <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-transparent to-brand-red/10 opacity-50" />
      
      <div
        className="absolute inset-0 dither-bg opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(185, 31, 46, 0.08) 1px, transparent 1px)',
          backgroundSize: '8px 8px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div
          className={`
            text-center transition-all duration-1000 transform
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-12 tracking-wider uppercase font-adelle-mono"
            style={{ textShadow: "2px 2px 8px rgba(185, 31, 46, 0.5)" }}
          >
            Cuenta Regresiva
          </h2>

          <div className="flex flex-wrap justify-center gap-3 md:gap-6 max-w-4xl mx-auto">
            <div
              className={`
                relative transition-all duration-1000 transform
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-8 hover:bg-white/10 hover:border-brand-red/30 transition-all duration-300 min-w-[70px] md:min-w-[120px]">
                <div className="text-4xl md:text-6xl font-bold text-white mb-1 md:mb-2 font-adelle-mono-flex tabular-nums">
                  {String(timeLeft.days).padStart(2, "0")}
                </div>
                <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest font-adelle-mono">
                  Días
                </div>
              </div>
            </div>

            <div
              className={`
                relative transition-all duration-1000 transform
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-8 hover:bg-white/10 hover:border-brand-red/30 transition-all duration-300 min-w-[70px] md:min-w-[120px]">
                <div className="text-4xl md:text-6xl font-bold text-white mb-1 md:mb-2 font-adelle-mono-flex tabular-nums">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest font-adelle-mono">
                  Horas
                </div>
              </div>
            </div>

            <div
              className={`
                relative transition-all duration-1000 transform
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-8 hover:bg-white/10 hover:border-brand-red/30 transition-all duration-300 min-w-[70px] md:min-w-[120px]">
                <div className="text-4xl md:text-6xl font-bold text-white mb-1 md:mb-2 font-adelle-mono-flex tabular-nums">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest font-adelle-mono">
                  Minutos
                </div>
              </div>
            </div>

            <div
              className={`
                relative transition-all duration-1000 transform
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-8 hover:bg-white/10 hover:border-brand-red/30 transition-all duration-300 min-w-[70px] md:min-w-[120px]">
                <div className="text-4xl md:text-6xl font-bold text-brand-red mb-1 md:mb-2 font-adelle-mono-flex tabular-nums">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-[10px] md:text-sm text-gray-400 uppercase tracking-widest font-adelle-mono">
                  Segundos
                </div>
              </div>
            </div>
          </div>

          <div
            className={`
              mt-10 md:mt-12 transition-all duration-1000 transform
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="inline-block bg-brand-red/10 border border-brand-red/30 rounded-lg px-6 py-4 backdrop-blur-sm">
              <p className="text-lg md:text-xl text-white font-semibold mb-1">
                <span className="text-brand-red font-bold">29 de Noviembre, 2025</span> • 9:00 AM
              </p>
              <p className="text-sm md:text-base text-gray-300 font-adelle-mono">
                El futuro de la IA en el Perú comienza aquí
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
