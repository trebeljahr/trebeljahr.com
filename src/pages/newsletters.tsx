import { allNewsletters } from "@contentlayer/generated";
import { ToTopButton } from "@components/ToTopButton";
import Layout from "@components/Layout";
import { NewsletterForm } from "@components/NewsletterSignup";
import { NiceCard } from "@components/NiceCard";

type NewsletterData = {
  slug: string;
  number: number;
  title: string;
  excerpt: string;
  cover: {
    src: string;
    alt: string;
  };
  id: string;
};

type Props = {
  newsletterData: NewsletterData[];
};

const sortByIds = (arr: NewsletterData[]) => {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });
  return arr.sort((a, b) => -collator.compare(a.id, b.id));
};

const Newsletters = ({ newsletterData }: Props) => {
  return (
    <Layout
      title="Newsletters - an archive of newsletters"
      description="An archive overview page of all the Newsletters I have published in the past at trebeljahr.com."
      url="newsletters"
    >
      <article className="posts-overview">
        <h1>Newsletters</h1>

        <section>
          {newsletterData.map(
            ({ slug, number, title, excerpt, cover }, index) => {
              const priority = index <= 1;

              return (
                <NiceCard
                  key={slug}
                  cover={cover}
                  slug={slug}
                  excerpt={excerpt}
                  priority={priority}
                  title={`${title} | Live and Learn #${number}`}
                />
              );
            }
          )}
        </section>
        <section>
          <NewsletterForm />
          <ToTopButton />
        </section>
      </article>
    </Layout>
  );
};

export default Newsletters;

export const getStaticProps = async () => {
  const newsletterData = allNewsletters.map(
    ({ slug, number, title, excerpt = "", cover, id }) => ({
      slug,
      number,
      title,
      cover,
      id,
      excerpt: excerpt
        .replace("Welcome to this edition of Live and Learn. ", "")
        .replace("Enjoy.", ""),
    })
  );

  return {
    props: { newsletterData: sortByIds(newsletterData) },
  };
};
