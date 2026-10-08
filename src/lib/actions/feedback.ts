'use server';

/**
 * Feedback Server Action
 * ─────────────────────────────────────────────────────────────────────────────
 * Called from FeedbackModal (client component). Validates the session and
 * payload server-side, then inserts into `public.feedback` using the SSR
 * anon client — RLS (`auth.uid() = user_id`) is the second line of defence.
 */

import { createClient } from '@/lib/supabase/server';

export interface FeedbackInput {
  message: string;
  rating: number | null;
  page?: string;
}

export interface FeedbackResult {
  ok: boolean;
  error?: string;
}

export async function submitFeedback(input: FeedbackInput): Promise<FeedbackResult> {
  const supabase = await createClient();

  // 1. Must be an authenticated session (never trust the client payload)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: 'You must be signed in to submit feedback.' };
  }

  // 2. Validate server-side (mirrors the DB CHECK constraints)
  const message = (input.message || '').trim();
  if (message.length < 3 || message.length > 2000) {
    return { ok: false, error: 'Feedback must be between 3 and 2000 characters.' };
  }

  const rating =
    typeof input.rating === 'number' &&
    Number.isInteger(input.rating) &&
    input.rating >= 1 &&
    input.rating <= 5
      ? input.rating
      : null;

  // 3. Insert with the session-bound client — RLS enforces user_id = auth.uid()
  const { error } = await supabase.from('feedback').insert({
    user_id: user.id,
    message,
    rating,
    page: input.page?.slice(0, 100) ?? null,
  });

  if (error) {
    console.error('[Expansio] submitFeedback failed:', {
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return { ok: false, error: 'Could not save your feedback. Please try again.' };
  }

  return { ok: true };
}
