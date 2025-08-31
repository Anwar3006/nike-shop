import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-model";
import { relations } from "drizzle-orm";
import { shoes } from "./shoes.model";

export const search_queries = pgTable("search_queries", {
  query_id: uuid("query_id").primaryKey().defaultRandom(),
  user_id: text("user_id").references(() => user.id),
  query: text("query").notNull(),
  results_count: integer("results_count"),
  search_timestamp: timestamp("search_timestamp").defaultNow(),
  ip_address: text("ip_address"),
});

export const search_clicks = pgTable("search_clicks", {
  click_id: text("click_id").primaryKey().default(`gen_random_uuid()`),
  query_id: uuid("query_id").references(() => search_queries.query_id),
  product_id: text("product_id").notNull(),
  click_timestamp: timestamp("click_timestamp").defaultNow(),
});

export const popular_searches = pgTable(
  "popular_searches",
  {
    id: serial("id").primaryKey(),
    query: text("query").notNull(),
    search_count: integer("search_count").default(1),
  },
  (table) => [unique("unique_query").on(table.query)]
);

// Relations
export const searchQueriesRelations = relations(
  search_queries,
  ({ one, many }) => ({
    user: one(user, {
      fields: [search_queries.user_id],
      references: [user.id],
    }),
    clicks: many(search_clicks),
  })
);

export const searchClicksRelations = relations(search_clicks, ({ one }) => ({
  query: one(search_queries, {
    fields: [search_clicks.query_id],
    references: [search_queries.query_id],
  }),
  product: one(shoes, {
    fields: [search_clicks.product_id],
    references: [shoes.id],
  }),
}));
