import { Router } from "express";
import { verifyAuth } from "../middlewares/verfiyAuth.middleware";
import validate from "../middlewares/validate.middleware";
import {
  addressSchema,
  updateUserInfoSchema,
} from "../schemas/userInfo.schema";
import { UserInfoController } from "../controllers/userInfo.controller";

const userInfoRouter = Router();

userInfoRouter.get("/basic", verifyAuth, UserInfoController.getUserInfo);

userInfoRouter.put(
  "/basic",
  verifyAuth,
  validate(updateUserInfoSchema),
  UserInfoController.updateInfo
);

userInfoRouter.put(
  "/address",
  verifyAuth,
  validate(addressSchema),
  UserInfoController.upsertAddress
);

userInfoRouter.delete(
  "/address/:addressId",
  verifyAuth,
  UserInfoController.deleteAddress
);

export default userInfoRouter;
