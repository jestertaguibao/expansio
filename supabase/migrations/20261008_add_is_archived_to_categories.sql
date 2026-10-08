-- Expansio migration: soft-delete support for categories
-- ─────────────────────────────────────────────────────────────────────────────
-- Adds an `is_archived` flag to public.categories so users can "delete" a
-- category WITHOUT removing the row. Historical expenses keep their
-- category_id FK, so the ledger can still resolve and display the archived
-- category's name for past transactions. No rows are dropped or hard-deleted.
--
-- Apply with:  npx supabase db push      (or paste into the SQL Editor)
-- Idempotent:  safe to re-run.

-- 1. Add the column (default false → brand-new rows are active by default).
alter table public.categories
  add column if not exists is_archived boolean not null default false;

-- 2. Backfill any pre-existing rows (a fresh add column already defaults to
--    false via the NOT NULL DEFAULT, but this is belt-and-suspenders for rows
--    added before the column existed).
update public.categories
  set is_archived = false
  where is_archived is null;

comment on column public.categories.is_archived is
  'Soft delete flag. true = archived/hidden from category pickers but retained for historical transactions.';

-- 3. Performance index: pickers query active categories per owner.
create index if not exists categories_user_archived_idx
  on public.categories (user_id, is_archived);
