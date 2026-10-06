import React, { Suspense } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Expansio - Excel-like Expense Ledger',
  description: 'Create an account on Expansio.',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-base-200">
      <Suspense fallback={<div className="text-base-content/60 text-sm">Loading sign up...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
