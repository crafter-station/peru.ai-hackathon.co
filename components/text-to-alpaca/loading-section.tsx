"use client";

interface LoadingSectionProps {
  progress: number;
  isCheckingContent?: boolean;
}

export const LoadingSection = ({ progress }: LoadingSectionProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-sm sm:max-w-md w-full px-4">
        <div className="relative h-8 bg-black/50 border border-gray-600 overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 0%, transparent 49%, #333 49%, #333 51%, transparent 51%),
                linear-gradient(0deg, transparent 0%, transparent 49%, #333 49%, #333 51%, transparent 51%)
              `,
              backgroundSize: "8px 8px",
            }}
          />

          <div
            className="absolute top-0 left-0 h-full transition-all duration-100 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, #B91F2E, #d62e3b)`,
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-mono text-white/80">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-base sm:text-lg font-medium text-white animate-pulse">
            Creando tu alpaca... 🦙
          </p>
        </div>
      </div>
    </div>
  );
};
