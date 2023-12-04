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

interface BookInfo {
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
        bookInfo.coverUrl = await getPictureSrc(title);
      }
    }

    console.warn("No book found for title:", title, "author:", author);
    return bookInfo;
  } catch (error) {
    console.error("Error fetching book information:", error);
    throw error;
  }
}
