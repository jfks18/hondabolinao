import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InventoryProvider } from "./contexts/InventoryContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Honda Bolinao - Official 3S Dealership",
  description: "Honda motorcycles, scooters and parts in Bolinao. Real-time inventory and promos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InventoryProvider>
          {children}
        </InventoryProvider>
      </body>
    </html>
  );
}
