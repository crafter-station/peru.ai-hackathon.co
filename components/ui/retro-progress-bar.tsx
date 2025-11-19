"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RetroProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

export function RetroProgressBar({
  currentStep,
  totalSteps,
  labels,
  className,
}: RetroProgressBarProps) {
  const defaultLabels = Array.from({ length: totalSteps }, (_, i) => `LVL ${i + 1}`);
  const stepLabels = labels || defaultLabels;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-xs font-adelle-mono uppercase tracking-wider">
        <span className="text-muted-foreground">PROGRESS</span>
        <span className="text-terminal-green">
          {currentStep}/{totalSteps}
        </span>
      </div>
      
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep - 1;
          
          return (
            <motion.div
              key={index}
              className={cn(
                "flex-1 h-6 border-2 border-foreground relative overflow-hidden",
                isCompleted ? "bg-foreground" : "bg-background"
              )}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 bg-terminal-green/30"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              {isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-background text-xs font-adelle-mono font-bold">
                    ✓
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex justify-between">
        {stepLabels.map((label, index) => (
          <span
            key={index}
            className={cn(
              "text-[10px] font-adelle-mono uppercase tracking-wider",
              index < currentStep
                ? "text-foreground"
                : index === currentStep - 1
                ? "text-terminal-green"
                : "text-muted-foreground"
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
