import { and, between, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { category, colorVariant, images, shoes, shoeSizes, sizes, } from "../models/index.js";
import { parseSizeRange } from "../utils/helpers.js";
import { createSlug } from "../utils/slugify.js";
export const ShoeRepository = {
    createShoe: async (data) => {
        try {
            return await db.transaction(async (tx) => {
                //check if shoe exists
                const [exists] = await tx
                    .select()
                    .from(shoes)
                    .where(eq(shoes.name, data.name))
                    .limit(1);
                if (exists) {
                    throw new Error(`Shoe already exists: ${exists.name}`);
                }
                const slug = createSlug(data.name);
                // 1. Create the base shoe
                const [shoe] = await tx
                    .insert(shoes)
                    .values({
                    name: data.name,
                    slug,
                    description: data.description,
                    categoryId: data.categoryId,
                    basePrice: data.basePrice,
                })
                    .returning();
                // 2. Create color variants and related data
                await ShoeRepository._createVariantsForShoe(tx, shoe.id, data.colorVariants);
                return shoe;
            });
        }
        catch (error) {
            throw error;
        }
    },
    updateShoe: async (shoeId, data) => {
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
                    description: data.description || exists.description,
                    categoryId: data.categoryId || exists.categoryId,
                    basePrice: data.basePrice || exists.basePrice,
                };
                if (data.name && data.name !== exists.name) {
                    sanitizedData.name = data.name;
                    sanitizedData.slug = createSlug(data.name);
                }
                // 1. Update the base shoe
                const [shoe] = await tx
                    .update(shoes)
                    .set(sanitizedData)
                    .where(eq(shoes.id, shoeId))
                    .returning();
                //2. Update color variants
                if (data.colorVariants) {
                    await ShoeRepository._updateVariantsForShoe(tx, shoeId, data.colorVariants);
                }
                return shoe;
            });
        }
        catch (error) {
            throw error;
        }
    },
    deleteShoe: async (shoeId) => {
        try {
            const [deleted] = await db
                .delete(shoes)
                .where(eq(shoes.id, shoeId))
                .returning();
            return deleted;
        }
        catch (error) {
            throw error;
        }
    },
    deleteVariant: async (variantId) => {
        try {
            return await db.transaction(async (tx) => {
                // Delete in correct order due to foreign keys
                await tx
                    .delete(shoeSizes)
                    .where(eq(shoeSizes.colorVariantId, variantId));
                await tx.delete(images).where(eq(images.colorVariantId, variantId));
                await tx.delete(colorVariant).where(eq(colorVariant.id, variantId));
            });
        }
        catch (error) {
            throw error;
        }
    },
    getShoeById: async (shoeId) => {
        try {
            // Query 1: Fetch the base shoe data
            const [shoeData] = await db
                .select()
                .from(shoes)
                .where(eq(shoes.id, shoeId));
            if (!shoeData) {
                return null;
            }
            // Query 2: Fetch all color variants for the shoe
            const colorVariantsData = await db
                .select()
                .from(colorVariant)
                .where(eq(colorVariant.shoeId, shoeId));
            if (colorVariantsData.length === 0) {
                return {
                    ...shoeData,
                    colors: [],
                };
            }
            const colorVariantIds = colorVariantsData.map((v) => v.id);
            // Query 3: Fetch all images for all color variants in a single query
            const allImages = await db
                .select()
                .from(images)
                .where(inArray(images.colorVariantId, colorVariantIds));
            // Query 4: Fetch all sizes for all color variants in a single query
            const allSizes = await db
                .select({
                colorVariantId: shoeSizes.colorVariantId,
                size: sizes.size,
            })
                .from(shoeSizes)
                .innerJoin(sizes, eq(shoeSizes.sizeId, sizes.id))
                .where(inArray(shoeSizes.colorVariantId, colorVariantIds));
            // Group images and sizes by their variant ID for efficient lookup
            const imagesMap = new Map();
            for (const image of allImages) {
                if (!imagesMap.has(image.colorVariantId)) {
                    imagesMap.set(image.colorVariantId, []);
                }
                imagesMap.get(image.colorVariantId).push(image.imageUrl);
            }
            const sizesMap = new Map();
            for (const size of allSizes) {
                if (!sizesMap.has(size.colorVariantId)) {
                    sizesMap.set(size.colorVariantId, []);
                }
                sizesMap.get(size.colorVariantId).push(size.size);
            }
            // Assemble the final nested structure
            const colorVariants = colorVariantsData.map((variant) => ({
                ...variant,
                images: imagesMap.get(variant.id) || [],
                size: sizesMap.get(variant.id) || [],
            }));
            return {
                ...shoeData,
                colors: colorVariants,
            };
        }
        catch (error) {
            throw error;
        }
    },
    getShoeBySlug: async (slug) => {
        try {
            const [shoeData] = await db
                .select()
                .from(shoes)
                .where(eq(shoes.slug, slug));
            if (!shoeData) {
                return null;
            }
            return ShoeRepository.getShoeById(shoeData.id);
        }
        catch (error) {
            throw error;
        }
    },
    getShoes: async (options) => {
        try {
            const { limit = "6", offset = "0", gender, size, color, minPrice, maxPrice, } = options;
            const limit_ = parseInt(limit);
            const offset_ = parseInt(offset);
            const minPrice_ = minPrice ? parseInt(minPrice) : undefined;
            const maxPrice_ = maxPrice ? parseInt(maxPrice) : undefined;
            console.log("Options: ", options);
            // Build base conditions for shoes table
            let baseConditions = [];
            // Gender filter
            if (gender) {
                const [{ id: categoryId }] = await db
                    .select()
                    .from(category)
                    .where(eq(category.name, gender));
                baseConditions.push(eq(shoes.categoryId, categoryId));
            }
            // Price filters
            if (minPrice && maxPrice) {
                baseConditions.push(between(shoes.basePrice, minPrice_, maxPrice_));
            }
            else if (minPrice) {
                baseConditions.push(gte(shoes.basePrice, minPrice_));
            }
            else if (maxPrice) {
                baseConditions.push(lte(shoes.basePrice, maxPrice_));
            }
            // Size range filter - Updated for slider
            let validShoeIdsForSize = null;
            if (size) {
                const sizeRange = parseSizeRange(size);
                if (sizeRange) {
                    console.log(`🔍 Filtering by size range: ${sizeRange.min} - ${sizeRange.max}`);
                    // Find all sizes within the range
                    const foundSizes = await db
                        .select()
                        .from(sizes)
                        .where(and(gte(sizes.size, sql `${sizeRange.min}`), lte(sizes.size, sql `${sizeRange.max}`)));
                    if (foundSizes.length === 0) {
                        return {
                            data: [],
                            meta: {
                                totalItems: 0,
                                hasMore: false,
                                nextOffset: offset_,
                            },
                        };
                    }
                    const sizeIds = foundSizes.map((s) => s.id);
                    console.log(`📏 Found ${sizeIds.length} sizes in range`);
                    // Get shoes that have variants available in these sizes
                    const shoesWithSizeInRange = await db
                        .selectDistinct({ shoeId: colorVariant.shoeId })
                        .from(colorVariant)
                        .innerJoin(shoeSizes, eq(shoeSizes.colorVariantId, colorVariant.id))
                        .where(and(inArray(shoeSizes.sizeId, sizeIds), sql `${shoeSizes.quantity} > 0` // Only in-stock items
                    ));
                    validShoeIdsForSize = shoesWithSizeInRange.map((row) => row.shoeId);
                    console.log(`👟 Found ${validShoeIdsForSize.length} shoes with sizes in range`);
                    if (validShoeIdsForSize.length === 0) {
                        return {
                            data: [],
                            meta: {
                                totalItems: 0,
                                hasMore: false,
                                nextOffset: offset_,
                            },
                        };
                    }
                }
            }
            // Color filter (unchanged)
            let validShoeIdsForColor = null;
            if (color) {
                const colorUp = color.charAt(0).toUpperCase() + color.slice(1);
                const shoesWithColor = await db
                    .selectDistinct({ shoeId: colorVariant.shoeId })
                    .from(colorVariant)
                    .where(eq(colorVariant.dominantColor, colorUp));
                validShoeIdsForColor = shoesWithColor.map((row) => row.shoeId);
                if (validShoeIdsForColor.length === 0) {
                    return {
                        data: [],
                        meta: {
                            totalItems: 0,
                            hasMore: false,
                            nextOffset: offset_,
                        },
                    };
                }
            }
            // Combine shoe ID filters
            if (validShoeIdsForSize || validShoeIdsForColor) {
                let finalValidIds = validShoeIdsForSize || validShoeIdsForColor;
                // If both filters exist, find intersection
                if (validShoeIdsForSize && validShoeIdsForColor) {
                    finalValidIds = validShoeIdsForSize.filter((id) => validShoeIdsForColor.includes(id));
                    console.log(`🔗 Intersection of size and color filters: ${finalValidIds.length} shoes`);
                }
                if (finalValidIds.length === 0) {
                    return {
                        data: [],
                        meta: {
                            totalItems: 0,
                            hasMore: false,
                            nextOffset: offset_,
                        },
                    };
                }
                baseConditions.push(inArray(shoes.id, finalValidIds));
            }
            const queryConditions = baseConditions.length > 0 ? and(...baseConditions) : undefined;
            // Execute main queries
            const [shoeRecords, totalCountResult] = await Promise.all([
                db
                    .select({
                    id: shoes.id,
                    name: shoes.name,
                    basePrice: shoes.basePrice,
                    baseImage: shoes.baseImage,
                    categoryName: category.name,
                })
                    .from(shoes)
                    .leftJoin(category, eq(shoes.categoryId, category.id))
                    .where(queryConditions)
                    .orderBy(shoes.createdAt)
                    .limit(limit_)
                    .offset(offset_),
                db
                    .select({ count: sql `count(*)` })
                    .from(shoes)
                    .leftJoin(category, eq(shoes.categoryId, category.id))
                    .where(queryConditions),
            ]);
            if (shoeRecords.length === 0) {
                return {
                    data: [],
                    meta: {
                        total: Number(totalCountResult[0].count),
                        limit: limit_,
                        offset: offset_,
                        hasNext: false,
                        nextPage: undefined,
                    },
                };
            }
            const shoeIds = shoeRecords.map((shoe) => shoe.id);
            // Get colors and available size ranges for the returned shoes
            const [colorsQuery, sizesQuery] = await Promise.all([
                db
                    .select({
                    shoeId: colorVariant.shoeId,
                    dominantColor: colorVariant.dominantColor,
                })
                    .from(colorVariant)
                    .where(inArray(colorVariant.shoeId, shoeIds))
                    .orderBy(colorVariant.dominantColor),
                // Get available size ranges for each shoe
                db
                    .select({
                    shoeId: colorVariant.shoeId,
                    minSize: sql `MIN(${sizes.size}::numeric)`,
                    maxSize: sql `MAX(${sizes.size}::numeric)`,
                    availableSizes: sql `array_agg(DISTINCT ${sizes.size}::text)`,
                })
                    .from(colorVariant)
                    .innerJoin(shoeSizes, eq(shoeSizes.colorVariantId, colorVariant.id))
                    .innerJoin(sizes, eq(shoeSizes.sizeId, sizes.id))
                    .where(and(inArray(colorVariant.shoeId, shoeIds), sql `${shoeSizes.quantity} > 0`))
                    .groupBy(colorVariant.shoeId),
            ]);
            // Group data
            const colorMap = new Map();
            const sizeMap = new Map();
            colorsQuery.forEach((row) => {
                if (!colorMap.has(row.shoeId))
                    colorMap.set(row.shoeId, new Set());
                colorMap.get(row.shoeId).add(row.dominantColor);
            });
            sizesQuery.forEach((row) => {
                sizeMap.set(row.shoeId, {
                    min: row.minSize,
                    max: row.maxSize,
                    available: row.availableSizes,
                });
            });
            // Transform final data
            const transformedData = shoeRecords.map((shoe) => ({
                id: shoe.id,
                name: shoe.name,
                price: shoe.basePrice,
                baseImage: shoe.baseImage,
                category: shoe.categoryName || "Unknown Category",
                colors: Array.from(colorMap.get(shoe.id) || []),
                sizes: sizeMap.get(shoe.id) || { min: 0, max: 0, available: [] },
            }));
            const totalItems = Number(totalCountResult[0].count);
            const hasNext = offset_ + limit_ < totalItems;
            const nextOffset = hasNext ? offset_ + limit_ : undefined;
            return {
                data: transformedData,
                meta: {
                    total: totalItems,
                    limit: limit_,
                    offset: offset_,
                    hasNext,
                    nextPage: nextOffset,
                },
            };
        }
        catch (error) {
            console.error("❌ Error in getShoes:", error);
            throw error;
        }
    },
    //Helper functions
    _createVariantsForShoe: async (tx, shoeId, colorVariants) => {
        for (const variant of colorVariants) {
            const [record] = await tx
                .select()
                .from(colorVariant)
                .where(and(eq(colorVariant.shoeId, shoeId), eq(colorVariant.name, variant.name)))
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
                await tx.insert(images).values(variant.images.map((img) => ({
                    colorVariantId: colorVariantRecord.id,
                    imageUrl: img.imageUrl,
                    altText: img.altText,
                })));
            }
            // Insert size availability
            if (variant.sizeAvailability && variant.sizeAvailability.length > 0) {
                await tx.insert(shoeSizes).values(variant.sizeAvailability.map((size) => ({
                    colorVariantId: colorVariantRecord.id,
                    sizeId: size.sizeId,
                    price: size.price,
                    quantity: size.quantity,
                })));
            }
        }
    },
    _updateVariantsForShoe: async (tx, shoeId, colorVariants) => {
        for (const variant of colorVariants) {
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
                    .where(and(eq(colorVariant.id, variant.id), eq(colorVariant.shoeId, shoeId)));
                //2. Update images
                if (variant.images && variant.images.length > 0) {
                    await tx.delete(images).where(eq(images.colorVariantId, variant.id));
                    await tx.insert(images).values(variant.images.map((img) => ({
                        colorVariantId: variant.id,
                        imageUrl: img.imageUrl,
                        altText: img.altText,
                    })));
                }
                //3. Update size availability
                if (variant.sizeAvailability && variant.sizeAvailability.length > 0) {
                    await tx
                        .delete(shoeSizes)
                        .where(eq(shoeSizes.colorVariantId, variant.id));
                    await tx.insert(shoeSizes).values(variant.sizeAvailability.map((size) => ({
                        colorVariantId: variant.id,
                        sizeId: size.sizeId,
                        price: size.price,
                        quantity: size.quantity,
                    })));
                }
            }
            else {
                // create color variant
                const variantData = {
                    name: variant.name,
                    dominantColor: variant.dominantColor,
                    images: variant.images,
                    sizeAvailability: variant.sizeAvailability,
                };
                await ShoeRepository._createVariantsForShoe(tx, shoeId, [variantData]);
            }
        }
    },
};
