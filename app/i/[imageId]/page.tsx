"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CometCard } from "@/components/ui/comet-card";
import { Download, Share2, ArrowLeft, Sparkles } from "lucide-react";
import type { GalleryImage } from "@/lib/schema";

export default function SharedImagePage() {
  const params = useParams();
  const router = useRouter();
  const [image, setImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const imageId = params.imageId as string;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/gallery/${imageId}`);
        if (!response.ok) {
          throw new Error("Image not found");
        }
        const imageData = await response.json();
        setImage(imageData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading image");
      } finally {
        setLoading(false);
      }
    };

    if (imageId) {
      fetchImage();
    }
  }, [imageId]);

  const handleDownload = async () => {
    if (!image) return;

    try {
      const imageUrl = image.blobUrl || image.imageUrl;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `alpaca-${image.id}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      window.open(image.blobUrl || image.imageUrl, "_blank");
    }
  };

  const handleShare = async () => {
    if (!image) return;
    
    const shareUrl = `${window.location.origin}/i/${image.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "¡Mira esta alpaca generada con IA!",
          text: `Creé esta increíble alpaca: "${image.prompt}" en IA Hackathon Perú`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(
          `¡Mira esta alpaca generada con IA! "${image.prompt}" - ${shareUrl} #IAHackathonPeru`
        );
        alert("¡Enlace copiado al portapapeles!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Imagen No Encontrada</h1>
        <p className="text-gray-300 mb-8">La imagen que buscas no existe.</p>
        <Link href="/tta">
          <Button className="bg-white text-black hover:bg-gray-200">
            <Sparkles className="w-4 h-4 mr-2" />
            Crea Tu Propia Alpaca
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Regresar
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Link href="/tta">
          <Button className="bg-white text-black hover:bg-gray-200">
            <Sparkles className="w-4 h-4 mr-2" />
            Crea la Tuya
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-20">
        <div className="max-w-lg w-full text-center">


          {/* Image Card */}
          <CometCard className="mb-6">
            <div className="flex w-full flex-col items-stretch bg-[#1F2121] p-3 md:p-4">
              <div className="mx-2 flex-1">
                <div className="relative mt-2 aspect-[3/4] w-full">
                  <Image
                    src={image.blobUrl || image.imageUrl}
                    alt={image.prompt}
                    fill
                    className="bg-[#000000] object-cover"
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                    }}
                    priority
                    unoptimized
                  />
                </div>
              </div>
              <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                <div className="text-xs">Alpaca IA</div>
                <div className="text-xs text-gray-300 opacity-50">#GEN</div>
              </div>
            </div>
          </CometCard>

          {/* Prompt Display */}
          <div className="mb-6 p-3 md:p-4 bg-black/50 border border-gray-600 text-left">
            <p className="text-sm md:text-base text-gray-300">
              <span className="font-semibold text-white">Prompt:</span> {image.prompt}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8">
            <Button
              onClick={handleDownload}
              className="h-12 px-6 text-base font-semibold bg-white text-black hover:bg-gray-200"
            >
              <Download className="w-5 h-5 mr-2" />
              Descargar
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="h-12 px-6 text-base font-semibold bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartir
            </Button>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link href="/tta">
              <Button 
                size="lg"
                className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Crea Tu Propia Alpaca con IA
              </Button>
            </Link>
            
          </div>

          
        </div>
      </div>
    </div>
  );
}
