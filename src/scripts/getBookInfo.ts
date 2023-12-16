import { chromium, ElementHandle, Page } from "@playwright/test";
import axios from "axios";
import path from "path";

export async function getPictureSrc(
  page: Page,
  title: string = "the great gatsby"
) {
  await page.goto("https://www.goodreads.com/");
  await page.getByPlaceholder("Title / Author / ISBN").click();
  await page.getByPlaceholder("Title / Author / ISBN").fill(title);
  await page.getByPlaceholder("Title / Author / ISBN").press("Enter");
  await page.locator(".bookTitle").first().click();

  const a = (await page
    .locator(".ResponsiveImage")
    .first()
    .elementHandle()) as ElementHandle<HTMLImageElement>;
  const src = await a.getAttribute("src");

  if (!src) return;

  // const response = await axios.get(src, { responseType: "stream" });
  const filePath = path.join(process.cwd(), "src", "scripts", "bookImage.jpg");

  console.log(filePath); // Specify the file path to save the image
  // const writer = fs.createWriteStream(filePath);
  // response.data.pipe(writer);

  // return new Promise((resolve, reject) => {
  //   writer.on("finish", resolve);
  //   writer.on("error", reject);
  // });
  return src;
}

export interface BookInfo {
  isbn?: string;
  coverUrl?: string;
  olid?: string;
  id_amazon?: string;
  id_better_world_books?: string;
  id_goodreads?: string;
}

export async function getBookInfo(
  title: string,
  author: string,
  page: Page
): Promise<BookInfo> {
  try {
    const response = await axios.get(
      `http://openlibrary.org/search.json?title=${encodeURIComponent(
        title
      )}&author=${encodeURIComponent(author)}`
    );
    let bookInfo: BookInfo = {};

    if (response.data.docs.length > 0) {
      const book = response.data.docs[0];
      const olid = book.key.replace("/works/", "");
      const id_amazon = book.id_amazon;
      const id_better_world_books = book.id_better_world_books;
      const id_goodreads = book.id_goodreads;
      const isbn = book.isbn ? book.isbn[0] : undefined;

      bookInfo = {
        olid,
        id_amazon,
        id_better_world_books,
        id_goodreads,
        isbn,
        coverUrl: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg?default=false`
          : isbn
          ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`
          : undefined,
      };

      if (!bookInfo.coverUrl) {
        bookInfo.coverUrl = await getPictureSrc(page, title);
      }
    } else {
      console.warn("No book found for title:", title, "author:", author);
    }

    return bookInfo;
  } catch (error) {
    console.error("Error fetching book information:", error);
    throw error;
  }
}

import puppeteer, { Browser } from "puppeteer";

const GOODREAD_URL = "https://www.goodreads.com/book/show/";
const GOODREAD_IMAGE_URL_PATTERN =
  "https://images-na.ssl-images-amazon.com/images";

export const getGoodreadsUrl = (data: string) => {
  if (data === undefined) {
    return null;
  }
  let init = find(data, GOODREAD_URL);
  let final = find(data, "&", init + 10);
  let url = data.slice(init, final);
  return url;
};

export const getBookcoverUrl = async (
  bookTitle: string,
  authorName: string,
  browser: Browser
) => {
  try {
    const googleQuery = `${bookTitle} ${authorName} site:goodreads.com/book/show`;
    const googleResponse = await axios.get(
      `https://www.google.com/search?q=${googleQuery}&sourceid=chrome&ie=UTF-8`
    );

    const goodreadsUrl = getGoodreadsUrl(googleResponse.data);
    if (!goodreadsUrl) {
      throw new Error("No goodreads url found");
    }
    const url = await getImageUrl(goodreadsUrl, browser);
    return url;
  } catch (error) {
    console.error(error);
  }
};

export const find = (str: string, term: string, startsBy = 0) => {
  if (str === undefined) {
    return -1;
  }
  let len = 0;
  let pos = null;
  for (let i = startsBy; i < str.length; i++) {
    if (str[i] == term[len]) len++;
    else len = 0;
    if (len == term.length) {
      pos = i + 1 - term.length; //gets position i-term.length but has to add 1 given that startsBy has default value 0
      break;
    }
  }
  if (pos != null) return pos;

  return -1;
};

export const getImageUrl = async (
  goodreadsLink: string,
  browser: Browser
): Promise<string> => {
  const page = await browser.newPage();
  await page.goto(goodreadsLink);
  const imageSelector = `img[src^="${GOODREAD_IMAGE_URL_PATTERN}"]`;
  await page.waitForSelector(imageSelector, {
    visible: true,
  });
  const src = await page.evaluate((selector) => {
    const img: any = document.querySelector(selector);
    if (!img) {
      throw new Error("Image not found");
    }
    return img.src;
  }, imageSelector);

  return src;
};
