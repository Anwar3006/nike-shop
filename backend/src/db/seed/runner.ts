import { db } from "../index.js";
import { createSlug } from "../../utils/slugify.js";
import { logger } from "../../utils/logger.js";
import seedData from "./seedData.js";
import {
  brands,
  categories,
  genders,
  colors,
  sizes,
  shoes,
  shoeVariants,
  shoeImages,
  reviews,
  favorites,
  user,
  address,
  orders,
  orderItems,
  payments,
} from "../../models/index.js";
import { nanoid } from "nanoid";
import { eq, sql } from "drizzle-orm";
import { auth } from "../../utils/auth.js";

// Color mapping for hex codes
const COLOR_HEX_MAP: Record<string, string> = {
  Orange: "#FF8C00",
  White: "#FFFFFF",
  Brown: "#8B4513",
  Green: "#32CD32",
  Blue: "#0000FF",
  Gray: "#808080",
  Grey: "#808080",
  Pink: "#FFC0CB",
  Red: "#FF0000",
  Yellow: "#FFFF00",
  Navy: "#000080",
  Black: "#000000",
};

// Sample user data
const SAMPLE_USERS = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    dob: "1990-05-15",
    password: "passwordJohnDoe",
    imageUrl:
      "https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869141.jpg",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    dob: "1988-12-20",
    password: "passwordJaneSmith",
    imageUrl:
      "https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869151.jpg",
  },
  {
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    dob: "1992-03-10",
    password: "passwordMikeJohnson",
    imageUrl:
      "https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303093.jpg",
  },
];

// Sample addresses for users
const SAMPLE_ADDRESSES = [
  {
    type: "home",
    streetAddress: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    phoneNumber: "+1-555-0101",
    isDefault: true,
    userId: "",
  },
  {
    type: "work",
    streetAddress: "456 Business Ave",
    city: "New York",
    state: "NY",
    zipCode: "10002",
    phoneNumber: "+1-555-0102",
    isDefault: false,
    userId: "",
  },
  {
    type: "home",
    streetAddress: "789 Oak Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    phoneNumber: "+1-555-0201",
    isDefault: true,
    userId: "",
  },
  {
    type: "home",
    streetAddress: "321 Pine Road",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    phoneNumber: "+1-555-0301",
    isDefault: true,
    userId: "",
  },
];

// Sample reviews data
const SAMPLE_REVIEWS = [
  { rating: 5, comment: "Amazing shoes! Perfect fit and great quality." },
  { rating: 4, comment: "Love the design and comfort. Highly recommend." },
  { rating: 5, comment: "Best sneakers I've ever owned. Worth every penny." },
  { rating: 3, comment: "Good shoes but a bit pricey for what you get." },
  {
    rating: 4,
    comment: "Great for running and everyday wear. Very comfortable.",
  },
  { rating: 5, comment: "Excellent build quality and stylish design." },
  { rating: 2, comment: "Not as comfortable as expected. Size runs small." },
  { rating: 4, comment: "Good value for money. Fast shipping too." },
];

/**
 * Generate a unique SKU for a variant
 */
function generateSKU(
  styleNumber: string,
  colorSlug: string,
  sizeValue: string
): string {
  return `${styleNumber}-${colorSlug}-${sizeValue.replace(".", "5")}`;
}

/**
 * Get random stock level
 */
function getRandomStock(): number {
  return Math.floor(Math.random() * 91) + 10; // 10-100
}

/**
 * Get random sale price (20-40% off)
 */
function getRandomSalePrice(basePrice: number): number | null {
  if (Math.random() < 0.3) {
    // 30% chance of being on sale
    const discount = 0.2 + Math.random() * 0.2; // 20-40% discount
    return Math.floor(basePrice * (1 - discount));
  }
  return null;
}

/**
 * Clear all existing data
 */
async function clearDatabase() {
  logger.info("🧹 Clearing existing data...");

  try {
    // Step 1: Nullify the foreign key reference in the 'shoes' table.
    // This is the crucial step to avoid the foreign key constraint error.
    await db.update(shoes).set({ defaultVariantId: null });
    logger.info("✅ Nullified defaultVariantId in shoes table");

    // Delete tables that have foreign keys from other tables first
    await db.delete(orderItems);
    await db.delete(payments);
    await db.delete(orders);
    await db.delete(reviews);
    await db.delete(favorites);
    await db.delete(shoeImages);
    await db.delete(shoeVariants);
    await db.delete(address);

    // Then, delete the parent tables
    await db.delete(shoes);
    await db.delete(user);
    await db.delete(sizes);
    await db.delete(colors);
    await db.delete(genders);
    await db.delete(categories);
    await db.delete(brands);

    // After using this, youll need to run `npx drizzle-kit push` to create the tables
    // await db.execute(sql`DROP SCHEMA "public" CASCADE;`);
    // await db.execute(sql`CREATE SCHEMA "public";`);

    logger.info("✅ Database cleared successfully");
  } catch (error: unknown) {
    logger.error("❌ Error clearing database: " + error);
    throw error;
  }
}

