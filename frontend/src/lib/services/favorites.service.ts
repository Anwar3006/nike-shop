import {
  AddFavoriteRequest,
  FavoriteItem,
  GetFavoritesResponse,
} from "@/types/favorites";
import axiosClient from "../api/client";

const FavoritesService = {
  /**
   * Get all favorites for the current user
   */
  getFavorites: async (): Promise<GetFavoritesResponse> => {
    try {
      const response = await axiosClient.get("/favorites");
      return response.data;
    } catch (error) {
      console.error("Error getting favorites:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch favorites"
      );
    }
  },

  /**
   * Add item to favorites
   */
  addFavorite: async (
    data: AddFavoriteRequest
  ): Promise<{ success: boolean; data: FavoriteItem }> => {
    try {
      const response = await axiosClient.post("/favorites", data);
      console.log("Add favorite response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to add to favorites"
      );
    }
  },

  /**
   * Remove item from favorites
   */
  removeFavorite: async (
    favoriteId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosClient.delete(`/favorites/${favoriteId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to remove from favorites"
      );
    }
  },

  /**
   * Check if item is in favorites
   */
  isFavorite: async (
    shoeId: string
  ): Promise<{ isFavorite: boolean; favoriteId?: string }> => {
    try {
      const params: Record<string, string> = { shoeId };

      const response = await axiosClient.get("/favorites/check", { params });
      console.log("Is favorite response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking favorite status:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to check favorite status"
      );
    }
  },
};

export default FavoritesService;
