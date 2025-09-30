"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface UnsafeMessageAlertProps {
  message: string;
  onClose: () => void;
}

export const UnsafeMessageAlert = ({ message, onClose }: UnsafeMessageAlertProps) => {
  return (
    <div className="relative z-10 mx-4 sm:mx-6 mb-4">
      <div className="max-w-sm sm:max-w-lg mx-auto">
        <div className="bg-gradient-to-r from-red-900/40 to-pink-900/40 backdrop-blur-sm border border-red-500/30 p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🦙</span>
                <span className="text-sm font-semibold text-red-200">Alpaca Guard</span>
              </div>
              <p className="text-sm text-red-100 leading-relaxed">
                {message}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-red-300 hover:text-red-100 hover:bg-red-800/30"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
