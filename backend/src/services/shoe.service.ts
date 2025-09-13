import { ShoeRepository } from "../repositories/shoe.repository.js";
import type {
  CreateShoeSchemaType,
  GetShoesSchemaType,
  UpdateShoeSchemaType,
} from "../schemas/shoe.schema.js";

export const ShoesService = {
  createShoe: async (data: CreateShoeSchemaType["body"]) => {
    const newShoe = await ShoeRepository.createShoe(data);
    return newShoe;
  },

  updateShoe: async (shoeId: string, data: UpdateShoeSchemaType["body"]) => {
    const updatedShoe = await ShoeRepository.updateShoe(shoeId, data);
    return updatedShoe;
  },

  deleteShoe: async (shoeId: string) => {
    const deletedShoe = await ShoeRepository.deleteShoe(shoeId);
    return deletedShoe;
  },

  getShoeById: async (shoeId: string) => {
    const shoe = await ShoeRepository.getShoeById(shoeId);
    return shoe;
  },

  getShoeBySlug: async (slug: string) => {
    const shoe = await ShoeRepository.getShoeBySlug(slug);
    return shoe;
  },

  getShoes: async (options: GetShoesSchemaType["query"]) => {
    const shoes = await ShoeRepository.getShoes(options);
    return shoes;
  },
};
