import { Button } from "@/components/ui/button";
import cx from "clsx";
import { Menu, X } from "lucide-react";

export default function MobileNavBar({
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (mobileMenuOpen: boolean) => void;
}) {
  return (
    <div
      className={cx(
        "fixed inset-0 bg-white z-40 pt-20 px-6 transform transition-transform duration-300 ease-in-out md:hidden",
        mobileMenuOpen ? "translate-x-0 " : "translate-x-full"
      )}
    >
      <button
        className=" absolute top-6 right-6 md:hidden text-ds-chef-800 "
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex flex-col gap-6 bg-white">
        <a
          href="#how-it-works"
          className="text-lg font-medium py-2 border-b border-gray-100"
          onClick={() => setMobileMenuOpen(false)}
        >
          How it Works
        </a>
        <a
          href="#chefs"
          className="text-lg font-medium py-2 border-b border-gray-100"
          onClick={() => setMobileMenuOpen(false)}
        >
          Our Chefs
        </a>
        <a
          href="#cuisines"
          className="text-lg font-medium py-2 border-b border-gray-100"
          onClick={() => setMobileMenuOpen(false)}
        >
          Cuisines
        </a>
        <a
          href="#testimonials"
          className="text-lg font-medium py-2 border-b border-gray-100"
          onClick={() => setMobileMenuOpen(false)}
        >
          Testimonials
        </a>
        <a
          href="#subscription-plans"
          className="text-lg font-medium py-2 border-b border-gray-100"
          onClick={() => setMobileMenuOpen(false)}
        >
          Subscriptions
        </a>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => console.log("TODO: implement login function here")}
            variant="outline"
            className="w-full rounded-full"
          >
            Log in
          </Button>
          <a href="/auth/chef-login" className="w-full">
            <Button className="w-full rounded-full bg-ds-chef-800 hover:bg-ds-chef-900">
              Start Cooking
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
