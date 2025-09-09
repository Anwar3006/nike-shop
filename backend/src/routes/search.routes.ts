import { Router } from "express";
import { SearchController } from "../controllers/search.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  getAutocompleteSchema,
  getSearchResultsSchema,
  recordClickSchema,
} from "../schemas/search.schema.js";
import {
  optionalAuth,
  verifyAuth,
} from "../middlewares/verfiyAuth.middleware.js";

const searchRouter = Router();

searchRouter.get(
  "/",
  optionalAuth,
  validate(getSearchResultsSchema),
  SearchController.getSearchResults
);
searchRouter.get(
  "/autocomplete",
  validate(getAutocompleteSchema),
  SearchController.getAutocompleteSuggestions
);
searchRouter.post(
  "/click",
  validate(recordClickSchema),
  SearchController.recordClick
);

// TODO: Add auth middleware to protect this route
searchRouter.get("/history", verifyAuth, SearchController.getSearchHistory);
searchRouter.get("/popular", SearchController.getPopularSearches);

export default searchRouter;
