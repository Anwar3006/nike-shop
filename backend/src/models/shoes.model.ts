import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "./categories.model";
import { genders } from "./filters/genders.model";
import { brands } from "./brands.model";
import { shoeVariants } from "./variants.model";
import { relations } from "drizzle-orm";
import { reviews } from "./reviews.model";
import { shoeImages } from "./images.model";

export const shoes = pgTable("shoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  genderId: uuid("gender_id")
    .references(() => genders.id)
    .notNull(),
  brandId: uuid("brand_id")
    .references(() => brands.id)
    .notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  defaultVariantId: uuid("default_variant_id").references(
    (): any => shoeVariants.id
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shoesRelations = relations(shoes, ({ one, many }) => ({
  category: one(categories, {
    fields: [shoes.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [shoes.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [shoes.brandId],
    references: [brands.id],
  }),
  defaultVariant: one(shoeVariants, {
    fields: [shoes.defaultVariantId],
    references: [shoeVariants.id],
  }),
  variants: many(shoeVariants),
  reviews: many(reviews),
  images: many(shoeImages),
}));

export const insertShoeSchema = createInsertSchema(shoes);
export const selectShoesSchema = createSelectSchema(shoes);
export type Shoe = z.infer<typeof selectShoesSchema>;
export type NewShoe = z.infer<typeof insertShoeSchema>;
