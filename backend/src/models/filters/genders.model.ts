import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { shoes } from "../shoes.model.js";
import { relations } from "drizzle-orm";

export const genders = pgTable("genders", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  slug: text("slug").notNull().unique(),
});

export const gendersRelations = relations(genders, ({ many }) => ({
  shoes: many(shoes),
}));

export const insertGenderSchema = createInsertSchema(genders);
export const selectGenderSchema = createSelectSchema(genders);
export type Gender = z.infer<typeof selectGenderSchema>;
export type NewGender = z.infer<typeof insertGenderSchema>;
