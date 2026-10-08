import React, { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Account',
  description: 'Create a free EXPENSIO account and start tracking income and expenses with spreadsheet speed.',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-emerald-50 via-slate-50 to-white">
      <Suspense fallback={<div className="text-base-content/60 text-sm">Loading sign up...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
