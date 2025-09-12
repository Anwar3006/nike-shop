import Stripe from "stripe";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../config/default";
import { db } from "../db";
import { orderItems, orders } from "../models/orders.model";
import type { NewOrderItem } from "../models/orders.model";
import { and, eq, sql } from "drizzle-orm";
import { logger } from "../utils/logger";
import AppError from "../errors/AppError";
import { shoeVariants } from "../models/variants.model";
import { colors } from "../models/filters/colors.model";
import { sizes } from "../models/filters/sizes.model";
import { payments } from "../models";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

export const createPaymentIntent = async (
  amount: number,
  userId: string,
  shippingAddressId: string,
  cartItems: CartItemData[]
) => {
  let paymentIntent: Stripe.PaymentIntent;

  await db.transaction(async (tx) => {
    try {
      // Step 1: Fetch details and verify stock for all cart items
      const detailedCartItems = await Promise.all(
        cartItems.map(async (item) => {
          const [color] = await tx
            .select()
            .from(colors)
            .where(eq(colors.name, item.color));
          const [size] = await tx
            .select()
            .from(sizes)
            .where(eq(sizes.value, item.size));

          if (!color || !size) {
            throw new AppError(
              `Invalid color or size for item ${item.name}`,
              400
            );
          }

          const [variant] = await tx
            .select()
            .from(shoeVariants)
            .where(
              and(
                eq(shoeVariants.shoeId, item.shoeId),
                eq(shoeVariants.colorId, color.id),
                eq(shoeVariants.sizeId, size.id)
              )
            );

          if (!variant || variant.inStock < item.quantity) {
            throw new AppError(
              `Not enough stock for ${item.name} (Size: ${item.size}, Color: ${item.color}). Available: ${variant?.inStock}, Requested: ${item.quantity}`,
              400
            );
          }
          return {
            ...item,
            shoeVariantId: variant.id,
            priceAtPurchase: variant.price,
          };
        })
      );

      // Step 2: Create the order
      const [order] = await tx
        .insert(orders)
        .values({
          userId,
          totalAmount: String(amount),
          shippingAddressId,
          billingAddressId: shippingAddressId, // Assuming shipping and billing are the same for now
          status: "pending",
        })
        .returning();

      if (!order) {
        throw new AppError("Failed to create order", 500);
      }

      paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId,
          orderId: order.id,
        },
      });

      // Step 3: Create order items and decrement stock
      const orderItemsToInsert: NewOrderItem[] = detailedCartItems.map(
        (item) => ({
          orderId: order.id,
          shoeVariantId: item.shoeVariantId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        })
      );

      await tx.insert(orderItems).values(orderItemsToInsert);

      for (const item of detailedCartItems) {
        await tx
          .update(shoeVariants)
          .set({
            inStock: sql`${shoeVariants.inStock} - ${item.quantity}`,
          })
          .where(eq(shoeVariants.id, item.shoeVariantId));
      }
    } catch (error: unknown) {
      logger.error("Error during payment transaction, rolling back: " + error);
      throw error;
    }
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};

export const handleStripeWebhook = async (signature: string, body: Buffer) => {
  const webhookSecret = STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    throw new Error("Webhook signature verification failed.");
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logger.info(`PaymentIntent ${paymentIntent.id} was successful!`);

      // Find the order in the database and update its status

      await db.transaction(async (tx) => {
        await tx
          .update(orders)
          .set({ status: "completed" })
          .where(eq(orders.id, paymentIntent.metadata.orderId));

        await tx
          .update(payments)
          .set({ status: "completed", paidAt: new Date(), method: "stripe" })
          .where(eq(payments.transactionId, paymentIntent.id));
      });

      break;
    case "payment_intent.payment_failed":
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
      logger.warn(`PaymentIntent ${paymentIntentFailed.id} failed.`);
      // Optionally, update the order status to "failed"
      break;
    default:
      logger.info(`Unhandled event type ${event.type}`);
  }

  return;
};
