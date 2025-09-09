import { logger } from "../utils/logger.js";
import { FavoritesRepository } from "../repositories/favorites.repository.js";
export const FavoritesService = {
    getFavorites: async (userId, query) => {
        try {
            const favorites = await FavoritesRepository.getFavorites(userId, query);
            return favorites;
        }
        catch (error) {
            logger.error("Error fetching favorites: " + error);
            throw error;
        }
    },
    addFavorite: async (userId, shoeId) => {
        try {
            const favorite = await FavoritesRepository.addFavorite(userId, shoeId);
            return favorite;
        }
        catch (error) {
            logger.error("Error adding favorite: " + error);
            throw error;
        }
    },
    removeFavorite: async (userId, favoriteId) => {
        try {
            const result = await FavoritesRepository.removeFavorite(userId, favoriteId);
            return result;
        }
        catch (error) {
            logger.error("Error removing favorite: " + error);
            throw error;
        }
    },
    checkIsFavorite: async (userId, shoeId) => {
        try {
            const favorite = await FavoritesRepository.checkIsFavorite(userId, shoeId);
            return favorite;
        }
        catch (error) {
            logger.error("Error checking favorite: " + error);
            // Return null if there's an error checking favorite status
            return null;
        }
    },
};
