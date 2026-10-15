'use client';

import React, { useState } from 'react';
import { Expense, Category } from '@/types/database';
import { getTodayDateString } from '@/lib/utils';
import { Calendar, Tag, DollarSign, FileText, Trash2, X, Loader2, AlertCircle } from 'lucide-react';

/** Values the sheet hands back on submit — used by both create and edit flows. */
export interface MobileSheetValues {
  expense_date: string;
  category_id: string | null;
  categories: Category | null;
  amount: number;
  notes: string;
}

interface MobileEditModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  /** Edit mode: the tapped row. Ignored in create mode. */
  expense?: Expense | null;
  /** Create mode: pre-selects the first active category of this type. */
  defaultType?: 'income' | 'expense';
  categories: Category[];
  currency?: string;
  onClose: () => void;
  /** Shell decides create vs update from the mode — the sheet stays dumb. */
  onSubmit: (values: MobileSheetValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const labelCls =
  'mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400';
const fieldCls =
  'w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-3 text-sm text-white outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30';

export default function MobileEditModal({
  isOpen,
  mode,
  expense,
  defaultType,
  categories,
  currency = 'USD',
  onClose,
  onSubmit,
  onDelete,
}: MobileEditModalProps) {
  const isCreate = mode === 'create';

  // Mounted fresh per open (conditional render + key), so seeding useState from
  // props once is enough — no sync effects.
  const initialCategory = isCreate
    ? categories.find((c) => !c.is_archived && c.type === defaultType) || null
    : expense?.categories ||
      categories.find((c) => c.id === expense?.category_id) ||
      null;

  const [date, setDate] = useState(
    isCreate ? getTodayDateString() : expense?.expense_date ?? ''
  );
  const [categoryId, setCategoryId] = useState<string>(initialCategory?.id ?? '');
  const [amount, setAmount] = useState(
    !isCreate && expense && expense.amount !== 0 ? String(expense.amount) : ''
  );
  const [notes, setNotes] = useState(isCreate ? '' : expense?.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Same rule as the inline ledger picker: active categories only, plus this
  // row's own category even if archived, so history stays selectable.
  const selectableCategories = categories.filter(
    (c) => !c.is_archived || c.id === expense?.category_id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSaving(true);
      const matched = categories.find((c) => c.id === categoryId) || null;
      await onSubmit({
        expense_date: date,
        category_id: categoryId || null,
        categories: matched,
        amount: parseFloat(amount) || 0,
        notes,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not save changes. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Two-step confirm keeps a fat-fingered tap from destroying a record.
  const handleDelete = async () => {
    if (!expense) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    try {
      setError(null);
      setSaving(true);
      await onDelete(expense.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete this record.');
      setConfirmDelete(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/80 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-zinc-800 bg-zinc-900 shadow-2xl sm:rounded-2xl">
        {/* Sheet handle (mobile affordance) */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-zinc-700 sm:hidden" aria-hidden />

        {/* Header — title switches between Add and Edit */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1">
          <h3 className="text-base font-bold text-white">
            {isCreate ? 'Add Transaction' : 'Edit Transaction'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto px-6 pb-6 pt-3">
          <div>
            <label htmlFor="mobile-edit-date" className={labelCls}>
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Date</span>
            </label>
            <input
              id="mobile-edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${fieldCls} font-mono`}
              required
            />
          </div>

          <div>
            <label htmlFor="mobile-edit-category" className={labelCls}>
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Category</span>
            </label>
            <select
              id="mobile-edit-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={fieldCls}
            >
              <option value="">Uncategorized</option>
              {selectableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.is_archived ? ' · archived' : ''} ({c.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mobile-edit-amount" className={labelCls}>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Amount ({currency})</span>
            </label>
            <input
              id="mobile-edit-amount"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`${fieldCls} font-mono text-right`}
            />
          </div>

          <div>
            <label htmlFor="mobile-edit-notes" className={labelCls}>
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Notes</span>
            </label>
            <textarea
              id="mobile-edit-notes"
              rows={3}
              placeholder="Memo, vendor, or detail…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${fieldCls} resize-none`}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Prominent primary action */}
          <button
            type="submit"
            disabled={saving}
            className="btn w-full border-none bg-gradient-to-r from-emerald-600 to-teal-500 font-semibold text-white shadow-lg shadow-emerald-600/25 transition-transform hover:scale-[1.01] active:scale-[0.99] gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            <span>{isCreate ? 'Add Transaction' : 'Save Changes'}</span>
          </button>
        </form>

        {/* Delete is edit-only and lives outside the form so its tap never
            triggers submit. Hidden entirely in Create mode. */}
        {!isCreate && expense && (
          <div className="border-t border-zinc-800 px-6 py-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className={`btn w-full gap-2 border font-semibold text-sm ${
                confirmDelete
                  ? 'border-rose-500 bg-rose-600 text-white hover:bg-rose-700'
                  : 'border-rose-500/40 bg-transparent text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{confirmDelete ? 'Tap again to confirm delete' : 'Delete Record'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
