import type { Express } from "express";

import { VERSION } from "../config/default";
import shoeRouter from "./shoe.routes";
import searchRouter from "./search.routes";
import favoritesRouter from "./favorites.routes";

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
  app.use(`/api/${VERSION}/search`, searchRouter);
  app.use(`/api/${VERSION}/favorites`, favoritesRouter);
};
