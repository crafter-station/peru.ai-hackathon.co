"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import { useRetroSounds } from "@/hooks/use-click-sound";

const RetroSelect = SelectPrimitive.Root;

const RetroSelectGroup = SelectPrimitive.Group;

const RetroSelectValue = SelectPrimitive.Value;

const RetroSelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { playClick } = useRetroSounds();

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between bg-background px-3 py-2",
        "border-2 border-foreground font-adelle-mono text-sm uppercase",
        "placeholder:text-muted-foreground",
        "focus:outline-none focus:border-terminal-green focus:shadow-[0_0_10px_rgba(0,255,65,0.3)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[&>span]:line-clamp-1",
        className
      )}
      onClick={() => playClick()}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <span className="font-adelle-mono text-xs">▼</span>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
RetroSelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const RetroSelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
        "bg-background border-2 border-foreground font-adelle-mono",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
RetroSelectContent.displayName = SelectPrimitive.Content.displayName;

const RetroSelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  const { playHover } = useRetroSounds();

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center py-2 px-3 text-sm uppercase outline-none",
        "focus:bg-foreground focus:text-background",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onMouseEnter={() => playHover()}
      {...props}
    >
      <span className="absolute left-1 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <span className="font-bold">&gt;</span>
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
RetroSelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  RetroSelect,
  RetroSelectGroup,
  RetroSelectValue,
  RetroSelectTrigger,
  RetroSelectContent,
  RetroSelectItem,
};
