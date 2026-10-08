'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TimeFilter } from '@/types/database';

interface MetricCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
  activeTimeFilter: TimeFilter;
  currency?: string; // ISO-4217 from profiles.currency, defaults to USD
}

export default function MetricCards({
  totalIncome,
  totalExpenses,
  netBalance,
  transactionCount,
  activeTimeFilter,
  currency = 'USD',
}: MetricCardsProps) {
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const timeFilterLabels: Record<TimeFilter, string> = {
    daily: 'Today',
    weekly: 'This Week',
    monthly: 'This Month',
    yearly: 'This Year',
  };

  const periodLabel = timeFilterLabels[activeTimeFilter] || 'Active Period';

  return (
    /* Sticky totals deck. Rendered as a DIRECT child of <main> (see DashboardShell) so its
       sticky containing block is the tall <main> — this keeps Income/Expense pinned while the
       ledger scrolls underneath. top-16 docks it just below the 4rem sticky navbar; z-40 sits
       above ledger content but below the mobile floating bar (z-50). Solid bg + backdrop-blur
       so rows slide cleanly under it. On mobile the strip bleeds edge-to-edge (-mx-4/px-4) and
       shows a compact 2-column grid of Income + Expense (Balance/Savings hidden). */
    <div className="sticky top-16 z-40 mb-6 bg-base-100/95 backdrop-blur-md border-b border-slate-100 shadow-sm pt-3 pb-3 sm:mb-8 max-sm:-mx-4 max-sm:px-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
      {/* Total Income */}
      <div className="stat p-3 sm:p-6 bg-base-100 border border-base-200 rounded-box shadow-sm">
        <div className="stat-figure text-emerald-600">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="stat-title text-slate-500 text-[10px] sm:text-xs uppercase tracking-wider font-medium">
          Income ({periodLabel})
        </div>
        <div className="stat-value text-emerald-600 text-base sm:text-2xl font-mono font-bold">
          {formatCurrency(totalIncome, currency)}
        </div>
        <div className="stat-desc hidden sm:flex text-slate-500 text-xs items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Inflows recorded</span>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="stat p-3 sm:p-6 bg-base-100 border border-base-200 rounded-box shadow-sm">
        <div className="stat-figure text-rose-600">
          <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="stat-title text-slate-500 text-[10px] sm:text-xs uppercase tracking-wider font-medium">
          Expenses ({periodLabel})
        </div>
        <div className="stat-value text-rose-600 text-base sm:text-2xl font-mono font-bold">
          {formatCurrency(totalExpenses, currency)}
        </div>
        <div className="stat-desc hidden sm:flex text-slate-500 text-xs items-center gap-1">
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Outflows recorded</span>
        </div>
      </div>

      {/* Remaining Balance */}
      <div className="stat max-sm:hidden p-3 sm:p-6 bg-base-100 border border-base-200 rounded-box shadow-sm">
        <div className="stat-figure text-slate-600">
          <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="stat-title text-slate-500 text-[10px] sm:text-xs uppercase tracking-wider font-medium">
          Balance
        </div>
        <div
          className={`stat-value text-base sm:text-2xl font-mono font-bold ${
            netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {formatCurrency(netBalance, currency)}
        </div>
        <div className="stat-desc hidden sm:block text-slate-500 text-xs">
          Net cash flow in active view
        </div>
      </div>

      {/* Savings Rate & Activity */}
      <div className="stat max-sm:hidden p-3 sm:p-6 bg-base-100 border border-base-200 rounded-box shadow-sm">
        <div className="stat-figure text-slate-600">
          <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="stat-title text-slate-500 text-[10px] sm:text-xs uppercase tracking-wider font-medium">
          Savings / Activity
        </div>
        <div className="stat-value text-slate-800 text-base sm:text-2xl font-mono font-bold">
          {savingsRate}%
        </div>
        <div className="stat-desc hidden sm:block text-slate-500 text-xs">
          <span className="font-medium text-slate-700">
            {savingsRate >= 20 ? 'Healthy surplus' : savingsRate > 0 ? 'Positive margin' : 'Deficit / No Income'}
          </span>
          <span className="ml-1">({transactionCount} items)</span>
        </div>
      </div>
      </div>
    </div>
  );
}
