"use client";

export default function Footer() {
  return (
    <footer className="bg-ds-chef-950 text-white py-16 px-6 lg:px-12 font-[Inter] bg-ds-chef-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-10">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src="/feast-logo-red.png" alt="Feast Logo" className="h-8" />
            </div>
            <p className="text-ds-chef-700 mb-6">
              Connecting culinary artists with food enthusiasts for
              extraordinary dining experiences.
            </p>
          </div>
        </div>

        <div className="border-t border-ds-chef-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-ds-chef-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Feast. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <div className="text-ds-chef-400 transition-colors">
              Privacy Policy
            </div>
            <div className="text-ds-chef-400 transition-colors">
              Terms of Service
            </div>
            <div className="text-ds-chef-400 transition-colors">
              Cookie Policy
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
