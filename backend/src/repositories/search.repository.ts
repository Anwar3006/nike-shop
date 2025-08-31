import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../db";
import { popular_searches, search_clicks, search_queries } from "../models/search.model";
import { shoes, category } from "../models";
import { alias } from "drizzle-orm/pg-core";

export const SearchRepository = {
  async getSearchResults(query: string) {
    const searchWords = query.split(" ").filter(Boolean);

    if (searchWords.length === 0) {
      return {
        data: [],
        meta: {
          total: 0,
          hasNext: false,
          nextPage: undefined,
        },
      };
    }
    const searchConditions = and(
      ...searchWords.map((word) =>
        ilike(shoes.name, `%${word.toLowerCase()}%`)
      )
    );
    try {
      const results = await db
        .select({
          id: shoes.id,
          name: shoes.name,
          basePrice: shoes.basePrice,
          baseImage: shoes.baseImage,
          category: category.name,
        })
        .from(shoes)
        .leftJoin(category, eq(shoes.categoryId, category.id))
        .where(searchConditions)
        .limit(30);

      return {
        data: results,
        meta: {
          total: results.length,
          hasNext: false,
          nextPage: undefined,
        },
      };
    } catch (error) {
      console.error("Error in getSearchResults:", error);
      throw new Error("Could not fetch search results");
    }
  },

  async getAutocompleteSuggestions(query: string) {
    const simplifiedQuery = query.trim().toLowerCase();
    if (!simplifiedQuery) {
      return [];
    }

    try {
      const shoeSuggestions = await db
        .selectDistinct({
          name: shoes.name,
        })
        .from(shoes)
        .where(ilike(shoes.name, `%${simplifiedQuery}%`))
        .limit(10);

      const popularSuggestions = await db
        .select({
          query: popular_searches.query,
        })
        .from(popular_searches)
        .where(ilike(popular_searches.query, `%${simplifiedQuery}%`))
        .limit(5);

      const combined = [
        ...shoeSuggestions.map((s) => s.name),
        ...popularSuggestions.map((p) => p.query),
      ];
      const unique = [...new Set(combined)];

      return unique.slice(0, 10);
    } catch (error) {
      console.error("Error in getAutocompleteSuggestions:", error);
      // Don't throw, just return empty array on error
      return [];
    }
  },

  async recordSearchQuery(
    query: string,
    results_count: number,
    userId?: string,
    ip_address?: string
  ) {
    // This will not work until the user creates the `search_queries` table.
    try {
      const [searchQuery] = await db
        .insert(search_queries)
        .values({
          query,
          results_count,
          user_id: userId,
          ip_address,
        })
        .returning();
      return searchQuery;
    } catch (error) {
      console.error("Error recording search query:", error);
      // Fail silently
    }
  },

  async recordClick(query_id: string, product_id: string) {
    // This will not work until the user creates the `search_clicks` table.
    try {
      await db.insert(search_clicks).values({ query_id, product_id });
    } catch (error) {
      console.error("Error recording search click:", error);
      // Fail silently
    }
  },

  async getSearchHistory(userId: string) {
    // This will not work until the user creates the `search_queries` table.
    try {
      return await db
        .selectDistinct({ query: search_queries.query })
        .from(search_queries)
        .where(eq(search_queries.user_id, userId))
        .orderBy(desc(search_queries.search_timestamp))
        .limit(10);
    } catch (error) {
      console.error("Error fetching search history:", error);
      return [];
    }
  },

  async getPopularSearches() {
    // This will not work until the user creates the `popular_searches` table.
    try {
      return await db
        .select()
        .from(popular_searches)
        .orderBy(desc(popular_searches.search_count))
        .limit(10);
    } catch (error) {
      console.error("Error fetching popular searches:", error);
      return [];
    }
  },

  async upsertPopularSearch(query: string) {
    // This will not work until the user creates the `popular_searches` table.
    try {
      await db
        .insert(popular_searches)
        .values({ query, search_count: 1 })
        .onConflictDoUpdate({
          target: popular_searches.query,
          set: {
            search_count: sql`${popular_searches.search_count} + 1`,
          },
        });
    } catch (error) {
      console.error("Error upserting popular search:", error);
    }
  },
};
