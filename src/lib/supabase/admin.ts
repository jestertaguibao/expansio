/**
 * Supabase Admin Client (Service Role)
 * ─────────────────────────────────────────────────────────────────────────────
 * This module creates a singleton Supabase client that uses the SERVICE ROLE
 * key (`SUPABASE_SECRET_KEY`). This key bypasses Row Level Security and grants
 * full access to auth.admin APIs (e.g. listUsers).
 *
 * ⚠️  NEVER import this file from client components or expose it to the browser.
 *     It MUST only be used inside:
 *       - Next.js Route Handlers  (src/app/api/*)
 *       - Server Actions          (server-only files)
 *       - Next.js Middleware      (src/middleware.ts)
 *
 * The service role key is stored ONLY in .env.local as SUPABASE_SECRET_KEY
 * and is NEVER prefixed with NEXT_PUBLIC_, so it is never bundled client-side.
 */

import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      '[Expansio] Admin client: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY is missing ' +
        'from environment variables. Add both to .env.local.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // Disable auto session detection — this client is purely server-side
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

// Lazily created singleton — one instance per cold start / per worker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _adminClient: any = null;

export function createAdminClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!_adminClient) {
    _adminClient = getAdminClient();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return _adminClient as ReturnType<typeof getAdminClient>;
}
