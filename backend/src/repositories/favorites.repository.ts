import { db } from "../db";
import { favorites } from "../models/favorites.model";
import { eq, and, desc, sql } from "drizzle-orm";

export const FavoritesRepository = {
  getFavorites: async (userId: string, query: any) => {
    const limit = parseInt(query.limit) || 10;
    const offset = parseInt(query.offset) || 0;

    const userFavorites = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      orderBy: desc(favorites.createdAt),
      limit: limit,
      offset: offset,
      with: {
        shoe: {
          with: {
            category: true,
          },
        },
      },
    });

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(favorites)
      .where(eq(favorites.userId, userId));

    return {
      data: userFavorites,
      count: Number(totalCount[0].count),
    };
  },

  addFavorite: async (userId: string, shoeId: string) => {
    try {
      const [favorite] = await db
        .insert(favorites)
        .values({ shoeId, userId })
        .returning();

      return favorite;
    } catch (error) {
      console.error("Error adding favorite: ", error);
      throw error;
    }
  },

  removeFavorite: async (userId: string, favoriteId: string) => {
    try {
      const [found] = await db
        .select()
        .from(favorites)
        .where(and(eq(favorites.id, favoriteId), eq(favorites.userId, userId)));
      if (!found) {
        throw new Error("Favorite with id: " + favoriteId + " not found");
      }
      await db
        .delete(favorites)
        .where(and(eq(favorites.id, favoriteId), eq(favorites.userId, userId)));
    } catch (error) {
      console.error("Error adding favorite: ", error);
      throw error;
    }
  },

  checkIsFavorite: async (userId: string, shoeId: string) => {
    try {
      const [found] = await db
        .select()
        .from(favorites)
        .where(and(eq(favorites.shoeId, shoeId), eq(favorites.userId, userId)));
      return found || null;
    } catch (error) {
      console.error("Error adding favorite: ", error);
      throw error;
    }
  },
};
