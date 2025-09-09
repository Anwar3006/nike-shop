import { UserInfoRepository } from "../repositories/userInfo.repository.js";
export const UserInfoService = {
    getUserInfo: async (userId) => {
        try {
            return await UserInfoRepository.getUserInfo(userId);
        }
        catch (error) {
            throw error;
        }
    },
    updateInfo: async (userId, name, phone, dob) => {
        try {
            return await UserInfoRepository.updateInfo(userId, name, phone, dob);
        }
        catch (error) {
            throw error;
        }
    },
    upsertAddress: async (userId, addressData) => {
        try {
            return await UserInfoRepository.upsertAddress(userId, addressData);
        }
        catch (error) {
            throw error;
        }
    },
    deleteAddress: async (userId, addressId) => {
        try {
            return await UserInfoRepository.deleteAddress(userId, addressId);
        }
        catch (error) {
            throw error;
        }
    },
};
