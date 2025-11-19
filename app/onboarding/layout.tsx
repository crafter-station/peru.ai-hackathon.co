"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("retro-sounds-muted");
    if (stored === "true") {
      setIsMuted(true);
    }
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem("retro-sounds-muted", String(newValue));
      return newValue;
    });
  };

  return (
    <div className="min-h-screen bg-background retro-grid">
      <div className="fixed top-0 left-0 right-0 h-8 bg-foreground text-background flex items-center px-4 font-adelle-mono text-xs uppercase tracking-wider z-50">
        <span className="text-terminal-green mr-2">&gt;</span>
        <span>SYSTEM_BOOT</span>
        <span className="mx-2">/</span>
        <span>IA_HACKATHON_2025.exe</span>
        <span className="ml-auto flex items-center gap-2">
          <span className="opacity-60">v1.0.0</span>
          <button
            onClick={toggleMute}
            className="p-1 hover:bg-background/20 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="size-3" />
            ) : (
              <Volume2 className="size-3" />
            )}
          </button>
        </span>
      </div>

      <div className="max-w-3xl mx-auto py-8 px-4 pt-16">
        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-6 bg-foreground/5 border-t border-foreground/10 flex items-center px-4 font-adelle-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>PRESS [ENTER] TO CONTINUE</span>
        <span className="ml-auto">
          <span className="text-terminal-green">●</span> SYSTEM ONLINE
        </span>
      </div>
    </div>
  );
}
