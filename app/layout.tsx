import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://studywithasma.com"),
  title: "Study with Asma - Online IELTS Preparation",
  description:
    "Master IELTS Academic and General with structured lessons, recorded sessions, and personal guidance from Asma.",
  keywords: [
    "IELTS",
    "English Preparation",
    "Study with Asma",
    "IELTS Academic",
    "IELTS General",
    "English Course",
  ],
  openGraph: {
    title: "Study with Asma - Online IELTS Preparation",
    description:
      "Master IELTS Academic and General with structured lessons, recorded sessions, and personal guidance from Asma.",
    url: "https://studywithasma.com",
    siteName: "Study with Asma",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Study with Asma",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study with Asma - Online IELTS Preparation",
    description:
      "Master IELTS Academic and General with structured lessons, recorded sessions, and personal guidance from Asma.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
