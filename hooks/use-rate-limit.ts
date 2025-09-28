import { useState, useEffect } from "react";

export const useRateLimit = (maxGenerations: number = 2) => {
  const [generationsUsed, setGenerationsUsed] = useState(0);

  // Load generations count from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('alpaca-generations-used');
    if (stored) {
      setGenerationsUsed(parseInt(stored, 10));
    }
  }, []);

  // Update localStorage when generations count changes
  useEffect(() => {
    localStorage.setItem('alpaca-generations-used', generationsUsed.toString());
  }, [generationsUsed]);

  const incrementGenerations = () => {
    setGenerationsUsed(prev => prev + 1);
  };

  const canGenerate = generationsUsed < maxGenerations;
  const remainingGenerations = maxGenerations - generationsUsed;

  const checkRateLimit = (): boolean => {
    if (generationsUsed >= maxGenerations) {
      alert(`Has alcanzado el límite de ${maxGenerations} generaciones. ¡Gracias por probar nuestro generador!`);
      return false;
    }
    return true;
  };

  return {
    generationsUsed,
    canGenerate,
    remainingGenerations,
    checkRateLimit,
    incrementGenerations,
  };
};
