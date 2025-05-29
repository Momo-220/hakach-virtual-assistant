"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const combinedClasses = `${geistSans.variable} ${geistMono.variable} antialiased`;
  
  return (
    <html lang="fr" className={combinedClasses}>
      <body className={combinedClasses}>
        <div id="app-root">
          {children}
        </div>
      </body>
    </html>
  );
}
