import React, { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Expansio - Excel-like Expense Ledger',
  description: 'Sign in to your Expansio ledger account.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-base-200">
      <Suspense fallback={<div className="text-base-content/60 text-sm">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
