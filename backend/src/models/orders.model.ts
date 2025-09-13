import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z, type output } from "zod";
import { user, address } from "./auth-model.js";
import { relations } from "drizzle-orm";
import { shoeVariants } from "./variants.model.js";
import { payments } from "./payments.model.js";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: varchar("shipping_address_id")
    .notNull()
    .references(() => address.id),
  billingAddressId: varchar("billing_address_id")
    .notNull()
    .references(() => address.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  shippingAddress: one(address, {
    fields: [orders.shippingAddressId],
    references: [address.id],
    relationName: "shipping_address",
  }),
  billingAddress: one(address, {
    fields: [orders.billingAddressId],
    references: [address.id],
    relationName: "billing_address",
  }),
  orderItems: many(orderItems),
  payments: many(payments),
}));

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  shoeVariantId: uuid("shoe_variant_id")
    .notNull()
    .references(() => shoeVariants.id),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: numeric("price_at_purchase", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  shoeVariant: one(shoeVariants, {
    fields: [orderItems.shoeVariantId],
    references: [shoeVariants.id],
  }),
}));

export const insertOrderSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  status: z.enum(["pending", "processing", "shipped", "delivered"]).optional(),
  totalAmount: z.string(), // numeric fields are often strings in Drizzle
  shippingAddressId: z.string(),
  billingAddressId: z.string(),
  createdAt: z.date().optional(),
});
export const selectOrderSchema = createSelectSchema(orders);
export type Order = z.infer<typeof selectOrderSchema>;
export type NewOrder = z.infer<typeof insertOrderSchema>;

export const insertOrderItemSchema = createInsertSchema(orderItems);
export const selectOrderItemSchema = createSelectSchema(orderItems);
export type OrderItem = z.infer<typeof selectOrderItemSchema>;
export type NewOrderItem = Omit<OrderItem, "id">;
