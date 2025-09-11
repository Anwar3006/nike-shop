import {
  doublePrecision,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { shoes } from "./shoes.model";
import { colors } from "./filters/colors.model";
import { sizes } from "./filters/sizes.model";
import { relations } from "drizzle-orm";
import { shoeImages } from "./images.model";
import { orderItems } from "./orders.model";

export const shoeVariants = pgTable("shoe_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  shoeId: uuid("shoe_id")
    .notNull()
    .references(() => shoes.id),
  sku: text("sku").notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
  colorId: uuid("color_id").references(() => colors.id),
  sizeId: uuid("size_id").references(() => sizes.id),
  inStock: integer("in_stock").notNull().default(0),
  weight: doublePrecision("weight"),
  dimensions: jsonb("dimensions"), // { length, width, height }
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shoeVariantsRelations = relations(
  shoeVariants,
  ({ one, many }) => ({
    shoe: one(shoes, {
      fields: [shoeVariants.shoeId],
      references: [shoes.id],
    }),
    color: one(colors, {
      fields: [shoeVariants.colorId],
      references: [colors.id],
    }),
    size: one(sizes, {
      fields: [shoeVariants.sizeId],
      references: [sizes.id],
    }),
    images: many(shoeImages),
    orderItems: many(orderItems),
  })
);

export const insertShoeVariantSchema = createInsertSchema(shoeVariants);
export const selectShoeVariantSchema = createSelectSchema(shoeVariants);
export type ShoeVariant = z.infer<typeof selectShoeVariantSchema>;
export type NewShoeVariant = z.infer<typeof insertShoeVariantSchema>;
