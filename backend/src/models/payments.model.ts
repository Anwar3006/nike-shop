import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { orders } from "./orders.model";
import { relations } from "drizzle-orm";

export const paymentMethodEnum = pgEnum("payment_method", [
  "stripe",
  "paypal",
  "cod",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "initiated",
  "completed",
  "failed",
]);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").notNull(),
  paidAt: timestamp("paid_at"),
  transactionId: text("transaction_id"),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

export const insertPaymentSchema = createInsertSchema(payments);
export const selectPaymentSchema = createSelectSchema(payments);
export type Payment = z.infer<typeof selectPaymentSchema>;
export type NewPayment = z.infer<typeof insertPaymentSchema>;
