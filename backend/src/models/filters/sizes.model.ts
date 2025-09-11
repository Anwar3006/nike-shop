import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const sizes = pgTable("sizes", {
  id: uuid("id").primaryKey().defaultRandom(),
  value: text("value").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertSizeSchema = createInsertSchema(sizes);
export const selectSizeSchema = createSelectSchema(sizes);
export type Size = z.infer<typeof selectSizeSchema>;
export type NewSize = z.infer<typeof insertSizeSchema>;
