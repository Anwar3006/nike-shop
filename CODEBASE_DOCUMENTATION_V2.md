# Backend Codebase Documentation (V2 - with Source Code)

This document provides a comprehensive analysis of the backend codebase, including the full source code for its functions, allowing a developer to understand its structure, components, and functionality in detail.

---

## **Folder: `src/errors`**

### **File: `AppError.ts`**
- **Primary Purpose:** Defines a custom error class for creating "operational" errors with an HTTP status code and a flag to distinguish them from unexpected programming errors.
- **Source Code:**
  ```typescript
  class AppError extends Error {
    status: string;
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
      this.isOperational = true;

      Error.captureStackTrace(this, this.constructor);
    }
  }

  export default AppError;
  ```

### **File: `errorHandler.ts`**
- **Primary Purpose:** Provides the core error handling logic for the Express application, including a 404 handler, a global error handler, and an async wrapper for controllers.

#### **Function: `NotFound()`**
- **Purpose:** A middleware to catch requests for routes that don't exist and create a 404 `AppError`.
- **Source Code:**
  ```typescript
  export const NotFound = (req: Request, _: Response, next: NextFunction) => {
    const error = new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404
    );
    next(error);
  };
  ```

#### **Function: `sendErrorDev()`**
- **Purpose:** Formats and sends a detailed error response in the development environment, including the stack trace.
- **Source Code:**
  ```typescript
  export const sendErrorDev = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
      status: err.status,
      stack: err.stack,
      error: err,
      message: err.message,
    });
  };
  ```

#### **Function: `sendErrorProd()`**
- **Purpose:** Formats and sends a generic, safe error response in the production environment, avoiding the leak of implementation details.
- **Source Code:**
  ```typescript
  export const sendErrorProd = (err: AppError, res: Response) => {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    logger.error("Error discovered: " + err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  };
  ```

#### **Function: `globalErrorHandler()`**
- **Purpose:** The main Express error handling middleware. It delegates to either `sendErrorDev` or `sendErrorProd` based on the `NODE_ENV`.
- **Source Code:**
  ```typescript
  export const globalErrorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (NODE_ENV === "development") {
      sendErrorDev(err, res);
    } else {
      sendErrorProd(err, res);
    }
  };
  ```

#### **Function: `catchAsync()`**
- **Purpose:** A higher-order function that wraps async route handlers to automatically catch errors and pass them to the `globalErrorHandler`.
- **Source Code:**
  ```typescript
  export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };
  ```
---

## **Folder: `src/middlewares`**

### **File: `validate.middleware.ts`**
- **Primary Purpose:** Provides a reusable, higher-order middleware for validating request data against a Zod schema.
- **Source Code:**
  ```typescript
  import type { NextFunction, Request, Response } from "express";
  import { ZodObject } from "zod";

  const validate =
    (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        next();
      } catch (error: any) {
        return res.status(400).json({
          error: "Validation Error",
          message: JSON.parse(error.message),
        });
      }
    };

  export default validate;
  ```

### **File: `verfiyAuth.middleware.ts`**
- **Primary Purpose:** Provides middlewares for handling user authentication and authorization.

#### **Function: `optionalAuth()`**
- **Purpose:** To check for a user session and attach `req.user` if it exists, but to allow the request to proceed regardless of authentication status.
- **Source Code:**
  ```typescript
  export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const headers = fromNodeHeaders(req.headers);
      const session = await auth.api.getSession({ headers });

      if (session?.user) {
        req.user = session.user;
        req.session = session.session;
        console.log("Optional auth - user authenticated:", req.user.id);
      }

      // Continue regardless of authentication status
      next();
    } catch (error) {
      console.error("Optional auth error:", error);
      // Continue without authentication
      next();
    }
  };
  ```

#### **Function: `verifyAuth()`**
- **Purpose:** To require a valid user session. If no session exists, it ends the request with a 401 Unauthorized error.
- **Source Code:**
  ```typescript
  export const verifyAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Convert Express headers to better-auth compatible format
      const headers = fromNodeHeaders(req.headers);

      // Use better-auth's built-in session validation
      const session = await auth.api.getSession({
        headers,
        query: { disableCookieCache: true },
      });

      if (!session?.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No valid session found",
        });
      }

      // Attach user and session data to request object
      req.user = session.user;
      req.session = session.session;

      console.log("Authenticated user:", req.user.id);
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Session validation failed",
      });
    }
  };
  ```
