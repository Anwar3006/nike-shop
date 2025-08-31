import { SearchRepository } from "../repositories/search.repository";
import { logger } from "../utils/logger";

export const SearchService = {
  async getSearchResults(
    query: string,
    userId?: string,
    ip_address?: string
  ) {
    try {
      const results = await SearchRepository.getSearchResults(query);
      // Fire-and-forget the logging and popular search update
      SearchRepository.recordSearchQuery(
        query,
        results.data.length,
        userId,
        ip_address
      );
      SearchRepository.upsertPopularSearch(query);
      return results;
    } catch (error) {
      logger.error(error, "Error in getSearchResults service");
      throw error;
    }
  },

  async getAutocompleteSuggestions(query: string) {
    try {
      return await SearchRepository.getAutocompleteSuggestions(query);
    } catch (error) {
      logger.error(error, "Error in getAutocompleteSuggestions service");
      throw error;
    }
  },

  async recordClick(query_id: string, product_id: string) {
    try {
      await SearchRepository.recordClick(query_id, product_id);
    } catch (error) {
      logger.error(error, "Error in recordClick service");
      throw error;
    }
  },

  async getSearchHistory(userId: string) {
    try {
      return await SearchRepository.getSearchHistory(userId);
    } catch (error) {
      logger.error(error, "Error in getSearchHistory service");
      throw error;
    }
  },

  async getPopularSearches() {
    try {
      return await SearchRepository.getPopularSearches();
    } catch (error) {
      logger.error(error, "Error in getPopularSearches service");
      throw error;
    }
  },
};
