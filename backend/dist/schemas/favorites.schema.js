import { z } from "zod";
export const addFavoriteSchema = z.object({
    body: z.object({
        shoeId: z.string().min(1, "Shoe ID is required"),
    }),
});
export const getFavoritesSchema = z.object({
    query: z.object({
        limit: z.string().optional(),
        offset: z.string().optional(),
    }),
});
export const checkFavoriteSchema = z.object({
    query: z.object({
        shoeId: z.string().min(1, "Shoe ID is required"),
    }),
});
