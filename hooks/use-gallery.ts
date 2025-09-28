import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { GalleryImage } from "@/lib/schema";

interface GalleryResponse {
  images: GalleryImage[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface SaveImageParams {
  imageUrl: string;
  prompt: string;
  description?: string;
  enhancedPrompt?: string;
  width?: number;
  height?: number;
  userId?: string;
}

export const useGallery = (userId?: string) => {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<GalleryResponse>({
    queryKey: ["gallery", userId],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams({ limit: "20" });
      if (pageParam) {
        params.set("cursor", pageParam as string);
      }
      if (userId) {
        params.set("userId", userId);
      }

      const response = await fetch(`/api/gallery?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch gallery images");
      }
      return response.json();
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const saveImageMutation = useMutation<GalleryImage, Error, SaveImageParams, { previousData?: any }>({
    mutationFn: async (params) => {
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to save image to gallery");
      }

      return response.json();
    },
    onMutate: async (newImage) => {
      await queryClient.cancelQueries({ queryKey: ["gallery", userId] });

      const previousData = queryClient.getQueryData(["gallery", userId]);

      // Optimistically add the new image to the first page
      queryClient.setQueryData(["gallery", userId], (old: any) => {
        if (!old) return old;

        const optimisticImage: GalleryImage = {
          id: `temp_${Date.now()}`, // Temporary ID
          userId: newImage.userId || "user_anonymous",
          imageUrl: newImage.imageUrl,
          blobUrl: null,
          prompt: newImage.prompt,
          description: newImage.description || null,
          enhancedPrompt: newImage.enhancedPrompt || null,
          width: newImage.width || null,
          height: newImage.height || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          likeCount: 0,
          isLikedByUser: false,
        };

        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              images: [optimisticImage, ...old.pages[0].images],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousData };
    },
    onError: (err, newImage, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["gallery", userId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery", userId] });
    },
  });

  // Flatten and deduplicate images by ID to prevent duplicate keys
  const images = data?.pages?.flatMap((page) => page.images) || [];
  const deduplicatedImages = images.filter((image, index, array) => 
    array.findIndex(img => img.id === image.id) === index
  );

  return {
    images: deduplicatedImages,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    saveImage: saveImageMutation.mutate,
    saveImageAsync: saveImageMutation.mutateAsync,
    isSaving: saveImageMutation.isPending,
    saveError: saveImageMutation.error,
  };
};
