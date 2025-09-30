"use client";

import dynamic from "next/dynamic";
import { AnonymousUserProvider } from "@/contexts/anonymous-user-context";

const TextToAlpacaClient = dynamic(() => import("@/components/text-to-alpaca/text-to-alpaca-client"), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-black"><div className="text-white">Cargando...</div></div>
});

export default function TextToAlpacaPage() {
  return (
    <AnonymousUserProvider>
      <TextToAlpacaClient />
    </AnonymousUserProvider>
  );
}