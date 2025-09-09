import { SearchRepository } from "../repositories/search.repository.js";
import { logger } from "../utils/logger.js";
export const SearchService = {
    async getSearchResults(query, userId, ip_address) {
        try {
            const results = await SearchRepository.getSearchResults(query);
            // Fire-and-forget the logging and popular search update
            SearchRepository.recordSearchQuery(query, results.data.length, userId, ip_address);
            SearchRepository.upsertPopularSearch(query);
            return results;
        }
        catch (error) {
            logger.error(error, "Error in getSearchResults service");
            throw error;
        }
    },
    async getAutocompleteSuggestions(query) {
        try {
            return await SearchRepository.getAutocompleteSuggestions(query);
        }
        catch (error) {
            logger.error(error, "Error in getAutocompleteSuggestions service");
            throw error;
        }
    },
    async recordClick(query_id, product_id) {
        try {
            await SearchRepository.recordClick(query_id, product_id);
        }
        catch (error) {
            logger.error(error, "Error in recordClick service");
            throw error;
        }
    },
    async getSearchHistory(userId) {
        try {
            return await SearchRepository.getSearchHistory(userId);
        }
        catch (error) {
            logger.error(error, "Error in getSearchHistory service");
            throw error;
        }
    },
    async getPopularSearches() {
        try {
            return await SearchRepository.getPopularSearches();
        }
        catch (error) {
            logger.error(error, "Error in getPopularSearches service");
            throw error;
        }
    },
};
