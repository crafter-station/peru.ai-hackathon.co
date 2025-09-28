import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LikeImageParams {
  imageId: string;
  userId: string;
}

interface LikeResponse {
  success: boolean;
  liked: boolean;
  likeCount: number;
}

export const useImageLikes = (userId?: string, skipRefetch = false) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation<LikeResponse, Error, LikeImageParams>({
    mutationFn: async ({ imageId, userId }: LikeImageParams) => {
      const response = await fetch(`/api/gallery/${imageId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to like image");
      }

      return response.json();
    },
    onMutate: async ({ imageId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["gallery", userId] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["gallery", userId]);

      // Optimistically update the gallery
      queryClient.setQueryData(["gallery", userId], (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            images: page.images.map((image: any) => 
              image.id === imageId
                ? {
                    ...image,
                    isLikedByUser: true,
                    likeCount: (image.likeCount || 0) + 1,
                  }
                : image
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Revert on error
      if (context && typeof context === 'object' && 'previousData' in context && context.previousData) {
        queryClient.setQueryData(["gallery", userId], context.previousData);
      }
    },
    onSettled: () => {
      // Only refetch if not skipping (e.g., not in modal mode)
      if (!skipRefetch) {
        queryClient.invalidateQueries({ queryKey: ["gallery", userId] });
      }
    },
  });

  const unlikeMutation = useMutation<LikeResponse, Error, LikeImageParams>({
    mutationFn: async ({ imageId, userId }: LikeImageParams) => {
      const response = await fetch(`/api/gallery/${imageId}/like`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to unlike image");
      }

      return response.json();
    },
    onMutate: async ({ imageId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["gallery", userId] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["gallery", userId]);

      // Optimistically update the gallery
      queryClient.setQueryData(["gallery", userId], (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            images: page.images.map((image: any) => 
              image.id === imageId
                ? {
                    ...image,
                    isLikedByUser: false,
                    likeCount: Math.max((image.likeCount || 0) - 1, 0),
                  }
                : image
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Revert on error
      if (context && typeof context === 'object' && 'previousData' in context && context.previousData) {
        queryClient.setQueryData(["gallery", userId], context.previousData);
      }
    },
    onSettled: () => {
      // Only refetch if not skipping (e.g., not in modal mode)
      if (!skipRefetch) {
        queryClient.invalidateQueries({ queryKey: ["gallery", userId] });
      }
    },
  });

  const toggleLike = (imageId: string, isCurrentlyLiked: boolean) => {
    if (!userId) return;

    if (isCurrentlyLiked) {
      unlikeMutation.mutate({ imageId, userId });
    } else {
      likeMutation.mutate({ imageId, userId });
    }
  };

  return {
    toggleLike,
    isLoading: likeMutation.isPending || unlikeMutation.isPending,
    error: likeMutation.error || unlikeMutation.error,
  };
};
