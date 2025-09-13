import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { address, user } from "../models/index.js";
import type { AddressFormData } from "../schemas/userInfo.schema.js";

export const UserInfoRepository = {
  getUserInfo: async (userId: string) => {
    try {
      const userInfo = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .leftJoin(address, eq(user.id, address.userId));

      if (userInfo.length === 0) {
        throw new Error("User not found");
      }

      const userData = userInfo[0].user; // Exclude password

      const addresses = userInfo
        .filter((entry) => entry.address) // Filter out null addresses
        .map((entry) => entry.address);

      return { ...userData, addresses };
    } catch (error) {
      console.error("Error fetching user info: ", error);
      throw error;
    }
  },
  updateInfo: async (
    userId: string,
    name: string,
    email: string,
    dob: string
  ) => {
    try {
      const [updatedUser] = await db
        .update(user)
        .set({ name, email, dob })
        .where(eq(user.id, userId))
        .returning();
      return updatedUser;
    } catch (error) {
      console.error("Error updating user data: ", error);
      throw error;
    }
  },

  upsertAddress: async (
    userId: string,
    addressData: AddressFormData["body"]
  ) => {
    try {
      const addressValues = {
        type: addressData.type as string,
        streetAddress: addressData.streetAddress,
        city: addressData.city,
        state: addressData.state,
        zipCode: addressData.zipcode,
        phoneNumber: addressData.phone,
        isDefault: addressData.isDefault,
        userId,
      };

      const [updatedAddress] = await db
        .insert(address)
        .values(addressValues)
        .onConflictDoUpdate({
          target: [address.userId, address.type],
          set: {
            streetAddress: addressValues.streetAddress,
            city: addressValues.city,
            state: addressValues.state,
            zipCode: addressValues.zipCode,
            isDefault: addressValues.isDefault,
            phoneNumber: addressValues.phoneNumber,
          },
        })
        .returning();
      return updatedAddress;
    } catch (error) {
      console.error("Error updating user data: ", error);
      throw error;
    }
  },

  deleteAddress: async (userId: string, addressId: string) => {
    try {
      const [deletedAddress] = await db
        .delete(address)
        .where(and(eq(address.id, addressId), eq(address.userId, userId)))
        .returning();

      return deletedAddress;
    } catch (error) {
      console.error("Error deleting address: ", error);
      throw error;
    }
  },
};
