import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the local HTML file. Replace 's.html' with the actual file path.
    await page.goto("file:///path/to/your/s.html");

    // Wait for the main product information to load
    await page.waitForSelector(".pdp-main");

    // Extract product details
    const productData = await page.evaluate(() => {
      const product = {} as any;

      // Name

      const nameEl = document.querySelector(
        ".b-pdp__product-name .js-gtm-product-name"
      );
      product.name = nameEl ? nameEl.textContent?.trim() : null;

      // Description
      const descEl = document.querySelector(
        ".pdp-main .pdp-description-content .b-pdp-description__text"
      );
      product.description = descEl ? descEl.textContent?.trim() : null;

      // Category
      const categoryEl = document.querySelector(
        ".b-pdp__product-subcategory .js-pdp__product-subcategory"
      );
      product.category = categoryEl
        ? categoryEl.textContent?.trim().toLowerCase()
        : null;

      // Base Image
      const baseImageEl = document.querySelector(
        ".product-images-carousel .primary-images-sectionrow img"
      );
      product.baseImage = baseImageEl ? baseImageEl.getAttribute("src") : null;

      // Price
      const priceEl = document.querySelector(".pdp-main .b-pdp-price__value");
      product.price = priceEl
        ? parseInt(priceEl.textContent!.replace(/[^\d]/g, ""), 10)
        : null;

      // Colors
      product.colors = [];
      const colorOptions = document.querySelectorAll(".b-swatch-list__item");

      colorOptions.forEach((colorEl) => {
        const color = {} as any;

        // Color Name and Dominant Color
        // const colorButton = colorEl.querySelector(".b-productswatch--color");
        // if (colorButton) {
        //   color.name = colorButton.getAttribute("data-swatch-name").trim();
        //   color.dominantColor = colorButton
        //     .getAttribute("data-dominant-color")
        //     .trim();
        // }

        // Style Number
        const styleNumberEl = colorEl.querySelector(
          ".b-productswatch-style-number"
        );
        color.styleNumber = styleNumberEl
          ? styleNumberEl.textContent?.trim()
          : null;

        // Images for this color
        color.images = [];
        const imagesForColor = document.querySelectorAll(
          `.product-images-carousel .primary-images-sectionrow .carousel-item img[src*="${color.styleNumber}"]`
        );
        imagesForColor.forEach((img) => {
          color.images.push(img.getAttribute("src"));
        });

        // Sizes for this color
        color.size = [];
        const sizeOptions = document.querySelectorAll(".b-size-list__item");
        sizeOptions.forEach((sizeEl) => {
          const sizeValueEl = sizeEl.querySelector(".b-size-value");
          if (sizeValueEl) {
            color.size.push(sizeValueEl.textContent?.trim());
          }
        });

        product.colors.push(color);
      });

      return product;
    });

    console.log(JSON.stringify(productData, null, 2));
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await browser.close();
  }
})();
