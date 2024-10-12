import { PropsWithChildren } from "react";
import { PageLoader } from "./PageLoader";

type Props = {
  isLoading?: boolean;
  title?: string;
  footer?: React.ReactElement;
  header?: React.ReactElement;
};

export const Page = ({
  title,
  children,
  footer,
  header,
  isLoading,
}: PropsWithChildren<Props>) => (
  <>
    <header className="flex px-8 mb-4 h-20 w-full items-center max-w-6xl justify-between">
      <h1 className="text-4xl font-extrabold tracking-tight">toby.</h1>
      {header}
    </header>
    <main className="flex px-8 flex-col flex-1 w-full  max-w-6xl overflow-y-auto">
      <h2 className="text-xl mb-8">{title}</h2>
      <div className="flex flex-1 overflow-y-auto">
        {isLoading ? <PageLoader /> : children}
      </div>
    </main>
    <footer className="flex px-8 py-12 w-full max-w-6xl">{footer}</footer>
  </>
);
