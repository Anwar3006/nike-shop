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
  or,
  gt,
  isNull,
  not,
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

// Utility functions for parsing range strings
interface ParsedRange {
  min?: number;
  max?: number;
}

/**
 * Parses range strings like "50-150", "50-", "-150", or "100"
 * @param rangeString - String in format "min-max", "min-", "-max", or "value"
 * @returns Object with min and max values
 */
function parseRange(rangeString: string): ParsedRange {
  if (!rangeString || rangeString.trim() === "") {
    return {};
  }

  const trimmed = rangeString.trim();

  // Handle single value (no dash)
  if (!trimmed.includes("-")) {
    const value = parseFloat(trimmed);
    if (isNaN(value)) return {};
    return { min: value, max: value };
  }

  // Handle range with dash
  const [minStr, maxStr] = trimmed.split("-");
  const result: ParsedRange = {};

  if (minStr && minStr.trim() !== "") {
    const min = parseFloat(minStr.trim());
    if (!isNaN(min)) result.min = min;
  }

  if (maxStr && maxStr.trim() !== "") {
    const max = parseFloat(maxStr.trim());
    if (!isNaN(max)) result.max = max;
  }

  return result;
}

/**
 * Parses size range strings like "7-10", "8.5-", "-12", or "9"
 * @param sizeString - Size range string
 * @returns Object with min and max size values
 */
function parseSizeRange(sizeString: string): ParsedRange {
  return parseRange(sizeString); // Same logic as price ranges
}

/**
 * Builds WHERE conditions for variant-based filters using EXISTS subqueries
 * This approach avoids N+1 queries and is more efficient than separate queries
 */
function buildVariantFilterConditions(filters: {
  priceRange?: ParsedRange;
  colorHex?: string;
  sizeRange?: ParsedRange;
  inStock?: boolean;
}) {
  const conditions = [];

  // Build variant filter conditions
  const variantConditions = [];

  if (filters.priceRange?.min !== undefined) {
    variantConditions.push(
      gte(shoeVariants.price, filters.priceRange.min.toString())
    );
  }
  if (filters.priceRange?.max !== undefined) {
    variantConditions.push(
      lte(shoeVariants.price, filters.priceRange.max.toString())
    );
  }

  if (filters.inStock !== undefined) {
    if (filters.inStock) {
      variantConditions.push(gt(shoeVariants.inStock, 0));
    } else {
      variantConditions.push(eq(shoeVariants.inStock, 0));
    }
  }

  // Handle color filter using EXISTS with color join
  if (filters.colorHex) {
    conditions.push(
      exists(
        db
          .select()
          .from(shoeVariants)
          .innerJoin(colors, eq(shoeVariants.colorId, colors.id))
          .where(
            and(
              eq(shoeVariants.shoeId, shoes.id),
              eq(colors.hexCode, filters.colorHex),
              ...variantConditions
            )
          )
      )
    );
    return conditions;
  }

  // Handle size filter using EXISTS with size join
  if (
    filters.sizeRange &&
    (filters.sizeRange.min !== undefined || filters.sizeRange.max !== undefined)
  ) {
    const sizeConditions = [];
    if (filters.sizeRange.min !== undefined) {
      sizeConditions.push(
        gte(sql`CAST(${sizes.value} AS DECIMAL)`, filters.sizeRange.min)
      );
    }
    if (filters.sizeRange.max !== undefined) {
      sizeConditions.push(
        lte(sql`CAST(${sizes.value} AS DECIMAL)`, filters.sizeRange.max)
      );
    }

    conditions.push(
      exists(
        db
          .select()
          .from(shoeVariants)
          .innerJoin(sizes, eq(shoeVariants.sizeId, sizes.id))
          .where(
            and(
              eq(shoeVariants.shoeId, shoes.id),
              and(...sizeConditions),
              ...variantConditions
            )
          )
      )
    );
    return conditions;
  }

  // If no color or size filter, just use variant conditions
  if (variantConditions.length > 0) {
    conditions.push(
      exists(
        db
          .select()
          .from(shoeVariants)
          .where(and(eq(shoeVariants.shoeId, shoes.id), ...variantConditions))
      )
    );
  }

  return conditions;
}

/**
 * Builds sort order based on sort string
 * @param sort - Sort string in format "field.direction" e.g. "price.asc"
 * @returns Drizzle order by clause
 */
