"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PromoBannerProps {
  id: string;
  text: string;
  linkText: string;
  linkUrl: string;
  delay?: number;
  dismissible?: boolean;
}

export function PromoBanner({
  id,
  text,
  linkText,
  linkUrl,
  delay = 1000,
  dismissible = true,
}: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const storageKey = `promo-banner-dismissed-${id}`;
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed) {
      setTimeout(() => setIsVisible(true), delay);
    }
  }, [id, delay]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    const storageKey = `promo-banner-dismissed-${id}`;
    localStorage.setItem(storageKey, "true");
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed banner */}
      {!isDismissed && (
        <div
          className={`transition-all duration-500 ease-out ${
            isVisible ? "h-[48px] md:h-[40px]" : "h-0"
          }`}
          aria-hidden="true"
        />
      )}
      
      {/* Fixed banner that stays at top when scrolling */}
      {!isDismissed && (
        <div
          className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-gradient-to-r from-brand-red/10 via-background/95 to-brand-red/10 backdrop-blur-sm border-b-2 border-brand-red/30 md:border-b md:border-edge/50 shadow-lg md:shadow-sm md:bg-background/95">
            <div className="max-w-7xl mx-auto px-4 py-3 md:py-2.5">
              <div className="flex items-center justify-center gap-2 md:gap-3 text-sm font-semibold md:text-xs md:font-normal flex-wrap">
                <span className="text-foreground md:text-muted-foreground/70">{text}</span>
                <Link
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red font-bold md:font-medium md:text-brand-red/70 hover:text-brand-red/90 transition-all duration-200 underline decoration-2 decoration-brand-red/60 hover:decoration-brand-red underline-offset-2 px-2 py-1 rounded-md bg-brand-red/5 hover:bg-brand-red/10 md:bg-transparent md:hover:bg-transparent md:px-0 md:py-0"
                >
                  {linkText}
                </Link>
                {dismissible && (
                  <button
                    onClick={handleDismiss}
                    className="ml-1 text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors p-1 -mr-1 rounded-sm hover:bg-muted/30"
                    aria-label="Cerrar banner"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
