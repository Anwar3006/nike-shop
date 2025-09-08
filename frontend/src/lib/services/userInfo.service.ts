import { AddressFormData, UserProfileSchemaType } from "@/schemas/auth.schema";
import axiosClient from "../api/client";

const UserInfoService = {
  getUserInfo: async () => {
    try {
      console.log("Fetching user info...");
      const response = await axiosClient.get(`/userInfo/basic`);
      return response.data;
    } catch (error) {
      console.error("Error when fetching user info: ", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user info"
      );
    }
  },

  updateInfo: async (data: UserProfileSchemaType) => {
    try {
      const response = await axiosClient.put("/userInfo/basic", data);
      return response.data;
    } catch (error) {
      console.error("Error when updating user info: ", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update user info"
      );
    }
  },

  upsertAddress: async (data: AddressFormData) => {
    try {
      const response = await axiosClient.put("/userInfo/address", data);
      return response.data;
    } catch (error) {
      console.error("Error when upserting address: ", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to upsert address"
      );
    }
  },

  deleteAddress: async (addressId: string) => {
    try {
      const response = await axiosClient.delete(
        `/userInfo/address/${addressId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error when deleting address: ", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete address"
      );
    }
  },
};

export default UserInfoService;
