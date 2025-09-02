// This file should be added to your backend/src/models/ directory
// File: backend/src/models/favorites.model.ts

import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import { user } from "./auth-model";
import { shoes, colorVariant } from "./shoes.model";

export const favorites = pgTable(
  "favorites",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    shoeId: text("shoe_id")
      .notNull()
      .references(() => shoes.id, { onDelete: "cascade" }),
    colorVariantId: text("color_variant_id")
      .references(() => colorVariant.id, { onDelete: "cascade" }), // Optional - for specific color variants
    createdAt: timestamp().defaultNow(),
  },
  (table) => [
    // Ensure user can't favorite the same item twice
    uniqueIndex("unique_user_shoe_variant").on(
      table.userId,
      table.shoeId,
      table.colorVariantId
    ),
  ]
);

// Relations
export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(user, {
    fields: [favorites.userId],
    references: [user.id],
  }),
  shoe: one(shoes, {
    fields: [favorites.shoeId],
    references: [shoes.id],
  }),
  colorVariant: one(colorVariant, {
    fields: [favorites.colorVariantId],
    references: [colorVariant.id],
  }),
}));

// Add to your main models/index.ts export
// export { favorites, favoritesRelations } from "./favorites.model";
