import { Slot } from "@radix-ui/react-slot";
import React from "react";

import { cn } from "@/lib/utils";

function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "screen-line-before screen-line-after border-x border-edge border-x-[1.5px]",
        "relative",
        "before:bg-gradient-to-r before:from-transparent before:via-edge/70 before:to-transparent before:shadow-[0_1px_0_0_rgba(0,0,0,0.03)]",
        "after:bg-gradient-to-r after:from-transparent after:via-edge/70 after:to-transparent after:shadow-[0_-1px_0_0_rgba(0,0,0,0.03)]",
        className
      )}
      {...props}
    />
  );
}

function PanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header"
      className={cn(
        "screen-line-after px-4",
        "after:bg-gradient-to-r after:from-transparent after:via-edge/80 after:to-transparent",
        "after:shadow-[0_1px_0_0_rgba(0,0,0,0.05)]",
        className
      )}
      {...props}
    />
  );
}

function PanelTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h2"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "h2";

  return (
    <Comp
      data-slot="panel-title"
      className={cn("text-3xl font-black uppercase tracking-tight", className)}
      {...props}
    />
  );
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="panel-body" className={cn("p-4", className)} {...props} />
  );
}

export { Panel, PanelContent, PanelHeader, PanelTitle };

