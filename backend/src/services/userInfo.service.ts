import { UserInfoRepository } from "../repositories/userInfo.repository";
import type { AddressFormData } from "../schemas/userInfo.schema";

export const UserInfoService = {
  getUserInfo: async (userId: string) => {
    try {
      return await UserInfoRepository.getUserInfo(userId);
    } catch (error) {
      throw error;
    }
  },

  updateInfo: async (
    userId: string,
    name: string,
    phone: string,
    dob: string
  ) => {
    try {
      return await UserInfoRepository.updateInfo(userId, name, phone, dob);
    } catch (error) {
      throw error;
    }
  },

  upsertAddress: async (
    userId: string,
    addressData: AddressFormData["body"]
  ) => {
    try {
      return await UserInfoRepository.upsertAddress(userId, addressData);
    } catch (error) {
      throw error;
    }
  },

  deleteAddress: async (userId: string, addressId: string) => {
    try {
      return await UserInfoRepository.deleteAddress(userId, addressId);
    } catch (error) {
      throw error;
    }
  },
};
