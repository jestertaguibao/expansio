'use client';

import React, { useState } from 'react';
import { Expense, Category } from '@/types/database';
import {
  Plus,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  Calendar,
  Tag,
  DollarSign,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SpreadsheetLedgerProps {
  expenses: Expense[];
  categories: Category[];
  onUpdateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
  onAddRow: () => Promise<void>;
  savingRowIds: Record<string, 'saving' | 'saved' | 'error'>;
  isLoading: boolean;
}

export default function SpreadsheetLedger({
  expenses,
  categories,
  onUpdateExpense,
  onDeleteExpense,
  onAddRow,
  savingRowIds,
  isLoading,
}: SpreadsheetLedgerProps) {
  // Track active editing cell if needed, or row edits
  const [activeCell, setActiveCell] = useState<{ id: string; field: string } | null>(null);

  return (
    <div className="bg-base-100 border border-base-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Spreadsheet Toolbar */}
      <div className="px-5 py-3 border-b border-base-200 bg-base-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>SHEET1: LEDGER</span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click any cell to edit & auto-save
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Row</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Container with Horizontal Scroll */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[760px] text-xs font-mono">
          <thead>
            {/* Column coordinate row (Excel Style A, B, C...) */}
            <tr className="bg-base-50 border-b border-base-200 text-[10px] text-slate-500 uppercase select-none">
              <th className="w-12 px-3 py-1.5 text-center font-normal border-r border-base-200">#</th>
              <th className="w-36 px-3 py-1.5 font-normal border-r border-base-200">A · DATE</th>
              <th className="w-48 px-3 py-1.5 font-normal border-r border-base-200">B · CATEGORY</th>
              <th className="w-28 px-3 py-1.5 font-normal border-r border-base-200">C · TYPE</th>
              <th className="w-36 px-3 py-1.5 text-right font-normal border-r border-base-200">D · AMOUNT</th>
              <th className="px-3 py-1.5 font-normal border-r border-base-200">E · NOTES</th>
              <th className="w-20 px-3 py-1.5 text-center font-normal">F · ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200 font-sans">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                      <span>Loading ledger data...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center text-slate-400 border border-base-300">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="text-slate-700 font-medium text-sm">No expenses in this view</div>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Change your filter in the sidebar or click below to record your first transaction.
                      </p>
                      <button
                        type="button"
                        onClick={onAddRow}
                        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Row to Ledger</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              expenses.map((expense, idx) => {
                const rowStatus = savingRowIds[expense.id];
                const category =
                  expense.categories ||
                  categories.find((c) => c.id === expense.category_id);
                const isIncome = category?.type === 'income';
                // Picker shows only ACTIVE categories, plus this row's own category
                // even if archived — so historical transactions still display/select their name.
                const selectableCategories = categories.filter(
                  (c) => !c.is_archived || c.id === expense.category_id
                );

                return (
                  <tr
                    key={expense.id}
                    className="hover:bg-base-50 transition-colors group relative"
                  >
                    {/* Row Index + Status Dot */}
                    <td className="px-3 py-2 text-center text-slate-500 font-mono text-[11px] bg-base-50 border-r border-base-200 select-none">
                      <div className="flex items-center justify-center gap-1">
                        <span>{idx + 1}</span>
                        {rowStatus === 'saving' && (
                          <Loader2 className="w-2.5 h-2.5 text-amber-500 animate-spin" />
                        )}
                        {rowStatus === 'saved' && (
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                        )}
                        {rowStatus === 'error' && (
                          <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
                        )}
                      </div>
                    </td>

                    {/* Cell A: Date */}
                    <td className="p-1 border-r border-base-200">
                      <input
                        type="date"
                        value={expense.expense_date || ''}
                        onChange={(e) =>
                          onUpdateExpense(expense.id, { expense_date: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded bg-transparent hover:bg-base-100 focus:bg-white focus:ring-1 focus:ring-emerald-500 text-xs font-mono text-slate-700 border border-transparent focus:border-emerald-500/50 transition-all outline-none cursor-pointer"
                      />
                    </td>

                    {/* Cell B: Category */}
                    <td className="p-1 border-r border-base-200">
                      <select
                        value={expense.category_id || ''}
                        onChange={(e) => {
                          const newCatId = e.target.value;
                          const newCat = categories.find((c) => c.id === newCatId) || null;
                          onUpdateExpense(expense.id, {
                            category_id: newCatId,
                            categories: newCat,
                          });
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-transparent hover:bg-base-100 focus:bg-white focus:ring-1 focus:ring-emerald-500 text-xs text-slate-700 border border-transparent focus:border-emerald-500/50 transition-all outline-none cursor-pointer truncate"
                      >
                        <option value="" disabled className="bg-white text-slate-500">
                          Select category...
                        </option>
                        {selectableCategories.map((c) => (
                          <option key={c.id} value={c.id} className="bg-white text-slate-700">
                            {c.name}
                            {c.is_archived ? ' · archived' : ''} ({c.type})
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Cell C: Type Badge (Dynamic from Category) */}
                    <td className="px-3 py-2 border-r border-base-200 select-none">
                      {category ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${
                            isIncome
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-100 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {category.type}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Cell D: Amount (Inline Number Input) */}
                    <td className="p-1 border-r border-base-200 text-right">
                      <div className="relative flex items-center justify-end">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={expense.amount === 0 ? '' : expense.amount}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            onUpdateExpense(expense.id, { amount: val });
                          }}
                          className={`w-full px-2.5 py-1.5 rounded bg-transparent hover:bg-base-100 focus:bg-white focus:ring-1 focus:ring-emerald-500 text-xs font-mono text-right border border-transparent focus:border-emerald-500/50 transition-all outline-none ${
                            isIncome ? 'text-emerald-600 font-semibold' : 'text-slate-700'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Cell E: Notes */}
                    <td className="p-1 border-r border-base-200">
                      <input
                        type="text"
                        placeholder="Add notes, memo, or vendor..."
                        value={expense.notes || ''}
                        onChange={(e) =>
                          onUpdateExpense(expense.id, { notes: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 rounded bg-transparent hover:bg-base-100 focus:bg-white focus:ring-1 focus:ring-emerald-500 text-xs text-slate-700 placeholder-slate-400 border border-transparent focus:border-emerald-500/50 transition-all outline-none"
                      />
                    </td>

                    {/* Cell F: Actions */}
                    <td className="px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => onDeleteExpense(expense.id)}
                        title="Delete row"
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Spreadsheet Bottom Bar with Quick Add Row & Formula Summary */}
      <div className="px-5 py-3 border-t border-base-200 bg-base-50 flex items-center justify-between">
        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium py-1 px-2 rounded hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add new row (+ Enter)</span>
        </button>

        <div className="text-[11px] text-slate-500 font-mono">
          Total rows: <span className="text-slate-700 font-semibold">{expenses.length}</span>
        </div>
      </div>
    </div>
  );
}
