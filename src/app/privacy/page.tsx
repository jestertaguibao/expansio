import Link from 'next/link';
import { Metadata } from 'next';
import { Wallet, ArrowLeft, ShieldCheck, Ban, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | EXPENSIO',
  description:
    'How EXPENSIO handles your data: we respect your privacy, we never sell your data, and we never ask for bank credentials or account-scraping access.',
  alternates: { canonical: '/privacy' },
};

/* The three promises we lead with — this is the heart of the page. */
const PROMISES = [
  {
    icon: ShieldCheck,
    iconWrap: 'bg-emerald-100 text-emerald-600',
    title: 'We respect your privacy',
    body: 'Your ledger is yours. We collect the bare minimum needed to run the Service and nothing more.',
  },
  {
    icon: Ban,
    iconWrap: 'bg-rose-100 text-rose-600',
    title: 'We do not sell your data',
    body: 'Never have, never will. We do not sell, rent, or trade your personal or financial information to third parties, and we do not run ads against it.',
  },
  {
    icon: Lock,
    iconWrap: 'bg-teal-100 text-teal-600',
    title: 'No bank credential scraping',
    body: 'EXPENSIO never asks for your bank login, API keys, or account-access credentials. There is no connection to scrape — you type your own rows, the way a spreadsheet works.',
  },
];

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. Information We Collect',
    body: [
      'Account information: your email address and (optionally) your name, provided when you register — including via a Google sign-in.',
      'Ledger content: the transactions, categories, dates, amounts, and notes you choose to record. This is data you create, and it exists only to render your dashboard, trends, and exports.',
      'Payment information: if you become a Donor, checkout is handled entirely by our third-party payment provider (Ko-fi). We never see or store your card numbers.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'To provide the core Service: storing your ledger, calculating totals and analytics, syncing across your devices, and enabling exports you initiate.',
      'To communicate service updates or respond to support requests you send us.',
      'To honor a Donor unlock: our payment webhook matches the email address on your donation to your account to enable premium features. That is the only reason donation data touches our systems.',
    ],
  },
  {
    title: '3. What We Never Do',
    body: [
      'We do not sell your data to anyone, for any reason.',
      'We do not connect to, scrape, or store credentials for your bank, credit card, or any financial institution.',
      'We do not use your ledger contents to train models, build advertising profiles, or share with third parties for their own purposes.',
    ],
  },
  {
    title: '4. Data Storage and Security',
    body: [
      'Your data is stored in a managed Postgres database (Supabase) with row-level security, so your rows are only ever readable and writable by your authenticated account.',
      'We use HTTPS encryption in transit and industry-standard provider controls at rest. No system is perfectly secure, but we design for minimal data and least privilege.',
      'In demo or local modes, your entries are stored in your own browser and are not sent to our servers at all.',
    ],
  },
  {
    title: '5. Your Choices',
    body: [
      'Export: you can download your full ledger (CSV & Excel) at any time, on every tier.',
      'Deletion: you may delete individual rows, archive categories, or close your account. Removing a category never destroys historical transactions — past rows are preserved by design.',
      'Data minimization: because EXPENSIO is manual-entry by philosophy, the simplest way to limit your data is to only record what you want reflected.',
    ],
  },
  {
    title: '6. Cookies and Local Storage',
    body: [
      'We use the minimum storage required for authentication sessions and (in demo mode) your local ledger. We do not use advertising or cross-site tracking cookies.',
    ],
  },
  {
    title: '7. Children\'s Privacy',
    body: [
      'EXPENSIO is not directed at children under 13, and we do not knowingly collect their data. If you believe a child has provided us personal information, contact us and we will promptly delete it.',
    ],
  },
  {
    title: '8. Changes to This Policy',
    body: [
      'If this policy changes, we will update this page and its effective date. Material changes will be communicated through the Service where practical. Continued use means you accept the updated policy.',
    ],
  },
  {
    title: '9. Contact',
    body: [
      'Privacy questions or requests (access, correction, deletion)? Reach us through the contact information on expensio.online. We aim to respond within 30 days.',
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="navbar sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto max-w-3xl">
          <div className="navbar-start">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="bg-gradient-to-tr from-emerald-500 to-teal-400 text-white p-2 rounded-xl shadow-md shadow-emerald-500/25 flex group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5" />
              </span>
              <span className="font-bold text-xl tracking-tight text-slate-900">EXPENSIO</span>
            </Link>
          </div>
          <div className="navbar-end">
            <Link
              href="/"
              className="btn btn-ghost btn-sm rounded-full text-slate-600 hover:text-emerald-700 gap-1.5 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="container mx-auto max-w-3xl px-4 py-14 md:py-20">
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Legal</p>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mt-2">
          Privacy Policy
        </h1>
        <p className="text-slate-500 mt-4 text-base md:text-lg leading-relaxed">
          Money data is personal data. Here is the short version, and then the details.
        </p>
        <p className="text-xs text-slate-400 mt-3 font-medium">
          Effective date: October 2026
        </p>

        {/* The promises, up front */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {PROMISES.map(({ icon: Icon, iconWrap, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-full ${iconWrap} flex items-center justify-center mb-4`}>
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-8">
          {SECTIONS.map(({ title, body }) => (
            <section key={title}>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">{title}</h2>
              <div className="mt-2 space-y-3">
                {body.map((para, i) => (
                  <p key={i} className="text-sm md:text-base text-slate-600 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 leading-relaxed">
          Questions about how we handle your data? See our{' '}
          <Link href="/about" className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2">
            About page
          </Link>{' '}
          for who is behind EXPENSIO, or read the{' '}
          <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2">
            Terms of Service
          </Link>
          .
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="container mx-auto max-w-3xl px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-tr from-emerald-500 to-teal-400 text-white p-1.5 rounded-lg flex">
              <Wallet className="w-4 h-4" />
            </span>
            <p className="font-bold text-slate-900 tracking-wide">EXPENSIO</p>
          </div>
          <p className="text-xs text-slate-400">
            Copyright © {new Date().getFullYear()} — All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
