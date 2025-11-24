"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRetroSounds } from "@/hooks/use-click-sound";

interface TerminalTextProps {
  text: string;
  className?: string;
  speed?: number;
  showCursor?: boolean;
  onComplete?: () => void;
  delay?: number;
}

export function TerminalText({
  text,
  className,
  speed = 50,
  showCursor = true,
  onComplete,
  delay = 0,
}: TerminalTextProps) {
  const [displayedText, setDisplayedText] = React.useState("");
  const [isComplete, setIsComplete] = React.useState(false);
  const { playType } = useRetroSounds();

  React.useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          if (text[currentIndex] !== " ") {
            playType();
          }
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete, playType]);

  return (
    <span className={cn("font-adelle-mono", className)}>
      {displayedText}
      {showCursor && !isComplete && (
        <motion.span
          className="text-terminal-green"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          █
        </motion.span>
      )}
      {showCursor && isComplete && (
        <span className="text-terminal-green blink">█</span>
      )}
    </span>
  );
}

export function GlitchText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block glitch", className)}>
      {children}
    </span>
  );
}
