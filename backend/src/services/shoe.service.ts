import { ShoeRepository } from "../repositories/shoe.repository";
import {
  CreateShoeSchemaType,
  UpdateShoeSchemaType,
} from "../schemas/shoe.schema";
import { logger } from "../utils/logger";

export const ShoesService = {
  createShoe: async (data: CreateShoeSchemaType["body"]) => {
    try {
      const newShoe = await ShoeRepository.createShoe(data);
      return newShoe;
    } catch (error) {
      logger.error(error, "Error when creating shoe");
      throw error;
    }
  },

  updateShoe: async (shoeId: string, data: UpdateShoeSchemaType["body"]) => {
    try {
      const updatedShoe = await ShoeRepository.updateShoe(shoeId, data);
      return updatedShoe;
    } catch (error) {
      logger.error(error, "Error when updating shoe");
      throw error;
    }
  },

  deleteShoe: async (shoeId: string) => {
    try {
      const deletedShoe = await ShoeRepository.deleteShoe(shoeId);
      return deletedShoe;
    } catch (error) {
      logger.error(error, "Error when deleting shoe");
      throw error;
    }
  },

  getShoeById: async (shoeId: string) => {
    try {
      const shoe = await ShoeRepository.getShoeById(shoeId);
      return shoe;
    } catch (error) {
      logger.error(error, "Error when getting shoe");
      throw error;
    }
  },

  getShoes: async (options: GetShoesOptions) => {
    try {
      const shoes = await ShoeRepository.getShoes(options);
      return shoes;
    } catch (error) {
      logger.error(error, "Error when getting shoes");
      throw error;
    }
  },
};
