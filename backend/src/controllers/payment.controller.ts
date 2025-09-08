import { Request, Response } from "express";
import {
  createPaymentIntent,
  handleStripeWebhook,
} from "../services/payment.service";
import { logger } from "../utils/logger";

export const createPaymentIntentHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { amount, cart } = req.body;
    if (!amount || amount < 50) {
      return res
        .status(400)
        .json({ message: "Invalid amount. Minimum is $0.50." });
    }

    const userId = req?.user?.id;
    const mockAddressId = "addr_2i3h4g23j4g23j4g23j4g";
    const { clientSecret } = await createPaymentIntent(
      amount,
      userId as string,
      mockAddressId,
      cart
    );
    res.status(200).json({ clientSecret });
  } catch (error: any) {
    logger.error("Failed to create payment intent:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

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
