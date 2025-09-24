"use client";

import Image from "next/image";

/**
 * Loading component that matches hero section's branding and assets
 */
export const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className={`
      absolute inset-0 z-40 flex items-center justify-center
      bg-black
      transition-all duration-500 transform
      ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `}>
      {/* Dark backdrop to match hero section */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Enhanced overlay for better contrast and visual depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40" />

      {/* Subtle brand gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-red-900/15 via-transparent to-red-900/15"
        style={{
          background: 'linear-gradient(135deg, #B91F2E15 0%, rgba(185, 31, 46, 0.08) 30%, transparent 50%, rgba(185, 31, 46, 0.08) 70%, #B91F2E15 100%)',
          mixBlendMode: 'overlay'
        }} 
      />

      <div className="relative z-10 text-center px-4 md:px-8 max-w-4xl mx-auto">
        {/* Main logo: IA HACKATHON Brand */}
        <div className="mb-8 md:mb-12 animate-pulse">
          <div className="flex justify-center items-center">
            <Image 
              src="/IA_HACK_BRAND.svg" 
              alt="IA HACKATHON" 
              width={600}
              height={150}
              className="w-full max-w-xl h-auto opacity-90"
              priority
            />
          </div>
        </div>

        {/* Organizer and Partnership logos */}
        <div className="mb-8 md:mb-12 opacity-80">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
            {/* The Hackathon Company */}
            <div className="flex items-center">
              <Image
                src="/THC-BRAND-WHITE.svg"
                alt="By The Hackathon Company"
                width={100}
                height={32}
                className="h-6 md:h-8 w-auto"
                style={{
                  filter: 'brightness(1.1) contrast(1.2)',
                  opacity: '0.8'
                }}
              />
            </div>
            
            {/* Partnership with MAKERS */}
            <div className="flex items-center">
              <Image
                src="/partner_makers.svg"
                alt="In partnership with MAKERS"
                width={140}
                height={24}
                className="h-5 md:h-6 w-auto"
                style={{
                  filter: 'brightness(1.1) contrast(1.2)',
                  opacity: '0.8'
                }}
              />
            </div>
          </div>
        </div>

      
        
        {/* Enhanced loading indicator with brand colors */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-brand-red rounded-full animate-pulse shadow-lg"></div>
          <div className="w-3 h-3 bg-brand-red rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-3 h-3 bg-brand-red rounded-full animate-pulse shadow-lg" style={{ animationDelay: '0.6s' }}></div>
        </div>

       
      </div>

      
    </div>
  );
};
