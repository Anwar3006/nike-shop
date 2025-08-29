import puppeteer, { Browser, Page } from "puppeteer";
import fs from "fs/promises";
import path from "path";

interface ScrapedShoe {
  name: string;
  description?: string;
  category: string;
  styleNumber?: string;
  basePrice: number;
  baseImage?: string;
  colorVariants: {
    name: string;
    dominantColor: string;
    images: string[];
  }[];
  availableSizes: string[];
}

interface ScraperOptions {
  headless?: boolean;
  maxPages?: number;
  delay?: number;
  outputFile?: string;
  categories?: string[];
}

class NikeShoeScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private scrapedData: ScrapedShoe[] = [];

  constructor(private options: ScraperOptions = {}) {
    this.options = {
      headless: true,
      maxPages: 5,
      delay: 2000,
      outputFile: "scraped-shoes.json",
      categories: ["mens", "womens"],
      ...options,
    };
  }

  async initialize(): Promise<void> {
    console.log("🚀 Initializing Nike shoe scraper...");

    this.browser = await puppeteer.launch({
      headless: this.options.headless,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      ],
    });

    this.page = await this.browser.newPage();

    // Set viewport and headers to mimic real browser
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Block unnecessary resources to speed up scraping
    await this.page.setRequestInterception(true);
    this.page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    console.log("✅ Browser initialized successfully");
  }

  async scrapeNikeProductListing(): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    // const baseUrl = 'https://www.nike.com/w/shoes-y7ok';
    const baseUrl = "https://www.nike.sa/en/mens/shoes";
    console.log(`📄 Scraping Nike product listings from: ${baseUrl}`);

    try {
      await this.page.goto(baseUrl, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Wait for products to load
      await this.page.waitForSelector('[data-testid="product-card"]', {
        timeout: 15000,
      });

      // Scroll to load more products
      await this.autoScroll();

      // Extract product URLs
      const productUrls = await this.page.evaluate(() => {
        const productCards = document.querySelectorAll(
          '[data-testid="product-card"] a'
        );
        return Array.from(productCards)
          .map((card) => (card as HTMLAnchorElement).href)
          .filter((url) => url.includes("/t/"))
          .slice(0, 20); // Limit to first 20 products
      });

      console.log(`🔍 Found ${productUrls.length} product URLs`);

      // Scrape each product page
      for (
        let i = 0;
        i < Math.min(productUrls.length, this.options.maxPages || 10);
        i++
      ) {
        const url = productUrls[i];
        console.log(
          `📦 Scraping product ${i + 1}/${productUrls.length}: ${url}`
        );

        try {
          await this.scrapeProductPage(url);
          await this.delay(this.options.delay || 2000);
        } catch (error) {
          console.error(`❌ Error scraping product ${url}:`, error);
          continue;
        }
      }
    } catch (error) {
      console.error("❌ Error scraping product listings:", error);
      throw error;
    }
  }

  async scrapeProductPage(url: string): Promise<void> {
    if (!this.page) throw new Error("Browser not initialized");

    try {
      await this.page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

      // Wait for key elements to load
      await this.page.waitForSelector('h1[data-testid="product-title"]', {
        timeout: 10000,
      });

      const productData = await this.page.evaluate(() => {
        // Extract basic product info
        const nameElement = document.querySelector(
          'h1[data-testid="product-title"]'
        );
        const name = nameElement?.textContent?.trim() || "";

        const subtitleElement = document.querySelector(
          'h2[data-testid="product-subtitle"]'
        );
        const category = subtitleElement?.textContent?.trim() || "";

        const descriptionElement = document.querySelector(
          '[data-testid="product-description"]'
        );
        const description = descriptionElement?.textContent?.trim() || "";

        // Extract price
        const priceElement = document.querySelector(
          '[data-testid="product-price"]'
        );
        const priceText = priceElement?.textContent?.trim() || "";
        const priceMatch = priceText.match(/\$(\d+(?:\.\d{2})?)/);
        const basePrice = priceMatch
          ? Math.round(parseFloat(priceMatch[1]) * 100)
          : 0;

        // Extract style number
        const styleElements = document.querySelectorAll(
          '[data-testid="product-sub-title"], .description-preview p'
        );
        let styleNumber = "";
        for (const el of styleElements) {
          const text = el.textContent || "";
          const styleMatch = text.match(/Style:\s*([A-Z0-9-]+)/i);
          if (styleMatch) {
            styleNumber = styleMatch[1];
            break;
          }
        }

        // Extract color variants
        const colorButtons = document.querySelectorAll(
          '[data-testid="color-swatch"]'
        );
        const colorVariants = Array.from(colorButtons).map((button, index) => {
          const colorName =
            button.getAttribute("aria-label") || `Color ${index + 1}`;

          // Try to determine dominant color from the color name
          let dominantColor = "Multi";
          const colorLower = colorName.toLowerCase();
          if (colorLower.includes("white")) dominantColor = "White";
          else if (colorLower.includes("black")) dominantColor = "Black";
          else if (colorLower.includes("red")) dominantColor = "Red";
          else if (colorLower.includes("blue")) dominantColor = "Blue";
          else if (colorLower.includes("green")) dominantColor = "Green";
          else if (colorLower.includes("yellow")) dominantColor = "Yellow";
          else if (colorLower.includes("grey") || colorLower.includes("gray"))
            dominantColor = "Grey";
          else if (colorLower.includes("pink")) dominantColor = "Pink";
          else if (colorLower.includes("orange")) dominantColor = "Orange";
          else if (colorLower.includes("brown")) dominantColor = "Brown";

          return {
            name: colorName,
            dominantColor,
            images: [] as string[],
          };
        });

        // Extract main product image
        const mainImageElement = document.querySelector(
          '[data-testid="hero-image"] img'
        );
        const baseImage = mainImageElement
          ? (mainImageElement as HTMLImageElement).src
          : "";

        // Extract additional images
        const imageElements = document.querySelectorAll(
          '[data-testid="image-gallery"] img, .css-1g5o7nc img'
        );
        const images = Array.from(imageElements)
          .map((img) => (img as HTMLImageElement).src)
          .filter((src) => src && !src.includes("data:"))
          .slice(0, 5); // Limit to 5 images

        // If we have color variants but no images extracted, add the base image
        if (colorVariants.length > 0 && images.length === 0 && baseImage) {
          colorVariants[0].images.push(baseImage);
        } else if (colorVariants.length > 0 && images.length > 0) {
          // Distribute images among color variants (simplified approach)
          colorVariants[0].images = images;
        }

        // Extract available sizes
        const sizeButtons = document.querySelectorAll(
          '[data-testid="size-selector-button"]'
        );
        const availableSizes = Array.from(sizeButtons)
          .filter((button) => !button.hasAttribute("disabled"))
          .map((button) => button.textContent?.trim() || "")
          .filter((size) => size);

        return {
          name,
          description,
          category,
          styleNumber,
          basePrice,
          baseImage,
          colorVariants:
            colorVariants.length > 0
              ? colorVariants
              : [
                  {
                    name: "Default",
                    dominantColor: "Multi",
                    images: baseImage ? [baseImage] : [],
                  },
                ],
          availableSizes,
        };
      });

      // Only add products with valid data
      if (productData.name && productData.basePrice > 0) {
        this.scrapedData.push(productData);
        console.log(
          `✅ Successfully scraped: ${productData.name} - $${
            productData.basePrice / 100
          }`
        );
      } else {
        console.log(
          `⚠️  Skipped product with incomplete data: ${productData.name}`
        );
      }
    } catch (error) {
      console.error(`❌ Error scraping product page ${url}:`, error);
      throw error;
    }
  }

  private async autoScroll(): Promise<void> {
    if (!this.page) return;

    await this.page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async saveData(): Promise<void> {
    const outputPath = path.join(
      process.cwd(),
      this.options.outputFile || "scraped-shoes.json"
    );

    try {
      await fs.writeFile(outputPath, JSON.stringify(this.scrapedData, null, 2));
      console.log(`💾 Data saved to: ${outputPath}`);
      console.log(`📊 Total products scraped: ${this.scrapedData.length}`);
    } catch (error) {
      console.error("❌ Error saving data:", error);
      throw error;
    }
  }

  async generateSeederFile(): Promise<void> {
    const seederContent = `
// Auto-generated Nike shoes seeder from web scraping
import { db } from "../index";
import { shoes, colorVariant, images, shoeSizes, sizes, categories } from "../schema";

export const scrapedNikeShoes = ${JSON.stringify(this.scrapedData, null, 2)};

export async function seedScrapedNikeShoes() {
  console.log("🌱 Seeding scraped Nike shoes...");
  
  for (const shoeData of scrapedNikeShoes) {
    try {
      // Create the base shoe
      const [shoe] = await db.insert(shoes).values({
        name: shoeData.name,
        description: shoeData.description,
        category: shoeData.category,
        styleNumber: shoeData.styleNumber,
        basePrice: shoeData.basePrice,
        baseImage: shoeData.baseImage,
      }).returning();

      // Create color variants
      for (const variant of shoeData.colorVariants) {
        const [colorVariantRecord] = await db.insert(colorVariant).values({
          shoeId: shoe.id,
          name: variant.name,
          dominantColor: variant.dominantColor,
        }).returning();

        // Create images for this variant
        if (variant.images.length > 0) {
          await db.insert(images).values(
            variant.images.map(imageUrl => ({
              colorVariantId: colorVariantRecord.id,
              imageUrl,
              altText: \`\${shoeData.name} - \${variant.name}\`,
            }))
          );
        }
      }

      console.log(\`✅ Seeded: \${shoeData.name}\`);
    } catch (error) {
      console.error(\`❌ Error seeding \${shoeData.name}:\`, error);
    }
  }
  
  console.log("🎉 Scraped Nike shoes seeding completed!");
}
`;

    const seederPath = path.join(process.cwd(), "scraped-nike-seeder.ts");
    await fs.writeFile(seederPath, seederContent);
    console.log(`📝 Seeder file generated: ${seederPath}`);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log("🔐 Browser closed");
    }
  }

  async run(): Promise<ScrapedShoe[]> {
    try {
      await this.initialize();
      await this.scrapeNikeProductListing();
      await this.saveData();
      await this.generateSeederFile();
      return this.scrapedData;
    } finally {
      await this.close();
    }
  }
}

// Usage example
// async function main() {
//   const scraper = new NikeShoeScraper({
//     headless: false, // Set to true for production
//     maxPages: 15,
//     delay: 3000,
//     outputFile: 'nike-shoes-scraped.json'
//   });

//   try {
//     const data = await scraper.run();
//     console.log(\`🎉 Scraping completed! Collected \${data.length} products.\`);
//   } catch (error) {
//     console.error('❌ Scraping failed:', error);
//     process.exit(1);
//   }
// }

// // Run if this file is executed directly
// if (require.main === module) {
//   main();
// }

// export { NikeShoeScraper, ScrapedShoe, ScraperOptions };
