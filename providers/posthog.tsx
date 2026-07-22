"use client";

import posthog from "posthog-js";
import type { CaptureResult } from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState } from "react";

// Noise from crypto-wallet browser extensions (MetaMask, Coinbase Wallet, …)
// that inject into `window.ethereum`. These are EIP-1193 provider errors thrown
// by the extension, not by our app — this site has no web3 integration — so we
// drop them before ingestion to keep error tracking signal-heavy.
const WALLET_EXTENSION_NOISE = [
  /disconnected from all chains/i,
  /ProviderDisconnectedError/i,
  /ChainDisconnectedError/i,
];

function isWalletExtensionNoise(event: CaptureResult): boolean {
  if (event.event !== "$exception") {
    return false;
  }

  const exceptionList = event.properties?.$exception_list;
  if (!Array.isArray(exceptionList)) {
    return false;
  }

  return exceptionList.some((exception) => {
    const value = typeof exception?.value === "string" ? exception.value : "";
    const type = typeof exception?.type === "string" ? exception.type : "";
    return WALLET_EXTENSION_NOISE.some(
      (pattern) => pattern.test(value) || pattern.test(type),
    );
  });
}

function beforeSend(event: CaptureResult | null): CaptureResult | null {
  if (event && isWalletExtensionNoise(event)) {
    return null;
  }
  return event;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest";

    if (apiKey && typeof window !== "undefined") {
      posthog.init(apiKey, {
        api_host: apiHost,
        ui_host: "https://us.posthog.com",
        defaults: "2025-05-24",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        capture_exceptions: true,
        before_send: beforeSend,
        session_recording: {
          recordCrossOriginIframes: true,
          maskAllInputs: false,
          maskTextSelector: ".sensitive",
        },
        debug: process.env.NODE_ENV === "development",
        loaded: () => {
          setIsInitialized(true);
          if (process.env.NODE_ENV === "development") {
            console.log("PostHog initialized successfully");
          }
        },
      });
    } else {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "PostHog API key not found. Set NEXT_PUBLIC_POSTHOG_KEY in your .env file",
        );
      }
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}