import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smartyatra - AI Powered Smart Travel Planner",
  description: "Discover destinations, estimate budgets, and generate personalized itineraries with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        <ReactQueryProvider>
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}