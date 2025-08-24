import {
  check,
  decimal,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { ProductDefaultDescription } from "../db/seed/data";
import { sql } from "drizzle-orm";

export const shoes = pgTable("shoes", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid(12)),
  name: varchar("name").notNull(),
  description: text("description").default(ProductDefaultDescription),
  category: varchar("category"), // "Women's Shoes"
  styleNumber: varchar("style_number"), // "HM9451-600"
  basePrice: integer("base_price"), // Base price before size variations
});

//TODO: add fields for EUR sizes, US sizes
export const sizes = pgTable(
  "sizes",
  {
    id: serial("id").primaryKey(),
    size: decimal("size", { precision: 3, scale: 1 }).notNull(), // e.g., 7.5, 8, 8.5
  },
  (table) => [check("size_increment_check", sql`(${table.size} * 2) % 1 = 0`)]
);

export const colorVariant = pgTable("colorVariant", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid(18)),
  shoeId: varchar("shoe_id")
    .notNull()
    .references(() => shoes.id),
  name: varchar("name").notNull(),
  dominantColor: varchar("dominant_color").notNull(),
});

export const shoeSizes = pgTable(
  "shoe_sizes",
  {
    colorVariantId: varchar("color_variant_id")
      .notNull()
      .references(() => shoes.id),
    sizeId: integer("size_id")
      .notNull()
      .references(() => sizes.id),
    price: integer("price").notNull(), // Price for this shoe at this size
    quantity: integer("quantity").notNull().default(0), // Quantity available for this shoe at this size
  },
  (table) => [
    primaryKey({
      name: "shoe_size_pkey",
      columns: [table.colorVariantId, table.sizeId],
    }),
  ]
);

export const images = pgTable("variant_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  colorVariantId: varchar("color_variant_id")
    .notNull()
    .references(() => colorVariant.id),
  imageUrl: varchar("url").notNull(),
  altText: varchar("alt_text"),
});
