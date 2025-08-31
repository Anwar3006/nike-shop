import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../errors/errorHandler";
import { SearchService } from "../services/search.service";
import {
  GetAutocompleteSchemaType,
  GetSearchResultsSchemaType,
  RecordClickSchemaType,
} from "../schemas/search.schema";

export const SearchController = {
  getSearchResults: catchAsync(
    async (
      req: Request<{}, {}, {}, GetSearchResultsSchemaType["query"]>,
      res: Response,
      next: NextFunction
    ) => {
      const { q } = req.query;
      // @ts-ignore
      const userId = req.user?.id;
      const ip_address = req.ip;
      const results = await SearchService.getSearchResults(
        q,
        userId,
        ip_address
      );
      res.status(200).json({ success: true, ...results });
    }
  ),

  getAutocompleteSuggestions: catchAsync(
    async (
      req: Request<{}, {}, {}, GetAutocompleteSchemaType["query"]>,
      res: Response,
      next: NextFunction
    ) => {
      const { q } = req.query;
      const suggestions = await SearchService.getAutocompleteSuggestions(q);
      res.status(200).json({ success: true, data: suggestions });
    }
  ),

  recordClick: catchAsync(
    async (
      req: Request<{}, {}, RecordClickSchemaType["body"]>,
      res: Response,
      next: NextFunction
    ) => {
      const { query_id, product_id } = req.body;
      await SearchService.recordClick(query_id, product_id);
      res.status(204).send();
    }
  ),

  getSearchHistory: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // @ts-ignore
      const userId = req.user?.id;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      const history = await SearchService.getSearchHistory(userId);
      res.status(200).json({ success: true, data: history });
    }
  ),

  getPopularSearches: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const popularSearches = await SearchService.getPopularSearches();
      res.status(200).json({ success: true, data: popularSearches });
    }
  ),
};
