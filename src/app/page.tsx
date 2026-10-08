import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expansio | Excel-like Expense Tracker & Online Ledger',
  description: 'Spreadsheet speed, modern app power. Track income and expenses with an inline-editable ledger, real-time sync, and instant analytics — free on expensio.online.',
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header/Nav */}
      <header className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl text-slate-800">
            <img src="/logo.svg" alt="Expansio Logo" className="w-8 h-8 mr-2" />
            Expansio
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-slate-600">
            <li><Link href="#features">Features</Link></li>
            <li><Link href="#pricing">Pricing</Link></li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link href="/login" className="btn btn-ghost mr-2 text-slate-600 hover:text-slate-800">
            Log In
          </Link>
          <Link href="/register" className="btn btn-primary">
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero min-h-[80vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 text-slate-800">
              Spreadsheet speed. Modern app power.
            </h1>
            <p className="py-6 text-lg text-slate-600">
              Track expenses with the familiarity of a spreadsheet, backed by real-time sync and powerful analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn btn-primary btn-lg">
                Get Started for Free
              </Link>
              <Link href="/login" className="btn btn-outline btn-lg">
                Sign In to Your Ledger
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card bg-base-200 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Inline Editing
                </h3>
                <p className="text-slate-600">Edit cells directly like Excel. No forms, no buttons, just click and type.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-200 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Real-time Analytics
                </h3>
                <p className="text-slate-600">Visual insights into your spending patterns with charts and summaries.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-200 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Instant Sync
                </h3>
                <p className="text-slate-600">Your data syncs instantly across all devices. Never lose track of expenses.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-2xl text-slate-800">Free Tier</h3>
                <div className="text-4xl font-bold text-primary">$0<span className="text-lg font-normal text-slate-500">/month</span></div>
                <ul className="mt-4 space-y-2 text-slate-600">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Basic ledger functionality
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Monthly expense views
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Real-time sync
                  </li>
                </ul>
                <div className="card-actions justify-end mt-6">
                  <Link href="/register" className="btn btn-primary btn-block">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            {/* Donor Tier */}
            <div className="card bg-primary text-primary-content shadow-lg border border-primary">
              <div className="card-body">
                <div className="badge badge-secondary badge-outline">Popular</div>
                <h3 className="card-title text-2xl">Donor Tier</h3>
                <div className="text-4xl font-bold">$5<span className="text-lg font-normal opacity-80">/month</span></div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Everything in Free
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced yearly analytics
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    CSV exports
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                </ul>
                <div className="card-actions justify-end mt-6">
                  <Link href="/register" className="btn btn-secondary btn-block">
                    Upgrade to Donor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-slate-600 rounded">
        <nav className="grid grid-flow-col gap-4">
          <Link href="/about" className="link link-hover">About</Link>
          <Link href="/privacy" className="link link-hover">Privacy</Link>
          <Link href="/terms" className="link link-hover">Terms</Link>
        </nav>
        <aside>
          <p className="font-bold text-slate-800">Expansio</p>
          <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
        </aside>
      </footer>
    </div>
  );
}
