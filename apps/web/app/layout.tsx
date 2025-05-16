import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/app/_trpc/provider";

export const metadata: Metadata = {
  title: "Feast - Personal Chef Booking",
  description: "Bring the magic home",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
