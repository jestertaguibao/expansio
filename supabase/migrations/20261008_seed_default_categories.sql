-- Expansio migration: seed default categories for every new account
-- ─────────────────────────────────────────────────────────────────────────────
-- Fires directly on INSERT into auth.users — i.e. the moment a new user signs
-- up (email/password OR Google OAuth) — and seeds starter Income + Expense
-- categories owned by the new user, so no dashboard ever starts empty.
--
-- Apply with:  npx supabase db push      (or paste into the SQL Editor)
-- Idempotent:  safe to re-run; skips seeding if the user already has
--              categories (e.g. created via the dashboard UI first).

create or replace function public.seed_default_categories()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.categories where user_id = new.id) then
    insert into public.categories (user_id, name, type)
    values
      (new.id, 'Salary',                  'income'),
      (new.id, 'Freelance & Client Pay',  'income'),
      (new.id, 'Food & Groceries',        'expense'),
      (new.id, 'Rent & Utilities',        'expense'),
      (new.id, 'Loan Repayment',          'expense'),
      (new.id, 'Transport & Fuel',        'expense');
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_seed_categories on auth.users;

create trigger on_auth_user_created_seed_categories
  after insert on auth.users
  for each row
  execute function public.seed_default_categories();