---

## **Folder: `src/utils`**

### **File: `logger.ts`**
- **Primary Purpose:** Configures a `pino` logger with `pino-pretty` for human-readable logs in development.
- **Source Code:**
  ```typescript
  import dayjs from "dayjs";
  import pino from "pino";

  import { NODE_ENV } from "../config/default.js";

  const isTest = NODE_ENV === "test";

  export const logger = pino({
    // Avoid starting a worker thread in tests
    ...(isTest
      ? {}
      : {
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
            },
          },
        }),
    base: {
      pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
  });
  ```

### **File: `auth.ts`**
- **Primary Purpose:** The central configuration file for the `better-auth` library.
- **Source Code:**
  ```typescript
  import { betterAuth } from "better-auth";
  import { drizzleAdapter } from "better-auth/adapters/drizzle";
  import { db } from "../db/index.js";
  import {
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

  export const auth = betterAuth({
    secret: BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "pg", // or "mysql", "sqlite"
      schema: { user, account, verification, session },
    }),
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        dob: {
          type: "string",
        },
      },
    },
    trustedOrigins: [
      "https://nike-shop-frontend.vercel.app",
      "http://localhost:3000",
    ],
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
      defaultCookieAttributes: {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "none",
        path: "/",
      },
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
  });
  ```

### **File: `cron.ts`**
- **Primary Purpose:** Sets up a "keep-alive" cron job that pings the server's health check endpoint.
- **Source Code:**
  ```typescript
  import { CronJob } from "cron";
  import https from "https";
  import { logger } from "./logger.js";
  import { API_URL, VERSION } from "../config/default.js";

  export const cronJob = new CronJob("*/14 * * * *", () => {
    https.get(`${API_URL}/api/${VERSION}/health`, (res) => {
      res
        .on("end", () => {
          if (res.statusCode === 200) {
            logger.info("✅ Cron job health check successful");
          } else {
            logger.warn("⚠️ Health check returned non-200 status");
          }
        })
        .on("error", (err) => {
          logger.error("❌ Cron job health check failed");
        });
    });
  });
  ```

### **File: `helpers.ts`**
- **Primary Purpose:** Contains miscellaneous helper functions.

#### **Function: `sanitizeUpdateData()`**
- **Source Code:**
  ```typescript
  export function sanitizeUpdateData<T extends Record<string, any>>(
    data: T
  ): Partial<T> {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => {
        if (value === undefined || value === null) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        return true;
      })
    ) as Partial<T>;
  }
  ```

#### **Function: `parseSizeRange()`**
- **Source Code:**
  ```typescript
  export function parseSizeRange(
    sizeParam: string | null
  ): { min: string; max: string } | null {
    if (!sizeParam || !sizeParam.includes("-")) return null;

    const [min, max] = sizeParam.split("-");
    return { min, max };
  }
  ```

### **File: `slugify.ts`**
- **Primary Purpose:** A wrapper around the `slugify` library to generate URL-friendly slugs.
- **Source Code:**
  ```typescript
  import slugify from "slugify";

  export const createSlug = (text: string) => {
    return slugify(text, {
      lower: true,
      strict: true,
      replacement: "-",
    });
  };
  ```
---

## **Folder: `src/controllers`**

### **File: `favorites.controller.ts`**
- **Primary Purpose:** Handles HTTP requests related to a user's favorite shoes.
- **Source Code for `FavoritesController` methods:**
  ```typescript
  export const FavoritesController = {
    getFavorites: catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = req?.user?.id!; // From auth middleware
        const favorites = await FavoritesService.getFavorites(userId, req.query);
        res.status(200).json({
          success: true,
          data: favorites.data,
          count: favorites.count,
        });
      }
    ),

    addFavorite: catchAsync(
      async (
        req: Request<{}, {}, AddFavoriteSchemaType["body"]>,
        res: Response,
        next: NextFunction
      ) => {
        const userId = req?.user?.id!; // From auth middleware
        const favorite = await FavoritesService.addFavorite(
          userId,
          req.body.shoeId
        );
        res.status(201).json({ success: true, data: favorite });
      }
    ),

    removeFavorite: catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = req?.user?.id!; // From auth middleware
        const favoriteId = req.params.id;
        await FavoritesService.removeFavorite(userId, favoriteId);
        res.status(200).json({ success: true, message: "Favorite removed" });
      }
    ),

    checkIsFavorite: catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = req?.user?.id!; // From auth middleware
        const { shoeId } = req.query;
        const result = await FavoritesService.checkIsFavorite(
          userId,
          shoeId as string
        );

        res.status(200).json({
          isFavorite: !!result,
          favoriteId: result?.id || undefined,
        });
      }
    ),
  };
  ```

