/**
 * /api/admin/users
 * ─────────────────────────────────────────────────────────────────────────────
 * Security model (two-client pattern):
 *
 *  1. SSR client  (anon key + cookies)
 *       → verifies the *requesting user's* session via auth.getUser()
 *       → queries `profiles` to confirm tier === 'admin'
 *       → also used for the PATCH update (anon key respects RLS, but the
 *         admin tier allows the write via policy)
 *
 *  2. Admin client (service role key)
 *       → used ONLY after the tier check passes
 *       → calls auth.admin.listUsers() to retrieve email addresses
 *         (only accessible with the service role key)
 *
 * GET  → returns enriched user list { id, email, tier, created_at }[]
 * PATCH → { userId, newTier } — updates a user's tier in `profiles`
 */

import { createClient as createSsrClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { UserTier } from '@/types/database';

const VALID_TIERS: UserTier[] = ['free', 'donor', 'admin'];

// ─── Shared helper: verify session + admin tier ────────────────────────────
async function requireAdminUser() {
  const ssrClient = await createSsrClient();

  // 1. Verify the caller has a valid Supabase session
  const {
    data: { user },
    error: userErr,
  } = await ssrClient.auth.getUser();

  if (userErr || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized — no valid session.' }, { status: 401 }) };
  }

  // 2. Check the profiles table to confirm tier === 'admin'
  const { data: callerProfile, error: profileErr } = await ssrClient
    .from('profiles')
    .select('tier')
    .eq('id', user.id)
    .single();

  if (profileErr) {
    console.error('[Expansio] requireAdminUser: profiles query failed:', profileErr);
    return { error: NextResponse.json({ error: 'Could not verify user tier.' }, { status: 500 }) };
  }

  if (callerProfile?.tier !== 'admin') {
    return {
      error: NextResponse.json(
        { error: 'Forbidden — admin tier required.', yourTier: callerProfile?.tier ?? 'none' },
        { status: 403 }
      ),
    };
  }

  return { user, ssrClient };
}

// ─── GET /api/admin/users ──────────────────────────────────────────────────
export async function GET() {
  try {
    // Step 1: Authenticate + authorise
    const guard = await requireAdminUser();
    if (guard.error) return guard.error;

    const { ssrClient } = guard;

    // Step 2: Fetch all profile rows (id, tier, created_at)
    const { data: profiles, error: profilesErr } = await ssrClient!
      .from('profiles')
      .select('id, tier, created_at')
      .order('created_at', { ascending: false });

    if (profilesErr) {
      console.error('[Expansio] GET /api/admin/users — profiles fetch failed:', {
        message: profilesErr.message,
        details: profilesErr.details,
        code: profilesErr.code,
      });
      return NextResponse.json(
        { error: profilesErr.message, details: profilesErr.details },
        { status: 500 }
      );
    }

    // Step 3: Use the ADMIN client (service role) to fetch auth user emails
    //         auth.admin.listUsers() requires the service_role key — the anon
    //         key will always return a 403 from Supabase's Auth API.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let authUsers: any = null;
    let authErr: Error | null = null;
    try {
      const adminClient = createAdminClient();
      const result = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
      authUsers = result.data;
      authErr = result.error ?? null;
    } catch (adminInitErr) {
      console.error('[Expansio] GET /api/admin/users — failed to initialise admin client:', adminInitErr);
    }

    if (authErr) {
      console.error('[Expansio] GET /api/admin/users — auth.admin.listUsers failed:', {
        message: (authErr as any).message,
        status: (authErr as any).status,
      });
      // Non-fatal: we still return profiles but with placeholder emails
    }

    // Step 4: Build id → email lookup map
    const emailMap: Record<string, string> = {};
    if (authUsers?.users) {
      for (const u of authUsers.users) {
        emailMap[u.id] = u.email ?? '(no email)';
      }
    }

    // Step 5: Merge profiles + emails into response payload
    const enriched = (profiles ?? []).map((p) => ({
      id: p.id,
      email: emailMap[p.id] ?? '(email unavailable)',
      tier: p.tier as UserTier,
      created_at: p.created_at,
    }));

    return NextResponse.json({ users: enriched });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Expansio] GET /api/admin/users — unexpected error:', msg);
    return NextResponse.json({ error: 'Internal server error', detail: msg }, { status: 500 });
  }
}

// ─── PATCH /api/admin/users ────────────────────────────────────────────────
export async function PATCH(request: Request) {
  try {
    // Step 1: Authenticate + authorise
    const guard = await requireAdminUser();
    if (guard.error) return guard.error;

    const { ssrClient } = guard;

    // Step 2: Parse and validate the request body
    let body: { userId?: string; newTier?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const { userId, newTier } = body;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid `userId` field.' }, { status: 400 });
    }

    if (!newTier || !VALID_TIERS.includes(newTier as UserTier)) {
      return NextResponse.json(
        { error: `Invalid \`newTier\`. Must be one of: ${VALID_TIERS.join(', ')}.` },
        { status: 400 }
      );
    }

    // Step 3: Apply the tier update via the SSR client (anon key + RLS)
    //         Admin users should have a Supabase RLS policy allowing them to
    //         UPDATE profiles for any user_id.
    //         Fallback: if RLS blocks the write, we use the admin client below.
    const { error: updateErr } = await ssrClient!
      .from('profiles')
      .update({ tier: newTier })
      .eq('id', userId);

    if (updateErr) {
      console.warn(
        '[Expansio] PATCH /api/admin/users — SSR client update blocked (possibly RLS), trying admin client:',
        { message: updateErr.message, code: updateErr.code }
      );

      // Fallback: use the service-role admin client to bypass RLS
      try {
        const adminClient = createAdminClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: adminUpdateErr } = await adminClient
          .from('profiles')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .update({ tier: newTier } as any)
          .eq('id', userId);

        if (adminUpdateErr) {
          console.error('[Expansio] PATCH /api/admin/users — admin client update also failed:', {
            message: adminUpdateErr.message,
            details: adminUpdateErr.details,
            code: adminUpdateErr.code,
          });
          return NextResponse.json(
            { error: adminUpdateErr.message, details: adminUpdateErr.details },
            { status: 500 }
          );
        }
      } catch (adminInitErr) {
        console.error('[Expansio] PATCH /api/admin/users — admin client init failed:', adminInitErr);
        return NextResponse.json({ error: 'Admin client unavailable.' }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, userId, newTier });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Expansio] PATCH /api/admin/users — unexpected error:', msg);
    return NextResponse.json({ error: 'Internal server error', detail: msg }, { status: 500 });
  }
}
