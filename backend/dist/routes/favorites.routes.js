import { Router } from "express";
import { FavoritesController } from "../controllers/favorites.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { verifyAuth } from "../middlewares/verfiyAuth.middleware.js";
import { addFavoriteSchema, getFavoritesSchema, checkFavoriteSchema, } from "../schemas/favorites.schema.js";
const favoritesRouter = Router();
// All favorites routes require authentication
favoritesRouter.use(verifyAuth);
favoritesRouter.get("/", validate(getFavoritesSchema), FavoritesController.getFavorites);
favoritesRouter.post("/", validate(addFavoriteSchema), FavoritesController.addFavorite);
favoritesRouter.delete("/:id", FavoritesController.removeFavorite);
favoritesRouter.get("/check", validate(checkFavoriteSchema), FavoritesController.checkIsFavorite);
export default favoritesRouter;
