import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const siteUrl = 'https://expensio.online';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'EXPENSIO — Open Source Kakeibo Expense Tracker & Digital Ledger',
    template: '%s | EXPENSIO',
  },
  description:
    'EXPENSIO is a free, open source personal expense tracker and online ledger that brings the Japanese Kakeibo method into the digital age. Spreadsheet-fast inline editing, real-time sync, and instant analytics — a Next.js budgeting app at expensio.online.',
  keywords: [
    'open source personal expense tracker',
    'kakeibo method digital tracker',
    'next.js budgeting app',
    'expense tracker',
    'online ledger',
    'spreadsheet expense tracker',
    'personal finance app',
    'income and expense tracker',
    'mindful spending app',
    'expensio',
  ],
  authors: [{ name: 'EXPENSIO', url: siteUrl }],
  creator: 'EXPENSIO',
  applicationName: 'EXPENSIO',
  category: 'finance',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'EXPENSIO',
    title:
      'EXPENSIO — Mindful Spending at the Speed of Thought | Kakeibo Digital Tracker',
    description:
      'A free, Kakeibo-inspired online expense tracker: spreadsheet speed, real-time sync, and analytics that recalculate as you type. Built with Next.js — get started free on expensio.online.',
    locale: 'en_US',
    // images come from app/opengraph-image.tsx (Metadata Image File convention)
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'EXPENSIO — Open Source Kakeibo Expense Tracker & Next.js Budgeting App',
    description:
      'Track expenses, reflect on habits, and build intentional wealth — one row at a time. Free at expensio.online.',
    // images come from app/opengraph-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: { 'en-US': '/' },
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="winter"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
