'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { UserTier } from '@/types/database';
import {
  Shield,
  Users,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Crown,
  ChevronDown,
  Check,
  User,
  Calendar,
  Search,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

interface AdminUser {
  id: string;
  email: string;
  tier: UserTier;
  created_at: string;
}

const TIER_COLORS: Record<UserTier, string> = {
  free: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  donor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  admin: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
};

const TIER_ICONS: Record<UserTier, React.ReactNode> = {
  free: <User className="w-3 h-3" />,
  donor: <Crown className="w-3 h-3 text-amber-400" />,
  admin: <Shield className="w-3 h-3 text-indigo-400" />,
};

export default function AdminUsersView() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      const body = await res.json();
      setUsers(body.users ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!configured) {
      setError('Live Supabase is required for Admin features. Please add your keys to .env.local.');
      setLoading(false);
      return;
    }

    // Verify caller is an admin before showing the view
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/login');
        return;
      }
      setCurrentUserId(user.id);
      const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single();

      if (profile?.tier !== 'admin') {
        router.replace('/dashboard');
        return;
      }
      loadUsers();
    })();
  }, [configured, loadUsers, router]);

  const handleTierChange = async (userId: string, newTier: UserTier) => {
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newTier }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || 'Update failed');
      }
      // Optimistic local update
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, tier: newTier } : u))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.tier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tier stats
  const tierCounts = users.reduce(
    (acc, u) => {
      acc[u.tier] = (acc[u.tier] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Background Grid */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Page Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white">Admin Panel</h1>
                <p className="text-[11px] text-zinc-400">User & Tier Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadUsers}
              disabled={loading}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh users"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              href="/dashboard"
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-4 h-4 text-zinc-400" />}
            label="Total Users"
            value={users.length}
            color="zinc"
          />
          <StatCard
            icon={<User className="w-4 h-4 text-zinc-400" />}
            label="Free Tier"
            value={tierCounts['free'] ?? 0}
            color="zinc"
          />
          <StatCard
            icon={<Crown className="w-4 h-4 text-amber-400" />}
            label="Donor Tier"
            value={tierCounts['donor'] ?? 0}
            color="amber"
          />
          <StatCard
            icon={<Shield className="w-4 h-4 text-indigo-400" />}
            label="Admin Tier"
            value={tierCounts['admin'] ?? 0}
            color="indigo"
          />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search + Table */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Table Toolbar */}
          <div className="px-5 py-3 border-b border-zinc-800/80 bg-zinc-950/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>PROFILES TABLE</span>
              </div>
              <span className="text-xs text-zinc-400 hidden sm:inline">
                {filteredUsers.length} of {users.length} users
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by email or tier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-56"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/50 text-[10px] text-zinc-500 uppercase tracking-wider">
                  <th className="px-5 py-3 font-normal w-8">#</th>
                  <th className="px-5 py-3 font-normal">Email</th>
                  <th className="px-4 py-3 font-normal">Current Tier</th>
                  <th className="px-4 py-3 font-normal">Signed Up</th>
                  <th className="px-4 py-3 font-normal w-48">Change Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-zinc-500">
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                        <span>Loading users from Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                      {searchQuery ? 'No users match your search.' : 'No users found in profiles table.'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => (
                    <UserRow
                      key={u.id}
                      user={u}
                      index={idx + 1}
                      isCurrentUser={u.id === currentUserId}
                      isUpdating={updatingId === u.id}
                      onTierChange={handleTierChange}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'zinc' | 'amber' | 'indigo';
}) {
  const colorStyles = {
    zinc: 'border-zinc-800 hover:border-zinc-700',
    amber: 'border-zinc-800 hover:border-amber-500/30',
    indigo: 'border-zinc-800 hover:border-indigo-500/30',
  };

  return (
    <div
      className={`bg-zinc-900/80 border ${colorStyles[color]} rounded-2xl p-4 shadow-md transition-all`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
    </div>
  );
}

function UserRow({
  user,
  index,
  isCurrentUser,
  isUpdating,
  onTierChange,
}: {
  user: AdminUser;
  index: number;
  isCurrentUser: boolean;
  isUpdating: boolean;
  onTierChange: (id: string, tier: UserTier) => void;
}) {
  const [open, setOpen] = useState(false);
  const tiers: UserTier[] = ['free', 'donor', 'admin'];

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <tr className="hover:bg-zinc-800/30 transition-colors group relative">
      <td className="px-5 py-3 text-zinc-500 font-mono text-[11px] select-none">{index}</td>

      {/* Email */}
      <td className="px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0 text-[10px] font-bold uppercase">
            {user.email?.[0] ?? '?'}
          </div>
          <div>
            <span className="font-medium text-zinc-200 text-xs">{user.email}</span>
            {isCurrentUser && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                You
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Current Tier Badge */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${TIER_COLORS[user.tier]}`}
        >
          {TIER_ICONS[user.tier]}
          {user.tier}
        </span>
      </td>

      {/* Signed Up */}
      <td className="px-4 py-3 text-zinc-400 font-mono text-[11px]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-zinc-600" />
          {formatDate(user.created_at)}
        </div>
      </td>

      {/* Tier Change Dropdown */}
      <td className="px-4 py-3">
        <div className="relative">
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => setOpen((prev) => !prev)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all w-full justify-between cursor-pointer ${
              isUpdating
                ? 'bg-zinc-800/50 text-zinc-500 border-zinc-700 opacity-60'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
            }`}
          >
            {isUpdating ? (
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                <span className="capitalize">{user.tier}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500 shrink-0" />
              </>
            )}
          </button>

          {open && !isUpdating && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-36 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-1 overflow-hidden">
                {tiers.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (t !== user.tier) onTierChange(user.id, t);
                    }}
                    className={`flex items-center justify-between gap-2 w-full px-3 py-2 text-xs font-medium transition-colors capitalize cursor-pointer ${
                      t === user.tier
                        ? 'text-emerald-400 bg-emerald-500/5'
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {TIER_ICONS[t]}
                      {t}
                    </span>
                    {t === user.tier && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
