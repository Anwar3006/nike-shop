import Stripe from "stripe";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../config/default";
import { db } from "../db";
import {
  colorVariant,
  OrderItemInsert,
  orderItems,
  orders,
  shoeSizes,
  sizes,
} from "../models";
import { and, eq, sql } from "drizzle-orm";
import { logger } from "../utils/logger";
import AppError from "../errors/AppError";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

export const createPaymentIntent = async (
  amount: number,
  userId: string,
  shippingAddressId: string,
  cartItem: CartItemData[]
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  await db.transaction(async (tx) => {
    try {
      // Step 1: Fetch details and verify stock for all cart items
      const detailedCartItems = await Promise.all(
        cartItem.map(async (item) => {
          const itemColor =
            item.color.charAt(0).toUpperCase() + item.color.slice(1);
          const [color_variant] = await tx
            .select()
            .from(colorVariant)
            .where(
              and(
                eq(colorVariant.shoeId, item.shoeId),
                eq(colorVariant.dominantColor, itemColor)
              )
            );

          if (!color_variant) {
            throw new AppError(
              `Color variant not found for shoe ${item.shoeId} with color ${itemColor}`,
              400
            );
          }

          const [shoeSizeData] = await tx
            .select()
            .from(shoeSizes)
            .where(
              and(
                eq(shoeSizes.colorVariantId, color_variant.id),
                eq(sizes.size, item.size)
              )
            )
            .leftJoin(sizes, eq(shoeSizes.sizeId, sizes.id));

          if (
            !shoeSizeData?.shoe_sizes ||
            shoeSizeData.shoe_sizes.quantity < item.quantity
          ) {
            throw new AppError(
              `Not enough stock for ${item.name} (Size: ${item.size}, Color: ${item.color}). Available: ${shoeSizeData.shoe_sizes?.quantity}, Requested: ${item.quantity}`,
              400
            );
          }
          return {
            ...item,
            colorVariantId: color_variant.id,
            sizeId: shoeSizeData.shoe_sizes.sizeId,
          };
        })
      );

      // Step 2: Create the order
      const [order] = await tx
        .insert(orders)
        .values({
          userId,
          totalAmount: amount,
          shippingAddressId,
          paymentIntentId: paymentIntent.id,
          status: "pending",
        })
        .returning();

      if (!order) {
        throw new AppError("Failed to create order", 500);
      }

      // Step 3: Create order items and decrement stock
      const orderItemsToInsert: OrderItemInsert[] = detailedCartItems.map(
        (item) => ({
          name: item.name,
          image: item.image,
          orderId: order.id,
          colorVariantId: item.colorVariantId,
          sizeId: item.sizeId,
          quantity: item.quantity,
          price: item.price * item.quantity * 100,
        })
      );

      await tx.insert(orderItems).values(orderItemsToInsert);

      for (const item of detailedCartItems) {
        await tx
          .update(shoeSizes)
          .set({
            quantity: sql`${shoeSizes.quantity} - ${item.quantity}`,
          })
          .where(
            and(
              eq(shoeSizes.colorVariantId, item.colorVariantId),
              eq(shoeSizes.sizeId, item.sizeId)
            )
          );
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
      await db
        .update(orders)
        .set({ status: "processing" })
        .where(eq(orders.paymentIntentId, paymentIntent.id));

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
