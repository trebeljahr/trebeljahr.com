import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { BookInfo, getBookInfo, getBookcoverUrl } from "./getBookInfo";
import { writeFile } from "fs/promises";
import { chromium } from "@playwright/test";
import puppeteer from "puppeteer";

interface Recommendation {
  title: string;
  author: string;
  recommendationSource: string[];
  count: number;
}

const parseBookRecommendation = (
  content: string,
  filePath: string
): Recommendation[] => {
  const regex = /\*\*Book Recommendation:\*\* ([^–\n]+) (– [^\n]+)?/g;
  const books: Recommendation[] = [];

  const {
    data: { title },
  } = matter(content);

  [...content.matchAll(regex)].forEach((match) => {
    books.push({
      title: match[1].trim(),
      author: match[2]?.replace("–", "").trim(),
      recommendationSource: [title],
      count: 1,
    });
  });

  return books;
};

const extractBooksFromDirectory = (dirPath: string): Recommendation[] => {
  const files = fs.readdirSync(dirPath);
  let allBooks: Recommendation[] = [];

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, "utf8");
    const books = parseBookRecommendation(content, file);
    allBooks = [...allBooks, ...books];
  }

  return allBooks;
};

const booksFromAntiLibrary = (): Recommendation[] => {
  const antiLibrarySrcPath = path.join(
    process.cwd(),
    "src",
    "scripts",
    "antilibrary.txt"
  );
  const content = fs.readFileSync(antiLibrarySrcPath, "utf8");

  const lines = content.split("\n").filter((line) => line !== "");
  const books = lines.map((line) => {
    const book = line.split("–");
    return {
      title: book[0]?.trim(),
      author: book[1]?.trim(),
      recommendationSource: ["antilibrary"],
      count: 1,
    };
  });

  return books;
};

const sortBooks = (books: Recommendation[]): Recommendation[] => {
  return Object.values(books).sort((a, b) => {
    const authorComparison = a.author.localeCompare(b.author);
    if (authorComparison !== 0) {
      return authorComparison;
    }

    return a.title.localeCompare(b.title);
  });
};

const sortBooksByCount = (books: Recommendation[]): Recommendation[] => {
  return Object.values(books).sort((a, b) => {
    if (a.count === undefined || b.count === undefined) {
      return 0;
    }
    return b.count - a.count;
  });
};

const summarizeBookRecommendations = (books: Recommendation[]) => {
  const bookCounts: { [key: string]: Recommendation } = {};

  for (const book of books) {
    const uniqueKey = `${book.title}-${book.author}`.toLowerCase();

    if (bookCounts[uniqueKey]) {
      bookCounts[uniqueKey].count++;
      const recommendationSources = bookCounts[uniqueKey].recommendationSource;
      if (recommendationSources.includes(book.recommendationSource[0])) {
        console.log("Duplicate recommendation: ", book);
      }

      recommendationSources.push(book.recommendationSource[0]);
    } else {
      bookCounts[uniqueKey] = {
        ...book,
        count: 1,
      };
    }
  }

  return Object.values(bookCounts);
};

const booknotePath = path.join(process.cwd(), "src", "content", "booknotes");
const fromNotes = extractBooksFromDirectory(booknotePath);
const fromAntilibrary = booksFromAntiLibrary();
const books = [...fromNotes, ...fromAntilibrary];
const sortedBooks = sortBooks(books);
const countedBooks = summarizeBookRecommendations(sortedBooks);

const sortedBooksByCount = sortBooksByCount(countedBooks);

const playwrightBrowser = await chromium.launch();
const context = await playwrightBrowser.newContext();
const page = await context.newPage();

let sortedBooksByCountWithInfo: (BookInfo & Recommendation)[] = [];
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

// const bookPromises = sortedBooksByCount.map(async (book) => {
//   // const bookInfoPromise = getBookInfo(book.title, book.author, page);
//   const coverUrlPromise = getBookcoverUrl(book.title, book.author, browser);

//   const coverUrl = await coverUrlPromise;

//   console.log(coverUrl);

//   return {
//     ...book,
//     coverUrl,
//     // ...(await bookInfoPromise),
//   };
// });

// sortedBooksByCountWithInfo = await Promise.all(bookPromises);

for (const book of sortedBooksByCount) {
  // const bookInfo = await getBookInfo(book.title, book.author, page);
  const coverUrl = await getBookcoverUrl(book.title, book.author, browser);

  console.log(coverUrl);

  sortedBooksByCountWithInfo.push({
    ...book,
    coverUrl,
    // ...bookInfo,
  });
  // console.log(bookInfo.coverUrl);
}

await playwrightBrowser.close();

console.log(sortedBooksByCountWithInfo.slice(0, 10));

const recommendationsPath = path.join(
  process.cwd(),
  "src",
  "scripts",
  "bookRecommendations.json"
);

await writeFile(
  recommendationsPath,
  JSON.stringify(sortedBooksByCountWithInfo, null, 2)
);

console.log("Amount of recommendations: ", sortedBooksByCount.length);
console.log("Most recommended: ", sortedBooksByCount[0]);
