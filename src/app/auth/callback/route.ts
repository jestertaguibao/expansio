import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      // Log for debugging (production-safe - no secrets)
      console.log('[Auth Callback] OAuth exchange result:', {
        hasSession: !!data?.session,
        error: error?.message,
        codePresent: !!code,
      });

      if (!error) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      } else {
        console.error('[Auth Callback] OAuth exchange error:', error.message);
      }
    } catch (exception) {
      console.error('[Auth Callback] Exception during OAuth flow:', exception);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login?error=auth-code-error', requestUrl.origin));
}
