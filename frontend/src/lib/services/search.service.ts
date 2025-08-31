import {
  AutocompleteApiResponse,
  PopularSearchesApiResponse,
  SearchApiResponse,
  SearchHistoryApiResponse,
} from "@/types/search";
import axiosClient from "../api/client";

const SearchService = {
  async getSearchResults(
    query: string,
    offset: number = 0,
    limit: number = 10
  ): Promise<SearchApiResponse> {
    try {
      const response = await axiosClient.get("/search", {
        params: { q: query, offset, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching search results:", error);
      throw new Error("Failed to fetch search results");
    }
  },

  async getAutocompleteSuggestions(
    query: string
  ): Promise<AutocompleteApiResponse> {
    try {
      const response = await axiosClient.get("/search/autocomplete", {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching autocomplete suggestions:", error);
      throw new Error("Failed to fetch autocomplete suggestions");
    }
  },

  async recordClick(query_id: string, product_id: string): Promise<void> {
    try {
      await axiosClient.post("/search/click", { query_id, product_id });
    } catch (error) {
      console.error("Error recording search click:", error);
      // Fail silently on the client, but still throw to be caught by mutation
      throw new Error("Failed to record click");
    }
  },

  async getSearchHistory(): Promise<SearchHistoryApiResponse> {
    try {
      const response = await axiosClient.get("/search/history");
      return response.data;
    } catch (error) {
      console.error("Error fetching search history:", error);
      throw new Error("Failed to fetch search history");
    }
  },

  async getPopularSearches(): Promise<PopularSearchesApiResponse> {
    try {
      const response = await axiosClient.get("/search/popular");
      return response.data;
    } catch (error) {
      console.error("Error fetching popular searches:", error);
      throw new Error("Failed to fetch popular searches");
    }
  },
};

export default SearchService;
