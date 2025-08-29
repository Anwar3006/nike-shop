import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db";
import {
  FRONTEND_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../config/default";
import { account, session, user, verification } from "../models";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: { user, account, verification, session },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [FRONTEND_URL!],
  socialProviders: {
    google: {
      enabled: true,
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    },
    github: {
      enabled: true,
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  advanced: {
    cookies: {
      session_token: {
        name: "nike-shop.session_token",
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        },
      },
    },
  },
  plugins: [nextCookies()],
  rateLimit: {
    enabled: true,
    window: 60, //1 min
    max: 5, // 5 attempts per minute
  },
});
