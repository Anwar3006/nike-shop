import { db } from "./db";
import { products } from "./schema";

async function seed() {
  await db.insert(products).values([
    {
      name: "Nike Air Max",
      price: 120,
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Nike Dunk Low",
      price: 100,
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Nike Air Force 1",
      price: 90,
      image: "https://via.placeholder.com/150",
    },
  ]);
  console.log("Seeded products.");
  process.exit(0);
}

seed();
