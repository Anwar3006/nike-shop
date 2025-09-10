import express from "express";
import cors from "cors";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";

import { routes } from "./routes/index.routes.js";
import { NODE_ENV } from "./config/default.js";
import { auth } from "./utils/auth.js";
import { globalErrorHandler, NotFound } from "./errors/errorHandler.js";
import { cronJob } from "./utils/cron.js";

export default () => {
  console.log("SERVER STARTING: Using hardcoded CORS origin for vercel.");
  const app = express();

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "https://nike-shop-frontend.vercel.app",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.all("/api/auth/*", toNodeHandler(auth));

  if (NODE_ENV === "production") {
    cronJob.start();
  }

  // Use raw body for stripe webhook
  app.use((req, res, next) => {
    if (req.originalUrl.includes("/webhook")) {
      next();
    } else {
      express.json()(req, res, next);
    }
  });

  app.use(express.urlencoded({ extended: false }));

  routes(app);

  app.use(NotFound);
  app.use(globalErrorHandler);

  return app;
};
