import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../errors/errorHandler";
import { FavoritesService } from "../services/favorites.service";
import type { AddFavoriteSchemaType } from "../schemas/favorites.schema";

export const FavoritesController = {
  getFavorites: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req?.user?.id!; // From auth middleware
      const favorites = await FavoritesService.getFavorites(userId, req.query);
      res.status(200).json({
        success: true,
        data: favorites.data,
        count: favorites.count,
      });
    }
  ),

  addFavorite: catchAsync(
    async (
      req: Request<{}, {}, AddFavoriteSchemaType["body"]>,
      res: Response,
      next: NextFunction
    ) => {
      const userId = req?.user?.id!; // From auth middleware
      const favorite = await FavoritesService.addFavorite(
        userId,
        req.body.shoeId
      );
      res.status(201).json({ success: true, data: favorite });
    }
  ),

  removeFavorite: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req?.user?.id!; // From auth middleware
      const favoriteId = req.params.id;
      await FavoritesService.removeFavorite(userId, favoriteId);
      res.status(200).json({ success: true, message: "Favorite removed" });
    }
  ),

  checkIsFavorite: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req?.user?.id!; // From auth middleware
      const { shoeId } = req.query;
      const result = await FavoritesService.checkIsFavorite(
        userId,
        shoeId as string
      );

      res.status(200).json({
        isFavorite: !!result,
        favoriteId: result?.id || undefined,
      });
    }
  ),
};
