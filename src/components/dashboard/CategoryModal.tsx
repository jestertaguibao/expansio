'use client';

import React, { useState } from 'react';
import { Category } from '@/types/database';
import {
  Tag,
  Plus,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  Trash2,
  RotateCcw,
  Archive,
} from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (name: string, type: 'expense' | 'income') => Promise<void>;
  onSeedDefaultCategories?: () => Promise<void>;
  /** Soft-delete (archive) a category — flips is_archived = true, never deletes. */
  onArchiveCategory?: (id: string) => Promise<void>;
  /** Restore an archived category back into the active picker. */
  onRestoreCategory?: (id: string) => Promise<void>;
}

export default function CategoryModal({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onSeedDefaultCategories,
  onArchiveCategory,
  onRestoreCategory,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inline confirm state for the soft-delete ("Delete") action.
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeCategories = categories.filter((c) => !c.is_archived);
  const archivedCategories = categories.filter((c) => c.is_archived);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setError(null);
      setSubmitting(true);
      await onAddCategory(name.trim(), type);
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeed = async () => {
    if (!onSeedDefaultCategories) return;
    try {
      setError(null);
      setSeeding(true);
      await onSeedDefaultCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed categories');
    } finally {
      setSeeding(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!onArchiveCategory) return;
    try {
      setError(null);
      setBusyId(id);
      await onArchiveCategory(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  const handleRestore = async (id: string) => {
    if (!onRestoreCategory) return;
    try {
      setError(null);
      setBusyId(id);
      await onRestoreCategory(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore category');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Ledger Categories</h3>
            <p className="text-xs text-zinc-400">Manage income and expense categories</p>
          </div>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleSubmit} className="mb-5 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Create New Category
          </div>

          {error && (
            <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Category name (e.g., Software, Rent)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'expense' | 'income')}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
            <span>Add Category</span>
          </button>
        </form>

        {/* Existing Categories List */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Available Categories ({activeCategories.length})
            </div>

            {onSeedDefaultCategories && activeCategories.length === 0 && (
              <button
                type="button"
                onClick={handleSeed}
                disabled={seeding}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                {seeding ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                )}
                <span>Load Starter Categories</span>
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {activeCategories.length === 0 && archivedCategories.length === 0 ? (
              <div className="text-center py-6 text-zinc-500 text-xs">
                No categories yet. Add one above or load starter categories.
              </div>
            ) : (
              activeCategories.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl bg-zinc-950/40 border border-zinc-800/80"
                >
                  <div className="flex items-center justify-between p-2.5 text-xs">
                    <span className="font-medium text-zinc-200">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          c.type === 'income'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {c.type}
                      </span>
                      {onArchiveCategory && (
                        <button
                          type="button"
                          onClick={() => setConfirmId(confirmId === c.id ? null : c.id)}
                          title="Delete category"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline confirmation (soft delete) */}
                  {confirmId === c.id && (
                    <div className="px-2.5 pb-2.5">
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-[11px] text-rose-200">
                        <div className="flex items-start gap-1.5 mb-2">
                          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>Delete this category? Historical transactions will be kept.</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleArchive(c.id)}
                            disabled={busyId === c.id}
                            className="flex-1 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-zinc-950 font-semibold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-60"
                          >
                            {busyId === c.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Archived categories (soft-deleted) — kept for history, restorable */}
          {archivedCategories.length > 0 && (
            <div className="mt-5">
              <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Archive className="w-3 h-3" />
                <span>Archived ({archivedCategories.length})</span>
              </div>
              <div className="space-y-1.5">
                {archivedCategories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/20 border border-zinc-800/60 text-xs opacity-70"
                  >
                    <span className="font-medium text-zinc-400 line-through">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-zinc-500">{c.type}</span>
                      {onRestoreCategory && (
                        <button
                          type="button"
                          onClick={() => handleRestore(c.id)}
                          disabled={busyId === c.id}
                          title="Restore category"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                        >
                          {busyId === c.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
