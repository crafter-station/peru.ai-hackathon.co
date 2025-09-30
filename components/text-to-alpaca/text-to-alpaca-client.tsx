"use client";

import { useState } from "react";
import Image from "next/image";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { ImageDisplay } from "@/components/text-to-alpaca/image-display";
import { LoadingSection } from "@/components/text-to-alpaca/loading-section";
import { InputForm } from "@/components/text-to-alpaca/input-form";
import { UnsafeMessageAlert } from "@/components/text-to-alpaca/unsafe-message-alert";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

const TextToAlpacaClient = () => {
  const [prompt, setPrompt] = useState("");

  // Custom hooks for cleaner state management
  const imageGeneration = useImageGeneration();
  const { anonymousUser } = imageGeneration;

  const handleGenerate = async () => {
    if (!anonymousUser.checkRateLimit()) return;

    await imageGeneration.generateImage(prompt, async () => {
      await anonymousUser.incrementGenerations();
    });
  };

  const canGenerate = prompt.trim().length > 0 && anonymousUser.canGenerate;

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden relative">
      {/* Dithering Background Effect */}
      <div className="fixed inset-0 z-0">
        <div
          className="h-full w-full"
          style={{
            backgroundColor: "#000000",
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(185, 31, 46, 0.03) 2px,
                rgba(185, 31, 46, 0.03) 4px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(185, 31, 46, 0.03) 2px,
                rgba(185, 31, 46, 0.03) 4px
              )
            `,
            backgroundSize: "3px 3px"
          }}
        />
      </div>

      {/* Header with branding */}
      <div className="relative z-10 p-4 sm:p-6 flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-4">
          <Image
            src="/IA_HACK_BRAND.svg"
            alt="IA HACKATHON"
            width={200}
            height={50}
            className="h-6 sm:h-8 w-auto opacity-90"
          />
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Unsafe Message Alert */}
        {imageGeneration.unsafeMessage && (
          <UnsafeMessageAlert
            message={imageGeneration.unsafeMessage}
            onClose={imageGeneration.clearUnsafeMessage}
          />
        )}

        {/* Generated Image Section */}
        {imageGeneration.generatedImage && (
          <ImageDisplay
            generatedImage={imageGeneration.generatedImage}
            imageLoaded={imageGeneration.imageLoaded}
            onDownload={imageGeneration.downloadImage}
            onShare={imageGeneration.shareImage}
          />
        )}

        {/* Loading Section */}
        {imageGeneration.isLoading && (
          <LoadingSection
            progress={imageGeneration.progress}
            isCheckingContent={imageGeneration.isCheckingContent}
          />
        )}

        {/* Input Section */}
        <InputForm
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          isLoading={imageGeneration.isLoading || anonymousUser.isLoading}
          canGenerate={canGenerate}
          remainingGenerations={anonymousUser.remainingGenerations}
          generationsUsed={anonymousUser.generationsUsed}
          maxGenerations={anonymousUser.maxGenerations}
          hasGeneratedImage={!!imageGeneration.generatedImage}
        />
      </div>

      {/* Gallery Section */}
      <div className="relative z-10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              AlpacaVerse Gallery
            </h2>
            <p className="text-muted-foreground">
              Admira las creaciones de la comunidad 🦙
            </p>
          </div>
          <GalleryGrid />
        </div>
      </div>
    </div>
  );
};

export default TextToAlpacaClient;
