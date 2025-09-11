import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "./categories.model.js";
import { genders } from "./filters/genders.model.js";
import { brands } from "./brands.model.js";
import { productVariants } from "./variants.model.js";
import { relations } from "drizzle-orm";
import { reviews } from "./reviews.model.js";
import { productImages } from "./images.model.js";
import { productsToCollections } from "./collections.model.js";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => categories.id).notNull(),
  genderId: uuid("gender_id").references(() => genders.id).notNull(),
  brandId: uuid("brand_id").references(() => brands.id).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  defaultVariantId: uuid("default_variant_id").references(
    (): any => productVariants.id
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [products.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  defaultVariant: one(productVariants, {
    fields: [products.defaultVariantId],
    references: [productVariants.id],
  }),
  variants: many(productVariants),
  reviews: many(reviews),
  images: many(productImages),
  productsToCollections: many(productsToCollections),
}));

export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);
export type Product = z.infer<typeof selectProductSchema>;
export type NewProduct = z.infer<typeof insertProductSchema>;
