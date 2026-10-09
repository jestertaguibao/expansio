import Link from 'next/link';
import { Metadata } from 'next';
import {
  Wallet,
  ArrowLeft,
  ArrowRight,
  PiggyBank,
  TrendingDown,
  Sparkles,
  Feather,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | EXPENSIO — the indie ledger built on Kakeibo',
  description:
    'The indie-maker story behind EXPENSIO: born from frustration with bloated budgeting apps, shaped by Kakeibo — the Japanese art of mindful saving.',
  alternates: { canonical: '/about' },
};

/* The four Kakeibo questions, as they live inside EXPENSIO's product philosophy. */
const KAKEIBO_PILLARS = [
  {
    icon: Wallet,
    iconWrap: 'bg-emerald-100 text-emerald-600',
    title: 'How much do you have?',
    body: 'Clarity before anything else — total income and available cash flow, at a glance.',
  },
  {
    icon: PiggyBank,
    iconWrap: 'bg-teal-100 text-teal-600',
    title: 'How much will you save?',
    body: 'Savings is a decision made before spending, not a leftover. Set the goal first.',
  },
  {
    icon: TrendingDown,
    iconWrap: 'bg-rose-100 text-rose-600',
    title: 'How much are you spending?',
    body: 'One honest row at a time. Fast entry, no friction, nowhere to hide.',
  },
  {
    icon: Sparkles,
    iconWrap: 'bg-amber-100 text-amber-600',
    title: 'How can you improve?',
    body: 'The month ends in reflection: trends and exports that turn records into wisdom.',
  },
];

export default function About() {
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
        {/* Hero-ish intro */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 md:p-12">
          <div
            aria-hidden
            className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none"
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-emerald-200/70 text-xs font-semibold text-emerald-700 shadow-sm mb-5">
              <Feather className="w-3.5 h-3.5 text-amber-500" />
              An indie-maker project
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Built out of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                frustration
              </span>
              , finished with intention.
            </h1>
            <p className="text-slate-600 mt-5 text-base md:text-lg leading-relaxed">
              EXPENSIO is the ledger its maker wanted and could not find: as fast and familiar as
              a spreadsheet, as honest as a notebook, and guided by Kakeibo — the Japanese art of
              mindful saving.
            </p>
          </div>
        </div>

        {/* The story */}
        <section className="mt-12 space-y-5">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            The story
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Like a lot of people, the maker behind EXPENSIO started the year with good intentions
            and a spreadsheet. It worked — for about two weeks. Then came the subscription budgeting
            apps: fourteen onboarding screens, a bank-login connection that made us flinch, AI
            &quot;insights&quot; buried behind quarterly reports, and a monthly fee for the privilege
            of typing in what we already knew.
          </p>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            The irony was obvious. The tools claiming to help with money had become another
            expense, another account to trust, another app that moved slower than a keyboard.
            Meanwhile the one format everyone actually understood — rows, columns, a total that
            updates as you type — was treated as something to graduate away from.
          </p>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            So instead of another fintech dashboard, the answer went backwards in the best way:
            back to the ledger. <strong className="text-slate-800">EXPENSIO</strong> is that
            ledger, rebuilt for the browser — inline editing at spreadsheet speed, real-time sync,
            and analytics that recalculate as you type. No bank credentials. No data for sale. No
            bloat. Just you, your numbers, and the discipline of one honest row at a time.
          </p>
        </section>

        {/* Kakeibo philosophy */}
        <section className="mt-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Why{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Kakeibo
              </span>
            </h2>
            <p className="text-slate-500 mt-3 text-sm md:text-base leading-relaxed">
              Written in 1904 by Japanese journalist Hani Motoko, Kakeibo is a century-old practice
              of mindful money — a household ledger driven by four simple questions. It asks for no
              app, no bank access, and no fee. It asks for attention. That aligned with exactly
              what EXPENSIO was trying to build, so we made it the product&apos;s spine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {KAKEIBO_PILLARS.map(({ icon: Icon, iconWrap, title, body }) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div className={`w-11 h-11 rounded-full ${iconWrap} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">{title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Indie promises */}
        <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-8 md:p-10">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
            What &quot;indie&quot; means here
          </h2>
          <ul className="mt-5 space-y-3 text-sm md:text-base text-slate-600 leading-relaxed">
            <li className="flex gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>
                <strong className="text-slate-800">Free to start, cheap to support.</strong> The
                Donor Tier is $2/month — less than the coffee the old spreadsheet cost more than.
                It pays for hosting, not a sales team.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>
                <strong className="text-slate-800">Your data stays yours.</strong> We do not sell
                it, and EXPENSIO never asks for bank credentials — read the{' '}
                <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>
                <strong className="text-slate-800">Built in the open, shaped by users.</strong>
                Features land because someone wrote in and asked — the way indie software should
                work.
              </span>
            </li>
          </ul>
        </section>

        {/* Closing CTA */}
        <section className="mt-14 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Ready to keep a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              mindful ledger
            </span>
            ?
          </h2>
          <p className="text-slate-500 mt-3 text-sm md:text-base">
            Mindful spending at the speed of thought — one row at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-7">
            <Link
              href="/register"
              className="btn btn-lg rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-none shadow-lg shadow-emerald-500/30 hover:scale-[1.03] transition-all font-semibold px-8 gap-2"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="btn btn-lg rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 transition-all font-semibold px-8"
            >
              Sign In
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white mt-16">
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
