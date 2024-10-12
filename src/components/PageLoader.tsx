import { LoaderCircle } from "lucide-react";

export const PageLoader = () => (
  <div className="flex flex-1 items-center justify-center">
    <LoaderCircle size={96} className="animate-spin" />
  </div>
);
