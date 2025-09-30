import { useState } from "react";
import { useGallery } from "./use-gallery";
import { useAnonymousUser } from "./use-anonymous-user";

interface GeneratedImage {
  url: string;
  prompt: string;
  description: string;
  enhancedPrompt?: string;
  savedImageId?: string;
}

export const useImageGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingContent, setIsCheckingContent] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [unsafeMessage, setUnsafeMessage] = useState<string | null>(null);
  const anonymousUser = useAnonymousUser();
  const { saveImageAsync } = useGallery(anonymousUser?.userId || undefined);

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

    setIsCheckingContent(true);
    setIsLoading(true);
    setGeneratedImage(null);
    setImageLoaded(false);
    setProgress(0);
    setUnsafeMessage(null); // Clear any previous unsafe message

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
        const errorData = await response.json();
        
        // Handle guardrail rejection with fun Spanish message
        if (errorData.error === 'unsafe_content') {
          clearInterval(progressInterval);
          setProgress(0);
          setIsCheckingContent(false);
          setIsLoading(false);
          
          // Set the fun Spanish message in state for UI display
          setUnsafeMessage(errorData.message);
          return;
        }
        
        // Handle other errors
        throw new Error(`Error al generar imagen: ${response.status} - ${errorData.error || 'Error desconocido'}`);
      }

      const data = await response.json();
      
      // Content check passed, now generating image
      setIsCheckingContent(false);
      clearInterval(progressInterval);

      setProgress(99);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(100);

      await preloadImage(data.url);
      setImageLoaded(true);

      // Save to gallery automatically and get the saved image ID
      let savedImageId: string | undefined;
      try {
        const savedImage = await saveImageAsync({
          imageUrl: data.url,
          prompt: data.prompt,
          description: data.description,
          enhancedPrompt: data.enhancedPrompt,
          width: 512, // Default dimensions
          height: 512,
          userId: anonymousUser.userId || undefined,
        });
        savedImageId = savedImage?.id;
      } catch (galleryError) {
        console.warn("Failed to save to gallery:", galleryError);
        // Don't throw error here, as generation was successful
      }

      setGeneratedImage({
        ...data,
        savedImageId,
      });
      
      setIsLoading(false);
      setProgress(0);
      
      onSuccess?.();
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setIsCheckingContent(false);
      console.error("Error generating image:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Error desconocido"}`);
      setIsLoading(false);
    }
  };

  const clearUnsafeMessage = () => {
    setUnsafeMessage(null);
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
        const shareUrl = generatedImage.savedImageId 
          ? `${window.location.origin}/i/${generatedImage.savedImageId}`
          : generatedImage.url; // Fallback to direct URL if no saved image ID
        
        if (navigator.share) {
          await navigator.share({
            title: "¡Mira mi alpaca generada con IA!",
            text: `Creé esta alpaca con IA: "${generatedImage.prompt}" en IA Hackathon Perú`,
            url: shareUrl,
          });
        } else {
          const message = generatedImage.savedImageId
            ? `¡Mira mi alpaca generada con IA! "${generatedImage.prompt}" - ${shareUrl} #IAHackathonPeru`
            : `¡Mira mi alpaca generada con IA! "${generatedImage.prompt}" - ${shareUrl}`;
          
          await navigator.clipboard.writeText(message);
          alert("¡Enlace copiado al portapapeles!");
        }
      } catch (error) {
        console.error("Error sharing image:", error);
        // Fallback to direct image URL
        window.open(generatedImage.url, "_blank");
      }
    }
  };

  return {
    isLoading,
    isCheckingContent,
    generatedImage,
    progress,
    imageLoaded,
    unsafeMessage,
    generateImage,
    downloadImage,
    shareImage,
    clearUnsafeMessage,
    anonymousUser,
  };
};
