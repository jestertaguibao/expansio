'use server';

/**
 * Category soft-delete Server Actions
 * ─────────────────────────────────────────────────────────────────────────────
 * "Deleting" a category is a SOFT delete: we flip `is_archived` to true instead
 * of running a DELETE, so historical expenses keep their category_id FK and the
 * ledger can still resolve the archived name for past transactions.
 *
 * Called from DashboardShell handlers (client). Validates the session server-side
 * and scopes the write to the owner; RLS (auth.uid() = user_id) is the second
 * line of defence.
 */

import { createClient } from '@/lib/supabase/server';

export interface CategoryMutationResult {
  ok: boolean;
  error?: string;
}

/** Archive (soft-delete) one of the current user's categories. */
export async function archiveCategory(categoryId: string): Promise<CategoryMutationResult> {
  return setCategoryArchived(categoryId, true);
}

/** Restore an archived category back into the active picker. */
export async function reactivateCategory(categoryId: string): Promise<CategoryMutationResult> {
  return setCategoryArchived(categoryId, false);
}

async function setCategoryArchived(
  categoryId: string,
  archived: boolean
): Promise<CategoryMutationResult> {
  if (!categoryId) {
    return { ok: false, error: 'Missing category id.' };
  }

  const supabase = await createClient();

  // Never trust the client payload — require an authenticated session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: 'You must be signed in to manage categories.' };
  }

  // UPDATE (not DELETE). Scoped to the owner so a crafted id can't touch
  // another user's row even if RLS were misconfigured. `count: 'exact'` lets us
  // detect a no-op (wrong id / not owned) via a 0 affected-row result.
  const { error, count } = await supabase
    .from('categories')
    .update({ is_archived: archived }, { count: 'exact' })
    .eq('id', categoryId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[Expansio] setCategoryArchived failed:', {
      message: error.message,
      code: error.code,
      details: error.details,
    });
    return { ok: false, error: 'Could not update the category. Please try again.' };
  }

  if (count === 0) {
    return { ok: false, error: 'Category not found for this account.' };
  }

  return { ok: true };
}
