import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../errors/errorHandler.js";
import { UserInfoService } from "../services/userInfo.service.js";
import AppError from "../errors/AppError.js";

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
