"use client";

import { BlockLetter } from "../../ui/block-letter";

/**
 * Loading component that shows 2D "IA HACKATHON" text while 3D model loads
 */
export const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className={`
      absolute inset-0 z-40 flex items-center justify-center bg-background
      transition-all duration-500 transform
      ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      <div className="text-center">
        {/* IA text using block letters */}
        <div className="flex justify-center items-center mb-6">
          <BlockLetter letter="I" size="large" />
          <BlockLetter letter="A" size="large" />
        </div>
        
        {/* HACKATHON text using block letters */}
        <div className="flex justify-center items-center flex-wrap mb-6">
          <BlockLetter letter="H" size="small" />
          <BlockLetter letter="A" size="small" />
          <BlockLetter letter="C" size="small" />
          <BlockLetter letter="K" size="small" />
          <BlockLetter letter="A" size="small" />
          <BlockLetter letter="T" size="small" />
          <BlockLetter letter="H" size="small" />
          <BlockLetter letter="O" size="small" />
          <BlockLetter letter="N" size="small" />
        </div>
        
        {/* Simple loading indicator */}
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-white animate-pulse"></div>
          <div className="w-2 h-2 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};
