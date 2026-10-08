import Link from 'next/link';
import { Metadata } from 'next';
import {
  Wallet,
  Zap,
  RefreshCw,
  ChartColumn,
  ArrowRight,
  Check,
  Sparkles,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'EXPENSIO | Excel-like Expense Tracker & Online Ledger',
  description:
    'EXPENSIO — spreadsheet speed, modern app power. Track income and expenses with an inline-editable ledger, real-time sync, and instant analytics. Free on expensio.online.',
  alternates: { canonical: '/' },
};

/* ── Static mock rows for the hero dashboard visual ─────────────────────── */
const LEDGER_ROWS = [
  { date: 'Oct 07', name: 'Salary', tag: 'Income', amount: '+$4,200.00', type: 'income' },
  { date: 'Oct 06', name: 'Groceries & Food', tag: 'Expense', amount: '−$86.40', type: 'expense' },
  { date: 'Oct 05', name: 'Cloud & Software', tag: 'Expense', amount: '−$29.00', type: 'expense' },
  { date: 'Oct 03', name: 'Freelance Invoice', tag: 'Income', amount: '+$650.00', type: 'income' },
  { date: 'Oct 02', name: 'Loan Repayment', tag: 'Expense', amount: '−$310.75', type: 'expense' },
];

const FEATURES = [
  {
    icon: Zap,
    iconWrap: 'bg-amber-100 text-amber-600',
    title: 'Inline Editing, Zero Friction',
    body: 'Click any cell and type — like Excel. No forms, no save buttons, no modal chains. Your keystrokes become rows.',
  },
  {
    icon: RefreshCw,
    iconWrap: 'bg-sky-100 text-sky-600',
    title: 'Real-time Sync Everywhere',
    body: 'Autosave to the edge in under a millisecond. Your phone, tablet, and laptop always show the same live ledger.',
  },
  {
    icon: ChartColumn,
    iconWrap: 'bg-emerald-100 text-emerald-600',
    title: 'Instant Analytics',
    body: 'Balance trends, savings rate, and category breakdowns recalculated as you type — daily, weekly, monthly, yearly.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ─────────────────────────── Navbar ─────────────────────────── */}
      <header className="navbar sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-none">
        <div className="container mx-auto max-w-6xl">
          <div className="navbar-start">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="bg-gradient-to-tr from-emerald-500 to-teal-400 text-white p-2 rounded-xl shadow-md shadow-emerald-500/25 flex group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5" />
              </span>
              <span className="font-bold text-xl tracking-tight text-slate-900">EXPENSIO</span>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 text-sm font-medium text-slate-600">
              <li><Link href="#features" className="hover:text-emerald-600 transition-colors rounded-lg">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-emerald-600 transition-colors rounded-lg">Pricing</Link></li>
            </ul>
          </div>

          <div className="navbar-end gap-2">
            <Link
              href="/login"
              className="btn btn-ghost btn-sm rounded-full text-slate-600 hover:text-slate-900 font-medium"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="btn btn-sm rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-none hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all font-semibold px-5"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────── Hero ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-white">
        {/* Dot-grid pattern overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle,_rgba(15,118,110,0.09)_1px,_transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_65%_60%_at_50%_35%,black,transparent)]"
        />
        {/* Soft top glow */}
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[48rem] h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative container mx-auto max-w-6xl px-4 pt-20 md:pt-28 pb-16 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-emerald-200/70 backdrop-blur-sm text-xs md:text-sm font-semibold text-emerald-700 shadow-sm mb-8">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>The spreadsheet-fast ledger for money that matters</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
            Spreadsheet speed.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Modern app power.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mt-6 leading-relaxed">
            Track income and expenses with the familiarity of a spreadsheet — backed by
            real-time sync, inline editing, and analytics that recalculate as you type.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/register"
              className="btn btn-lg rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-none shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.03] transition-all font-semibold px-8 gap-2"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="btn btn-lg rounded-full bg-white/60 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-white hover:border-emerald-300 hover:text-emerald-700 transition-all font-semibold px-8"
            >
              View Live Demo — Sign In
            </Link>
          </div>

          <p className="text-xs text-slate-400 mt-5 font-medium">
            No credit card required · Free forever tier · Cancel anytime
          </p>

          {/* ─────────────── Hero visual: ledger mockup ──────────────── */}
          <div className="mt-14 md:mt-20 mx-auto max-w-5xl">
            <div className="bg-white/70 backdrop-blur-md border border-white/20 shadow-2xl shadow-slate-900/10 rounded-2xl md:rounded-[2rem] p-2 md:p-4 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                    October · Personal Ledger
                  </span>
                </div>
                <span className="badge badge-ghost badge-sm text-[10px] font-mono text-slate-500 border-slate-200 bg-white/70">
                  autosaved · just now
                </span>
              </div>

              {/* Mini stat strip */}
              <div className="grid grid-cols-3 gap-2 md:gap-3 p-2 md:p-3">
                <div className="bg-white/80 border border-slate-100 rounded-xl px-3 py-2.5 text-left">
                  <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Income
                  </div>
                  <div className="text-sm md:text-lg font-bold font-mono text-slate-800 mt-0.5">$4,850.00</div>
                </div>
                <div className="bg-white/80 border border-slate-100 rounded-xl px-3 py-2.5 text-left">
                  <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Expenses
                  </div>
                  <div className="text-sm md:text-lg font-bold font-mono text-slate-800 mt-0.5">$426.15</div>
                </div>
                <div className="bg-white/80 border border-slate-100 rounded-xl px-3 py-2.5 text-left">
                  <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-slate-400">Balance</div>
                  <div className="text-sm md:text-lg font-bold font-mono mt-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                      +$4,423.85
                    </span>
                  </div>
                </div>
              </div>

              {/* Fake ledger rows */}
              <div className="bg-white/80 border border-slate-100 rounded-xl md:rounded-2xl mx-2 md:mx-3 mb-2 md:mb-3 overflow-hidden">
                <div className="hidden md:grid grid-cols-[90px_1fr_110px_120px] gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/80">
                  <span>Date</span><span>Category</span><span>Type</span><span className="text-right">Amount</span>
                </div>
                {LEDGER_ROWS.map((row) => (
                  <div
                    key={row.name}
                    className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[90px_1fr_110px_120px] items-center gap-2 md:gap-2 px-3 md:px-4 py-2.5 border-b border-slate-50 last:border-none hover:bg-emerald-50/40 transition-colors text-left"
                  >
                    <span className="text-[11px] md:text-xs font-mono text-slate-400">{row.date}</span>
                    <span className="text-xs md:text-sm font-medium text-slate-700 truncate">{row.name}</span>
                    <span
                      className={`hidden md:inline-flex justify-center w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        row.type === 'income'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}
                    >
                      {row.tag}
                    </span>
                    <span
                      className={`text-right text-xs md:text-sm font-mono font-semibold ${
                        row.type === 'income' ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── Features ─────────────────────────────── */}
      <section id="features" className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 py-20 md:py-24">
          <div className="md:col-span-3 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Built for people who think in spreadsheets
            </h2>
            <p className="text-slate-500 mt-4 text-base md:text-lg">
              Everything you loved about your ledger file. Everything it could never do.
            </p>
          </div>

          {FEATURES.map(({ icon: Icon, iconWrap, title, body }) => (
            <div
              key={title}
              className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-200 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
            >
              <div className={`w-12 h-12 rounded-full ${iconWrap} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────── Pricing ──────────────────────────────── */}
      <section id="pricing" className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center text-slate-900">
            Simple pricing
          </h2>
          <p className="text-center text-slate-500 mt-3">Free to start. A coffee a month to supercharge it.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* Free Tier */}
            <div className="card bg-white border border-slate-200 shadow-sm rounded-2xl">
              <div className="card-body p-8">
                <h3 className="text-xl font-bold text-slate-900">Free Forever</h3>
                <div className="text-4xl font-extrabold text-slate-900 mt-2">
                  $0<span className="text-base font-medium text-slate-400">/month</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
                  {['Inline-editable ledger', 'Daily · weekly · monthly views', 'Real-time sync across devices'].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={3} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="card-actions mt-7">
                  <Link
                    href="/register"
                    className="btn w-full rounded-full bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 transition-colors font-semibold"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            {/* Donor Tier */}
            <div className="card bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-500/25 rounded-2xl border-none relative overflow-hidden">
              <div aria-hidden className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="card-body p-8 relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Donor Tier</h3>
                  <span className="badge badge-sm bg-white/20 border-white/30 text-white font-semibold">Popular</span>
                </div>
                <div className="text-4xl font-extrabold mt-2">
                  $5<span className="text-base font-medium opacity-80">/month</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {[
                    'Everything in Free',
                    'Yearly analytics & balance trends',
                    'CSV & Excel exports',
                    'Priority support',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" strokeWidth={3} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="card-actions mt-7">
                  <Link
                    href="/register"
                    className="btn w-full rounded-full bg-white text-emerald-700 border-none hover:bg-emerald-50 hover:scale-[1.02] transition-all font-semibold"
                  >
                    Upgrade to Donor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── Bottom CTA band ─────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Your ledger is <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">one click away</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/register"
              className="btn btn-lg rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-none shadow-lg shadow-emerald-500/30 hover:scale-[1.03] transition-all font-semibold px-8 gap-2"
            >
              <span>Create free account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn btn-lg rounded-full btn-ghost text-slate-600 hover:text-emerald-700">
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Footer ───────────────────────────── */}
      <footer className="footer footer-center p-10 bg-slate-50 border-t border-slate-100 text-slate-500">
        <nav className="grid grid-flow-col gap-6 text-sm">
          <Link href="/about" className="link link-hover hover:text-emerald-600">About</Link>
          <Link href="/privacy" className="link link-hover hover:text-emerald-600">Privacy</Link>
          <Link href="/terms" className="link link-hover hover:text-emerald-600">Terms</Link>
        </nav>
        <aside>
          <div className="flex items-center justify-center gap-2">
            <span className="bg-gradient-to-tr from-emerald-500 to-teal-400 text-white p-1.5 rounded-lg flex">
              <Wallet className="w-4 h-4" />
            </span>
            <p className="font-bold text-slate-900 tracking-wide">EXPENSIO</p>
          </div>
          <p>Copyright © {new Date().getFullYear()} — All rights reserved</p>
        </aside>
      </footer>
    </div>
  );
}
