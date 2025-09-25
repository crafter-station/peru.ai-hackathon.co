"use client";

/**
 * Loading overlay that provides background and loading indicator while 3D background loads
 */
export const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <>
      {/* Background layer that fades out */}
      <div className={`
        absolute inset-0 z-40 bg-background
        transition-all duration-500
        ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `} />
      
      {/* Loading indicator only - positioned below the logo */}
      <div className={`
        absolute inset-0 z-41 flex items-center justify-center pointer-events-none
        transition-all duration-500 transform
        ${isLoading ? 'opacity-100' : 'opacity-0'}
      `} style={{ paddingTop: '120px' }}>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-white animate-pulse"></div>
          <div className="w-2 h-2 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </>
  );
};
