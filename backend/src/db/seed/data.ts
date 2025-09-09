import { createSlug } from "../../utils/slugify.js";
import { db } from "../index.js";
import {
  shoes,
  colorVariant,
  images,
  shoeSizes,
  sizes,
  category,
} from "../../models/shoes.model.js";

import seedData from "./seedData.js";

// Real Nike shoe data
// const nikeShoesSeedData = [
//   {
//     name: "Nike Air Max 90 SE",
//     description:
//       "The Air Max 90 stays true to its running roots with the iconic Waffle sole. Plus, stitched overlays and textured accents create the '90s look you love. Complete with romantic hues, its visible Air cushioning adds comfort to your journey.",
//     categoryId: 1,
//     styleNumber: "HM9451-600",
//     basePrice: 14000, // $140.00
//     colorVariants: [
//       {
//         name: "Dark Team Red/Platinum Tint/Pure Platinum/White",
//         dominantColor: "Red",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/89c5d539-8c2c-4e52-8d71-f8dce3e8b7a2/air-max-90-se-womens-shoes-HM9451-600.png",
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8c7c5d39-9c2c-4e52-8d71-f8dce3e8b7a3/air-max-90-se-womens-shoes-HM9451-600.png",
//         ],
//       },
//       {
//         name: "White/Black/Cool Grey",
//         dominantColor: "White",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/12345678-1234-1234-1234-123456789012/air-max-90-se-womens-shoes-white.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike Air Force 1 '07",
//     description:
//       "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
//     categoryId: 2,
//     styleNumber: "CW2288-111",
//     basePrice: 11000, // $110.00
//     colorVariants: [
//       {
//         name: "White/White",
//         dominantColor: "White",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b72b2fd7d68e/air-force-1-07-mens-shoes.png",
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/00375837-849f-4f17-ba24-d201d27be49b/air-force-1-07-mens-shoes.png",
//         ],
//       },
//       {
//         name: "Black/Black",
//         dominantColor: "Black",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/350e7f3a-979a-402b-9396-a8a998dd76ab/air-force-1-07-mens-shoes-315122-001.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike Dunk Low",
//     description:
//       "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with perfectly sheened overlays and original team colors. With its classic hoops design, the Nike Dunk Low channels '80s vintage back onto the streets while its padded, low-cut collar lets you take your game anywhere—in comfort.",
//     categoryId: 3,
//     styleNumber: "DD1391-100",
//     basePrice: 10000, // $100.00
//     colorVariants: [
//       {
//         name: "White/Black",
//         dominantColor: "White",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-mens-shoes.png",
//         ],
//       },
//       {
//         name: "University Red/White",
//         dominantColor: "Red",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8c7c5d39-9c2c-4e52-8d71-f8dce3e8b7a4/dunk-low-mens-shoes-red.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike Air Max 270",
//     description:
//       "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
//     categoryId: 4,
//     styleNumber: "AH6789-100",
//     basePrice: 13000, // $130.00
//     colorVariants: [
//       {
//         name: "White/Black/White",
//         dominantColor: "White",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/air-max-270-womens-shoes.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike Blazer Mid '77 Vintage",
//     description:
//       "In the '70s, Nike was the new shoe on the block. So new in fact, we were still making them in a small workshop in Beaverton. Fast forward a few decades and the Nike Blazer Mid '77 Vintage returns with classic details and throwback hoops flair.",
//     categoryId: 4,
//     styleNumber: "BQ6806-100",
//     basePrice: 9000, // $90.00
//     colorVariants: [
//       {
//         name: "White/Black",
//         dominantColor: "White",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/blazer-mid-77-vintage-womens-shoes.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike Air Max 1",
//     description:
//       "Meet the leader of the pack. Walking on air since 1987, the Air Max 1 won't be going anywhere soon. The timeless silhouette feels as good as it looks, with the perfect amount of flash to make you shine.",
//     categoryId: 3,
//     styleNumber: "DH4059-101",
//     basePrice: 12000, // $120.00
//     colorVariants: [
//       {
//         name: "White/University Red/Neutral Grey/Black",
//         dominantColor: "White",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/air-max-1-mens-shoes.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike Air Jordan 1 Low",
//     description:
//       "Inspired by the original that debuted in 1985, the Air Jordan 1 Low offers a clean, classic look that's familiar yet always fresh. With an iconic design that pairs perfectly with any fit, these kicks ensure you'll always be on point.",
//     categoryId: 2,
//     styleNumber: "553558-161",
//     basePrice: 9000, // $90.00
//     colorVariants: [
//       {
//         name: "White/Black/White",
//         dominantColor: "White",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/air-jordan-1-low-mens-shoes.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike React Infinity Run Flyknit 3",
//     description:
//       "A shoe designed to help you run more. The Nike React Infinity Run Flyknit 3 continues to help reduce injury and keep you on the run. More foam and improved upper details provide a secure and cushioned feel.",
//     categoryId: 1,
//     styleNumber: "CT2357-002",
//     basePrice: 16000, // $160.00
//     colorVariants: [
//       {
//         name: "Black/White/Iron Grey",
//         dominantColor: "Black",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/react-infinity-run-flyknit-3-mens-shoes.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike Cortez",
//     description:
//       "The Nike Cortez continues to deliver the comfort and simple style that made it an instant hit back in 1972. A cult classic with a track legacy, it pairs a nylon upper with suede accents and the signature waffle-pattern outsole.",
//     categoryId: 2,
//     styleNumber: "807471-101",
//     basePrice: 8000, // $80.00
//     colorVariants: [
//       {
//         name: "White/Varsity Red/Varsity Royal",
//         dominantColor: "White",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/cortez-womens-shoes.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike Air Max 97",
//     description:
//       "Featuring the original ripple design inspired by Japanese bullet trains, the Nike Air Max 97 lets you push your style full-speed ahead. Taking the revolutionary full-length Nike Air unit that shook up the running world and adding fresh colors and crisp details, it lets you ride in first-class comfort.",
//     categoryId: 4,
//     styleNumber: "DH4069-101",
//     basePrice: 17000, // $170.00
//     colorVariants: [
//       {
//         name: "White/Black/Wolf Grey",
//         dominantColor: "White",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/air-max-97-mens-shoes.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike Pegasus 40",
//     description:
//       "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love but with improved comfort in those sensitive areas of your foot, like the arch and toes.",
//     categoryId: 3,
//     styleNumber: "DV3853-101",
//     basePrice: 13000, // $130.00
//     colorVariants: [
//       {
//         name: "White/Metallic Silver/Pure Platinum",
//         dominantColor: "White",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/pegasus-40-womens-running-shoes.png",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Nike SB Dunk Low Pro",
//     description:
//       "Created for the hardwood but taken to the streets, the basketball icon returns with classic details and throwback hoops flair. Its vintage outsole is combined with a soft sockliner and Nike Zoom Air unit for a comfortable ride that can take on any street session.",
//     categoryId: 1,
//     styleNumber: "BQ6817-005",
//     basePrice: 9000, // $90.00
//     colorVariants: [
//       {
//         name: "Black/White/Black",
//         dominantColor: "Black",
//         images: [
//           "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/sb-dunk-low-pro-skate-shoes.png",
//         ],
//       },
//     ],
//   },
// ];

