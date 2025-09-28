import { useState } from "react";

interface GeneratedImage {
  url: string;
  prompt: string;
  description: string;
}

export const useImageGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new globalThis.Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  };

  const generateImage = async (prompt: string, onSuccess?: () => void) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setGeneratedImage(null);
    setImageLoaded(false);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 96) {
          return Math.min(prev + 0.1, 98);
        } else if (prev >= 90) {
          return prev + 0.3;
        } else if (prev >= 75) {
          return prev + 0.6;
        } else if (prev >= 50) {
          return prev + 0.9;
        } else if (prev >= 25) {
          return prev + 1.1;
        } else {
          return prev + 1.3;
        }
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      const response = await fetch("/api/generate-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al generar imagen: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      clearInterval(progressInterval);

      setProgress(99);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(100);

      await preloadImage(data.url);
      setImageLoaded(true);

      setGeneratedImage(data);
      setIsLoading(false);
      setProgress(0);
      
      onSuccess?.();
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error("Error generating image:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setIsLoading(false);
    }
  };

  const downloadImage = async () => {
    if (generatedImage) {
      try {
        const response = await fetch(generatedImage.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ia-hackathon-alpaca-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading image:", error);
        window.open(generatedImage.url, "_blank");
      }
    }
  };

  const shareImage = async () => {
    if (generatedImage) {
      try {
        if (navigator.share) {
          await navigator.share({
            title: "¡Mira mi alpaca generada con IA!",
            text: `Creé esta alpaca con IA: "${generatedImage.prompt}"`,
            url: generatedImage.url,
          });
        } else {
          await navigator.clipboard.writeText(
            `¡Mira mi alpaca generada con IA! "${generatedImage.prompt}" - ${generatedImage.url}`
          );
          alert("¡Enlace copiado al portapapeles!");
        }
      } catch (error) {
        console.error("Error sharing image:", error);
        window.open(generatedImage.url, "_blank");
      }
    }
  };

  return {
    isLoading,
    generatedImage,
    progress,
    imageLoaded,
    generateImage,
    downloadImage,
    shareImage,
  };
};
