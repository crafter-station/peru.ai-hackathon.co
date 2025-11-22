import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

type BadgeGenerationResponse = {
  participantNumber: number;
  badgeUrl: string;
};

export const useBadgeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const queryClient = useQueryClient();

  const generateBadge = async (participantId: string) => {
    if (!participantId) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/badge/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate badge");
      }

      await queryClient.invalidateQueries({ queryKey: ["participant"] });

      return data as BadgeGenerationResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error generando badge";
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateBadge,
    isGenerating,
    error,
    countdown,
    setCountdown,
  };
};
