import Link from 'next/link';
import { Metadata } from 'next';
import { Wallet, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | EXPENSIO',
  description:
    'The terms governing your use of EXPENSIO — the spreadsheet-fast ledger built on the Japanese art of Kakeibo.',
  alternates: { canonical: '/terms' },
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. Acceptance of Terms',
    body: [
      'By accessing or using EXPENSIO ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use the Service.',
      'The Service is provided for personal budgeting and expense-tracking purposes. You are responsible for maintaining the accuracy of the financial data you record.',
    ],
  },
  {
    title: '2. Description of Service',
    body: [
      'EXPENSIO is an online ledger and expense-tracking application inspired by Kakeibo, the Japanese art of mindful saving. It allows you to record income and expenses, categorize transactions, and view analytics.',
      'EXPENSIO is a record-keeping and reflection tool. It is not a bank, is not affiliated with any financial institution, and does not move, hold, or manage your money.',
    ],
  },
  {
    title: '3. Not Financial Advice',
    body: [
      'All content in the Service — including insights, trends, savings metrics, and the Kakeibo framing — is provided for informational and educational purposes only and does not constitute financial, investment, legal, or tax advice.',
      'You should consult a qualified professional before making financial decisions. EXPENSIO makes no guarantee of any financial outcome.',
    ],
  },
  {
    title: '4. Accounts and Responsibility',
    body: [
      'When creating an account you must provide accurate information and keep your credentials secure. You are responsible for all activity that occurs under your account.',
      'You may not use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service.',
    ],
  },
  {
    title: '5. Payments and Donor Tier',
    body: [
      'Optional paid features (the "Donor Tier") are processed through third-party payment providers such as Ko-fi. By making a payment you agree to the provider\'s terms in addition to these.',
      'Donor contributions support the ongoing development of EXPENSIO and do not create any warranty of uninterrupted service. Feature availability may change as the product evolves.',
    ],
  },
  {
    title: '6. Your Data',
    body: [
      'You retain ownership of the transaction and category data you enter into the Service. We process it solely to provide features to you, as described in our Privacy Policy.',
      'We respect your privacy: we do not sell your data, and we do not require — or support — unsafe bank-credential scraping or read access to your financial accounts.',
      'You may export or delete your data at any time. Because deletions are designed to protect historical records, removing a category preserves past transactions.',
    ],
  },
  {
    title: '7. Disclaimer of Warranties',
    body: [
      'The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including fitness for a particular purpose and non-infringement.',
      'We do not warrant that the Service will be error-free, uninterrupted, or that any data will be retained without loss. You use the Service at your own discretion and risk.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    body: [
      'To the fullest extent permitted by law, EXPENSIO and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising from your use of or inability to use the Service.',
    ],
  },
  {
    title: '9. Changes to These Terms',
    body: [
      'We may update these Terms from time to time. Material changes will be reflected on this page with an updated effective date. Continued use of the Service after changes constitutes acceptance of the revised Terms.',
    ],
  },
  {
    title: '10. Contact',
    body: [
      'Questions about these Terms? Reach out through the contact information listed on expensio.online.',
    ],
  },
];

export default function Terms() {
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
          Terms of Service
        </h1>
        <p className="text-slate-500 mt-4 text-base md:text-lg leading-relaxed">
          The terms that govern your use of EXPENSIO — mindful money, kept simply and safely.
          Please read them carefully.
        </p>
        <p className="text-xs text-slate-400 mt-3 font-medium">
          Effective date: October 2026
        </p>

        <div className="mt-10 space-y-8">
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
          By using EXPENSIO, you acknowledge that you have read and agree to these Terms of
          Service and our{' '}
          <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2">
            Privacy Policy
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
