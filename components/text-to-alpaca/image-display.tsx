"use client";

import { Button } from "@/components/ui/button";
import { CometCard } from "@/components/ui/comet-card";
import { Download, Share2 } from "lucide-react";

interface GeneratedImage {
  url: string;
  prompt: string;
  description: string;
}

interface ImageDisplayProps {
  generatedImage: GeneratedImage;
  imageLoaded: boolean;
  onDownload: () => void;
  onShare: () => void;
}

export const ImageDisplay = ({ 
  generatedImage, 
  imageLoaded, 
  onDownload, 
  onShare 
}: ImageDisplayProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-sm sm:max-w-md w-full text-center">
        <CometCard className="mb-4 sm:mb-6">
          <div className="flex w-full cursor-pointer flex-col items-stretch bg-[#1F2121] p-2 sm:p-3 md:p-4">
            <div className="mx-2 flex-1">
              <div className="relative mt-2 aspect-[3/4] w-full">
                <img
                  src={generatedImage.url}
                  alt="Generated Alpaca"
                  className={`absolute inset-0 h-full w-full bg-[#000000] object-cover transition-all duration-500 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                    transition: "opacity 0.5s ease-out",
                  }}
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
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-black/50 border border-gray-600 text-left">
          <p className="text-xs sm:text-sm text-gray-300">
            <span className="font-semibold text-white">Prompt:</span> {generatedImage.prompt}
          </p>
        </div>
        
        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            onClick={onDownload}
            className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-semibold bg-white text-black hover:bg-gray-200"
          >
            <Download className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
            Descargar
          </Button>
          <Button
            onClick={onShare}
            variant="outline"
            className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-semibold bg-transparent border-gray-600 text-white hover:bg-gray-700"
          >
            <Share2 className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
            Compartir
          </Button>
        </div>
      </div>
    </div>
  );
};
