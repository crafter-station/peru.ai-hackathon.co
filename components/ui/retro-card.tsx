"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function RetroCard({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative bg-black/60 backdrop-blur-sm text-white font-adelle-mono",
        "border border-brand-red",
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
        "border-b border-brand-red px-6 py-4 bg-brand-red/10 text-white",
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
        "text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-white",
        className
      )}
      {...props}
    >
      <span className="text-brand-red blink">&gt;_</span>
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
      className={cn("p-6", className)}
      {...props}
    />
  );
}

function RetroCardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center px-6 py-4 border-t border-brand-red/30", className)}
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