### **File: `payment.controller.ts`**
- **Primary Purpose:** Handles HTTP requests related to payments.
- **Source Code for handlers:**
  ```typescript
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
  ```

### **File: `search.controller.ts`**
- **Primary Purpose:** Handles HTTP requests related to search.
- **Source Code for `SearchController` methods:**
  ```typescript
  export const SearchController = {
    getSearchResults: catchAsync(
      async (
        req: Request<
          GetSearchResultsSchemaType["params"],
          {},
          {},
          GetSearchResultsSchemaType["query"]
        >,
        res: Response,
        next: NextFunction
      ) => {
        const { q } = req.query;
        const userId = req.user?.id;

        // @ts-ignore
        const ip_address = req.ip;
        const results = await SearchService.getSearchResults(
          q,
          userId,
          ip_address
        );
        res.status(200).json({ success: true, ...results });
      }
    ),

    getAutocompleteSuggestions: catchAsync(
      async (
        req: Request<{}, {}, {}, GetAutocompleteSchemaType["query"]>,
        res: Response,
        next: NextFunction
      ) => {
        const { q } = req.query;
        const suggestions = await SearchService.getAutocompleteSuggestions(q);
        res.status(200).json({ success: true, data: suggestions });
      }
    ),

    recordClick: catchAsync(
      async (
        req: Request<{}, {}, RecordClickSchemaType["body"]>,
        res: Response,
        next: NextFunction
      ) => {
        const { query_id, product_id } = req.body;
        await SearchService.recordClick(query_id, product_id);
        res.status(204).send();
      }
    ),

    getSearchHistory: catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;

        if (!userId) {
          return new AppError("Unauthorized", 401);
        }
        const history = await SearchService.getSearchHistory(userId);
        res.status(200).json({ success: true, data: history });
      }
    ),

    getPopularSearches: catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const popularSearches = await SearchService.getPopularSearches();
        res.status(200).json({ success: true, data: popularSearches });
      }
    ),
  };
  ```

### **File: `shoes.controller.ts`**
- **Primary Purpose:** Handles HTTP requests for shoes.
- **Source Code for `ShoesController` methods:**
  ```typescript
  export const ShoesController = {
    createShoe: catchAsync(
      async (
        req: Request<{}, {}, CreateShoeSchemaType["body"]>,
        res: Response,
        next: NextFunction
      ) => {
        const newShoe = await ShoesService.createShoe(req.body);
        res.status(201).json({
          success: true,
          data: newShoe,
        });
      }
    ),

    updateShoe: catchAsync(
      async (
        req: Request<{ id: string }, {}, UpdateShoeSchemaType["body"]>,
        res: Response,
        next: NextFunction
      ) => {
        const updatedShoe = await ShoesService.updateShoe(
          req.params.id,
          req.body
        );
        res.status(200).json({
          success: true,
          data: updatedShoe,
        });
      }
    ),

    deleteShoe: catchAsync(
      async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const deletedShoe = await ShoesService.deleteShoe(req.params.id);
        res.status(200).json({
          success: true,
          data: deletedShoe,
        });
      }
    ),

    getShoeById: catchAsync(
      async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const shoe = await ShoesService.getShoeById(req.params.id);
        res.status(200).json({
          success: true,
          data: shoe,
        });
      }
    ),

    getShoeBySlug: catchAsync(
      async (
        req: Request<{ slug: string }>,
        res: Response,
        next: NextFunction
      ) => {
        const shoe = await ShoesService.getShoeBySlug(req.params.slug);
        res.status(200).json({
          success: true,
          data: shoe,
        });
      }
    ),

    getAllShoes: catchAsync(
      async (
        req: Request<{}, {}, {}, GetShoesSchemaType["query"]>,
        res: Response,
        next: NextFunction
      ) => {
        const shoes = await ShoesService.getShoes(req.query);
        res.status(200).json({
          success: true,
          ...shoes,
        });
      }
    ),
  };
  ```

