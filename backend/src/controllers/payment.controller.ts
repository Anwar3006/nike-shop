import { NextFunction, Request, Response } from "express";
import {
  createPaymentIntent,
  handleStripeWebhook,
} from "../services/payment.service.js";
import { logger } from "../utils/logger.js";
import { catchAsync } from "../errors/errorHandler.js";
import AppError from "../errors/AppError.js";

export const createPaymentIntentHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, cart, shippingAddressId } = req.body;
      if (!amount || amount < 50) {
        return next(new AppError("Invalid amount. Minimum is $0.50.", 400));
      }

      const userId = req?.user?.id;
      if (!userId) {
        return next(new AppError("User not found, please login", 401));
      }
      const { clientSecret } = await createPaymentIntent(
        amount,
        userId,
        shippingAddressId,
        cart
      );
      res.status(200).json({ clientSecret });
    } catch (error: unknown) {
      logger.error("Failed to create payment intent: " + error);
      res.status(500).json({ message: "Internal server error", error });
    }
  }
);

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  try {
    await handleStripeWebhook(signature, req.body);
    res.status(200).send({ received: true });
  } catch (error: any) {
    logger.error(`Webhook Error: ${error.message}`);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
