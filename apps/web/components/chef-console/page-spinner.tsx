import { Loader2 } from "lucide-react";

/**
 * Specifically desgned for chef console pages
 */
export default function PageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen pl-[255px]">
      <Loader2 className="animate-spin" />
    </div>
  );
}
