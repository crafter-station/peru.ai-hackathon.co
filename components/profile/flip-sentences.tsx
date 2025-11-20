"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function FlipSentences({
  className,
  sentences,
}: {
  className?: string;
  sentences: string[];
}) {
  const [currentSentence, setCurrentSentence] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentSentence((prev) => (prev + 1) % sentences.length);
    }, 2500);
  }, [sentences.length]);

  useEffect(() => {
    startAnimation();

    const abortController = new AbortController();
    const { signal } = abortController;

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.visibilityState !== "visible" && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        } else if (document.visibilityState === "visible") {
          setCurrentSentence((prev) => (prev + 1) % sentences.length);
          startAnimation();
        }
      },
      { signal }
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      abortController.abort();
    };
  }, [sentences, startAnimation]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.p
        key={`current-sentence-${currentSentence}`}
        className={cn(
          "font-mono text-sm text-balance text-muted-foreground select-none",
          className
        )}
        initial={{
          y: 8,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: -8,
          opacity: 0,
        }}
        transition={{
          duration: 0.3,
          ease: "linear",
        }}
      >
        {sentences[currentSentence]}
      </motion.p>
    </AnimatePresence>
  );
}

