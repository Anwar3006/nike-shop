import { existsSync, mkdirSync, writeFileSync } from "fs";
import puppeteer from "puppeteer";

interface ShoeData {
  name: string;
  description: string;
  category: string;
  baseImage: string;
  price: number;
  colors: Array<{}>;
}

const Category = ["men", "women", "kids", "unisex"];

const scrapeShoes = async (url: string) => {
  if (url.trim() === "") return null;

  const broswer = await puppeteer.launch({ headless: true });
  const page = await broswer.newPage();

  //navigate to target
  await page.goto(url);

  //wait for the main product information to load
  await page.waitForSelector(".b-pdp__content");

  const shoe: ShoeData = {} as ShoeData;

  //start getting data
  const name =
    (await page.$eval(
      ".b-pdp__headline span.b-pdp__product-name",
      (el) => el.textContent
    )) || "N/A";

  const description =
    (await page.$eval(
      ".b-productinfo .b-productinfo__content",
      (el) => el.textContent
    )) || "N/A";

  const category =
    (
      await page.$eval(
        ".b-pdp__headline span.b-pdp__product-subcategory",
        (el) => el.textContent
      )
    )?.toLowerCase() || "N/A";

  const baseImage =
    (await page.$eval(
      ".product-images-carousel .primary-images-sectionrow img",
      (el) => el.getAttribute("src")
    )) || "N/A";
  const price = parseInt(
    (await page.$eval(".price .sales span", (el) => el.textContent)) || "0"
  );

  shoe.name = name;
  shoe.description = description;
  shoe.category = Category.includes(category) ? category : "unisex";
  shoe.baseImage = baseImage;
  shoe.price = price;

  //get all colors
  const colorButtons = await page.$$(".b-attribute__list .color-attribute");

  for (let i = 0; i < colorButtons.length; i++) {
    const colorButton = colorButtons[i];

    //basic color info
    const colorInfo = await colorButton.evaluate((btn) => {
      const dominantColor = btn.querySelector("data-attr-display-value");

      return dominantColor ? dominantColor.textContent : "N/A";
    });

    //click that button to go to the variant
    await colorButton.click();

    //wait for page to load
    await page.waitForSelector(".b-pdp__content");

    //get additonal details
    const variantDetails = await page.evaluate(() => {
      const details = {
        name: "",
        styleNumber: "",
        images: [] as string[],
        sizes: [] as string[],
      };

      //extract style number
      const styleNumber = document.querySelector(
        ".b-productinfo .b-list--dots"
      );
      if (styleNumber) {
        const listItems = styleNumber.querySelectorAll("li");
        listItems.forEach((item) => {
          const text = item.textContent?.trim();
          if (text && text.startsWith("Color Shown:")) {
            details.name = text.replace("Color Shown: ", "");
          } else if (text && text.startsWith("Style:")) {
            details.styleNumber = text.replace("Style: ", "");
          }
        });
      }

      //select the images
      const carouselIndicators = document.querySelectorAll(
        ".carousel-indicators li img.b-picture__img"
      );
      carouselIndicators.forEach((img) => {
        const imgSrc = img.getAttribute("src");
        if (imgSrc && !imgSrc.includes("data:image/svg+xml")) {
          details.images.push(imgSrc);
        }
      });

      //generate random sizes
      const getRandomSizesSubset = (min = 3, max = 8) => {
        const sizes = Array.from({ length: 17 }, (_, i) =>
          (6 + i * 0.5).toString()
        );
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        return sizes
          .sort(() => 0.5 - Math.random())
          .slice(0, count)
          .sort((a, b) => parseFloat(a) - parseFloat(b));
      };

      details.sizes = getRandomSizesSubset();

      return details;
    });

    const color = {
      name: colorInfo,
      styleNumber: variantDetails.styleNumber,
      images: variantDetails.images,
      sizes: variantDetails.sizes,
    };

    shoe.colors.push(color);
  }

  await broswer.close();
  return shoe;
};

(async () => {
  try {
    // Use the first approach if you want to navigate to each variant page for complete data
    const menShoesURls = [
      "https://www.nike.sa/en/air-jordan-4-retro-mens-shoes/NKFV5029-200.html",
      "https://www.nike.sa/en/vomero-plus-mens-road-running-shoes/NKHV8150-002.html",
      "https://www.nike.sa/en/vomero-plus-mens-road-running-shoes/NKIH2268-100.html",
      "https://www.nike.sa/en/air-force-1-07-mens-shoes/NKCW2288-111.html",
      "https://www.nike.sa/en/air-force-1-07-mens-shoes/NKCW2288-001.html",
      "https://www.nike.sa/en/ava-rover-shoes/NKDX4215-205.html",
      "https://www.nike.sa/en/vomero-18-mens-road-running-shoes/NKIB5726-100.html",
      "https://www.nike.sa/en/vaporfly-4-mens-road-racing-shoes/NKIH3586-999.html",
      "https://www.nike.sa/en/ja-3-basketball-shoes/NKHF2793-700.html",
      "https://www.nike.sa/en/phantom-6-low-elite-firm-ground-football-boot/NKHQ2332-800.html",
      "https://www.nike.sa/en/phantom-6-low-pro-firm-ground-football-boot/NKIB3094-800.html",
      "https://www.nike.sa/en/giannis-freak-7-basketball-shoes/NKHQ1743-600.html",
      "https://www.nike.sa/en/p-6000-shoes/NKCD6404-107.html",
      "https://www.nike.sa/en/vomero-plus-mens-road-running-shoes/NKHV8150-100.html",
      "https://www.nike.sa/en/air-jordan-4-retro-mens-shoes/NKFV5029-003.html",
      "https://www.nike.sa/en/vomero-18-mens-road-running-shoes/NKHM6803-700.html",
      "https://www.nike.sa/en/g.t.-cut-3-turbo-basketball-shoes/NKII3704-100.html",
      "https://www.nike.sa/en/vomero-plus-mens-road-running-shoes/NKHV8150-001.html",
      "https://www.nike.sa/en/vomero-plus-mens-road-running-shoes/NKHV8150-102.html",
      "https://www.nike.sa/en/air-max-plus-shoes/NKIH4458-001.html",
      "https://www.nike.sa/en/air-jordan-1-retro-high-og-mens-shoes/NKDZ5485-008.html",
      "https://www.nike.sa/en/air-jordan-1-low-mens-shoes/NK553558-081.html",
      "https://www.nike.sa/en/phantom-6-low-elite-firm-ground-football-boot/NKHJ2146-003.html",
      "https://www.nike.sa/en/ava-rover-shoes/NKDX4215-003.html",
    ];
    const extractedData = [];

    for (const url of menShoesURls) {
      console.log(`Scraping URL: ${url}`);
      const productWithVariants = await scrapeShoes(url);
      console.log("Extracted product colors:", productWithVariants?.name);

      extractedData.push(productWithVariants);
    }

    if (!existsSync("./src/db/seed/shoes")) {
      mkdirSync("./src/db/seed/shoes", { recursive: true });
    }

    writeFileSync(
      "./src/db/seed/shoes/men.json",
      JSON.stringify(extractedData, null, 2)
    );
    console.log("Data successfully written to src/db/seed/shoes/men.json");
  } catch (error) {
    console.error("Error scraping color variants:", error);
  }
})();
