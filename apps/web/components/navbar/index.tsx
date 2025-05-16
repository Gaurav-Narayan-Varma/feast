"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12 py-4 ",
        mobileMenuOpen
          ? "bg-white shadow-sm"
          : scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/feastLogoNewRed.png" alt="Feast Logo" className="h-8" />
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-sm font-medium hover:text-chef-700 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#chefs"
            className="text-sm font-medium hover:text-chef-700 transition-colors"
          >
            Our Chefs
          </a>
          <a
            href="#cuisines"
            className="text-sm font-medium hover:text-chef-700 transition-colors"
          >
            Cuisines
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium hover:text-chef-700 transition-colors"
          >
            Testimonials
          </a>
          <a
            href="#subscription-plans"
            className="text-sm font-medium hover:text-chef-700 transition-colors"
          >
            Subscriptions
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* <Button onClick={handleLoginClick} variant="outline" size="sm" className="rounded-full px-4">
            Log in
          </Button> */}
          <a href="/chef-login">
            <Button
              size="sm"
              className="rounded-full px-4 bg-chef-800 hover:bg-chef-900"
            >
              Start Cooking
            </Button>
          </a>
        </div>

        <button
          className="md:hidden text-chef-800 "
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 pt-20 px-6 transform transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0 " : "translate-x-full"
        )}
      >
        <button
          className=" absolute top-6 right-6 d:hidden text-chef-800 "
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="flex flex-col gap-6">
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
            <a href="/chef-login" className="w-full">
              <Button className="w-full rounded-full bg-chef-800 hover:bg-chef-900">
                Start Cooking
              </Button>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
