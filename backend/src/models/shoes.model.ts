import {
  check,
  decimal,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
// import { ProductDefaultDescription } from "../db/seed/data";
import { relations, sql } from "drizzle-orm";

export const ProductDefaultDescription = `
is simply dummy text of the printing and typesetting industry. 
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
when an unknown printer took a galley of type and scrambled it to make a type 
specimen book. It has survived not only five centuries, 
but also the leap into electronic typesetting, remaining essentially unchanged. 
It was popularised in the 1960s with the release of Letraset sheets containing 
Lorem Ipsum passages, and more recently with desktop publishing software 
like Aldus PageMaker including versions of Lorem Ipsum.`;

export const category = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // "Women's Shoes", "Men's Shoes", etc.
});

export const shoes = pgTable(
  "shoes",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
    name: varchar("name").notNull(),
    slug: varchar("slug").notNull().unique(),
    description: text("description").default(ProductDefaultDescription),
    categoryId: integer("categoryId")
      .notNull()
      .references(() => category.id),
    basePrice: integer("base_price"), // Base price before size variations
    baseImage: varchar("base_image")
      .notNull()
      .default(
        "https://atlas-content-cdn.pixelsquid.com/stock-images/nike-shoe-box-open-shoebox-047RRRB-600.jpg"
      ),

    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
  },
  (table) => [index("name_index").on(table.name)]
);

//TODO: add fields for EUR sizes, US sizes
export const sizes = pgTable(
  "sizes",
  {
    id: serial("id").primaryKey(),
    size: decimal("size", { precision: 3, scale: 1 }).notNull(), // e.g., 7.5, 8, 8.5
  },
  (table) => [check("size_increment_check", sql`(${table.size} * 2) % 1 = 0`)]
);

export const colorVariant = pgTable(
  "colorVariant",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => nanoid(18)),
    shoeId: varchar("shoe_id")
      .notNull()
      .references(() => shoes.id, { onDelete: "cascade" }),
    name: varchar("name").notNull(),
    dominantColor: varchar("dominant_color").notNull(),
    styleNumber: varchar("style_number").unique(), // "HM9451-600"

    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
  },
  (table) => [uniqueIndex("style_number_index").on(table.styleNumber)]
);

export const shoeSizes = pgTable(
  "shoe_sizes",
  {
    colorVariantId: varchar("color_variant_id")
      .notNull()
      .references(() => colorVariant.id, { onDelete: "cascade" }),
    sizeId: integer("size_id")
      .notNull()
      .references(() => sizes.id, { onDelete: "cascade" }),
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
    .references(() => colorVariant.id, { onDelete: "cascade" }),
  imageUrl: varchar("url").notNull(),
  altText: varchar("alt_text"),
});

// Relations - This is what you were missing!
export const categoriesRelations = relations(category, ({ many }) => ({
  shoes: many(shoes),
}));

export const shoesRelations = relations(shoes, ({ one, many }) => ({
  category: one(category, {
    fields: [shoes.categoryId],
    references: [category.id],
  }),
  colorVariants: many(colorVariant),
}));

export const colorVariantRelations = relations(
  colorVariant,
  ({ one, many }) => ({
    shoe: one(shoes, {
      fields: [colorVariant.shoeId],
      references: [shoes.id],
    }),
    images: many(images),
    shoeSizes: many(shoeSizes),
  })
);

export const imagesRelations = relations(images, ({ one }) => ({
  colorVariant: one(colorVariant, {
    fields: [images.colorVariantId],
    references: [colorVariant.id],
  }),
}));

export const shoeSizesRelations = relations(shoeSizes, ({ one }) => ({
  colorVariant: one(colorVariant, {
    fields: [shoeSizes.colorVariantId],
    references: [colorVariant.id],
  }),
  size: one(sizes, {
    fields: [shoeSizes.sizeId],
    references: [sizes.id],
  }),
}));

export const sizesRelations = relations(sizes, ({ many }) => ({
  shoeSizes: many(shoeSizes),
}));
