import { useEffect } from "react";
import { Search, useSearch } from "../components/SearchBar";
import { ToTopButton } from "../components/ToTopButton";
import { BookPreview } from "../components/book-preview";
import Layout from "../components/layout";
import { NewsletterForm } from "../components/newsletter-signup";
import { sluggify } from "src/lib/sluggify";
import { Booknote } from "@contentlayer/generated";
import bookRecommendations from "src/scripts/bookRecommendations.json";

type BookRecommendation = {
  title: string;
  author: string;
  recommendationSource: string[];
  count: 2;
  coverUrl: string;
  isbn: string;
};

type Props = {
  bookRecommendations: BookRecommendation[];
};

export default function Book({ bookRecommendations }: Props) {
  const books = bookRecommendations.map(({ title, coverUrl, author }) => {
    return {
      slug: sluggify(title),
      title,
      bookCover: coverUrl,
      excerpt: "",
      subtitle: "",
      bookAuthor: author,
      rating: 0,
    };
  }) as Booknote[];

  return (
    <Layout
      title="Antilibrary - "
      description={
        "An overview of what I still want to read and where it got recommended from"
      }
      image="/assets/midjourney/a-bookshelf.jpg"
      url="antilibrary"
      imageAlt={"a bookshelf filled with lots of books"}
    >
      <article className="main-section">
        <section className="main-section allBooknotes pt-5">
          <h1>Anti-Library</h1>
          {books.map((book, index) => {
            return <BookPreview key={book.slug} book={book} index={index} />;
          })}
        </section>
        <section className="main-section">
          <NewsletterForm />
          <ToTopButton />
        </section>
      </article>
    </Layout>
  );
}

export function getStaticProps() {
  return {
    props: {
      bookRecommendations,
    },
  };
}
