"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";
import { useRetroSounds } from "@/hooks/use-click-sound";

const RetroRadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RetroRadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RetroRadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  const { playClick } = useRetroSounds();

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square size-5 border-2 border-foreground bg-background",
        "focus:outline-none focus-visible:border-terminal-green focus-visible:shadow-[0_0_10px_rgba(0,255,65,0.3)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-foreground",
        "transition-all duration-150",
        className
      )}
      onClick={() => playClick()}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className="size-2 bg-background" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RetroRadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RetroRadioGroup, RetroRadioGroupItem };
