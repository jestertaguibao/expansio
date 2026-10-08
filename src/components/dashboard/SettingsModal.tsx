'use client';

import React, { useEffect, useState } from 'react';
import { Settings2, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SUPPORTED_CURRENCIES, formatCurrency } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  userTier: string;
  userEmail: string | null;
  onSaveCurrency: (currency: string) => Promise<void>;
}

export default function SettingsModal({
  isOpen,
  onClose,
  currency,
  userTier,
  userEmail,
  onSaveCurrency,
}: SettingsModalProps) {
  const [selected, setSelected] = useState(currency);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Re-sync when the profile currency changes elsewhere
  useEffect(() => {
    setSelected(currency);
  }, [currency, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSaved(false);
      setSaving(true);
      await onSaveCurrency(selected);
      setSaved(true);
      setTimeout(() => onClose(), 700);
    } catch (err: any) {
      setError(err?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
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
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Account Settings</h3>
            <p className="text-xs text-zinc-400">
              {userEmail || 'demo-user'} · <span className="capitalize">{userTier} tier</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="p-2.5 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div className="p-2.5 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Currency saved to your profile.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Currency selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Display Currency
            </label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1.5">
              Preview:
              <span className="font-mono text-emerald-400">
                {formatCurrency(1234.5, selected)}
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={saving || selected === currency}
            className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Settings</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
