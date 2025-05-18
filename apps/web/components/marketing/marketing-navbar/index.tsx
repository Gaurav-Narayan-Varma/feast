"use client";

import { Button } from "@/components/ui/button";
import cx from "clsx";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import MobileNavBar from "./mobile-navbar";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={cx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 py-4",
        mobileMenuOpen
          ? "bg-white shadow-sm"
          : scrolled
            ? "bg-white shadow-sm"
            : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/feast-logo-red.png" alt="Feast Logo" className="h-8" />
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-sm font-medium hover:text-ds-chef-700 transition-colors"
            onClick={(e) => scrollToSection(e, "how-it-works")}
          >
            How it Works
          </a>
          <a
            href="#cuisines"
            className="text-sm font-medium hover:text-ds-chef-700 transition-colors"
            onClick={(e) => scrollToSection(e, "cuisines")}
          >
            Cuisines
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium hover:text-ds-chef-700 transition-colors"
            onClick={(e) => scrollToSection(e, "testimonials")}
          >
            Testimonials
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href="/auth/chef-login">
            <Button
              size="sm"
              label="Start Cooking"
              className="rounded-full px-4 bg-ds-chef-800 hover:bg-ds-chef-900"
            />
          </a>
        </div>

        <button
          className="md:hidden text-ds-chef-800 "
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <MobileNavBar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </div>
  );
}
