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
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["participant"] });
      const previousParticipant = queryClient.getQueryData<Participant | null>(["participant"]);
      
      queryClient.setQueryData<Participant | null>(["participant"], (old) => {
        if (!old) return old;
        return { ...old, ...newData };
      });
      
      return { previousParticipant };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousParticipant) {
        queryClient.setQueryData(["participant"], context.previousParticipant);
      }
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
