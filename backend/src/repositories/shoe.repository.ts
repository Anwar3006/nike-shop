import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  lte,
  sql,
  exists,
  inArray,
} from "drizzle-orm";
import { db } from "../db/index.js";
import AppError from "../errors/AppError.js";
import { shoeImages } from "../models/images.model.js";
import { shoes } from "../models/shoes.model.js";
import type { Shoe } from "../models/shoes.model.js";
import { shoeVariants } from "../models/variants.model.js";
import type {
  CreateShoeSchemaType,
  GetShoesSchemaType,
  UpdateShoeSchemaType,
} from "../schemas/shoe.schema";
import type { PgColumn } from "drizzle-orm/pg-core";
import { colors } from "../models/filters/colors.model.js";
import { genders } from "../models/filters/genders.model.js";
import { sizes } from "../models/filters/sizes.model.js";
import { categories } from "../models/categories.model.js";

export const ShoeRepository = {
  createShoe: async (shoeData: CreateShoeSchemaType["body"]): Promise<Shoe> => {
    const { colorVariants, ...baseShoeData } = shoeData;

    const newShoe = await db.transaction(async (tx) => {
      const [shoe] = await tx.insert(shoes).values(baseShoeData).returning();

      if (!shoe) {
        throw new AppError("Could not create shoe", 500);
      }

      for (const variant of colorVariants) {
        const { images, ...variantData } = variant;
        const [newVariant] = await tx
          .insert(shoeVariants)
          .values({ ...variantData, shoeId: shoe.id })
          .returning();

        if (!newVariant) {
          throw new AppError("Could not create shoe variant", 500);
        }

        if (images && images.length > 0) {
          await tx.insert(shoeImages).values(
            images.map((image) => ({
              ...image,
              shoeId: shoe.id,
              variantId: newVariant.id,
            }))
          );
        }
      }

      return shoe;
    });

    return newShoe;
  },

  updateShoe: async (
    shoeId: string,
    shoeData: UpdateShoeSchemaType["body"]
  ): Promise<Shoe> => {
    const { colorVariants, ...baseShoeData } = shoeData;

    const updatedShoe = await db.transaction(async (tx) => {
      if (Object.keys(baseShoeData).length > 0) {
        await tx.update(shoes).set(baseShoeData).where(eq(shoes.id, shoeId));
      }

      if (colorVariants) {
        for (const variant of colorVariants) {
          const { images, id: variantId, ...variantData } = variant;

          if (variantId) {
            // Update existing variant
            await tx
              .update(shoeVariants)
              .set(variantData)
              .where(eq(shoeVariants.id, variantId));

            if (images) {
              // Replace images for the variant
              await tx
                .delete(shoeImages)
                .where(eq(shoeImages.variantId, variantId));
              await tx.insert(shoeImages).values(
                images.map((image) => ({
                  ...image,
                  shoeId: shoeId,
                  variantId: variantId,
                }))
              );
            }
          } else {
            // Create new variant
            const [newVariant] = await tx
              .insert(shoeVariants)
              .values({ ...variantData, shoeId: shoeId })
              .returning();

            if (!newVariant) {
              throw new AppError("Could not create shoe variant", 500);
            }

            if (images && images.length > 0) {
              await tx.insert(shoeImages).values(
                images.map((image) => ({
                  ...image,
                  shoeId: shoeId,
                  variantId: newVariant.id,
                }))
              );
            }
          }
        }
      }

      const [shoe] = await tx.select().from(shoes).where(eq(shoes.id, shoeId));

      if (!shoe) {
        throw new AppError("Shoe not found after update", 404);
      }

      return shoe;
    });

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
    //@ts-ignore
    const shoe = await db.query.shoes.findFirst({
      where: eq(shoes.id, shoeId),
      with: {
        brand: true,
        category: true,
        gender: true,
        variants: {
          with: {
            color: true,
            size: true,
            images: true,
          },
        },
      },
    });

    if (!shoe) {
      throw new AppError("Shoe not found", 404);
    }

    return shoe;
  },

  getShoeBySlug: async (slug: string) => {
    //@ts-ignore
    const shoe = await db.query.shoes.findFirst({
      where: eq(shoes.slug, slug),
      with: {
        brand: true,
        category: true,
        gender: true,
        variants: {
          with: {
            color: true,
            size: true,
            images: true,
          },
        },
      },
    });

    if (!shoe) {
      throw new Error("Shoe not found");
    }

    return shoe;
  },

  getShoes: async (options: GetShoesSchemaType["query"]) => {
    const {
      limit = "10",
      offset = "0",
      sort = "created_at.desc",
      gender,
      color,
      size,
      minPrice,
      maxPrice,
      category,
    } = options;

    const limit_ = parseInt(limit);
    const offset_ = parseInt(offset);

    const [genderExists] = await db
      .select()
      .from(genders)
      .where(eq(genders.slug, gender));
    const [categoryExists] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, category));

    // const [sizeLowerBound, sizeUpperBound] = size && size.split("-");
    const [[colorExists]] = await Promise.all([
      db.select().from(colors).where(eq(colors.hexCode, color)),
      // db.select().from(sizes).where(),
    ]);

    // Build base filter conditions for shoes table
    const baseWhere = and(
      genderExists ? eq(shoes.genderId, genderExists.id) : undefined,
      categoryExists ? eq(shoes.categoryId, categoryExists.id) : undefined
    );

    // Handle variant-based filters (price, color, size) separately
    let variantFilteredShoeIds: string[] | undefined;

    if (minPrice || maxPrice || color || size) {
      // Build variant filter conditions
      const variantWhere = and(
        minPrice ? gte(shoeVariants.price, minPrice) : undefined,
        maxPrice ? lte(shoeVariants.price, maxPrice) : undefined,
        colorExists ? eq(shoeVariants.colorId, colorExists.id) : undefined
        // sizeLowerBound ? gte(sizes.value, sizeLowerBound) : undefined,
        // sizeUpperBound ? lte(sizes.value, sizeUpperBound) : undefined
      );

      // Get shoe IDs that have variants matching the criteria
      const matchingVariants = await db
        .select({ shoeId: shoeVariants.shoeId })
        .from(shoeVariants)
        .leftJoin(sizes, eq(shoeVariants.sizeId, sizes.id))
        .where(variantWhere);

      variantFilteredShoeIds = [
        ...new Set(matchingVariants.map((v) => v.shoeId)),
      ];

      // If no variants match the criteria, return empty result
      if (variantFilteredShoeIds.length === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            limit: limit_,
            offset: offset_,
            hasNext: false,
            hasPrev: offset_ > 0,
          },
        };
      }
    }

    // Combine base filters with variant-based filtering
    const finalWhere = and(
      baseWhere,
      variantFilteredShoeIds
        ? inArray(shoes.id, variantFilteredShoeIds)
        : undefined
    );

    // Build sort order
    const [sortField, sortOrder] = sort.split(".");

    // Ensure sortField is a valid key
    const validSortFields = ["id", "name", "created_at", "price"];
    const effectiveSortField = validSortFields.includes(sortField)
      ? sortField
      : "created_at";
    const sortColumn = shoes[effectiveSortField as keyof typeof shoes];

    const orderBy =
      sortOrder === "asc"
        ? asc(sortColumn as PgColumn)
        : desc(sortColumn as PgColumn);

    // Fetch data and total count in parallel
    const [data, total] = await Promise.all([
      //@ts-ignore
      db.query.shoes.findMany({
        where: finalWhere,
        // orderBy,
        limit: limit_,
        offset: offset_,
        with: {
          brand: true,
          category: true,
          gender: true,
          variants: {
            with: {
              color: true,
              size: true,
              images: true,
            },
          },
        },
      }),
      db
        .select({ count: sql<number>`count(*)` })
        .from(shoes)
        .where(finalWhere),
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
