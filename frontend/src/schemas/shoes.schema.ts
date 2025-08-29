import { object, output, string } from "zod";

const getShoesSchema = object({
  query: object({
    limit: string().min(1, "Limit must be at least 1"),
    offset: string().min(0, "Offset must be non-negative"),

    sort: string().optional(),
    color: string().optional(),
    gender: string().optional(),
    size: string().optional(),
    minPrice: string().optional(),
    maxPrice: string().optional(),
  }),
});
export type GetShoesSchemaType = output<typeof getShoesSchema>;
