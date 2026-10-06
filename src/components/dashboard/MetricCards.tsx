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
}

export default function MetricCards({
  totalIncome,
  totalExpenses,
  netBalance,
  transactionCount,
  activeTimeFilter,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Income */}
      <div className="stat bg-base-100 border border-base-200 rounded-box shadow-sm">
        <div className="stat-figure text-emerald-600">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="stat-title text-slate-500 text-xs uppercase tracking-wider font-medium">
          Total Income ({periodLabel})
        </div>
        <div className="stat-value text-emerald-600 text-2xl font-mono font-bold">
          {formatCurrency(totalIncome)}
        </div>
        <div className="stat-desc text-slate-500 text-xs flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Inflows recorded</span>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="stat bg-base-100 border border-base-200 rounded-box shadow-sm">
        <div className="stat-figure text-rose-600">
          <TrendingDown className="w-6 h-6" />
        </div>
        <div className="stat-title text-slate-500 text-xs uppercase tracking-wider font-medium">
          Total Expenses ({periodLabel})
        </div>
        <div className="stat-value text-rose-600 text-2xl font-mono font-bold">
          {formatCurrency(totalExpenses)}
        </div>
        <div className="stat-desc text-slate-500 text-xs flex items-center gap-1">
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Outflows recorded</span>
        </div>
      </div>

      {/* Remaining Balance */}
      <div className="stat bg-base-100 border border-base-200 rounded-box shadow-sm">
        <div className="stat-figure text-slate-600">
          <Wallet className="w-6 h-6" />
        </div>
        <div className="stat-title text-slate-500 text-xs uppercase tracking-wider font-medium">
          Remaining Balance
        </div>
        <div
          className={`stat-value text-2xl font-mono font-bold ${
            netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {formatCurrency(netBalance)}
        </div>
        <div className="stat-desc text-slate-500 text-xs">
          Net cash flow in active view
        </div>
      </div>

      {/* Savings Rate & Activity */}
      <div className="stat bg-base-100 border border-base-200 rounded-box shadow-sm">
        <div className="stat-figure text-slate-600">
          <PiggyBank className="w-6 h-6" />
        </div>
        <div className="stat-title text-slate-500 text-xs uppercase tracking-wider font-medium">
          Savings Rate / Activity
        </div>
        <div className="stat-value text-slate-800 text-2xl font-mono font-bold">
          {savingsRate}%
        </div>
        <div className="stat-desc text-slate-500 text-xs">
          <span className="font-medium text-slate-700">
            {savingsRate >= 20 ? 'Healthy surplus' : savingsRate > 0 ? 'Positive margin' : 'Deficit / No Income'}
          </span>
          <span className="ml-1">({transactionCount} items)</span>
        </div>
      </div>
    </div>
  );
}
