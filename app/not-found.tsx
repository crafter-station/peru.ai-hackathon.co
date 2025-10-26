"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-6">
      <h1 className="text-5xl md:text-6xl font-black mb-3 text-foreground">
        404 🦙
      </h1>

      <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-md">
        Ups... esta alpaca no encontró la página que buscabas.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/" passHref>
          <Button
            variant="outline"
            size="default"
            className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white transition-all w-full"
          >
            Volver al inicio
          </Button>
        </Link>

        <Link
          href="/tta"
          target="_blank"
          rel="noopener noreferrer"
          passHref
        >
          <Button
            variant="outline"
            size="default"
            className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white transition-all w-full"
          >
            Genera tu alpaca
          </Button>
        </Link>
      </div>
    </div>
  );
}
