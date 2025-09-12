import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../errors/errorHandler";
import {
  CreateShoeSchemaType,
  GetShoesSchemaType,
  UpdateShoeSchemaType,
} from "../schemas/shoe.schema";
import { ShoesService } from "../services/shoe.service";

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
      req: Request<
        { id: string },
        {},
        UpdateShoeSchemaType["body"]
      >,
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
    async (
      req: Request<{ id: string }>,
      res: Response,
      next: NextFunction
    ) => {
      const deletedShoe = await ShoesService.deleteShoe(req.params.id);
      res.status(200).json({
        success: true,
        data: deletedShoe,
      });
    }
  ),

  getShoeById: catchAsync(
    async (
      req: Request<{ id: string }>,
      res: Response,
      next: NextFunction
    ) => {
      const shoe = await ShoesService.getShoeById(req.params.id);
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
