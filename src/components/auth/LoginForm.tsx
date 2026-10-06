'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ArrowRight, Lock, Mail, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam ? 'Authentication error occurred. Please try again.' : null
  );

  const configured = isSupabaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (!configured) {
        // Fallback for immediate trial
        localStorage.setItem('expansio_demo_user', JSON.stringify({ email: email || 'demo@expansio.local' }));
        router.push('/dashboard');
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    document.cookie = 'expansio_demo_mode=true; path=/; max-age=86400; SameSite=Lax';
    localStorage.setItem('expansio_demo_user', JSON.stringify({ email: 'demo@expansio.local', tier: 'free' }));
    router.push('/dashboard');
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    if (!configured) {
      setErrorMessage('Google sign-in requires Supabase to be configured.');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.svg" alt="Expansio Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Expansio</h1>
              <p className="text-xs text-base-content/60">Excel-like Expense Ledger</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-base-content/70 mt-1">
              Sign in with your email and password to access your ledger.
            </p>
          </div>

          {errorMessage && (
            <div role="alert" className="alert alert-error mb-5">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!configured && (
            <div role="alert" className="alert alert-warning mb-5">
              <Sparkles className="w-4 h-4" />
              <div>
                <span className="font-semibold">Supabase keys not yet set in .env.local.</span>
                <p className="text-sm mt-0.5">
                  You can click below to test the full spreadsheet UI immediately, or enter credentials once configured.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email address</span>
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="divider mt-6">Or continue with</div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={!configured}
            className="btn btn-outline w-full mt-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="divider mt-4"></div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-neutral w-full btn-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Instant Demo Ledger (Sandbox)</span>
          </button>

          <div className="mt-6 text-center text-xs">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/register"
              className="link link-primary font-medium"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
