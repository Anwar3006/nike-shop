import express from "express";
import cors from "cors";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";

import { routes } from "./routes/index.routes";
import { FRONTEND_URL } from "./config/default";
import { auth } from "./utils/auth";
import { globalErrorHandler, NotFound } from "./errors/errorHandler";

export default () => {
  const app = express();

  app.use(
    cors({
      origin: FRONTEND_URL, // Replace with your frontend's origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );
  app.use(morgan("dev"));
  app.all("/api/auth/*", toNodeHandler(auth));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  routes(app);

  app.use(NotFound);
  app.use(globalErrorHandler);

  return app;
};
