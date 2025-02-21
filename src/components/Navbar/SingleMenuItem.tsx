import clsx from "clsx";
import Link from "next/link";

type SingleMenuItemProps = {
  link: string;
  toggleMenu: () => void;
  left?: boolean;
};

export function SingleMenuItem({
  link,
  toggleMenu,
  left,
}: SingleMenuItemProps) {
  return (
    <Link
      href={`/${link}`}
      className={clsx(
        "block px-4 py-2 break-keep whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-700",
        left ? "text-left" : "text-right"
      )}
      onClick={toggleMenu}
    >
      {link}
    </Link>
  );
}
