import React, { Suspense } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Expansio - Excel-like Expense Ledger',
  description: 'Manage your personal and business expenses with spreadsheet speed.',
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
          Loading Expansio ledger...
        </div>
      }
    >
      <DashboardShell />
    </Suspense>
  );
}
