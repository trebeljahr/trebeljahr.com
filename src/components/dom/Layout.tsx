import {
  useRef,
  forwardRef,
  useImperativeHandle,
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";

type Props = {
  children: React.ReactNode;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Layout = forwardRef(({ children, ...props }: Props, ref) => {
  const localRef = useRef();

  useImperativeHandle(ref, () => localRef.current);

  return (
    <div
      {...props}
      ref={localRef}
      className="absolute top-0 left-0 z-10 h-screen w-screen overflow-hidden bg-zinc-900 text-gray-50"
    >
      {children}
    </div>
  );
});

Layout.displayName = "Layout";

export default Layout;
