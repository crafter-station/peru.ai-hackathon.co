"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Download, Share2, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { useImageLikes } from "@/hooks/use-image-likes";
import type { GalleryImage } from "@/lib/schema";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  userId?: string;
}

export function ImageModal({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onIndexChange, 
  userId 
}: ImageModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Use skipRefetch=true to prevent reordering during modal viewing
  const { toggleLike } = useImageLikes(userId, true);

  const currentImage = images[currentIndex];

  // Touch handling for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      onIndexChange(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      onIndexChange(currentIndex - 1);
    }

    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handle keyboard navigation (separate from scroll management)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            onIndexChange(currentIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < images.length - 1) {
            onIndexChange(currentIndex + 1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);


  // Reset image loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  const handleDownload = async () => {
    if (!currentImage) return;

    try {
      const imageUrl = currentImage.blobUrl || currentImage.imageUrl;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `alpaca-${currentImage.id}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      // Fallback: open in new tab
      window.open(currentImage.blobUrl || currentImage.imageUrl, "_blank");
    }
  };

  const handleShare = async () => {
    if (!currentImage) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "¡Mira esta alpaca generada con IA!",
          text: `Creé esta increíble alpaca: "${currentImage.prompt}"`,
          url: currentImage.blobUrl || currentImage.imageUrl,
        });
      } else {
        await navigator.clipboard.writeText(
          `¡Mira esta alpaca generada con IA! "${currentImage.prompt}" - ${currentImage.blobUrl || currentImage.imageUrl}`
        );
        // You could add a toast notification here
        console.log("¡Enlace copiado al portapapeles!");
      }
    } catch (error) {
      console.error("Error sharing image:", error);
      window.open(currentImage.blobUrl || currentImage.imageUrl, "_blank");
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove} 
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }} // Allow vertical scrolling but handle horizontal swipes
      >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 md:top-6 md:right-6"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onIndexChange(currentIndex - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 md:left-6"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {currentIndex < images.length - 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onIndexChange(currentIndex + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 md:right-6"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Modal Content Container */}
      <div className="w-full h-full flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
        {/* Image Container - Takes most of the space */}
        <div className="flex-1 flex items-center justify-center min-h-0 relative">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={currentImage.blobUrl || currentImage.imageUrl}
              alt={currentImage.prompt}
              width={currentImage.width || 512}
              height={currentImage.height || 512}
              className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 200px)', // Reserve space for info section
              }}
              onLoad={() => setImageLoaded(true)}
              unoptimized
              priority
            />
          </div>
        </div>

        {/* Image Info and Actions - Fixed height at bottom */}
        <div className="flex-shrink-0 pt-6 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg md:text-xl font-semibold mb-4 px-2">
              &ldquo;{currentImage.prompt}&rdquo;
            </h3>
            
            <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
              {/* Like Button */}
              {userId && (
                <Button
                  variant={currentImage?.isLikedByUser ? "destructive" : "secondary"}
                  size="sm"
                  onClick={() => toggleLike(currentImage.id, currentImage?.isLikedByUser || false)}
                  disabled={false}
                  className="gap-2 min-w-[120px]"
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      currentImage?.isLikedByUser ? 'fill-current' : ''
                    }`} 
                  />
                  {currentImage?.isLikedByUser ? 'Me gusta' : 'Me gusta'}
                  {currentImage?.likeCount ? ` (${currentImage.likeCount})` : ''}
                </Button>
              )}
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="gap-2 min-w-[120px]"
              >
                <Download className="h-4 w-4" />
                Descargar
              </Button>
              
              <Button
                variant="secondary" 
                size="sm"
                onClick={handleShare}
                className="gap-2 min-w-[120px]"
              >
                <Share2 className="h-4 w-4" />
                Compartir
              </Button>
            </div>

            {/* Image Counter */}
            <p className="text-sm text-white/70">
              {currentIndex + 1} de {images.length}
            </p>
          </div>
        </div>
      </div>
      </div>
    </Portal>
  );
}
