import type { Metadata } from "next";
import nextFontLocal from "next/font/local";
import "./globals.css";
import GlobalProvider from "@/providers";

const fontSans = nextFontLocal({
  src: [
    {
      path: "../../public/fonts/Bevellier-Thin.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Bevellier-Extralight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Bevellier-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Bevellier-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Bevellier-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Bevellier-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Bevellier-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Bevellier-Black.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-bevellier",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nike Shop",
  description:
    "Welcome to Nike Shop, your one-stop destination for all things Nike. Browse our wide range of products, from classic sneakers to the latest fashion trends. Get ready to unleash your inner athlete and style icon.",
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} antialiased overflow-x-hidden`}>
        <GlobalProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </GlobalProvider>
      </body>
    </html>
  );
}
