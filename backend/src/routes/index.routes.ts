import type { Express } from "express";

import { VERSION } from "../config/default";
import shoeRouter from "./shoe.routes";

export const routes = (app: Express) => {
  //Health check
  app.get("/", (req, res) => {
    res.send({
      status: "OK",
      version: VERSION,
      timestamp: new Date().toISOString(),
    });
  });

  // Other routes
  app.use(`/api/${VERSION}/shoes`, shoeRouter);
};
