import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db/index.js";
import {
  API_URL,
  BETTER_AUTH_SECRET,
  FRONTEND_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NODE_ENV,
} from "../config/default.js";
import { account, session, user, verification } from "../models/index.js";

if (!BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not defined");
}

console.log("NODE_ENV==", NODE_ENV);

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: { user, account, verification, session },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [FRONTEND_URL!, "http://localhost:3000"],
  socialProviders: {
    google: {
      enabled: true,
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      redirectURI: `${API_URL}/api/auth/callback/google`,
    },
    github: {
      enabled: true,
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
      redirectURI: `${API_URL}/api/auth/callback/github`,
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
          secure: NODE_ENV === "production",
          sameSite: "none",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        },
      },
    },
  },
  rateLimit: {
    enabled: true,
    window: 60, //1 min
    max: 5, // 5 attempts per minute
  },
  plugins: [nextCookies()],
});
