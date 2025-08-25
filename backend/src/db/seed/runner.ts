import seedNikeShoes from "./data";

async function main() {
  await seedNikeShoes();
}

main().catch(console.error);
