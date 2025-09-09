import { catchAsync } from "../errors/errorHandler.js";
import { FavoritesService } from "../services/favorites.service.js";
export const FavoritesController = {
    getFavorites: catchAsync(async (req, res, next) => {
        const userId = req?.user?.id; // From auth middleware
        const favorites = await FavoritesService.getFavorites(userId, req.query);
        res.status(200).json({
            success: true,
            data: favorites.data,
            count: favorites.count,
        });
    }),
    addFavorite: catchAsync(async (req, res, next) => {
        const userId = req?.user?.id; // From auth middleware
        const favorite = await FavoritesService.addFavorite(userId, req.body.shoeId);
        res.status(201).json({ success: true, data: favorite });
    }),
    removeFavorite: catchAsync(async (req, res, next) => {
        const userId = req?.user?.id; // From auth middleware
        const favoriteId = req.params.id;
        await FavoritesService.removeFavorite(userId, favoriteId);
        res.status(200).json({ success: true, message: "Favorite removed" });
    }),
    checkIsFavorite: catchAsync(async (req, res, next) => {
        const userId = req?.user?.id; // From auth middleware
        const { shoeId } = req.query;
        const result = await FavoritesService.checkIsFavorite(userId, shoeId);
        res.status(200).json({
            isFavorite: !!result,
            favoriteId: result?.id || undefined,
        });
    }),
};