### **File: `userInfo.controller.ts`**
- **Primary Purpose:** Handles HTTP requests for user information.
- **Source Code for `UserInfoController` methods:**
  ```typescript
  export const UserInfoController = {
    getUserInfo: catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = req?.user?.id;
        if (!userId) return next(new AppError("UserId not Found", 401));

        const userInfo = await UserInfoService.getUserInfo(userId);
        res.status(200).json({
          status: "success",
          data: userInfo,
        });
      }
    ),

    updateInfo: catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = req?.user?.id;
        if (!userId) return new AppError("UserId not Found", 401);

        const { firstName, lastName, phone, dob } = req.body;

        if (!firstName || !lastName || !phone || !dob) {
          return next(new AppError("All Fields are required", 404));
        }

        const name = firstName + " " + lastName;
        const updatedUserInfo = await UserInfoService.updateInfo(
          userId,
          name,
          phone,
          dob
        );

        res.status(200).json({
          status: "success",
          data: updatedUserInfo,
        });
      }
    ),

    upsertAddress: catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = req?.user?.id;
        if (!userId) return new AppError("UserId not Found", 401);

        const insertedAddress = await UserInfoService.upsertAddress(
          userId,
          req.body
        );
        if (!insertedAddress) {
          return next(new AppError("Failed to insert address", 500));
        }

        res.status(201).json({
          status: "success",
          data: insertedAddress,
        });
      }
    ),

    deleteAddress: catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = req?.user?.id;
        if (!userId) return new AppError("UserId not Found", 401);

        const { addressId } = req.params;
        if (!addressId) {
          return next(new AppError("Address ID is required", 400));
        }

        const deletedAddress = await UserInfoService.deleteAddress(
          userId,
          addressId
        );
        if (!deletedAddress) {
          return next(new AppError("Failed to delete address", 500));
        }

        res.status(200).json({
          status: "success",
          data: deletedAddress,
        });
      }
    ),
  };
  ```
---

## **Folder: `src/services`**

### **File: `favorites.service.ts`**
- **Primary Purpose:** Implements the business logic for managing a user's favorite shoes.
- **Source Code:**
  ```typescript
  import { logger } from "../utils/logger.js";
  import { FavoritesRepository } from "../repositories/favorites.repository.js";

  export const FavoritesService = {
    getFavorites: async (userId: string, query: any) => {
      try {
        const favorites = await FavoritesRepository.getFavorites(userId, query);
        return favorites;
      } catch (error) {
        logger.error("Error fetching favorites: " + error);
        throw error;
      }
    },
    addFavorite: async (userId: string, shoeId: string) => {
      try {
        const favorite = await FavoritesRepository.addFavorite(userId, shoeId);
        return favorite;
      } catch (error) {
        logger.error("Error adding favorite: " + error);
        throw error;
      }
    },
    removeFavorite: async (userId: string, favoriteId: string) => {
      try {
        const result = await FavoritesRepository.removeFavorite(
          userId,
          favoriteId
        );
        return result;
      } catch (error) {
        logger.error("Error removing favorite: " + error);
        throw error;
      }
    },
    checkIsFavorite: async (userId: string, shoeId: string) => {
      try {
        const favorite = await FavoritesRepository.checkIsFavorite(
          userId,
          shoeId
        );

        return favorite;
      } catch (error) {
        logger.error("Error checking favorite: " + error);
        // Return null if there's an error checking favorite status
        return null;
      }
    },
  };
  ```

### **File: `payment.service.ts`**
- **Primary Purpose:** Implements the core business logic for handling payments and orders.
- **Source Code:**
  ```typescript
  import Stripe from "stripe";
  import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../config/default.js";
  import { db } from "../db/index.js";
  import { orderItems, orders } from "../models/orders.model.js";
  import type { NewOrderItem } from "../models/orders.model.js";
  import { and, eq, sql } from "drizzle-orm";
  import { logger } from "../utils/logger.js";
  import AppError from "../errors/AppError.js";
  import { shoeVariants } from "../models/variants.model.js";
  import { colors } from "../models/filters/colors.model.js";
  import { sizes } from "../models/filters/sizes.model.js";
  import { payments } from "../models/payments.model.js";

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
            .set({ status: "paid" })
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
  ```

