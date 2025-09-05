import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
export const {
  PORT,
  VERSION,
  NODE_ENV,
  BETTER_AUTH_SECRET,
  DATABASE_URL,
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} = process.env;
