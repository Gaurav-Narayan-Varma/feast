import Provider from "@/app/_trpc/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
        <Provider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              className: "text-sm text-foreground cursor-default",
            }}
          />{" "}
          {children}
        </Provider>
      </body>
    </html>
  );
}
