import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function NavigationHeader() {
  return (
    <div className="z-50 w-full fixed top-0 left-0 h-20 border-b border-gray-200 flex items-center p-10 justify-between bg-white shadow-sm">
      <Link href="/#chefs">
        <Button variant="outline" label="Home" leftIcon={<ArrowLeftIcon />} />
      </Link>
      <Link href="/#chefs">
        <img src="/feast-logo-red.png" alt="Feast Logo" className="h-10" />
      </Link>
    </div>
  );
}
