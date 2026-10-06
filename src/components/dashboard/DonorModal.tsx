'use client';

import React, { useState } from 'react';
import { UserTier } from '@/types/database';
import { Crown, Check, X, Sparkles, Download, Calendar, Shield, Zap } from 'lucide-react';

interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: UserTier;
  onUpdateTier: (newTier: UserTier) => Promise<void>;
}

export default function DonorModal({
  isOpen,
  onClose,
  currentTier,
  onUpdateTier,
}: DonorModalProps) {
  const [updating, setUpdating] = useState(false);

  if (!isOpen) return null;

  const handleSelectTier = async (tier: UserTier) => {
    try {
      setUpdating(true);
      await onUpdateTier(tier);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-zinc-950">
            <Crown className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Expansio Donor Tier</h3>
            <p className="text-xs text-zinc-400">Unlock advanced ledger & export capabilities</p>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Full Yearly Analytics & Trends</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Examine multi-month and 365-day balance trends with instant recalculation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">1-Click CSV Ledger Export</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Download your full transaction history anytime for accounting or tax purposes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Cloudflare Edge Supercharging</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Sub-millisecond global caching and ultra-fast autosave sync worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Tier Switching Controls (For testing and donor activation) */}
        <div className="border-t border-zinc-800/80 pt-5">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
            Current Tier: <span className="text-amber-400 font-mono capitalize">{currentTier}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={updating || currentTier === 'free'}
              onClick={() => handleSelectTier('free')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                currentTier === 'free'
                  ? 'bg-zinc-800 text-zinc-400 border-zinc-700 opacity-60'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}
            >
              Downgrade to Free
            </button>

            <button
              type="button"
              disabled={updating || currentTier === 'donor'}
              onClick={() => handleSelectTier('donor')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                currentTier === 'donor'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 opacity-70'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 shadow-amber-500/20'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{currentTier === 'donor' ? 'Donor Active' : 'Activate Donor Tier'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
