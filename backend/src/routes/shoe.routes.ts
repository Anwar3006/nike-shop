import { Router } from "express";
import { ShoesController } from "../controllers/shoes.controller";
import validate from "../middlewares/validate.middleware";
import { createShoeSchema } from "../schemas/shoe.schema";

const shoeRouter = Router();

shoeRouter.post("/", validate(createShoeSchema), ShoesController.createShoe);
shoeRouter.put("/:id", validate(createShoeSchema), ShoesController.updateShoe);
shoeRouter.get("/", ShoesController.getAllShoes);
shoeRouter.get("/:id", ShoesController.getShoeById);
shoeRouter.delete("/:id", ShoesController.deleteShoe);

export default shoeRouter;
