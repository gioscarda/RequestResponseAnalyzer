import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Providers} from "@/app/providers";

const inter = Inter({ subsets: ['latin'], display: 'swap', adjustFontFallback: false})

export const metadata: Metadata = {
  title: "Request/response analyzer",
  description: "App for analyzing HTTP request and response",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
