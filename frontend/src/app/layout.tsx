import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Smartyatra",
  description: "AI Powered Smart Travel Planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
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