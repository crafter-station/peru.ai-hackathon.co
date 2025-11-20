"use client";

import Image from "next/image";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
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
      <div className="absolute inset-0 bg-black/80 z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 z-10" />
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(135deg, #B91F2E15 0%, rgba(185, 31, 46, 0.08) 30%, transparent 50%, rgba(185, 31, 46, 0.08) 70%, #B91F2E15 100%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        <div className="max-w-3xl mx-auto py-8 px-4 flex-1">
          {children}
        </div>

        <div className="fixed bottom-0 left-0 right-0 h-6 bg-foreground/5 backdrop-blur-sm border-t border-brand-red/20 flex items-center px-4 font-adelle-mono text-[10px] uppercase tracking-wider text-white/60 z-50">
          <span>PRESS [ENTER] TO CONTINUE</span>
          <span className="ml-auto">
            <span className="text-brand-red">●</span> SYSTEM ONLINE
          </span>
        </div>
      </div>
    </div>
  );
}