/**
 * Seed brands table
 */
async function seedBrands() {
  logger.info("🏷️ Seeding brands...");

  const brandData = [
    {
      name: "Nike",
      slug: "nike",
      logoUrl:
        "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
    },
    {
      name: "Jordan",
      slug: "jordan",
      logoUrl:
        "https://logos-world.net/wp-content/uploads/2020/09/Jordan-Logo.png",
    },
  ];

  const insertedBrands = await db.insert(brands).values(brandData).returning();
  logger.info(`✅ Inserted ${insertedBrands.length} brands`);
  return insertedBrands;
}

/**
 * Seed categories table
 */
async function seedCategories() {
  logger.info("📁 Seeding categories...");

  const categoryData = [
    { name: "Lifestyle", slug: "lifestyle" },
    { name: "Running", slug: "running" },
    { name: "Basketball", slug: "basketball" },
    { name: "Training", slug: "training" },
    { name: "Casual", slug: "casual" },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();
  logger.info(`✅ Inserted ${insertedCategories.length} categories`);
  return insertedCategories;
}

/**
 * Seed genders table
 */
async function seedGenders() {
  logger.info("👥 Seeding genders...");

  const genderData = [
    { label: "Men", slug: "men" },
    { label: "Women", slug: "women" },
    { label: "Kids", slug: "kids" },
    { label: "Unisex", slug: "unisex" },
  ];

  const insertedGenders = await db
    .insert(genders)
    .values(genderData)
    .returning();
  logger.info(`✅ Inserted ${insertedGenders.length} genders`);
  return insertedGenders;
}

/**
 * Seed colors table
 */
async function seedColors() {
  logger.info("🎨 Seeding colors...");

  // Extract unique colors from seed data
  const uniqueColors = new Set<string>();
  seedData.forEach((shoe) => {
    shoe.colors.forEach((color) => {
      uniqueColors.add(color.dominantColor);
    });
  });

  const colorData = Array.from(uniqueColors).map((colorName) => ({
    name: colorName,
    slug: createSlug(colorName),
    hexCode: COLOR_HEX_MAP[colorName] || "#808080", // Default to gray if not found
  }));

  const insertedColors = await db.insert(colors).values(colorData).returning();
  logger.info(`✅ Inserted ${insertedColors.length} colors`);
  return insertedColors;
}

/**
 * Seed sizes table
 */
async function seedSizes() {
  logger.info("📏 Seeding sizes...");

  // Extract unique sizes from seed data
  const uniqueSizes = new Set<string>();
  seedData.forEach((shoe) => {
    shoe.colors.forEach((color) => {
      color.size.forEach((size) => {
        uniqueSizes.add(size);
      });
    });
  });

  // Sort sizes numerically
  const sortedSizes = Array.from(uniqueSizes).sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    return numA - numB;
  });

  const sizeData = sortedSizes.map((sizeValue) => ({
    value: sizeValue,
    slug: createSlug(`size-${sizeValue.split(".").join("-")}`),
  }));

  const insertedSizes = await db.insert(sizes).values(sizeData).returning();
  logger.info(`✅ Inserted ${insertedSizes.length} sizes`);
  return insertedSizes;
}

/**
 * Seed users table
 */
async function seedUsers() {
  logger.info("👤 Seeding users...");

  const insertedUsers = [];
  SAMPLE_USERS.forEach(async (user) => {
    const { user: insertedUser } = await auth.api.signUpEmail({
      body: {
        name: user.name,
        email: user.email,
        password: user.password,
        image: user.imageUrl,
        dob: user.dob,
      },
    });

    //select one Address
    const addressToInsert =
      SAMPLE_ADDRESSES[Math.floor(Math.random() * SAMPLE_ADDRESSES.length)];

    await db
      .insert(address)
      .values({
        ...addressToInsert,
        userId: insertedUser.id,
      })
      .returning();
    insertedUsers.push(insertedUser);
  });

  // const insertedUsers = await db.insert({user}).values(SAMPLE_USERS).returning();
  logger.info(`✅ Inserted ${insertedUsers.length} users`);
  return insertedUsers;
}

/**
 * Seed addresses table
 */
// async function seedAddresses() {
//   logger.info("🏠 Seeding addresses...");

//   const insertedAddresses = await db
//     .insert(address)
//     .values(SAMPLE_ADDRESSES)
//     .returning();
//   logger.info(`✅ Inserted ${insertedAddresses.length} addresses`);
//   return insertedAddresses;
// }

/**
 * Seed shoes, variants, and images
 */
