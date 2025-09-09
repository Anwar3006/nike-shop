import { ShoeRepository } from "../repositories/shoe.repository.js";
import { logger } from "../utils/logger.js";
export const ShoesService = {
    createShoe: async (data) => {
        try {
            const newShoe = await ShoeRepository.createShoe(data);
            return newShoe;
        }
        catch (error) {
            logger.error(error, "Error when creating shoe");
            throw error;
        }
    },
    updateShoe: async (shoeId, data) => {
        try {
            const updatedShoe = await ShoeRepository.updateShoe(shoeId, data);
            return updatedShoe;
        }
        catch (error) {
            logger.error(error, "Error when updating shoe");
            throw error;
        }
    },
    deleteShoe: async (shoeId) => {
        try {
            const deletedShoe = await ShoeRepository.deleteShoe(shoeId);
            return deletedShoe;
        }
        catch (error) {
            logger.error(error, "Error when deleting shoe");
            throw error;
        }
    },
    getShoeById: async (shoeId) => {
        try {
            const shoe = await ShoeRepository.getShoeById(shoeId);
            return shoe;
        }
        catch (error) {
            logger.error(error, "Error when getting shoe");
            throw error;
        }
    },
    getShoeBySlug: async (slug) => {
        try {
            const shoe = await ShoeRepository.getShoeBySlug(slug);
            return shoe;
        }
        catch (error) {
            logger.error(error, "Error when getting shoe by slug");
            throw error;
        }
    },
    getShoes: async (options) => {
        try {
            const shoes = await ShoeRepository.getShoes(options);
            return shoes;
        }
        catch (error) {
            logger.error(error, "Error when getting shoes");
            throw error;
        }
    },
};
