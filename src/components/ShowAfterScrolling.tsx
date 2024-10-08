import { ReactElement, useEffect, useState } from "react";

export function useScrollVisibility({ howFarDown }: { howFarDown: number }) {
  const [visible, setVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight;
      const threshold = window.innerHeight * howFarDown;

      let shouldBeVisible = scrolled > threshold;
      if (threshold > maxHeight) {
        shouldBeVisible = scrolled > maxHeight * 0.5;
      }

      if (shouldBeVisible && !hasTriggered) {
        setVisible(true);
        setHasTriggered(true);
      }
    };

    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, [howFarDown, hasTriggered]);

  return { visible, setVisible };
}

export function ShowAfterScrolling({
  children,
  howFarDown = 50,
}: {
  howFarDown?: number;
  children: ReactElement;
}) {
  const { visible } = useScrollVisibility({ howFarDown });
  return (
    <div
      style={{
        visibility: visible ? "visible" : "hidden",
        transition: "visibility 0.3s linear,opacity 0.3s linear",
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
