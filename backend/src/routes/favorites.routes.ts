import { Router } from "express";
import { FavoritesController } from "../controllers/favorites.controller";
import validate from "../middlewares/validate.middleware";
import { verifyAuth } from "../middlewares/verfiyAuth.middleware"; // You'll need to create this
import {
  addFavoriteSchema,
  getFavoritesSchema,
  checkFavoriteSchema,
} from "../schemas/favorites.schema";

const favoritesRouter = Router();

// All favorites routes require authentication
favoritesRouter.use(verifyAuth);

favoritesRouter.get(
  "/",
  validate(getFavoritesSchema),
  FavoritesController.getFavorites
);
favoritesRouter.post(
  "/",
  validate(addFavoriteSchema),
  FavoritesController.addFavorite
);
favoritesRouter.delete("/:id", FavoritesController.removeFavorite);
favoritesRouter.get(
  "/check",
  validate(checkFavoriteSchema),
  FavoritesController.checkIsFavorite
);

export default favoritesRouter;
