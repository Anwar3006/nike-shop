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
import { products } from "./products.model.js";
import { colors } from "./filters/colors.model.js";
import { sizes } from "./filters/sizes.model.js";
import { relations } from "drizzle-orm";
import { productImages } from "./images.model.js";
import { orderItems } from "./orders.model.js";

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
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

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    color: one(colors, {
      fields: [productVariants.colorId],
      references: [colors.id],
    }),
    size: one(sizes, {
      fields: [productVariants.sizeId],
      references: [sizes.id],
    }),
    images: many(productImages),
    orderItems: many(orderItems),
  })
);

export const insertProductVariantSchema = createInsertSchema(productVariants);
export const selectProductVariantSchema = createSelectSchema(productVariants);
export type ProductVariant = z.infer<typeof selectProductVariantSchema>;
export type NewProductVariant = z.infer<typeof insertProductVariantSchema>;