async function seedShoesAndVariants(
  brandMap: Map<string, string>,
  categoryMap: Map<string, string>,
  genderMap: Map<string, string>,
  colorMap: Map<string, string>,
  sizeMap: Map<string, string>
) {
  logger.info("👟 Seeding shoes, variants, and images...");

  const nikeBrandId = brandMap.get("Nike")!;
  const defaultCategoryId = categoryMap.get("Lifestyle")!;

  let totalShoes = 0;
  let totalVariants = 0;
  let totalImages = 0;

  for (const shoeData of seedData) {
    // Determine gender and category
    const genderSlug =
      shoeData.category === "men"
        ? "Men"
        : shoeData.category === "women"
        ? "Women"
        : shoeData.category === "kids"
        ? "Kids"
        : "Unisex";
    const genderId = genderMap.get(genderSlug)!;

    // Create shoe record
    const [insertedShoe] = await db
      .insert(shoes)
      .values({
        name: shoeData.name,
        description: shoeData.description,
        categoryId: defaultCategoryId,
        genderId: genderId,
        brandId: nikeBrandId,
        isPublished: true,
      })
      .returning();

    totalShoes++;

    // Create base shoe image (first image from first color)
    await db.insert(shoeImages).values({
      shoeId: insertedShoe.id,
      url: shoeData.baseImage,
      sortOrder: 0,
      isPrimary: true,
    });
    totalImages++;

    let defaultVariantId: string | null = null;
    let isFirstVariant = true;

    // Create variants for each color/size combination
    for (const colorVariant of shoeData.colors) {
      const colorId = colorMap.get(colorVariant.dominantColor);

      if (!colorId) {
        logger.warn(`Color not found: ${colorVariant.dominantColor}`);
        continue;
      }

      for (const sizeValue of colorVariant.size) {
        const sizeId = sizeMap.get(sizeValue);

        if (!sizeId) {
          logger.warn(`Size not found: ${sizeValue}`);
          continue;
        }

        const sku = generateSKU(
          colorVariant.styleNumber,
          createSlug(colorVariant.dominantColor),
          sizeValue
        );
        const salePrice = getRandomSalePrice(shoeData.price);

        const [insertedVariant] = await db
          .insert(shoeVariants)
          .values({
            shoeId: insertedShoe.id,
            sku: sku,
            price: shoeData.price.toString(),
            salePrice: salePrice ? salePrice.toString() : null,
            colorId: colorId,
            sizeId: sizeId,
            inStock: getRandomStock(),
            weight: Math.random() * 2 + 0.5, // Random weight between 0.5-2.5 lbs
            dimensions: {
              length: Math.floor(Math.random() * 5) + 28, // 28-32 cm
              width: Math.floor(Math.random() * 3) + 10, // 10-12 cm
              height: Math.floor(Math.random() * 3) + 8, // 8-10 cm
            },
          })
          .returning();

        totalVariants++;

        // Set first variant as default
        if (isFirstVariant) {
          defaultVariantId = insertedVariant.id;
          isFirstVariant = false;
        }

        // Create images for this variant (first few images from color variant)
        const maxImages = Math.min(3, colorVariant.images.length);
        for (let i = 0; i < maxImages; i++) {
          await db.insert(shoeImages).values({
            shoeId: insertedShoe.id,
            variantId: insertedVariant.id,
            url: colorVariant.images[i],
            sortOrder: i + 1,
            isPrimary: i === 0,
          });
          totalImages++;
        }
      }
    }

    // Update shoe with default variant
    if (defaultVariantId) {
      await db
        .update(shoes)
        .set({ defaultVariantId })
        .where(eq(shoes.id, insertedShoe.id));
    }
  }

  logger.info(
    `✅ Inserted ${totalShoes} shoes, ${totalVariants} variants, and ${totalImages} images`
  );
}

/**
 * Seed reviews
 */
async function seedReviews(shoeIds: string[], userIds: string[]) {
  logger.info("⭐ Seeding reviews...");

  const reviewData = [];

  // Create 2-5 reviews per shoe
  for (const shoeId of shoeIds) {
    const reviewCount = Math.floor(Math.random() * 4) + 2; // 2-5 reviews

    for (let i = 0; i < reviewCount; i++) {
      const randomReview =
        SAMPLE_REVIEWS[Math.floor(Math.random() * SAMPLE_REVIEWS.length)];
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];

      reviewData.push({
        shoeId,
        userId: randomUserId,
        rating: randomReview.rating,
        comment: randomReview.comment,
      });
    }
  }

  const insertedReviews = await db
    .insert(reviews)
    .values(reviewData)
    .returning();
  logger.info(`✅ Inserted ${insertedReviews.length} reviews`);
  return insertedReviews;
}

/**
 * Seed favorites
 */