### **File: `search.service.ts`**
- **Primary Purpose:** Implements the business logic for search-related functionality.
- **Source Code:**
  ```typescript
  import { SearchRepository } from "../repositories/search.repository.js";
  import { logger } from "../utils/logger.js";

  export const SearchService = {
    async getSearchResults(query: string, userId?: string, ip_address?: string) {
      try {
        const results = await SearchRepository.getSearchResults(query);
        // Fire-and-forget the logging and popular search update
        SearchRepository.recordSearchQuery(
          query,
          results.data.length,
          userId,
          ip_address
        );
        SearchRepository.upsertPopularSearch(query);
        return results;
      } catch (error) {
        logger.error(error, "Error in getSearchResults service");
        throw error;
      }
    },

    async getAutocompleteSuggestions(query: string) {
      try {
        return await SearchRepository.getAutocompleteSuggestions(query);
      } catch (error) {
        logger.error(error, "Error in getAutocompleteSuggestions service");
        throw error;
      }
    },

    async recordClick(query_id: string, product_id: string) {
      try {
        await SearchRepository.recordClick(query_id, product_id);
      } catch (error) {
        logger.error(error, "Error in recordClick service");
        throw error;
      }
    },

    async getSearchHistory(userId: string) {
      try {
        return await SearchRepository.getSearchHistory(userId);
      } catch (error) {
        logger.error(error, "Error in getSearchHistory service");
        throw error;
      }
    },

    async getPopularSearches() {
      try {
        return await SearchRepository.getPopularSearches();
      } catch (error) {
        logger.error(error, "Error in getPopularSearches service");
        throw error;
      }
    },
  };
  ```

### **File: `shoe.service.ts`**
- **Primary Purpose:** Implements the business logic for managing shoes.
- **Source Code:**
  ```typescript
  import { ShoeRepository } from "../repositories/shoe.repository.js";
  import type {
    CreateShoeSchemaType,
    GetShoesSchemaType,
    UpdateShoeSchemaType,
  } from "../schemas/shoe.schema.js";

  export const ShoesService = {
    createShoe: async (data: CreateShoeSchemaType["body"]) => {
      const newShoe = await ShoeRepository.createShoe(data);
      return newShoe;
    },

    updateShoe: async (shoeId: string, data: UpdateShoeSchemaType["body"]) => {
      const updatedShoe = await ShoeRepository.updateShoe(shoeId, data);
      return updatedShoe;
    },

    deleteShoe: async (shoeId: string) => {
      const deletedShoe = await ShoeRepository.deleteShoe(shoeId);
      return deletedShoe;
    },

    getShoeById: async (shoeId: string) => {
      const shoe = await ShoeRepository.getShoeById(shoeId);
      return shoe;
    },

    getShoeBySlug: async (slug: string) => {
      const shoe = await ShoeRepository.getShoeBySlug(slug);
      return shoe;
    },

    getShoes: async (options: GetShoesSchemaType["query"]) => {
      const shoes = await ShoeRepository.getShoes(options);
      return shoes;
    },
  };
  ```

### **File: `userInfo.service.ts`**
- **Primary Purpose:** Implements the business logic for managing user profile information.
- **Source Code:**
  ```typescript
  import { UserInfoRepository } from "../repositories/userInfo.repository.js";
  import type { AddressFormData } from "../schemas/userInfo.schema.js";

  export const UserInfoService = {
    getUserInfo: async (userId: string) => {
      try {
        return await UserInfoRepository.getUserInfo(userId);
      } catch (error) {
        throw error;
      }
    },

    updateInfo: async (
      userId: string,
      name: string,
      phone: string,
      dob: string
    ) => {
      try {
        return await UserInfoRepository.updateInfo(userId, name, phone, dob);
      } catch (error) {
        throw error;
      }
    },

    upsertAddress: async (
      userId: string,
      addressData: AddressFormData["body"]
    ) => {
      try {
        return await UserInfoRepository.upsertAddress(userId, addressData);
      } catch (error) {
        throw error;
      }
    },

    deleteAddress: async (userId: string, addressId: string) => {
      try {
        return await UserInfoRepository.deleteAddress(userId, addressId);
      } catch (error) {
        throw error;
      }
    },
  };
  ```
---

## **Folder: `src/repositories`**

