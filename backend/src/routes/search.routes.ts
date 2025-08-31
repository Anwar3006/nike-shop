import { Router } from "express";
import { SearchController } from "../controllers/search.controller";
import validate from "../middlewares/validate.middleware";
import {
  getAutocompleteSchema,
  getSearchResultsSchema,
  recordClickSchema,
} from "../schemas/search.schema";

const searchRouter = Router();

searchRouter.get(
  "/",
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
searchRouter.get("/history", SearchController.getSearchHistory);
searchRouter.get("/popular", SearchController.getPopularSearches);

export default searchRouter;