function buildSortOrder(sort: string) {
  const [sortField, sortOrder] = sort.split(".");

  // Map sort fields to actual columns or computed values
  let sortColumn: any;

  switch (sortField) {
    case "price":
      // Sort by minimum price of variants
      return sortOrder === "asc"
        ? asc(
            sql`(SELECT MIN(CAST(price AS DECIMAL)) FROM shoe_variants WHERE shoe_id = ${shoes.id})`
          )
        : desc(
            sql`(SELECT MIN(CAST(price AS DECIMAL)) FROM shoe_variants WHERE shoe_id = ${shoes.id})`
          );

    case "name":
      sortColumn = shoes.name;
      break;

    case "created_at":
    default:
      sortColumn = shoes.createdAt;
      break;
  }

  return sortOrder === "asc"
    ? asc(sortColumn as PgColumn)
    : desc(sortColumn as PgColumn);
}

export const ShoeRepository = {
  // ... keep existing createShoe, updateShoe, deleteShoe, getShoeById, getShoeBySlug methods unchanged

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
              url: image.imageUrl,
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

              if (images && images.length > 0) {
                await tx.insert(shoeImages).values(
                  images.map((image) => ({
                    ...image,
                    url: image.imageUrl,
                    shoeId: shoeId,
                    variantId: variantId,
                  }))
                );
              }
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
                  url: image.imageUrl,
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

  /**
   * Refactored getShoes function with optimized queries and proper range handling
   * Fixes N+1 query problems and handles complex filtering efficiently
   */
  getShoes: async (options: GetShoesSchemaType["query"]) => {
    const {
      limit = "10",
      offset = "0",
      sort = "created_at.desc",
      gender,
      color,
      size,
      price,
      minPrice,
      maxPrice,
      category,
      search,
      inStock,
    } = options;

    // Parse and validate input parameters
    const limit_ = Math.min(parseInt(limit) || 10, 100); // Cap at 100 for performance
    const offset_ = Math.max(parseInt(offset) || 0, 0);

    try {
      // Build base WHERE conditions for shoes table
      const baseConditions = [];

      // Handle search functionality
      if (search && search.trim()) {
        baseConditions.push(
          or(
            ilike(shoes.name, `%${search.trim()}%`),
            ilike(shoes.description, `%${search.trim()}%`)
          )
        );
      }

      // Handle direct shoe table filters using efficient JOINs instead of separate queries
      if (gender) {
        baseConditions.push(
          exists(
            db
              .select()
              .from(genders)
              .where(
                and(eq(genders.id, shoes.genderId), eq(genders.slug, gender))
              )
          )
        );
      }

      if (category) {
        baseConditions.push(
          exists(
            db
              .select()
              .from(categories)
              .where(
                and(
                  eq(categories.id, shoes.categoryId),
                  eq(categories.name, category)
                )
              )
          )
        );
      }

      // Parse price range - support both new range format and legacy min/max
      let priceRange: ParsedRange = {};
      if (price) {
        priceRange = parseRange(price);
      } else if (minPrice || maxPrice) {
        // Legacy support
        if (minPrice) priceRange.min = parseFloat(minPrice);
        if (maxPrice) priceRange.max = parseFloat(maxPrice);
      }

      // Parse size range
      let sizeRange: ParsedRange = {};
      if (size) {
        sizeRange = parseSizeRange(size);
      }

      // Parse inStock filter
      let inStockFilter: boolean | undefined;
      if (inStock && inStock.toLowerCase() === "true") {
        inStockFilter = true;
      } else if (inStock && inStock.toLowerCase() === "false") {
        inStockFilter = false;
      }

      // Build variant filter conditions using EXISTS subqueries to avoid N+1
      const variantConditions = buildVariantFilterConditions({
        priceRange: Object.keys(priceRange).length > 0 ? priceRange : undefined,
        colorHex: color,
        sizeRange: Object.keys(sizeRange).length > 0 ? sizeRange : undefined,
        inStock: inStockFilter,
      });

      // Combine all conditions
      const finalWhere = and(...baseConditions, ...variantConditions);

      // Build sort order
      const orderBy = buildSortOrder(sort);

      // Execute optimized query with proper joins - single query to avoid N+1
      const [data, totalResult] = await Promise.all([
        //@ts-ignore
        db.query.shoes.findMany({
          where: finalWhere,
          orderBy,
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
        // Optimized count query
        db
          .select({ count: sql<number>`count(*)` })
          .from(shoes)
          .where(finalWhere),
      ]);

      const totalCount = Number(totalResult[0]?.count || 0);
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
    } catch (error) {
      console.error("Error fetching shoes:", error);
      throw new Error("Failed to fetch shoes");
    }
  },
};
