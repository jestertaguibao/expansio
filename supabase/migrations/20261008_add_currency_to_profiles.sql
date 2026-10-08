-- Expansio migration: account currency preference
-- ─────────────────────────────────────────────────────────────────────────────
-- Adds a `currency` column to `profiles` so every account can format ledger
-- amounts in its preferred ISO-4217 code. Existing rows default to 'USD'.
--
-- Apply with:  npx supabase db push   (or paste into the SQL Editor)
-- Idempotent:  safe to re-run.

alter table public.profiles
  add column if not exists currency varchar(3) not null default 'USD';

-- Constrain to 3-letter ISO codes (e.g. USD, EUR, NGN, PHP, INR)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_currency_iso_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_currency_iso_check
      check (currency ~ '^[A-Z]{3}$');
  end if;
end $$;

comment on column public.profiles.currency is 'ISO-4217 currency code used to format ledger amounts for this account.';
