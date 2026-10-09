'use client';

import React from 'react';
import { UserTier } from '@/types/database';
import { Crown, Sparkles, LogOut, Database, Shield, Tags, Settings2, MessageSquareHeart, Wallet } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TopNavigationProps {
  userEmail: string | null;
  userTier: UserTier;
  onOpenDonorModal: () => void;
  onOpenCategoryModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenFeedbackModal: () => void;
  onTierChange?: (tier: UserTier) => void;
}

export default function TopNavigation({
  userEmail,
  userTier,
  onOpenDonorModal,
  onOpenCategoryModal,
  onOpenSettingsModal,
  onOpenFeedbackModal,
  onTierChange,
}: TopNavigationProps) {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const isAdmin = userTier === 'admin';

  const handleSignOut = async () => {
    if (configured) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    document.cookie = 'expansio_demo_mode=; path=/; max-age=0;';
    localStorage.removeItem('expansio_demo_user');
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="navbar bg-base-100 shadow-sm sticky top-0 z-30">
      <div className="navbar-start">
        {/* Brand group: icon tile + title/subtitle locked together on the left. */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-1.5 rounded-lg shadow-sm flex shrink-0">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 whitespace-nowrap font-bold text-base tracking-tight text-slate-800">EXPENSIO</span>
              {/* Version + tagline are secondary titles: never render them on mobile. */}
              <span className="badge badge-ghost badge-sm hidden font-mono text-slate-500 sm:inline-flex">v1.0</span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal hidden sm:block">Excel-like Expense Ledger</p>
          </div>
        </div>
      </div>

      {/* Infra status telemetry (Supabase live / demo mode) — admin eyes only. */}
      {isAdmin && (
        <div className="navbar-center hidden lg:flex">
          {configured ? (
            <div className="badge badge-success gap-1 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Live</span>
            </div>
          ) : (
            <div className="badge badge-warning gap-1 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Demo Mode</span>
            </div>
          )}
        </div>
      )}

      <div className="navbar-end flex-1 min-w-0 justify-end gap-1 sm:gap-2">
        {/* Admin Panel Link — only visible to admins */}
        {isAdmin && (
          <Link
            href="/admin/users"
            className="btn btn-sm btn-ghost text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">User Management</span>
            <span className="lg:hidden">Admin</span>
          </Link>
        )}

        <button
          type="button"
          onClick={onOpenCategoryModal}
          className="btn btn-sm btn-ghost max-sm:w-8 max-sm:px-0 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          title="Categories"
        >
          <Tags className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Categories</span>
        </button>

        {/* Account Settings (currency, preferences) */}
        <button
          type="button"
          onClick={onOpenSettingsModal}
          className="btn btn-sm btn-ghost max-sm:w-8 max-sm:px-0 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          title="Account Settings"
        >
          <Settings2 className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Settings</span>
        </button>

        {/* Feedback */}
        <button
          type="button"
          onClick={onOpenFeedbackModal}
          className="btn btn-sm btn-ghost max-sm:w-8 max-sm:px-0 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          title="Send Feedback"
        >
          <MessageSquareHeart className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Feedback</span>
        </button>

        {/* Tier Badge / Upgrade trigger */}
        <button
          type="button"
          onClick={onOpenDonorModal}
          className={`btn btn-sm gap-1.5 ${
            userTier === 'donor'
              ? 'btn-warning'
              : userTier === 'admin'
              ? 'btn-info'
              : 'btn-ghost text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span className="capitalize hidden sm:inline">{userTier} Tier</span>
          <span className="capitalize sm:hidden">{userTier}</span>
          {userTier === 'free' && (
            <span className="badge badge-warning badge-xs">Upgrade</span>
          )}
        </button>

        {/* User Email & Sign Out */}
        <div className="flex items-center gap-2 pl-2 border-l border-base-300">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-medium text-slate-700 truncate max-w-[140px]">
              {userEmail || 'demo-user'}
            </span>
            <span className="text-[10px] font-mono text-slate-500 capitalize">{userTier} Plan</span>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="btn btn-sm btn-ghost btn-circle text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
