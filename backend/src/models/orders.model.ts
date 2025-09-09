import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { InferInsertModel, relations } from "drizzle-orm";
import { nanoid } from "nanoid";
import { user, address } from "./auth-model.js";

export const orders = pgTable("orders", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid(21)),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: varchar("status", {
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
  })
    .default("pending")
    .notNull(),
  totalAmount: integer("total_amount").notNull(),
  shippingAddressId: varchar("shipping_address_id")
    .notNull()
    .references(() => address.id, { onDelete: "set null" }),
  paymentIntentId: varchar("payment_intent_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// name: string;
// image: string;
// color: string | undefined;
// price: number;
// quantity: number;
// size: string;

export const orderItems = pgTable(
  "order_items",
  {
    orderId: varchar("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    // Storing as a composite key of colorVariantId and sizeId
    colorVariantId: varchar("color_variant_id").notNull(),
    sizeId: integer("size_id").notNull(),
    quantity: integer("quantity").notNull(),
    price: integer("price").notNull(), // Price at the time of purchase
    name: text().notNull(),
    image: text().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.orderId, table.colorVariantId, table.sizeId],
    }),
  ]
);
export type OrderInsert = InferInsertModel<typeof orders>;

// RELATIONS

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  shippingAddress: one(address, {
    fields: [orders.shippingAddressId],
    references: [address.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  // We can't create a direct relation to shoeSizes because it has a composite key
  // and Drizzle doesn't support relations on composite keys yet.
  // We can fetch this information manually when needed.
}));
export type OrderItemInsert = InferInsertModel<typeof orderItems>;
