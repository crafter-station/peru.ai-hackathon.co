"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useRetroSounds } from "@/hooks/use-click-sound";

const pixelButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-adelle-mono font-bold uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none pixel-press border-2",
  {
    variants: {
      variant: {
        default: "bg-brand-red text-white border-brand-red hover:bg-brand-red/90",
        secondary: "bg-black/40 backdrop-blur-sm text-white border-brand-red/50 hover:bg-black/60",
        destructive: "bg-destructive text-white border-destructive hover:bg-destructive/90",
        ghost: "bg-transparent border-transparent hover:bg-black/40 hover:border-brand-red/30 text-white",
        terminal: "bg-black text-brand-red border-brand-red hover:bg-brand-red/10",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pixelButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const PixelButton = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, onClick, onMouseEnter, ...props }, ref) => {
    const { playClick, playHover } = useRetroSounds();
    const Comp = asChild ? Slot : "button";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playClick();
      onClick?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      playHover();
      onMouseEnter?.(e);
    };

    return (
      <Comp
        className={cn(pixelButtonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4">
              <span className="loading-dots">LOADING</span>
            </span>
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
PixelButton.displayName = "PixelButton";

export { PixelButton, pixelButtonVariants };
