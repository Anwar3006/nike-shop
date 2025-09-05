import { Router, raw } from "express";
import {
  createPaymentIntentHandler,
  stripeWebhookHandler,
} from "../controllers/payment.controller";

const router = Router();

router.post("/create-payment-intent", createPaymentIntentHandler);

router.post("/webhook", raw({ type: "application/json" }), stripeWebhookHandler);

export default router;
