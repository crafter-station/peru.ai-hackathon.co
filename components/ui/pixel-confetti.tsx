"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface PixelConfettiProps {
  isActive: boolean;
  particleCount?: number;
}

const COLORS = ["#00ff41", "#ffb000", "#ff0080", "#00ffff", "#ff00ff", "#ffff00"];

export function PixelConfetti({ isActive, particleCount = 50 }: PixelConfettiProps) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2"
          style={{
            backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
            left: `${Math.random() * 100}%`,
          }}
          initial={{
            y: -20,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: window.innerHeight + 20,
            opacity: [1, 1, 0],
            rotate: Math.random() * 360,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
