import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../errors/errorHandler";
import {
  CreateShoeSchemaType,
  GetShoesSchemaType,
} from "../schemas/shoe.schema";
import { ShoesService } from "../services/shoe.service";

export const ShoesController = {
  createShoe: catchAsync(
    async (
      req: Request<{}, {}, CreateShoeSchemaType["body"]>,
      res: Response,
      next: NextFunction
    ) => {
      const data = req.body;
      const newShoe = await ShoesService.createShoe(data);
      res.status(201).json(newShoe);
    }
  ),

  updateShoe: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const shoeId = req.params.id;
      const data = req.body;
      const updatedShoe = await ShoesService.updateShoe(shoeId, data);
      res.status(200).json(updatedShoe);
    }
  ),

  deleteShoe: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const shoeId = req.params.id;
      const deletedShoe = await ShoesService.deleteShoe(shoeId);
      res.status(200).json(deletedShoe);
    }
  ),

  getShoeById: catchAsync(
    async (
      req: Request<{ id: string }, {}, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const shoeId = req.params.id;
      const shoe = await ShoesService.getShoeById(shoeId);
      res.status(200).json({ success: true, data: shoe });
    }
  ),

  getAllShoes: catchAsync(
    async (
      req: Request<{}, {}, {}, GetShoesSchemaType["query"]>,
      res: Response,
      next: NextFunction
    ) => {
      const {
        limit = "6",
        offset = "1",
        sort,
        gender,
        size,
        color,
        minPrice,
        maxPrice,
      } = req.query;

      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        sort,
        gender,
        size: size ? parseFloat(size) : undefined,
        color,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      };

      const shoes = await ShoesService.getShoes(options);

      res.status(200).json({ success: true, ...shoes });
    }
  ),
};
