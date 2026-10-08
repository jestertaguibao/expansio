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
    default: 'EXPENSIO | Excel-like Expense Tracker & Ledger',
    template: '%s | EXPENSIO',
  },
  description:
    'EXPENSIO is a lightweight, lightning-fast Excel-like ledger for tracking personal and business income and expenses. Inline editing, real-time sync, and instant analytics — free at expensio.online.',
  keywords: [
    'expense tracker',
    'online ledger',
    'spreadsheet expense tracker',
    'personal finance app',
    'business expense ledger',
    'income and expense tracker',
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
    title: 'EXPENSIO | Spreadsheet Speed. Modern Ledger Power.',
    description:
      'Track income and expenses with the familiarity of a spreadsheet, backed by real-time sync and powerful analytics. Get started free on expensio.online.',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png', // drop a 1200x630 image into /public to enable OG sharing
        width: 1200,
        height: 630,
        alt: 'EXPENSIO — Excel-like Expense Ledger',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EXPENSIO | Excel-like Expense Tracker & Ledger',
    description:
      'Spreadsheet speed with modern app power. Track income and expenses in real time — free at expensio.online.',
    images: ['/og-image.png'],
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
