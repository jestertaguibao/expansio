'use client';

import React from 'react';
import { TimeFilter, UserTier, Category } from '@/types/database';
import {
  Calendar,
  Lock,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { getTodayDateString } from '@/lib/utils';

interface SidebarFiltersProps {
  activeTimeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
  userTier: UserTier;
  onOpenDonorModal: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  excelExporting?: boolean;
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedType: 'all' | 'expense' | 'income';
  onSelectType: (type: 'all' | 'expense' | 'income') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  referenceDate: string;
  onReferenceDateChange: (dateStr: string) => void;
}

export default function SidebarFilters({
  activeTimeFilter,
  onTimeFilterChange,
  userTier,
  onOpenDonorModal,
  onExportCsv,
  onExportExcel,
  excelExporting,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
  searchQuery,
  onSearchChange,
  referenceDate,
  onReferenceDateChange,
}: SidebarFiltersProps) {
  const isDonorOrAdmin = userTier === 'donor' || userTier === 'admin';

  const timeFilters: { id: TimeFilter; label: string; locked?: boolean }[] = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly', locked: !isDonorOrAdmin },
  ];

  // Navigate reference date
  const handleDateStep = (direction: 'prev' | 'next') => {
    const [y, m, d] = referenceDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);

    if (activeTimeFilter === 'daily') {
      date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    } else if (activeTimeFilter === 'weekly') {
      date.setDate(date.getDate() + (direction === 'next' ? 7 : -7));
    } else if (activeTimeFilter === 'monthly') {
      date.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (activeTimeFilter === 'yearly') {
      date.setFullYear(date.getFullYear() + (direction === 'next' ? 1 : -1));
    }

    const ny = date.getFullYear();
    const nm = String(date.getMonth() + 1).padStart(2, '0');
    const nd = String(date.getDate()).padStart(2, '0');
    onReferenceDateChange(`${ny}-${nm}-${nd}`);
  };

  const handleResetToday = () => {
    onReferenceDateChange(getTodayDateString());
  };

  const handleTimeClick = (item: { id: TimeFilter; label: string; locked?: boolean }) => {
    if (item.locked) {
      onOpenDonorModal();
      return;
    }
    onTimeFilterChange(item.id);
  };

  const handleCsvClick = () => {
    if (!isDonorOrAdmin) {
      onOpenDonorModal();
      return;
    }
    onExportCsv();
  };

  const handleExcelClick = () => {
    if (!isDonorOrAdmin) {
      onOpenDonorModal();
      return;
    }
    onExportExcel();
  };

  return (
    <div className="bg-base-100 border border-base-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-6">
      {/* Time Horizon Toggles */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            Time Horizon
          </label>
          <span className="text-[10px] text-slate-400 font-mono">Ledger View</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 p-1 bg-base-200 border border-base-300 rounded-xl">
          {timeFilters.map((tf) => {
            const isActive = activeTimeFilter === tf.id;
            return (
              <button
                key={tf.id}
                type="button"
                onClick={() => handleTimeClick(tf)}
                className={`relative flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-emerald-600 font-bold shadow-sm border border-base-300'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                <span>{tf.label}</span>
                {tf.locked && (
                  <Lock className="w-3 h-3 text-amber-500 ml-0.5 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Friendly Donor prompt if free */}
        {!isDonorOrAdmin && (
          <div
            onClick={onOpenDonorModal}
            className="mt-2.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-700 flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors group"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Unlock Yearly Trends</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-700 group-hover:bg-amber-300">
              Donor Perk
            </span>
          </div>
        )}
      </div>

      {/* Date Navigator */}
      <div className="pt-4 border-t border-base-200">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
          Period Reference
        </label>
        <div className="flex items-center justify-between gap-1 bg-base-200 border border-base-300 rounded-xl p-1.5">
          <button
            type="button"
            onClick={() => handleDateStep('prev')}
            title="Previous period"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={referenceDate}
            onChange={(e) => onReferenceDateChange(e.target.value)}
            className="bg-transparent text-xs text-center font-mono text-slate-700 focus:outline-none cursor-pointer py-1"
          />

          <button
            type="button"
            onClick={() => handleDateStep('next')}
            title="Next period"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-1.5 flex justify-end">
          <button
            type="button"
            onClick={handleResetToday}
            className="text-[11px] text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Type Filter (All, Income, Expense) */}
      <div className="pt-4 border-t border-base-200">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
          Transaction Type
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-base-200 border border-base-300 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => onSelectType('all')}
            className={`py-1.5 rounded-lg font-medium transition-all ${
              selectedType === 'all'
                ? 'bg-white text-slate-700 shadow-sm border border-base-300'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onSelectType('expense')}
            className={`py-1.5 rounded-lg font-medium transition-all ${
              selectedType === 'expense'
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Expenses
          </button>
          <button
            type="button"
            onClick={() => onSelectType('income')}
            className={`py-1.5 rounded-lg font-medium transition-all ${
              selectedType === 'income'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="pt-4 border-t border-base-200">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          Filter Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="w-full py-2 px-3 bg-base-200 border border-base-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
        >
          <option value="all">All Categories ({categories.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.type})
            </option>
          ))}
        </select>
      </div>

      {/* Search Filter */}
      <div className="pt-4 border-t border-base-200">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">
          Search Ledger
        </label>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes or descriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-base-200 border border-base-300 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* Export Buttons (Donor Gated — tier is re-verified server-side in /api/export/excel) */}
      <div className="pt-4 border-t border-base-200 space-y-2">
        <button
          type="button"
          onClick={handleCsvClick}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isDonorOrAdmin
              ? 'bg-base-200 hover:bg-base-300 text-slate-700 border border-base-300'
              : 'bg-base-100 hover:bg-base-200 text-slate-500 border border-base-300 group'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>Export Ledger CSV</span>
          {!isDonorOrAdmin && (
            <Lock className="w-3.5 h-3.5 text-amber-500 ml-auto group-hover:scale-110 transition-transform" />
          )}
        </button>

        <button
          type="button"
          onClick={handleExcelClick}
          disabled={excelExporting}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-wait ${
            isDonorOrAdmin
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-600'
              : 'bg-base-100 hover:bg-base-200 text-slate-500 border border-base-300 group'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>{excelExporting ? 'Building workbook…' : 'Export Ledger Excel'}</span>
          {!isDonorOrAdmin && (
            <Lock className="w-3.5 h-3.5 text-amber-500 ml-auto group-hover:scale-110 transition-transform" />
          )}
        </button>

        {!isDonorOrAdmin && (
          <p className="text-[10px] text-slate-400 text-center">
            CSV & Excel downloads require Donor tier
          </p>
        )}
      </div>
    </div>
  );
}
