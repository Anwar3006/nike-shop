import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { products } from "./products.model.js";

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
  productsToCollections: many(productsToCollections),
}));

export const productsToCollections = pgTable(
  "products_to_collections",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.collectionId] }),
  })
);

export const productsToCollectionsRelations = relations(
  productsToCollections,
  ({ one }) => ({
    product: one(products, {
      fields: [productsToCollections.productId],
      references: [products.id],
    }),
    collection: one(collections, {
      fields: [productsToCollections.collectionId],
      references: [collections.id],
    }),
  })
);

export const insertCollectionSchema = createInsertSchema(collections);
export const selectCollectionSchema = createSelectSchema(collections);
export type Collection = z.infer<typeof selectCollectionSchema>;
export type NewCollection = z.infer<typeof insertCollectionSchema>;
