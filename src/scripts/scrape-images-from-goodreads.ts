import axios from "axios";
import { writeFile } from "fs/promises";
import { chromium } from "playwright";

// import { test, expect } from "@playwright/test";

// test("has title", async ({ page }) => {
//   await page.goto("https://playwright.dev/");

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

async function searchBookOnGoodreads(title: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.goodreads.com/");
  await page.waitForSelector(".searchBox__input");
  await page.fill(".searchBox__input", title);
  await page.click(".searchBox__icon--magnifyingGlass");

  //   await page.fill(".HeaderSearch__input", title);
  //   await page.click(".HeaderSearch__button");

  await page.waitForSelector("tbody .bookTitle");
  await page.click("tbody .bookTitle");

  await page.waitForSelector(".BookCover__image");

  const imageUrl = await page.$eval(".bookImage img", (img) =>
    img.getAttribute("src")
  );

  if (imageUrl) {
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    await writeFile("bookImage.jpg", imageResponse.data);
  }

  await browser.close();
}

// Usage example
searchBookOnGoodreads("The Great Gatsby");