async function seedFavorites(shoeIds: string[], userIds: string[]) {
  logger.info("❤️ Seeding favorites...");

  const favoriteData = [];

  // Each user favorites 3-7 random shoes
  for (const userId of userIds) {
    const favoriteCount = Math.floor(Math.random() * 5) + 3;

    for (let i = 0; i < favoriteCount; i++) {
      const randomShoeId = shoeIds[Math.floor(Math.random() * shoeIds.length)];

      if (
        favoriteData.some(
          (f) => f.userId === userId && f.shoeId === randomShoeId
        )
      ) {
        // Skip duplicates
        continue;
      }

      favoriteData.push({
        userId,
        shoeId: randomShoeId,
      });
    }
  }

  const insertedFavorites = await db
    .insert(favorites)
    .values(favoriteData)
    .returning();
  logger.info(`✅ Inserted ${insertedFavorites.length} favorites`);
  return insertedFavorites;
}

// Main seeder function
export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data in correct order (reverse of dependencies)
    await clearDatabase();

    // Seed reference tables first
    const insertedBrands = await seedBrands();
    const insertedCategories = await seedCategories();
    const insertedGenders = await seedGenders();
    const insertedColors = await seedColors();
    const insertedSizes = await seedSizes();

    // Create maps for quick lookup
    const brandMap = new Map(
      insertedBrands.map((brand) => [brand.name, brand.id])
    );
    const categoryMap = new Map(
      insertedCategories.map((category) => [category.name, category.id])
    );
    const genderMap = new Map(
      insertedGenders.map((gender) => [gender.label, gender.id])
    );
    const colorMap = new Map(
      insertedColors.map((color) => [color.name, color.id])
    );
    const sizeMap = new Map(insertedSizes.map((size) => [size.value, size.id]));

    // console.log("CategoryMap: ", categoryMap.entries());
    // console.log("GenderMap: ", genderMap.entries());

    // Seed users and addresses
    await seedUsers();
    // await seedAddresses();

    // Seed shoes, variants, and images (complex relationships)
    await seedShoesAndVariants(
      brandMap,
      categoryMap,
      genderMap,
      colorMap,
      sizeMap
    );

    const [shoeIds, userIds] = await Promise.all([
      (await db.select({ id: shoes.id }).from(shoes)).map((v) => v.id),

      (await db.select({ id: user.id }).from(user)).map((v) => v.id),
    ]);

    // Seed user interactions
    await seedReviews(shoeIds, userIds);
    await seedFavorites(shoeIds, userIds);

    // Seed orders and payments
    // await seedOrders();
    // await seedPayments();

    console.log("🎉 Database seeding completed successfully!");

    // Print summary
    const counts = await Promise.all([
      db
        .select()
        .from(brands)
        .then((r) => r.length),
      db
        .select()
        .from(categories)
        .then((r) => r.length),
      db
        .select()
        .from(genders)
        .then((r) => r.length),
      db
        .select()
        .from(colors)
        .then((r) => r.length),
      db
        .select()
        .from(sizes)
        .then((r) => r.length),
      db
        .select()
        .from(user)
        .then((r) => r.length),
      db
        .select()
        .from(address)
        .then((r) => r.length),
      db
        .select()
        .from(shoes)
        .then((r) => r.length),
      db
        .select()
        .from(shoeVariants)
        .then((r) => r.length),
      db
        .select()
        .from(shoeImages)
        .then((r) => r.length),
      db
        .select()
        .from(reviews)
        .then((r) => r.length),
      db
        .select()
        .from(favorites)
        .then((r) => r.length),
      db
        .select()
        .from(orders)
        .then((r) => r.length),
      db
        .select()
        .from(orderItems)
        .then((r) => r.length),
      db
        .select()
        .from(payments)
        .then((r) => r.length),
    ]);

    console.log("\n📊 Seeding Summary:");
    console.log(`   Brands: ${counts[0]}`);
    console.log(`   Categories: ${counts[1]}`);
    console.log(`   Genders: ${counts[2]}`);
    console.log(`   Colors: ${counts[3]}`);
    console.log(`   Sizes: ${counts[4]}`);
    console.log(`   Users: ${counts[5]}`);
    console.log(`   User Addresses: ${counts[6]}`);
    console.log(`   Shoes: ${counts[7]}`);
    console.log(`   Shoe Variants: ${counts[8]}`);
    console.log(`   Shoe Images: ${counts[9]}`);
    console.log(`   Reviews: ${counts[10]}`);
    console.log(`   Favorites: ${counts[11]}`);
    console.log(`   Orders: ${counts[12]}`);
    console.log(`   Order Items: ${counts[13]}`);
    console.log(`   Payments: ${counts[14]}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

(async () => {
  try {
    await seedDatabase();
  } catch (error) {
    console.error("❌ Seeding process failed:", error);
    process.exit(1); // Exit the process with a failure code
  }
})();
