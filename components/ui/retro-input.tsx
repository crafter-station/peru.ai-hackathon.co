"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useRetroSounds } from "@/hooks/use-click-sound";

interface RetroInputProps extends React.ComponentProps<"input"> {
  label?: string;
}

const RetroInput = React.forwardRef<HTMLInputElement, RetroInputProps>(
  ({ className, type, label, onKeyDown, onFocus, onBlur, ...props }, ref) => {
    const { playType, playClick } = useRetroSounds();
    const [isFocused, setIsFocused] = React.useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key.length === 1 || e.key === "Backspace") {
        playType();
      }
      onKeyDown?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      playClick();
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="relative">
        {label && (
          <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider mb-1 text-white/80">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-10 w-full bg-black/40 backdrop-blur-sm px-3 py-2 text-sm font-adelle-mono text-white",
              "border border-brand-red/50",
              "placeholder:text-white/50 placeholder:uppercase",
              "focus:outline-none focus:border-brand-red focus:shadow-[0_0_10px_rgba(185,31,46,0.3)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-150",
              className
            )}
            ref={ref}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {isFocused && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-red blink font-adelle-mono pointer-events-none">
              █
            </span>
          )}
        </div>
      </div>
    );
  }
);
RetroInput.displayName = "RetroInput";

export { RetroInput };
