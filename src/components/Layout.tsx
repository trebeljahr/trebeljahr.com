import { toTitleCase } from "src/lib/toTitleCase";
import Meta from "./Meta";
import { OpenGraph } from "./OpenGraph";
import { TailwindNavbar } from "./TailwindNavbar";

type Props = {
  children: React.ReactNode;
  description: string;
  title: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  fullScreen?: boolean;
};

const Layout = ({
  children,
  description,
  title,
  url,
  image,
  imageAlt,
  fullScreen = false,
}: Props) => {
  const properTitle = toTitleCase(title);

  return (
    <>
      <Meta description={description} title={properTitle} />
      <OpenGraph
        title={properTitle}
        description={description}
        url={url}
        image={image}
        imageAlt={imageAlt}
      />
      <TailwindNavbar />

      <main
        className={fullScreen ? "w-full px-3 mt-10 md:px-10" : "px-3 main-page"}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
