import { and, between, eq, gte, lte, or } from "drizzle-orm";
import { db } from "../db";
import { category, colorVariant, images, shoes, shoeSizes } from "../models";
import {
  CreateShoeSchemaType,
  UpdateShoeSchemaType,
} from "../schemas/shoe.schema";
import { PgTransaction, PgTransactionConfig } from "drizzle-orm/pg-core";
import { NeonHttpQueryResultHKT } from "drizzle-orm/neon-http";

export const ShoeRepository = {
  createShoe: async (data: CreateShoeSchemaType["body"]) => {
    try {
      return await db.transaction(async (tx) => {
        //check if shoe exists
        const [exists] = await tx
          .select()
          .from(shoes)
          .where(
            data.styleNumber
              ? or(
                  eq(shoes.name, data.name),
                  eq(shoes.styleNumber, data.styleNumber)
                )
              : eq(shoes.name, data.name)
          )
          .limit(1);

        if (exists) {
          throw new Error(`Shoe already exists: ${exists.name}`);
        }

        // 1. Create the base shoe
        const [shoe] = await tx
          .insert(shoes)
          .values({
            name: data.name,
            description: data.description,
            categoryId: data.categoryId,
            styleNumber: data.styleNumber,
            basePrice: data.basePrice,
          })
          .returning();

        // 2. Create color variants and related data
        await ShoeRepository._createVariantsForShoe(
          tx,
          shoe.id,
          data.colorVariants
        );

        return shoe;
      });
    } catch (error) {
      throw error;
    }
  },

  updateShoe: async (shoeId: string, data: UpdateShoeSchemaType["body"]) => {
    try {
      return await db.transaction(async (tx) => {
        //check if shoe exists
        const [exists] = await tx
          .select()
          .from(shoes)
          .where(eq(shoes.id, shoeId));

        if (!exists) {
          throw new Error("Shoe does not exist");
        }

        const sanitizedData = {
          name: data.name || exists.name,
          description: data.description || exists.description,
          categoryId: data.categoryId || exists.categoryId,
          styleNumber: data.styleNumber || exists.styleNumber,
          basePrice: data.basePrice || exists.basePrice,
        };

        // 1. Update the base shoe
        const [shoe] = await tx
          .update(shoes)
          .set(sanitizedData)
          .where(eq(shoes.id, shoeId))
          .returning();

        //2. Update color variants
        if (data.colorVariants) {
          await ShoeRepository._updateVariantsForShoe(
            tx,
            shoeId,
            data.colorVariants!
          );
        }

        return shoe;
      });
    } catch (error) {
      throw error;
    }
  },

  deleteShoe: async (shoeId: string) => {
    try {
      const [deleted] = await db
        .delete(shoes)
        .where(eq(shoes.id, shoeId))
        .returning();

      return deleted;
    } catch (error) {
      throw error;
    }
  },

  deleteVariant: async (variantId: string) => {
    try {
      return await db.transaction(async (tx) => {
        // Delete in correct order due to foreign keys
        await tx
          .delete(shoeSizes)
          .where(eq(shoeSizes.colorVariantId, variantId));
        await tx.delete(images).where(eq(images.colorVariantId, variantId));
        await tx.delete(colorVariant).where(eq(colorVariant.id, variantId));
      });
    } catch (error) {
      throw error;
    }
  },

  getShoeById: async (shoeId: string) => {
    try {
      const [found] = await db.select().from(shoes).where(eq(shoes.id, shoeId));

      return found;
    } catch (error) {
      throw error;
    }
  },

  getShoes: async (options: GetShoesOptions) => {
    try {
      const {
        limit = 8,
        page = 1,
        sortBy,
        categoryId,
        minPrice,
        maxPrice,
      } = options;

      const offset = (page - 1) * limit;
      // const sorting =
      let query = [];
      if (categoryId) {
        query.push(eq(shoes.categoryId, categoryId));
      }
      if (minPrice && maxPrice) {
        query.push(between(shoes.basePrice, minPrice, maxPrice));
      } else if (minPrice) {
        query.push(gte(shoes.basePrice, minPrice));
      } else if (maxPrice) {
        query.push(lte(shoes.basePrice, maxPrice));
      }

      const queryString = query.length > 0 ? and(...query) : and();

      const [shoeRecords, totalItems] = await Promise.all([
        db
          .select({
            id: shoes.id,
            name: shoes.name,
            basePrice: shoes.basePrice,
            category: category.name,
            baseImage: shoes.baseImage,
          })
          .from(shoes)
          .where(queryString)
          .limit(limit)
          .offset(offset)
          .leftJoin(category, eq(shoes.categoryId, category.id)),

        db.$count(shoes, ...query),
      ]);

      // Add color variants
      let shoesWithVariants = [];
      for (const shoe of shoeRecords) {
        const colorVariantCount = await db.$count(
          colorVariant,
          eq(colorVariant.shoeId, shoe.id)
        );
        // .select({
        //   id: colorVariant.id,
        //   name: colorVariant.name,
        //   dominantColor: colorVariant.dominantColor,
        // })
        // .from(colorVariant)
        // .where(eq(colorVariant.shoeId, shoe.id));

        // const [variantImages, variantSizes] = await Promise.all([
        //   db
        //     .select({
        //       url: images.imageUrl,
        //       altText: images.altText,
        //     })
        //     .from(images)
        //     .where(eq(images.colorVariantId, colorVariants.id)),

        //   // TODO: adding this quickly bloats the returned data and it is not optimal, see if we can do something about it later
        //   db
        //     .select({
        //       sizeId: shoeSizes.sizeId,
        //       price: shoeSizes.price,
        //       quantity: shoeSizes.quantity,
        //     })
        //     .from(shoeSizes)
        //     .where(eq(shoeSizes.colorVariantId, colorVariants.id)),
        // ]);

        shoesWithVariants.push({
          ...shoe,
          colors: colorVariantCount,
          // variantImages,
          // variantSizes,
        });
      }

      const totalPages = Math.ceil(totalItems / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        data: shoesWithVariants,
        meta: {
          totalItems,
          totalPages,
          perPage: limit,
          currentPage: page,
          hasNextPage,
          hasPrevPage,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  //Helper functions
  _createVariantsForShoe: async (
    tx: any,
    shoeId: string,
    colorVariants: CreateShoeSchemaType["body"]["colorVariants"]
  ) => {
    for (const variant of colorVariants) {
      const [record] = await tx
        .select()
        .from(colorVariant)
        .where(
          and(
            eq(colorVariant.shoeId, shoeId),
            eq(colorVariant.name, variant.name)
          )
        )
        .limit(1);

      if (record) {
        throw new Error(`Color variant already exists: ${record.name}`);
      }

      // Create color variant
      const [colorVariantRecord] = await tx
        .insert(colorVariant)
        .values({
          name: variant.name,
          dominantColor: variant.dominantColor,
          shoeId,
        })
        .returning();

      // Insert images
      if (variant.images && variant.images.length > 0) {
        await tx.insert(images).values(
          variant.images.map((img) => ({
            colorVariantId: colorVariantRecord.id,
            imageUrl: img.imageUrl,
            altText: img.altText,
          }))
        );
      }

      // Insert size availability
      if (variant.sizeAvailability && variant.sizeAvailability.length > 0) {
        await tx.insert(shoeSizes).values(
          variant.sizeAvailability.map((size) => ({
            colorVariantId: colorVariantRecord.id,
            sizeId: size.sizeId,
            price: size.price,
            quantity: size.quantity,
          }))
        );
      }
    }
  },

  _updateVariantsForShoe: async (
    tx: any,
    shoeId: string,
    colorVariants: UpdateShoeSchemaType["body"]["colorVariants"]
  ) => {
    for (const variant of colorVariants!) {
      if (variant.id) {
        // Update color variant
        const [variantRecord] = await tx
          .select()
          .from(colorVariant)
          .where(eq(colorVariant.id, variant.id));
        if (!variantRecord) {
          throw new Error(`Color variant does not exist: ${variant.id}`);
        }

        //1. Update the variant
        await tx
          .update(colorVariant)
          .set({
            name: variant.name || variantRecord.name,
            dominantColor: variant.dominantColor || variantRecord.dominantColor,
          })
          .where(
            and(
              eq(colorVariant.id, variant.id),
              eq(colorVariant.shoeId, shoeId)
            )
          );

        //2. Update images
        if (variant.images && variant.images.length > 0) {
          await tx.delete(images).where(eq(images.colorVariantId, variant.id));
          await tx.insert(images).values(
            variant.images.map((img) => ({
              colorVariantId: variant.id,
              imageUrl: img.imageUrl,
              altText: img.altText,
            }))
          );
        }

        //3. Update size availability
        if (variant.sizeAvailability && variant.sizeAvailability.length > 0) {
          await tx
            .delete(shoeSizes)
            .where(eq(shoeSizes.colorVariantId, variant.id));
          await tx.insert(shoeSizes).values(
            variant.sizeAvailability.map((size) => ({
              colorVariantId: variant.id,
              sizeId: size.sizeId,
              price: size.price,
              quantity: size.quantity,
            }))
          );
        }
      } else {
        // create color variant
        const variantData = {
          name: variant.name!,
          dominantColor: variant.dominantColor!,
          images: variant.images,
          sizeAvailability: variant.sizeAvailability,
        } as CreateShoeSchemaType["body"]["colorVariants"][number];
        await ShoeRepository._createVariantsForShoe(tx, shoeId, [variantData]);
      }
    }
  },
};
