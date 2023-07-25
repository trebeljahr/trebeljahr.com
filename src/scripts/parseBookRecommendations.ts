import { count } from "console";
import fs from "fs";
import path from "path";

interface Book {
  title: string;
  author: string;
  recommendationSource: string;
}

const parseBookRecommendation = (content: string, filePath: string): Book[] => {
  const regex = /\*\*Book Recommendation:\*\* ([^–\n]+) (– [^\n]+)?/g;
  const books: Book[] = [];

  [...content.matchAll(regex)].forEach((match) => {
    books.push({
      title: match[1].trim(),
      author: match[2]?.replace("–", "").trim(),
      recommendationSource: filePath,
    });
  });

  return books;
};

const extractBooksFromDirectory = (dirPath: string): Book[] => {
  const files = fs.readdirSync(dirPath);
  let allBooks: Book[] = [];

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, "utf8");
    const books = parseBookRecommendation(content, file);
    allBooks = [...allBooks, ...books];
  }

  return allBooks;
};

const sortBooks = (books: Book[]): Book[] => {
  return Object.values(books).sort((a, b) => {
    const authorComparison = a.author.localeCompare(b.author);
    if (authorComparison !== 0) {
      return authorComparison;
    }

    return a.title.localeCompare(b.title);
  });
};

const countBooks = (books: Book[]) => {
  const bookCounts: { [key: string]: Book & { count: number } } = {};

  for (const book of books) {
    const uniqueKey = `${book.title}-${book.author}`.toLowerCase();

    if (bookCounts[uniqueKey]) {
      bookCounts[uniqueKey].count++;
    } else {
      bookCounts[uniqueKey] = { ...book, count: 1 };
    }
  }

  return Object.values(bookCounts);
};
const books = extractBooksFromDirectory("../content/booknotes");
// console.log(books);
// console.log(
//   "without author",
//   books.filter((book) => book.author === undefined)
// );

const sortedBooks = sortBooks(books);
// console.log(sortedUniqueBooks);

const number = countBooks(sortedBooks);
console.log(number);

const howManyBooks = number.reduce((acc, book) => {
  return acc + book.count;
}, 0);

console.log(books.length);
console.log(howManyBooks);
