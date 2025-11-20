import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Participant } from "@/lib/schema";

export function useParticipant() {
  const queryClient = useQueryClient();

  const { data: participant, isLoading, refetch } = useQuery<Participant | null>({
    queryKey: ["participant"],
    queryFn: async () => {
      const response = await fetch("/api/onboarding");
      if (!response.ok) return null;
      return response.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Participant>) => {
      const response = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update participant");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participant"] });
    },
  });

  return {
    participant,
    isLoading,
    updateParticipant: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    refetch,
  };
}
