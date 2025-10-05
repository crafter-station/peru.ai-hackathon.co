"use client";

import { useGallery } from "@/hooks/use-gallery";
import { Button } from "@/components/ui/button";
import { PlusCircle, Images } from "lucide-react";

export function GalleryHeader() {
  const { images, isLoading } = useGallery();

  return (
    <div className="flex flex-col gap-6 text-center mb-12">
      <div className="flex items-center justify-center gap-3">
        <Images className="h-8 w-8 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Galería de Alpacas IA
        </h1>
      </div>

      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Descubre la increíble colección de alpacas generadas por inteligencia artificial.
        Cada una es única y creada con creatividad y tecnología.
      </p>

      {!isLoading && (
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>{images.length} alpacas creadas</span>
          <span>•</span>
          <span>Actualizándose en tiempo real</span>
        </div>
      )}

      <div className="flex items-center justify-center">
        <Button asChild size="lg" className="gap-2">
          <a href="/tta">
            <PlusCircle className="h-5 w-5" />
            Crear mi alpaca
          </a>
        </Button>
      </div>
    </div>
  );
}
