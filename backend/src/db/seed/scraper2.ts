import { existsSync, mkdirSync, writeFileSync } from "fs";
import puppeteer from "puppeteer";
// import { cuid } from "@paralleldrive/cuid2";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ShoeData {
  id: string; // cuid()
  name: string;
  description: string;
  category: string;
  gender: "male" | "female" | "unisex";
  brand: string;
  basePrice: number;
  colors: Array<{
    name: string;
    styleCode: string;
    images: string[];
    availableSizes: string[];
  }>;
  reviews: {
    averageRating: number;
    count: number;
    reviews: Array<{
      title: string;
      comment: string;
      rating: number;
      author: string;
    }>;
  };
  similarProducts: Array<{
    name: string;
    price: number;
    image: string;
  }>;
}

const Gender = ["men", "women", "kids", "unisex"];

const scrapeShoes = async (url: string) => {
  if (url.trim() === "") return null;

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  //navigate to target
  await page.goto(url);

  //wait for the main product information to load
  await page.waitForSelector(".b-pdp__content");

  const shoe: ShoeData = {} as ShoeData;

  //start getting data
  //   shoe.id = cuid();
  shoe.name =
    (await page.$eval(".b-pdp__headline span.b-pdp__product-name", (el) =>
      el.textContent?.trim()
    )) || "N/A";

  shoe.description =
    (await page.$eval(".b-productinfo .b-productinfo__content", (el) =>
      el.textContent?.trim()
    )) || "N/A";

  const category =
    (
      await page.$eval(
        ".b-pdp__headline span.b-pdp__product-subcategory",
        (el) => el.textContent
      )
    )
      ?.trim()
      .toLowerCase() || "N/A";

  shoe.category = Gender.includes(category) ? category : "unisex";
  shoe.gender =
    shoe.category === "men"
      ? "male"
      : shoe.category === "women"
      ? "female"
      : "unisex";

  shoe.brand =
    (await page.$eval('meta[property="og:site_name"]', (el) =>
      el.getAttribute("content")
    )) || "N/A";

  shoe.basePrice = parseInt(
    (
      await page.$eval(".price .sales span.value", (el) =>
        el.textContent?.replace(/[^0-9.-]+/g, "")
      )
    )?.replace(",", "") || "0"
  );
  shoe.colors = [];

  //get all colors
  const colorButtons = await page.$$(".b-attribute__list .color-attribute");

  //   console.log("colorButtons: ", colorButtons);
  for (let i = 0; i < colorButtons.length; i++) {
    try {
      // Re-query the color buttons as DOM might have changed
      const currentColorButtons = await page.$$(
        ".b-attribute__list .color-attribute"
      );
      if (i >= currentColorButtons.length) break;

      await currentColorButtons[i].click();

      // Wait for content to reload with more specific selector
      await new Promise((res) => setTimeout(res, 2000));

      const colorData = await page.evaluate(() => {
        // Try multiple selectors for color name
        let name = "";
        const colorSelectors = [
          ".variantColor.attribute__headline .attribute__selected-color-vendor",
          ".color-attribute.m-selected .sr-only",
          ".attribute__selected-color-vendor",
          ".variantColor .attribute__selected-value",
        ];

        for (const selector of colorSelectors) {
          const el = document.querySelector(selector);
          if (el && el.textContent?.trim()) {
            name = el.textContent.trim();
            break;
          }
        }

        if (!name) {
          // Fallback: get from aria-label of selected color button
          const selectedColorBtn = document.querySelector(
            ".color-attribute.m-selected"
          );
          if (selectedColorBtn) {
            const ariaLabel = selectedColorBtn.getAttribute("aria-label");
            if (ariaLabel) {
              name = ariaLabel.replace("Select Color ", "").trim();
            }
          }
        }

        // Get style code
        let styleCode = "";
        const styleSelectors = [
          ".b-productinfo .b-list--dots li",
          ".product-number",
          ".style-number",
        ];

        for (const selector of styleSelectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach((li) => {
            const text = li.textContent?.trim();
            if (text && text.toLowerCase().includes("style")) {
              styleCode = text.replace(/style:?/i, "").trim();
            }
          });
          if (styleCode) break;
        }

        // Get images
        const imageSelectors = [
          ".carousel-indicators li img.b-picture__img",
          //   ".b-pdp__image-carousel img",
          //   ".product-images img",
          //   ".carousel-item img",
        ];

        let images: string[] = [];
        // for (const selector of imageSelectors) {
        const imgLiElements = document.querySelectorAll(
          ".carousel-indicators li"
        );
        if (imgLiElements.length > 0) {
          const carouselImages = Array.from(imgLiElements)
            .map((li) => {
              // Try different selectors for images within carousel indicators
              const img = li.querySelector("img.b-pdpimages__carousel-img");
              // li.querySelector("img") ||
              // li.querySelector("[data-src]");
              return img?.getAttribute("src") || img?.getAttribute("data-src");
            })
            .filter(
              (src): src is string =>
                !!src &&
                !src.includes("data:image/svg+xml") &&
                !src.includes("placeholder") &&
                src.startsWith("http")
            );

          images.push(...carouselImages);
          console.log(
            "Images from carousel indicators: ",
            carouselImages.length
          );
        }

        // Get available sizes
        let availableSizes: string[] = [];

        const sizeElements = document.querySelectorAll(
          ".js-size-attributes .shoe-size-attributes-UK .swatch-value"
        );
        availableSizes = Array.from(sizeElements)
          .map((el) => el.textContent?.trim())
          .filter((size): size is string => !!size && size !== "");

        return {
          name: name || "N/A",
          styleCode: styleCode || "N/A",
          images,
          availableSizes,
        };
      });

      console.log(`Color ${i + 1}: ${colorData.name}`);
      shoe.colors.push(colorData);
    } catch (error) {
      console.error(`Error processing color variant ${i + 1}:`, error);
    }
  }

  // Scrape reviews
  shoe.reviews = await page.evaluate(() => {
    const averageRatingText = document
      .querySelector(".b-ratings-summary__average-rating-value")
      ?.textContent?.trim();
    const averageRating = averageRatingText ? parseFloat(averageRatingText) : 0;

    const countText = document
      .querySelector(".b-ratings-summary__reviews-count span")
      ?.textContent?.trim()
      .replace(/[()]/g, "");
    const count = countText ? parseInt(countText) : 0;

    const reviews = Array.from(document.querySelectorAll(".b-review-item")).map(
      (reviewEl) => {
        const title =
          reviewEl
            .querySelector(".b-review-item__title")
            ?.textContent?.trim() || "N/A";
        const comment =
          reviewEl
            .querySelector(".b-review-item__text-content")
            ?.textContent?.trim() || "N/A";
        const ratingText = reviewEl
          .querySelector(".b-rating__value")
          ?.textContent?.trim();
        const rating = ratingText ? parseFloat(ratingText) : 0;
        const author =
          reviewEl
            .querySelector(".b-review-item__author-name")
            ?.textContent?.trim() || "N/A";
        return { title, comment, rating, author };
      }
    );

    return { averageRating, count, reviews };
  });

  // Scrape similar products
  //   shoe.similarProducts = await page.evaluate(() => {
  //     return Array.from(
  //       document.querySelectorAll(".b-pdp__recs--regular .b-product-tile")
  //     ).map((tile) => {
  //       const name =
  //         tile
  //           .querySelector(".b-product-tile__name-link a")
  //           ?.textContent?.trim() || "N/A";
  //       const priceText = tile
  //         .querySelector(".b-product-tile__price .sales .value")
  //         ?.textContent?.trim()
  //         .replace(/[^0-9.-]+/g, "");
  //       const price = priceText ? parseFloat(priceText.replace(",", "")) : 0;
  //       const image =
  //         tile.querySelector(".b-product-tile__image")?.getAttribute("src") ||
  //         "N/A";
  //       return { name, price, image };
  //     });
  //   });

  await browser.close();
  return shoe;
};

