"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { useRetroSounds } from "@/hooks/use-click-sound";

const PixelCheckbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, onCheckedChange, ...props }, ref) => {
  const { playClick } = useRetroSounds();

  const handleCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
    playClick();
    onCheckedChange?.(checked);
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer size-5 shrink-0 border-2 border-foreground bg-background",
        "focus-visible:outline-none focus-visible:border-terminal-green focus-visible:shadow-[0_0_10px_rgba(0,255,65,0.3)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-foreground data-[state=checked]:text-background",
        "transition-all duration-150",
        className
      )}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <span className="font-adelle-mono font-bold text-xs">X</span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
PixelCheckbox.displayName = CheckboxPrimitive.Root.displayName;

export { PixelCheckbox };