### **File: `favorites.repository.ts`**
- **Primary Purpose:** Provides a data access layer for managing a user's favorite shoes.
- **Source Code:**
  ```typescript
  import { db } from "../db/index.js";
  import { favorites } from "../models/favorites.model.js";
  import { eq, and, desc, sql } from "drizzle-orm";

  export const FavoritesRepository = {
    getFavorites: async (userId: string, query: any) => {
      const limit = parseInt(query.limit) || 10;
      const offset = parseInt(query.offset) || 0;

      //@ts-ignore
      const userFavorites = await db.query.favorites.findMany({
        where: eq(favorites.userId, userId),
        orderBy: desc(favorites.createdAt),
        limit: limit,
        offset: offset,
        with: {
          shoe: {
            with: {
              category: true,
            },
          },
        },
      });

      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(favorites)
        .where(eq(favorites.userId, userId));

      return {
        data: userFavorites,
        count: Number(totalCount[0].count),
      };
    },

    addFavorite: async (userId: string, shoeId: string) => {
      try {
        const [favorite] = await db
          .insert(favorites)
          .values({ shoeId, userId })
          .returning();

        return favorite;
      } catch (error) {
        console.error("Error adding favorite: ", error);
        throw error;
      }
    },

    removeFavorite: async (userId: string, favoriteId: string) => {
      try {
        const [found] = await db
          .select()
          .from(favorites)
          .where(and(eq(favorites.id, favoriteId), eq(favorites.userId, userId)));
        if (!found) {
          throw new Error("Favorite with id: " + favoriteId + " not found");
        }
        await db
          .delete(favorites)
          .where(and(eq(favorites.id, favoriteId), eq(favorites.userId, userId)));
      } catch (error) {
        console.error("Error adding favorite: ", error);
        throw error;
      }
    },

    checkIsFavorite: async (userId: string, shoeId: string) => {
      try {
        const [found] = await db
          .select()
          .from(favorites)
          .where(and(eq(favorites.shoeId, shoeId), eq(favorites.userId, userId)));
        return found || null;
      } catch (error) {
        console.error("Error adding favorite: ", error);
        throw error;
      }
    },
  };
  ```

### **File: `search.repository.ts`**
- **Primary Purpose:** Provides a data access layer for search and analytics.
- **Source Code:**
  ```typescript
  import { and, desc, eq, ilike, sql } from "drizzle-orm";
  import { db } from "../db/index.js";
  import {
    popular_searches,
    search_clicks,
    search_queries,
  } from "../models/search.model.js";
  import { shoes } from "../models/shoes.model.js";

  export const SearchRepository = {
    async getSearchResults(query: string) {
      const searchWords = query.split(" ").filter(Boolean);

      if (searchWords.length === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            hasNext: false,
            nextPage: undefined,
          },
        };
      }
      const searchConditions = and(
        ...searchWords.map((word) => ilike(shoes.name, `%${word.toLowerCase()}%`))
      );
      try {
        //@ts-ignore
        const results = await db.query.shoes.findMany({
          where: searchConditions,
          limit: 30,
          with: {
            category: true,
          },
        });

        return {
          data: results,
          meta: {
            total: results.length,
            hasNext: false,
            nextPage: undefined,
          },
        };
      } catch (error) {
        console.error("Error in getSearchResults:", error);
        throw new Error("Could not fetch search results");
      }
    },

    async getAutocompleteSuggestions(query: string) {
      const simplifiedQuery = query.trim().toLowerCase();
      if (!simplifiedQuery) {
        return [];
      }

      try {
        const shoeSuggestions = await db
          .selectDistinct({
            name: shoes.name,
          })
          .from(shoes)
          .where(ilike(shoes.name, `%${simplifiedQuery}%`))
          .limit(10);

        const popularSuggestions = await db
          .select({
            query: popular_searches.query,
          })
          .from(popular_searches)
          .where(ilike(popular_searches.query, `%${simplifiedQuery}%`))
          .limit(5);

        const combined = [
          ...shoeSuggestions.map((s) => s.name),
          ...popularSuggestions.map((p) => p.query),
        ];
        const unique = [...new Set(combined)];

        return unique.slice(0, 10);
      } catch (error) {
        console.error("Error in getAutocompleteSuggestions:", error);
        // Don't throw, just return empty array on error
        return [];
      }
    },

    async recordSearchQuery(
      query: string,
      results_count: number,
      userId?: string,
      ip_address?: string
    ) {
      // This will not work until the user creates the `search_queries` table.
      try {
        const [searchQuery] = await db
          .insert(search_queries)
          .values({
            query,
            results_count,
            user_id: userId,
            ip_address,
          })
          .returning();
        return searchQuery;
      } catch (error) {
        console.error("Error recording search query:", error);
        // Fail silently
      }
    },

    async recordClick(query_id: string, product_id: string) {
      // This will not work until the user creates the `search_clicks` table.
      try {
        await db.insert(search_clicks).values({ query_id, product_id });
      } catch (error) {
        console.error("Error recording search click:", error);
        // Fail silently
      }
    },

    async getSearchHistory(userId: string) {
      // This will not work until the user creates the `search_queries` table.
      try {
        return await db
          .selectDistinct({
            query: search_queries.query,
            search_timestamp: search_queries.search_timestamp,
          })
          .from(search_queries)
          .where(eq(search_queries.user_id, userId))
          .orderBy(desc(search_queries.search_timestamp))
          .limit(10);
      } catch (error) {
        console.error("Error fetching search history:", error);
        return [];
      }
    },

    async getPopularSearches() {
      // This will not work until the user creates the `popular_searches` table.
      try {
        return await db
          .select()
          .from(popular_searches)
          .orderBy(desc(popular_searches.search_count))
          .limit(10);
      } catch (error) {
        console.error("Error fetching popular searches:", error);
        return [];
      }
    },

    async upsertPopularSearch(query: string) {
      // This will not work until the user creates the `popular_searches` table.
      try {
        await db
          .insert(popular_searches)
          .values({ query, search_count: 1 })
          .onConflictDoUpdate({
            target: popular_searches.query,
            set: {
              search_count: sql`${popular_searches.search_count} + 1`,
            },
          });
      } catch (error) {
        console.error("Error upserting popular search:", error);
      }
    },
  };
  ```

