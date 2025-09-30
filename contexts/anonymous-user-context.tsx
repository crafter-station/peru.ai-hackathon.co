"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AnonymousUserState {
  userId: string | null;
  generationsUsed: number;
  maxGenerations: number;
  canGenerate: boolean;
  isLoading: boolean;
}

interface AnonymousUserContextType extends AnonymousUserState {
  remainingGenerations: number;
  checkRateLimit: () => boolean;
  incrementGenerations: () => Promise<boolean>;
}

const AnonymousUserContext = createContext<AnonymousUserContextType | undefined>(undefined);

export function AnonymousUserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnonymousUserState>({
    userId: null,
    generationsUsed: 0,
    maxGenerations: 2,
    canGenerate: true,
    isLoading: true,
  });

  // Single initialization effect - prevents race conditions
  useEffect(() => {
    let mounted = true;

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
        
        // Only update state if component is still mounted
        if (mounted) {
          setState({
            userId: userData.userId,           // This is now the fingerprint ID for rate limiting
            generationsUsed: userData.generationsUsed,
            maxGenerations: userData.maxGenerations,
            canGenerate: userData.canGenerate,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error initializing anonymous user:", error);
        if (mounted) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeUser();

    return () => {
      mounted = false;
    };
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

  const value: AnonymousUserContextType = {
    ...state,
    remainingGenerations,
    checkRateLimit,
    incrementGenerations,
  };

  return (
    <AnonymousUserContext.Provider value={value}>
      {children}
    </AnonymousUserContext.Provider>
  );
}

export function useAnonymousUser() {
  const context = useContext(AnonymousUserContext);
  if (context === undefined) {
    throw new Error('useAnonymousUser must be used within an AnonymousUserProvider');
  }
  return context;
}
