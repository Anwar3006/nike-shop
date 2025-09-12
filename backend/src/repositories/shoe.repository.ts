import { and, asc, desc, eq, gte, ilike, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { AppError } from "../errors/AppError";
import { Shoe, shoes } from "../models/shoes.model";
import {
  CreateShoeSchemaType,
  GetShoesSchemaType,
  UpdateShoeSchemaType,
} from "../schemas/shoe.schema";

export const ShoeRepository = {
  createShoe: async (shoeData: CreateShoeSchemaType["body"]): Promise<Shoe> => {
    const [newShoe] = await db.insert(shoes).values(shoeData).returning();

    if (!newShoe) {
      throw new AppError("Could not create shoe", 500);
    }
    return newShoe;
  },

  updateShoe: async (
    shoeId: string,
    shoeData: UpdateShoeSchemaType["body"]
  ): Promise<Shoe> => {
    const [updatedShoe] = await db
      .update(shoes)
      .set(shoeData)
      .where(eq(shoes.id, shoeId))
      .returning();

    if (!updatedShoe) {
      throw new AppError("Could not update shoe", 500);
    }

    return updatedShoe;
  },

  deleteShoe: async (shoeId: string): Promise<Shoe> => {
    const [deletedShoe] = await db
      .delete(shoes)
      .where(eq(shoes.id, shoeId))
      .returning();

    if (!deletedShoe) {
      throw new AppError("Could not delete shoe", 500);
    }

    return deletedShoe;
  },

  getShoeById: async (shoeId: string) => {
    const shoe = await db.query.shoes.findFirst({
      where: eq(shoes.id, shoeId),
      with: {
        brand: true,
        category: true,
        gender: true,
        variants: {
          with: {
            images: true,
            sizes: {
              with: {
                size: true,
              },
            },
          },
        },
      },
    });

    if (!shoe) {
      throw new AppError("Shoe not found", 404);
    }

    return shoe;
  },

  getShoes: async (options: GetShoesSchemaType["query"]) => {
    const {
      limit = "10",
      offset = "0",
      sort = "created_at.desc",
      name,
      gender,
      brand,
      category,
      minPrice,
      maxPrice,
      isPublished,
    } = options;

    const limit_ = parseInt(limit);
    const offset_ = parseInt(offset);

    // Build filter conditions
    const where = and(
      name ? ilike(shoes.name, `%${name}%`) : undefined,
      gender ? eq(shoes.genderId, gender) : undefined,
      brand ? eq(shoes.brandId, brand) : undefined,
      category ? eq(shoes.categoryId, category) : undefined,
      minPrice ? gte(shoes.price, minPrice) : undefined,
      maxPrice ? lte(shoes.price, maxPrice) : undefined,
      isPublished ? eq(shoes.isPublished, isPublished) : undefined
    );

    // Build sort order
    const [sortField, sortOrder] = sort.split(".");
    const orderBy =
      sortOrder === "asc"
        ? asc(shoes[sortField as keyof Shoe])
        // @ts-ignore
        : desc(shoes[sortField as keyof Shoe]);

    // Fetch data and total count in parallel
    const [data, total] = await Promise.all([
      db.query.shoes.findMany({
        where,
        orderBy,
        limit: limit_,
        offset: offset_,
        with: {
          brand: true,
          category: true,
          gender: true,
          variants: {
            with: {
              images: true,
              sizes: {
                with: {
                  size: true,
                },
              },
            },
          },
        },
      }),
      db.select({ count: sql<number>`count(*)` }).from(shoes).where(where),
    ]);

    const totalCount = Number(total[0].count);
    const hasNext = offset_ + limit_ < totalCount;
    const hasPrev = offset_ > 0;

    return {
      data,
      meta: {
        total: totalCount,
        limit: limit_,
        offset: offset_,
        hasNext,
        hasPrev,
      },
    };
  },
};
