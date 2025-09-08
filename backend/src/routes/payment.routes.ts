import { Router, raw } from "express";
import {
  createPaymentIntentHandler,
  stripeWebhookHandler,
} from "../controllers/payment.controller";
import { verifyAuth } from "../middlewares/verfiyAuth.middleware";

const router = Router();

router.post("/create-payment-intent", verifyAuth, createPaymentIntentHandler);

router.post(
  "/webhook",
  raw({ type: "application/json" }),
  stripeWebhookHandler
);

export default router;
