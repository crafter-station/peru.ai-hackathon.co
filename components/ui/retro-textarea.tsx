"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useRetroSounds } from "@/hooks/use-click-sound";

const RetroTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, onKeyDown, onFocus, ...props }, ref) => {
  const { playType, playClick } = useRetroSounds();
  const [isFocused, setIsFocused] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key.length === 1 || e.key === "Backspace") {
      playType();
    }
    onKeyDown?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    playClick();
    onFocus?.(e);
  };

  return (
    <div className="relative">
      <textarea
        className={cn(
          "flex min-h-[80px] w-full bg-background px-3 py-2 text-sm font-adelle-mono",
          "border-2 border-foreground",
          "placeholder:text-muted-foreground placeholder:uppercase",
          "focus:outline-none focus:border-terminal-green focus:shadow-[0_0_10px_rgba(0,255,65,0.3)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-150 resize-none",
          className
        )}
        ref={ref}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {isFocused && (
        <span className="absolute right-3 bottom-3 text-terminal-green blink font-adelle-mono text-sm">
          █
        </span>
      )}
    </div>
  );
});
RetroTextarea.displayName = "RetroTextarea";

export { RetroTextarea };
