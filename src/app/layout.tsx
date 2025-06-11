import type { Metadata } from "next";
import { Inter, Mulish } from "next/font/google"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-inter",
});

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mulish",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Becycle",
  description: "Selamatkan lingkungan, mulai dari sini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${mulish.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
