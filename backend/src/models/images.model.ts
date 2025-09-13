import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { shoes } from "./shoes.model.js";
import { shoeVariants } from "./variants.model.js";
import { relations } from "drizzle-orm";

export const shoeImages = pgTable("shoe_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  shoeId: uuid("shoe_id")
    .notNull()
    .references(() => shoes.id),
  variantId: uuid("variant_id").references(() => shoeVariants.id),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
});

export const shoeImagesRelations = relations(shoeImages, ({ one }) => ({
  shoe: one(shoes, {
    fields: [shoeImages.shoeId],
    references: [shoes.id],
  }),
  variant: one(shoeVariants, {
    fields: [shoeImages.variantId],
    references: [shoeVariants.id],
  }),
}));

export const insertShoeImageSchema = createInsertSchema(shoeImages);
export const selectShoeImageSchema = createSelectSchema(shoeImages);
export type ShoeImage = z.infer<typeof selectShoeImageSchema>;
export type NewShoeImage = z.infer<typeof insertShoeImageSchema>;
