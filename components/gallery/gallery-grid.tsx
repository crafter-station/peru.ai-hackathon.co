"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGallery } from "@/hooks/use-gallery";
import { useImageDimensions } from "@/hooks/use-image-dimensions";
import { useAnonymousUser } from "@/hooks/use-anonymous-user";
import { useImageLikes } from "@/hooks/use-image-likes";
import { ImageModal } from "./image-modal";
import { Button } from "@/components/ui/button";
import { Loader2, Heart } from "lucide-react";
import type { GalleryImage } from "@/lib/schema";

interface AlbumPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
  title?: string;
  key: string;
  photoIndex: number;
}

export function GalleryGrid() {
  const anonymousUser = useAnonymousUser();
  const userId = anonymousUser?.userId || undefined;
  
  const {
    images,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGallery(userId);
  
  const { toggleLike } = useImageLikes(userId, true);
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Get image URLs for dimension measurement
  const imageUrls = images.map(image => image.blobUrl || image.imageUrl);
  
  // Measure image dimensions dynamically
  const { dimensionsByUrl, isLoading: isDimensionsLoading } = useImageDimensions(imageUrls);

  // Convert gallery images to photo album format with measured dimensions
  const photos: AlbumPhoto[] = images.map((image: GalleryImage, index: number) => {
    const src = image.blobUrl || image.imageUrl;
    const measured = dimensionsByUrl[src];
    const width = measured?.width ?? image.width ?? 800;
    const height = measured?.height ?? image.height ?? 600;
    
    return {
      src,
      width,
      height,
      alt: image.prompt,
      title: image.prompt,
      key: image.id.toString(),
      photoIndex: index,
    };
  });

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if ((isLoading || isDimensionsLoading) && images.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando galería...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-destructive text-center">
          <h3 className="font-semibold mb-2">Error al cargar la galería</h3>
          <p className="text-sm opacity-80">
            {error instanceof Error ? error.message : "Error desconocido"}
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="text-muted-foreground">
          <h3 className="font-semibold mb-2">No hay alpacas en la galería</h3>
          <p className="text-sm">¡Sé el primero en crear una alpaca con IA!</p>
        </div>
        <Button asChild>
          <a href="/text-to-alpaca">Crear mi alpaca</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-max">
        {photos.map((photo, index) => {
          const currentImage = images[index];
          return (
            <div
              key={photo.key}
              className="group relative overflow-hidden rounded-lg bg-muted cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                aspectRatio: `${photo.width} / ${photo.height}`,
              }}
              onClick={() => {
                setSelectedImageIndex(index);
                setModalOpen(true);
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt || 'Generated alpaca'}
                width={photo.width}
                height={photo.height}
                className="w-full h-full object-cover"
                unoptimized
              />
              {photo.src.startsWith('blob:') && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              
              {/* Combined Like Button with Counter - Top Left */}
              <div className="absolute top-2 left-2 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 min-w-8 rounded-full transition-all duration-200 flex items-center gap-1 bg-black/60 hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (userId) {
                      toggleLike(currentImage.id, currentImage?.isLikedByUser || false);
                    }
                  }}
                  disabled={!userId}
                >
                  <Heart 
                    className={`h-4 w-4 transition-colors duration-200 ${
                      currentImage?.isLikedByUser 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-white'
                    }`} 
                  />
                  {(currentImage?.likeCount || 0) > 0 && (
                    <span className="text-xs font-medium text-white">
                      {currentImage.likeCount}
                    </span>
                  )}
                </Button>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-3">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-sm font-medium leading-tight">
                    {photo.title || photo.alt || "Generated alpaca"}
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    Click para ampliar
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={images}
        currentIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
        userId={userId}
      />

      {/* Load more trigger */}
      <div
        ref={loadMoreRef}
        className="flex items-center justify-center py-8"
      >
        {isFetchingNextPage && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Cargando más alpacas...</span>
          </div>
        )}
        {hasNextPage && !isFetchingNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            variant="outline"
          >
            Cargar más alpacas
          </Button>
        )}
        {!hasNextPage && images.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Es todo por ahora...
          </p>
        )}
      </div>
    </div>
  );
}