(async () => {
  try {
    const menShoesURls = [
      "https://www.nike.sa/en/air-jordan-4-retro-mens-shoes/NKFV5029-200.html",
      "https://www.nike.sa/en/vomero-plus-mens-road-running-shoes/NKHV8150-002.html",
      //   "https://www.nike.sa/en/vomero-plus-mens-road-running-shoes/NKIH2268-100.html",
      //   "https://www.nike.sa/en/air-force-1-07-mens-shoes/NKCW2288-111.html",
      //   "https://www.nike.sa/en/air-force-1-07-mens-shoes/NKCW2288-001.html",
      //   "https://www.nike.sa/en/ava-rover-shoes/NKDX4215-205.html",
      //   "https://www.nike.sa/en/vomero-18-mens-road-running-shoes/NKIB5726-100.html",
      //   "https://www.nike.sa/en/vaporfly-4-mens-road-racing-shoes/NKIH3586-999.html",
      //   "https://www.nike.sa/en/ja-3-basketball-shoes/NKHF2793-700.html",
      //   "https://www.nike.sa/en/phantom-6-low-elite-firm-ground-football-boot/NKHQ2332-800.html",
      //   "https://www.nike.sa/en/phantom-6-low-pro-firm-ground-football-boot/NKIB3094-800.html",
      //   "https://www.nike.sa/en/giannis-freak-7-basketball-shoes/NKHQ1743-600.html",
      //   "https://www.nike.sa/en/p-6000-shoes/NKCD6404-107.html",
      //   "https://www.nike.sa/en/vomero-plus-mens-road-running-shoes/NKHV8150-100.html",
      //   "https://www.nike.sa/en/air-jordan-4-retro-mens-shoes/NKFV5029-003.html",
      //   "https://www.nike.sa/en/vomero-18-mens-road-running-shoes/NKHM6803-700.html",
      //   "https://www.nike.sa/en/g.t.-cut-3-turbo-basketball-shoes/NKII3704-100.html",
      //   "https://www.nike.sa/en/vomero-plus-mens-road-running-shoes/NKHV8150-001.html",
      //   "https://www.nike.sa/en/vomero-plus-mens-road-running-shoes/NKHV8150-102.html",
      //   "https://www.nike.sa/en/air-max-plus-shoes/NKIH4458-001.html",
      //   "https://www.nike.sa/en/air-jordan-1-retro-high-og-mens-shoes/NKDZ5485-008.html",
      //   "https://www.nike.sa/en/air-jordan-1-low-mens-shoes/NK553558-081.html",
      //   "https://www.nike.sa/en/phantom-6-low-elite-firm-ground-football-boot/NKHJ2146-003.html",
      //   "https://www.nike.sa/en/ava-rover-shoes/NKDX4215-003.html",
    ];
    const extractedData = [];

    for (const url of menShoesURls) {
      console.log(`Scraping URL: ${url}`);
      const productWithVariants = await scrapeShoes(url);
      console.log("Extracted product colors:", productWithVariants?.name);

      extractedData.push(productWithVariants);
    }
    // const scrapedData = await scrapeShoes("s.html");

    if (!existsSync("./src/db/seed/data")) {
      mkdirSync("./src/db/seed/data", { recursive: true });
    }

    writeFileSync(
      "./src/db/seed/data/scraped-data.json",
      JSON.stringify(extractedData, null, 2)
    );
    console.log(
      "Data successfully written to src/db/seed/data/scraped-data.json"
    );
  } catch (error) {
    console.error("Error scraping shoe data");
  }
})();
