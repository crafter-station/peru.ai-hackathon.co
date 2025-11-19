"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useRetroSounds } from "@/hooks/use-click-sound";

interface RetroInputProps extends React.ComponentProps<"input"> {
  label?: string;
}

const RetroInput = React.forwardRef<HTMLInputElement, RetroInputProps>(
  ({ className, type, label, onKeyDown, onFocus, ...props }, ref) => {
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

    return (
      <div className="relative">
        {label && (
          <label className="block text-xs font-adelle-mono font-bold uppercase tracking-wider mb-1 text-muted-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-10 w-full bg-background px-3 py-2 text-sm font-adelle-mono",
              "border-2 border-foreground",
              "placeholder:text-muted-foreground placeholder:uppercase",
              "focus:outline-none focus:border-terminal-green focus:shadow-[0_0_10px_rgba(0,255,65,0.3)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-150",
              className
            )}
            ref={ref}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {isFocused && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-green blink font-adelle-mono">
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