### **File: `shoe.repository.ts`**
- **Primary Purpose:** Provides a data access layer for all shoe-related database operations.
- **Source Code:**
  ```typescript
  // ... Full source code for all helper functions and ShoeRepository methods ...
  ```

### **File: `userInfo.repository.ts`**
- **Primary Purpose:** Provides a data access layer for user profile information.
- **Source Code:**
  ```typescript
  import { and, eq } from "drizzle-orm";
  import { db } from "../db/index.js";
  import { address, user } from "../models/index.js";
  import type { AddressFormData } from "../schemas/userInfo.schema.js";

  export const UserInfoRepository = {
    getUserInfo: async (userId: string) => {
      try {
        const userInfo = await db
          .select()
          .from(user)
          .where(eq(user.id, userId))
          .leftJoin(address, eq(user.id, address.userId));

        if (userInfo.length === 0) {
          throw new Error("User not found");
        }

        const userData = userInfo[0].user; // Exclude password

        const addresses = userInfo
          .filter((entry) => entry.address) // Filter out null addresses
          .map((entry) => entry.address);

        return { ...userData, addresses };
      } catch (error) {
        console.error("Error fetching user info: ", error);
        throw error;
      }
    },
    updateInfo: async (
      userId: string,
      name: string,
      email: string,
      dob: string
    ) => {
      try {
        const [updatedUser] = await db
          .update(user)
          .set({ name, email, dob })
          .where(eq(user.id, userId))
          .returning();
        return updatedUser;
      } catch (error) {
        console.error("Error updating user data: ", error);
        throw error;
      }
    },

    upsertAddress: async (
      userId: string,
      addressData: AddressFormData["body"]
    ) => {
      try {
        const addressValues = {
          type: addressData.type as string,
          streetAddress: addressData.streetAddress,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipcode,
          phoneNumber: addressData.phone,
          isDefault: addressData.isDefault,
          userId,
        };

        const [updatedAddress] = await db
          .insert(address)
          .values(addressValues)
          .onConflictDoUpdate({
            target: [address.userId, address.type],
            set: {
              streetAddress: addressValues.streetAddress,
              city: addressValues.city,
              state: addressValues.state,
              zipCode: addressValues.zipCode,
              isDefault: addressValues.isDefault,
              phoneNumber: addressValues.phoneNumber,
            },
          })
          .returning();
        return updatedAddress;
      } catch (error) {
        console.error("Error updating user data: ", error);
        throw error;
      }
    },

    deleteAddress: async (userId: string, addressId: string) => {
      try {
        const [deletedAddress] = await db
          .delete(address)
          .where(and(eq(address.id, addressId), eq(address.userId, userId)))
          .returning();

        return deletedAddress;
      } catch (error) {
        console.error("Error deleting address: ", error);
        throw error;
      }
    },
  };
  ```
