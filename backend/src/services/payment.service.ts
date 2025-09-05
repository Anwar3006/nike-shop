import Stripe from "stripe";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../config/default";
import { db } from "../db";
import { orders } from "../models";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export const createPaymentIntent = async (
  amount: number,
  userId: string,
  shippingAddressId: string
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  await db.insert(orders).values({
    userId,
    totalAmount: amount,
    shippingAddressId,
    paymentIntentId: paymentIntent.id,
    status: "pending",
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
