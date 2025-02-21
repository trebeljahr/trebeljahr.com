import clsx from "clsx";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { SingleMenuItem } from "./SingleMenuItem";

type DesktopMenuProps = {
  links: string[];
  text: string;
  left?: boolean;
};

export function CollapsibleMenuDesktop({ links, text }: DesktopMenuProps) {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <div className="h-fit block relative ml-3">
      <button
        className="block hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-3 py-2"
        onClick={toggleMenu}
      >
        <span className="flex items-center justify-center">
          <span>{text}</span>
          <FiChevronDown className="h-3 w-3 ml-1" />
        </span>
      </button>
      {open && (
        <div className="overflow-hidden bg-white dark:bg-gray-800 flex-col absolute box-border right-0 z-50 mt-2 origin-top-right w-fit rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {links.map((item) => (
            <SingleMenuItem key={item} link={item} toggleMenu={toggleMenu} />
          ))}
        </div>
      )}
    </div>
  );
}

type MobileMenuProps = DesktopMenuProps;

export function CollapsibleMenuMobile({
  links,
  text,
  left = false,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <div className="relative w-fit">
      <div className="flex flex-col">
        <button
          className={clsx(
            "hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md flex",
            left ? "self-start justify-start" : "self-end justify-end"
          )}
          onClick={toggleMenu}
        >
          <div className="flex items-center justify-center">
            <span>{text}</span>
            <FiChevronDown className="h-3 w-3 ml-1" />
          </div>
        </button>

        {open && (
          <div className="overflow-hidden bg-white dark:bg-slate-800 mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            {links.map((item) => (
              <SingleMenuItem
                key={item}
                link={item}
                toggleMenu={toggleMenu}
                left={left}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
