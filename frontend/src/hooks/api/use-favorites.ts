import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AddFavoriteRequest,
  FavoriteItem,
  GetFavoritesResponse,
} from "@/types/favorites";
import FavoritesService from "@/lib/services/favorites.service";
import { useSession } from "@/lib/auth-client";
import { ToastID } from "@/types";

/**
 * Hook for getting user's favorites
 */
export const useGetFavorites = ({
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
}: {
  enabled?: boolean;
  staleTime?: number;
} = {}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<GetFavoritesResponse, Error>({
    queryKey: ["favorites", userId],
    queryFn: () => FavoritesService.getFavorites(),
    enabled: enabled && !!userId, // Only run if user is logged in
    staleTime,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

/**
 * Hook for adding items to favorites
 */
export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation<
    { success: boolean; data: FavoriteItem },
    Error,
    AddFavoriteRequest
  >({
    mutationFn: (data) => FavoritesService.addFavorite(data),
    onSuccess: (data, variables) => {
      // ✅ Update cache with real data from server
      const queryKey = [
        "is-favorite",
        userId,
        variables.shoeId,
        variables.colorVariantId,
      ];
      queryClient.setQueryData(queryKey, {
        isFavorite: true,
        favoriteId: data.data.id,
      });

      // ✅ Invalidate favorites list to refresh it
      queryClient.invalidateQueries({
        queryKey: ["favorites", userId],
      });

      // Show success toast
      toast.success("Added to favorites", {
        id: ToastID.ADD_FAVORITE_SUCCESS,
        description: "Item has been saved to your favorites.",
        duration: 4000,
        descriptionClassName: "text-green-800 font-medium",
      });
    },
    onError: (error) => {
      // Show error toast
      toast.error("❌Failed to add to favorites😪", {
        id: ToastID.ADD_FAVORITE_ERROR,
        description: error.message || "Something went wrong. Please try again.",
        duration: 8000,
      });
    },
  });
};

/**
 * Hook for removing items from favorites
 */
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation<
    { success: boolean; message: string },
    Error,
    { favoriteId: string; shoeId: string; colorVariantId?: string }
  >({
    mutationFn: ({ favoriteId }) => FavoritesService.removeFavorite(favoriteId),
    onSuccess: (data, variables) => {
      const queryKey = [
        "is-favorite",
        userId,
        variables.shoeId,
        variables.colorVariantId,
      ];
      queryClient.setQueryData(queryKey, {
        isFavorite: false,
        favoriteId: undefined,
      });

      // Invalidate and refetch favorites
      queryClient.invalidateQueries({
        queryKey: ["favorites", userId],
      });

      // Show success toast
      toast.success("Removed from favorites", {
        id: ToastID.REMOVE_FAVORITE_SUCCESS,
        description: "Item has been removed from your favorites.",
        duration: 4000,
      });
    },
    onError: (error) => {
      // Show error toast
      toast.error("❌Failed to remove from favorites😪", {
        id: ToastID.REMOVE_FAVORITE_ERROR,
        description: error.message || "Something went wrong. Please try again.",
        duration: 8000,
      });
    },
  });
};

/**
 * Hook for checking if an item is in favorites
 */
export const useIsFavorite = ({
  shoeId,
  colorVariantId,
}: {
  shoeId: string;
  colorVariantId?: string;
}) => {
  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  return useQuery<{ isFavorite: boolean; favoriteId?: string }, Error>({
    queryKey: ["is-favorite", userId, shoeId, colorVariantId],
    queryFn: () => FavoritesService.isFavorite({ shoeId, colorVariantId }),
    enabled: !!isPending && !!userId && !!shoeId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for toggling favorite status (add/remove)
 */
export const useToggleFavorite = () => {
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const toggleFavorite = async ({
    shoeId,
    colorVariantId,
    isFavorite,
    favoriteId,
  }: {
    shoeId: string;
    colorVariantId?: string;
    isFavorite: boolean;
    favoriteId?: string;
  }) => {
    if (!userId) {
      toast.error("❌Please sign in😪", {
        id: ToastID.LOGIN_ERROR,
        description: "You need to be logged in to save favorites.",
        duration: 8000,
      });
      return;
    }

    if (isFavorite && favoriteId) {
      // Remove from favorites
      return removeFavorite.mutateAsync({
        favoriteId,
        shoeId,
        colorVariantId,
      });
    } else {
      // Add to favorites
      if (!userId) {
        toast.error("❌Please sign in😪", {
          id: ToastID.LOGIN_ERROR,
          description: "You need to be logged in to save favorites.",
          duration: 8000,
        });
        return;
      }
      return addFavorite.mutateAsync({ shoeId, userId, colorVariantId });
    }
  };

  return {
    toggleFavorite,
    isLoading: addFavorite.isPending || removeFavorite.isPending,
    error: addFavorite.error || removeFavorite.error,
  };
};
