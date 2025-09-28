import { useState, useEffect } from "react";

interface AnonymousUserState {
  userId: string | null;
  generationsUsed: number;
  maxGenerations: number;
  canGenerate: boolean;
  isLoading: boolean;
}

export const useAnonymousUser = () => {
  const [state, setState] = useState<AnonymousUserState>({
    userId: null,
    generationsUsed: 0,
    maxGenerations: 2,
    canGenerate: true,
    isLoading: true,
  });

  // Initialize anonymous user on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const response = await fetch("/api/auth/anonymous", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to initialize anonymous user");
        }

        const userData = await response.json();
        setState({
          userId: userData.userId,
          generationsUsed: userData.generationsUsed,
          maxGenerations: userData.maxGenerations,
          canGenerate: userData.canGenerate,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error initializing anonymous user:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeUser();
  }, []);

  const incrementGenerations = async (): Promise<boolean> => {
    if (!state.userId) return false;
    
    try {
      const response = await fetch("/api/auth/anonymous/increment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: state.userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to increment generations");
      }

      const updatedData = await response.json();
      setState(prev => ({
        ...prev,
        generationsUsed: updatedData.generationsUsed,
        canGenerate: updatedData.canGenerate,
      }));

      return true;
    } catch (error) {
      console.error("Error incrementing generations:", error);
      return false;
    }
  };

  const checkRateLimit = (): boolean => {
    if (!state.canGenerate) {
      alert(`Has alcanzado el límite de ${state.maxGenerations} generaciones. ¡Gracias por probar nuestro generador!`);
      return false;
    }
    return true;
  };

  const remainingGenerations = state.maxGenerations - state.generationsUsed;

  return {
    ...state,
    remainingGenerations,
    checkRateLimit,
    incrementGenerations,
  };
};
