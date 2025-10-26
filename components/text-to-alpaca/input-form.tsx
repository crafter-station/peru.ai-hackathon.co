"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Shuffle } from "lucide-react";
import { getRandomPrompt } from "@/lib/constants/prompts";

interface InputFormProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  canGenerate: boolean;
  remainingGenerations: number;
  generationsUsed: number;
  maxGenerations: number;
  hasGeneratedImage: boolean;
}

export const InputForm = ({
  prompt,
  onPromptChange,
  onGenerate,
  isLoading,
  canGenerate,
  remainingGenerations,
  generationsUsed,
  maxGenerations,
  hasGeneratedImage,
}: InputFormProps) => {
  const handleRandomPrompt = () => {
    const randomPrompt = getRandomPrompt();
    onPromptChange(randomPrompt);
  };

  return (
    <div className={`relative z-10 ${hasGeneratedImage || isLoading ? 'p-4 sm:p-6' : 'flex-1 flex items-center justify-center p-4 sm:p-6'}`}>
      <div className={`w-full ${hasGeneratedImage || isLoading ? 'max-w-lg sm:max-w-2xl mx-auto' : 'max-w-sm sm:max-w-lg'}`}>
        <div className="bg-black/70 backdrop-blur-sm border-0 p-4 sm:p-6">
          
          {/* Title for centered layout */}
          {!hasGeneratedImage && !isLoading && (
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Text To Alpaca 🦙</h1>
              <p className="text-sm sm:text-base text-gray-300">Describe cómo quieres que se vea tu alpaca</p>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <label className="text-xs sm:text-sm font-medium text-gray-300">
                {hasGeneratedImage ? 'Crear otra alpaca' : 'Describe tu alpaca'}
              </label>
              <Button
                onClick={handleRandomPrompt}
                variant="outline"
                size="sm"
                disabled={generationsUsed >= maxGenerations}
                className="h-8 px-3 text-xs sm:text-sm bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shuffle className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                Shuffle
              </Button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
                onKeyDown={() => {
                const audio = new Audio("/sounds/bite.mp3");
                audio.volume = 0.3; 
                audio.play().catch(() => {}); 
              }}

              placeholder="Describe la escena que quieres crear con la alpaca..."
              className="w-full h-20 sm:h-24 p-3 sm:p-4 bg-black/50 border border-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-white text-white text-sm sm:text-base"
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {prompt.length}/500
              </div>
              <div className="text-xs text-gray-400">
                {remainingGenerations > 0 ? `${remainingGenerations} intentos restantes` : 'Límite alcanzado'}
              </div>
            </div>

            <Button
                onClick={onGenerate}
                disabled={!canGenerate || isLoading}
                className={`w-full h-10 sm:h-12 text-sm sm:text-base font-semibold ${
                  generationsUsed >= maxGenerations 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed hover:bg-gray-600' 
                    : 'bg-white text-black hover:bg-gray-200 cursor-pointer'
                }`}
              >
              {isLoading ? (
                <>Generando...</>
              ) : generationsUsed >= maxGenerations ? (
                <>Ups! Ya no puedes generar más alpacas :&apos;(</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {hasGeneratedImage ? 'Generar Nueva' : 'Generar'}
                </>
              )}
            </Button>

            {/* Rate limit warning */}
            {remainingGenerations === 1 && (
              <div className="mt-2 p-3 bg-yellow-900/20 border border-yellow-600/30 text-yellow-300 text-xs sm:text-sm text-center">
                 Te queda solo 1 intento n_n
              </div>
            )}

            {generationsUsed >= maxGenerations && (
              <div className="mt-2 p-3 bg-red-900/20 border border-red-600/30 text-red-300 text-xs sm:text-sm text-center">
                Ya no puedes generar más alpacas :&apos;(
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
