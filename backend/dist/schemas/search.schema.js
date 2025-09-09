import { z } from "zod";
export const getSearchResultsSchema = z.object({
    query: z.object({
        q: z.string().min(1, "Search query is required"),
    }),
    params: z.object({
        userId: z.string().optional(),
    }),
});
export const getAutocompleteSchema = z.object({
    query: z.object({
        q: z.string().min(1, "Search query is required"),
    }),
});
export const recordClickSchema = z.object({
    body: z.object({
        query_id: z.string(),
        product_id: z.string(),
    }),
});
