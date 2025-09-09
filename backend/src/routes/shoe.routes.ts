import { Router } from "express";
import { ShoesController } from "../controllers/shoes.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createShoeSchema,
  getShoesSchema,
  updateShoeSchema,
} from "../schemas/shoe.schema.js";

const shoeRouter = Router();

shoeRouter.post("/", validate(createShoeSchema), ShoesController.createShoe);
shoeRouter.put("/:id", validate(updateShoeSchema), ShoesController.updateShoe);
shoeRouter.get("/", validate(getShoesSchema), ShoesController.getAllShoes);
shoeRouter.get("/slug/:slug", ShoesController.getShoeBySlug);
shoeRouter.get("/:id", ShoesController.getShoeById);
shoeRouter.delete("/:id", ShoesController.deleteShoe);

export default shoeRouter;
