import { useScrollLock } from "@components/NewsletterModalPopup";
import { Disclosure } from "@headlessui/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import {
  CollapsibleMenuDesktop,
  CollapsibleMenuMobile,
} from "./CollapsibleMenus";
import { DarkModeHandler } from "./DarkModeHandler";
import { StickyHeaderProgressBar } from "@components/ProgressBar";

const navigation = ["posts", "newsletters", "photography"];
const resources = [
  "needlestack",
  "booknotes",
  "podcastnotes",
  "travel",
  "quotes",
];
const about = ["now", "principles", "1-month-projects"];

const MediaQuery = dynamic(() => import("react-responsive"), {
  ssr: false,
});

export function TailwindNavbar({
  withProgressBar = false,
}: {
  withProgressBar?: boolean;
} = {}) {
  return (
    <MediaQuery query={"(max-width: 1024px)"}>
      {(isMobile: boolean) => (
        <Disclosure>
          {({ open, close }) => (
            <header
              id="navbar"
              className={`sticky top-0 left-0 z-50 w-full not-prose ${
                open ? "bg-white" : "glassy"
              } dark:bg-none dark:bg-gray-900 pt-3 ${
                withProgressBar ? "" : "pb-2"
              }`}
            >
              <nav className="mx-auto max-w-7xl px-2 pb-1 lg:px-8 flex items-center justify-between">
                <Link
                  href="/"
                  className="flex flex-shrink-0 items-center not-prose"
                >
                  <Image
                    className="h-5 w-auto mr-1"
                    src="/favicon/apple-touch-icon.png"
                    alt="trebeljahr"
                    width={32}
                    height={32}
                  />
                  <span className="ml-1 font-semibold">Rico Trebeljahr</span>
                </Link>
                {isMobile ? (
                  <MobileVersion {...{ open, close }} />
                ) : (
                  <DesktopVersion {...{ open, close }} />
                )}
              </nav>
              {withProgressBar && <StickyHeaderProgressBar />}
            </header>
          )}
        </Disclosure>
      )}
    </MediaQuery>
  );
}

type NavbarProps = {
  open: boolean;
  close: () => void;
};

function MobileVersion({ open, close }: NavbarProps) {
  useScrollLock(open);

  return (
    <div>
      <div className="absolute mr-2 inset-y-0 right-0 flex items-center lg:hidden">
        <DarkModeHandler />

        <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
          <span className="sr-only">Open main menu</span>
          {open ? (
            <FiX className="" aria-hidden="true" />
          ) : (
            <FiMenu aria-hidden="true" />
          )}
        </Disclosure.Button>
      </div>
      <Disclosure.Panel className="absolute z-50 top-12 p-2 w-screen h-screen right-0 bg-white dark:bg-gray-900">
        <div className="flex flex-col px-2 pb-3 pt-2 items-end justify-end">
          {navigation.map((item) => (
            <Link
              key={item}
              href={"/" + item}
              className="block w-fit rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 "
            >
              <Disclosure.Button>{item}</Disclosure.Button>
            </Link>
          ))}

          <CollapsibleMenuMobile
            links={resources}
            text="resources"
            closeNav={close}
          />
          <CollapsibleMenuMobile links={about} text="about" closeNav={close} />
        </div>
      </Disclosure.Panel>
    </div>
  );
}

function DesktopVersion({ close }: NavbarProps) {
  return (
    <>
      <div className="flex flex-1 mr-1 items-stretch justify-end lg:mr-0 lg:items-center">
        <div className="hidden lg:ml-6 lg:block sm:justify-self-end">
          <div className="flex space-x-4">
            <DarkModeHandler />

            {navigation.map((item) => (
              <Link
                key={item}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 "
                href={"/" + item}
              >
                {item}
              </Link>
            ))}
            <CollapsibleMenuDesktop
              links={resources}
              text="resources"
              closeNav={close}
            />
            <CollapsibleMenuDesktop
              links={about}
              text="about"
              closeNav={close}
            />
          </div>
        </div>
      </div>
    </>
  );
}
