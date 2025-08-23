import {
  check,
  decimal,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
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
  price: integer("price").notNull(),
  image: varchar("image"),
});

export const sizes = pgTable(
  "sizes",
  {
    id: serial("id").primaryKey(),
    size: decimal("size", { precision: 3, scale: 1 }).notNull(), // e.g., 7.5, 8, 8.5
  },
  (table) => [check("size_increment_check", sql`(${table.size} * 2) % 1 = 0`)]
);

export const shoeSizes = pgTable(
  "shoe_sizes",
  {
    shoeId: varchar("shoe_id")
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
      columns: [table.shoeId, table.sizeId],
    }),
  ]
);

export const color = pgTable("color", {
  id: serial("id").primaryKey(),
  hexCode: varchar("hex_code").notNull(),
});
