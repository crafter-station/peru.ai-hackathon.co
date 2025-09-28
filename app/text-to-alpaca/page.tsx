"use client";

import { useState } from "react";
import { NextPage } from "next";
import Image from "next/image";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { ImageDisplay } from "@/components/text-to-alpaca/image-display";
import { LoadingSection } from "@/components/text-to-alpaca/loading-section";
import { InputForm } from "@/components/text-to-alpaca/input-form";

const TextToAlpaca: NextPage = () => {
  const [prompt, setPrompt] = useState("");
  
  const MAX_GENERATIONS = 2;
  
  // Custom hooks for cleaner state management
  const imageGeneration = useImageGeneration();
  const rateLimit = useRateLimit(MAX_GENERATIONS);

  const handleGenerate = async () => {
    if (!rateLimit.checkRateLimit()) return;
    
    await imageGeneration.generateImage(prompt, () => {
      rateLimit.incrementGenerations();
    });
  };

  const canGenerate = prompt.trim().length > 0 && rateLimit.canGenerate;

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
          <LoadingSection progress={imageGeneration.progress} />
        )}

        {/* Input Section */}
        <InputForm
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          isLoading={imageGeneration.isLoading}
          canGenerate={canGenerate}
          remainingGenerations={rateLimit.remainingGenerations}
          generationsUsed={rateLimit.generationsUsed}
          maxGenerations={MAX_GENERATIONS}
          hasGeneratedImage={!!imageGeneration.generatedImage}
        />
      </div>
    </div>
  );
};

export default TextToAlpaca;