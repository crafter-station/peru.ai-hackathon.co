"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface PixelConfettiProps {
  isActive: boolean;
  particleCount?: number;
}

const BRAND_COLORS = [
  "#B91F2E", // brand-red
  "#A01B26", // brand-red-dark
  "#D62E3B", // brand-red-light
  "#00ff41", // terminal-green
  "#ffb000", // terminal-amber
];

const PIXEL_SIZES = [8, 10, 12, 14, 16];

function getPixelShadow(color: string) {
  const isDark = color === "#A01B26" || color === "#B91F2E";
  const isGreen = color === "#00ff41";
  const isAmber = color === "#ffb000";
  
  if (isDark) {
    return `2px 2px 0 rgba(0,0,0,0.3), inset -1px -1px 0 rgba(255,255,255,0.1)`;
  }
  if (isGreen) {
    return `2px 2px 0 rgba(0,0,0,0.3), inset -1px -1px 0 rgba(0,255,65,0.3)`;
  }
  if (isAmber) {
    return `2px 2px 0 rgba(0,0,0,0.3), inset -1px -1px 0 rgba(255,176,0,0.3)`;
  }
  return `2px 2px 0 rgba(0,0,0,0.3)`;
}

export function PixelConfetti({ isActive, particleCount = 60 }: PixelConfettiProps) {
  const [windowHeight, setWindowHeight] = React.useState(0);

  React.useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isActive || windowHeight === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => {
        const color = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
        const size = PIXEL_SIZES[Math.floor(Math.random() * PIXEL_SIZES.length)];
        const startX = Math.random() * 100;
        const driftAmount = (Math.random() - 0.5) * 300;
        const duration = 2.5 + Math.random() * 2;
        const delay = Math.random() * 0.8;
        const rotationSteps = [0, 90, 180, 270][Math.floor(Math.random() * 4)];

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              border: `1px solid rgba(0,0,0,0.3)`,
              left: `${startX}%`,
              imageRendering: "pixelated",
              WebkitImageRendering: "pixelated",
              msImageRendering: "pixelated",
              boxShadow: getPixelShadow(color),
            } as React.CSSProperties}
            initial={{
              y: -size,
              opacity: 1,
              rotate: 0,
              scale: 1,
            }}
            animate={{
              y: windowHeight + size,
              opacity: [1, 1, 1, 0.7, 0],
              rotate: rotationSteps,
              x: driftAmount,
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{
              duration,
              delay,
              ease: [0.42, 0, 0.58, 1],
              times: [0, 0.2, 0.5, 0.8, 1],
            }}
          />
        );
      })}
    </div>
  );
}
