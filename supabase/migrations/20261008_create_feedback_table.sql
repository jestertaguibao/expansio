-- Expansio migration: feedback table
-- ─────────────────────────────────────────────────────────────────────────────
-- Users submit feedback from the dashboard. Rows are linked to auth.users.
-- RLS: authenticated users may INSERT their own feedback and READ it back;
-- only service-role / support tooling may UPDATE.
--
-- Apply with:  npx supabase db push   (or paste into the SQL Editor)
-- Idempotent:  safe to re-run.

create table if not exists public.feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  rating      smallint check (rating between 1 and 5),
  message     text not null check (char_length(message) between 3 and 2000),
  page        text,                      -- where it was submitted from (e.g. '/dashboard')
  created_at  timestamptz not null default now()
);

create index if not exists feedback_user_id_idx   on public.feedback (user_id);
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

alter table public.feedback enable row level security;

drop policy if exists "Users can insert own feedback" on public.feedback;
create policy "Users can insert own feedback"
  on public.feedback for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can read own feedback" on public.feedback;
create policy "Users can read own feedback"
  on public.feedback for select
  to authenticated
  using (auth.uid() = user_id);
