"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function RetroCard({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative bg-card text-card-foreground font-adelle-mono",
        "border-2 border-foreground",
        "before:absolute before:inset-0 before:border-2 before:border-foreground/20 before:translate-x-1 before:translate-y-1 before:-z-10",
        "scanlines",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function RetroCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-b-2 border-foreground px-4 py-3 bg-foreground text-background",
        className
      )}
      {...props}
    />
  );
}

function RetroCardTitle({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-sm font-bold uppercase tracking-wider flex items-center gap-2",
        className
      )}
      {...props}
    >
      <span className="text-terminal-green blink">&gt;_</span>
      {children}
    </div>
  );
}

function RetroCardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-xs opacity-80 mt-1 uppercase tracking-wide", className)}
      {...props}
    />
  );
}

function RetroCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("p-4", className)}
      {...props}
    />
  );
}

function RetroCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center px-4 py-3 border-t-2 border-foreground/20", className)}
      {...props}
    />
  );
}

export {
  RetroCard,
  RetroCardHeader,
  RetroCardTitle,
  RetroCardDescription,
  RetroCardContent,
  RetroCardFooter,
};