// Common sizes data (US sizing)
const sizesData = [
  { size: "5.0" },
  { size: "5.5" },
  { size: "6.0" },
  { size: "6.5" },
  { size: "7.0" },
  { size: "7.5" },
  { size: "8.0" },
  { size: "8.5" },
  { size: "9.0" },
  { size: "9.5" },
  { size: "10.0" },
  { size: "10.5" },
  { size: "11.0" },
  { size: "11.5" },
  { size: "12.0" },
  { size: "12.5" },
  { size: "13.0" },
  { size: "14.0" },
  { size: "15.0" },
];

// Category data
const categoriesData = [
  { name: "women" },
  { name: "men" },
  { name: "kids" },
  { name: "unisex" },
];

export async function seedNikeShoes() {
  try {
    console.log("🌱 Starting Nike shoes seeding...");

    // await db.delete(category).execute();
    // await db.delete(sizes).execute();
    // await db.delete(colorVariant).execute();
    // await db.delete(shoes).execute();
    // await db.delete(shoeSizes).execute();
    // await db.delete(images).execute();

    // First, seed sizes if they don't exist
    console.log("📏 Seeding sizes...");
    for (const sizeData of sizesData) {
      await db.insert(sizes).values(sizeData).onConflictDoNothing();
    }

    console.log("📏 Seeding categories...");
    const categories = [];
    for (const cat of categoriesData) {
      const [insertedCat] = await db
        .insert(category)
        .values(cat)
        .onConflictDoNothing()
        .returning();
      categories.push(insertedCat);
    }

    // Get all size IDs for later use
    const allSizes = await db.select().from(sizes);
    console.log(`✅ ${allSizes.length} sizes ready`);

    let totalShoes = 0;
    let totalVariants = 0;
    let totalImages = 0;

    // Seed each shoe with its variants
    for (const shoeData of seedData) {
      console.log(`👟 Creating shoe: ${shoeData.name}`);

      const catId = categories.find((c) => c.name === shoeData.category)?.id;
      console.log(`Category ID: ${catId}`);
      // if (!cat) {
      //   throw new Error(`Category not found for ${shoeData.name}`);
      // }
      // shoeData.category = cat;

      // Create the base shoe
      const [shoe] = await db
        .insert(shoes)
        .values({
          name: shoeData.name,
          slug: createSlug(shoeData.name),
          description: shoeData.description,
          categoryId: catId!,
          basePrice: shoeData.price,
        })
        .returning();

      totalShoes++;

      // Create color variants for this shoe
      for (const variantData of shoeData.colors) {
        const [variant] = await db
          .insert(colorVariant)
          .values({
            shoeId: shoe.id,
            name: variantData.name,
            dominantColor: variantData.dominantColor,
            styleNumber: variantData.styleNumber,
          })
          .returning();

        totalVariants++;

        // Create images for this variant
        for (const imageUrl of variantData.images) {
          await db.insert(images).values({
            colorVariantId: variant.id,
            imageUrl: imageUrl,
            altText: `${shoeData.name} - ${variantData.name}`,
          });
          totalImages++;
        }

        // Create size availability for this variant
        // Use random selection of sizes to simulate realistic availability
        const availableSizes = allSizes.slice(
          0,
          Math.floor(Math.random() * 10) + 8
        ); // 8-18 sizes available

        for (const size of availableSizes) {
          const priceVariation = Math.floor(Math.random() * 1000); // 0-$10 variation
          const quantity = Math.floor(Math.random() * 20) + 1; // 1-20 quantity

          await db.insert(shoeSizes).values({
            colorVariantId: variant.id,
            sizeId: size.id,
            price: shoeData.price + priceVariation,
            quantity: quantity,
          });
        }
      }
    }

    console.log("🎉 Nike shoes seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - ${totalShoes} shoes created`);
    console.log(`   - ${totalVariants} color variants created`);
    console.log(`   - ${totalImages} images created`);
    console.log(`   - Size availability populated for all variants`);
  } catch (error) {
    console.error("❌ Error seeding Nike shoes:", error);
    throw error;
  }
}

// Export for use in main seed file
export default seedNikeShoes;
