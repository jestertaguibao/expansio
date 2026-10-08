/**
 * POST /api/webhooks/kofi
 * ─────────────────────────────────────────────────────────────────────────────
 * Ko-fi webhook receiver — upgrades paying donors to the 'donor' tier.
 *
 * Ko-fi sends `application/x-www-form-urlencoded` with a single `data` form
 * field containing a JSON string shaped roughly like:
 *   {
 *     "type": "donation" | "subscription" | "purchase" | "commission_request" | "member",
 *     "verification_token": "<shared secret configured in Ko-fi, optional>",
 *     "payload": {
 *       "transaction_id": "...", "from_email": "donor@example.com",
 *       "from_name": "...", "amount_price": "5.00", "amount_currency": "USD", ...
 *     }
 *   }
 *
 * Security model:
 *   - Uses the SERVICE-ROLE admin client (SUPABASE_SECRET_KEY in
 *     src/lib/supabase/admin.ts) to bypass RLS — auth.admin.listUsers() and
 *     cross-user profile writes are only possible with it.
 *   - If KOFI_WEBHOOK_SECRET is set in .env.local, every request must present
 *     a matching `verification_token`; otherwise the route is trivially
 *     spoofable, so set it in production (Ko-fi → Manage Webhooks → Shared Secret).
 *   - Tier value is 'donor' (see UserTier in src/types/database.ts and the
 *     VALID_TIERS check in /api/admin/users) — NOT 'donator'.
 *
 * Always returns 200 for handled-but-ignored events so Ko-fi does not retry;
 * returns 4xx only for genuinely malformed/unauthorised requests.
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Events that represent money changing hands and therefore entitlement
const UPGRADE_EVENT_TYPES = ['donation', 'subscription', 'purchase', 'member'];

// Tier granted to verified Ko-fi payers (must match UserTier union)
const DONOR_TIER = 'donor';

interface KofiPayload {
  transaction_id?: string;
  from_email?: string | null;
  from_name?: string | null;
  amount_price?: string | number;
  amount_currency?: string;
}

interface KofiWebhookData {
  type?: string;
  verification_token?: string;
  payload?: KofiPayload;
}

export async function POST(request: Request) {
  try {
    // ── 1. Ko-fi posts form-urlencoded; the JSON lives in the `data` field ──
    const contentType = request.headers.get('content-type') ?? '';
    let data: KofiWebhookData;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      const raw = formData.get('data');
      if (typeof raw !== 'string') {
        return NextResponse.json({ error: 'Missing `data` form field.' }, { status: 400 });
      }
      try {
        data = JSON.parse(raw) as KofiWebhookData;
      } catch {
        return NextResponse.json({ error: '`data` is not valid JSON.' }, { status: 400 });
      }
    } else {
      // Tolerate JSON bodies (manual testing / future Ko-fi changes)
      const jsonBody = (await request.json().catch(() => null)) as KofiWebhookData | null;
      if (!jsonBody) {
        return NextResponse.json({ error: 'Unreadable body.' }, { status: 400 });
      }
      data = jsonBody;
    }

    // ── 2. Shared-secret verification ────────────────────────────────────────
    const webhookSecret = process.env.KOFI_WEBHOOK_SECRET;
    if (webhookSecret && data.verification_token !== webhookSecret) {
      console.warn('[Expansio] kofi webhook — verification_token mismatch, rejecting.');
      return NextResponse.json({ error: 'Invalid verification token.' }, { status: 401 });
    }
    if (!webhookSecret) {
      console.warn(
        '[Expansio] kofi webhook — KOFI_WEBHOOK_SECRET is not set; anyone who knows ' +
          'this URL could upgrade accounts. Configure the shared secret in Ko-fi and .env.local.'
      );
    }

    // ── 3. Only act on money events ──────────────────────────────────────────
    if (!data.type || !UPGRADE_EVENT_TYPES.includes(data.type)) {
      return NextResponse.json({ ok: true, ignored: `event type '${data.type}'` });
    }

    const email = (data.payload?.from_email ?? '').trim().toLowerCase();
    if (!email || email === 'anonymous@ko-fi.com') {
      // Anonymous donations can't be matched to an account — nothing to do.
      return NextResponse.json({ ok: true, ignored: 'no payer email on the transaction' });
    }

    // ── 4. Resolve the payer to a Supabase auth user (service role) ─────────
    const admin = createAdminClient();

    const { data: authData, error: listErr } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (listErr || !authData?.users) {
      console.error('[Expansio] kofi webhook — listUsers failed:', listErr?.message);
      return NextResponse.json({ error: 'User lookup failed.' }, { status: 500 });
    }

    const match = authData.users.find(
      (u) => (u.email ?? '').trim().toLowerCase() === email
    );

    if (!match) {
      // Not an account holder — return 200 so Ko-fi doesn't retry-loop,
      // and don't leak whether the email exists in our system.
      console.log(`[Expansio] kofi webhook — no account for payer, tier not changed. tx=${data.payload?.transaction_id ?? 'n/a'}`);
      return NextResponse.json({ ok: true, status: 'no-matching-account' });
    }

    // ── 5. Upgrade profiles.tier → 'donor' (create row if trigger missed it) ─
    const { data: updated, error: updateErr } = await admin
      .from('profiles')
      .update({ tier: DONOR_TIER })
      .eq('id', match.id)
      .select('id, tier');

    if (updateErr) {
      console.error('[Expansio] kofi webhook — profile update failed:', updateErr.message);
      return NextResponse.json({ error: 'Profile update failed.' }, { status: 500 });
    }

    if (!updated || updated.length === 0) {
      // Rare: auth user exists but the handle_new_user profile trigger didn't fire
      const { error: insertErr } = await admin
        .from('profiles')
        .insert({ id: match.id, tier: DONOR_TIER });

      if (insertErr) {
        console.error('[Expansio] kofi webhook — profile insert fallback failed:', insertErr.message);
        return NextResponse.json({ error: 'Profile creation failed.' }, { status: 500 });
      }
    }

    console.log(
      `[Expansio] kofi webhook — upgraded ${email} to '${DONOR_TIER}'. ` +
        `tx=${data.payload?.transaction_id ?? 'n/a'} ` +
        `amount=${data.payload?.amount_price ?? '?'} ${data.payload?.amount_currency ?? ''}`
    );

    return NextResponse.json({ ok: true, status: 'upgraded', tier: DONOR_TIER });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Expansio] POST /api/webhooks/kofi — unexpected error:', msg);
    // 500 (not 200) on real failures so Ko-fi retries the delivery
    return NextResponse.json({ error: 'Internal server error', detail: msg }, { status: 500 });
  }
}
