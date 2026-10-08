'use client';

import React from 'react';
import { UserTier } from '@/types/database';
import { Crown, X, Check, Calendar, Download, Zap } from 'lucide-react';
import KofiDonorButton from './KofiDonorButton';

interface DonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: UserTier;
}

export default function DonorModal({
  isOpen,
  onClose,
  currentTier,
}: DonorModalProps) {
  if (!isOpen) return null;

  const isDonorOrAdmin = currentTier === 'donor' || currentTier === 'admin';

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
            <h3 className="text-lg font-bold text-white tracking-tight">EXPENSIO Donor Tier</h3>
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

        {/* Payment CTA (free users only): Ko-fi checkout in a new tab +
            email-matching note. The tier flip happens server-side in
            /api/webhooks/kofi — no manual tier switching in production UI. */}
        {isDonorOrAdmin ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 mt-0.5">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-emerald-300">
                You are an active Donor. Thank you for your support!
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1">
                Yearly trends, CSV & Excel exports, and edge supercharging are unlocked
                on this account{currentTier === 'admin' ? ' (Admin tier)' : ''}.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-zinc-950/50 border border-amber-500/20">
            <KofiDonorButton
              buttonClassName="btn-block bg-white text-zinc-950 border-none hover:bg-zinc-200"
              noteClassName="text-zinc-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}
