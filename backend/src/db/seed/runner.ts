import seedNikeShoes from "./data.js";

async function main() {
  await seedNikeShoes();
}

main().catch(console.error);
