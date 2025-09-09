import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { relations, sql } from "drizzle-orm";
import { user } from "./auth-model.js";
import { shoes } from "./shoes.model.js";

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
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdateFn(() => sql`now()`),
  },
  (table) => [
    // Ensure user can't favorite the same item twice
    uniqueIndex("unique_user_shoe_variant").on(table.userId, table.shoeId),
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
}));

// Add to your main models/index.ts export
