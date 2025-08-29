import { GetShoesSchemaType } from "@/schemas/shoes.schema";
import axiosClient from "../api/client";
import { GetShoesApiResponse, ShoesQueryOptions } from "@/types/shoes";

const ShoesService = {
  getShoes: async (
    options: ShoesQueryOptions
  ): Promise<GetShoesApiResponse> => {
    try {
      // Handle pagination from React Query
      const limit = options.limit || "6";
      const offset = options.pageParam?.toString() || options.offset || "0";

      // Build query parameters
      const params: Record<string, string> = {
        limit,
        offset,
      };

      if (options.sort) params.sort = options.sort;
      if (options.gender) params.gender = options.gender;
      if (options.size) params.size = options.size;
      if (options.color) params.color = options.color;
      if (options.price) {
        const price = options.price;
        const splitPrice = price.includes("+")
          ? price.split("+")
          : price.split("-");
        params.minPrice = splitPrice[0] + "00";
        params.maxPrice = splitPrice[1] + "00";
      }

      console.log("options: ", options);
      console.log("params: ", params);

      const shoes = await axiosClient.get("/shoes", {
        params: params,
      });
      return shoes.data;
      //   return {} as GetShoesApiResponse;
    } catch (error) {
      console.error("Error when getting shoes: ", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch shoes"
      );
    }
  },
};

export default ShoesService;
