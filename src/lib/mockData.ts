import { Category, Expense, Profile } from '@/types/database';

export const INITIAL_MOCK_PROFILE: Profile = {
  id: 'demo-user-123',
  tier: 'free',
  created_at: new Date().toISOString(),
};

export const INITIAL_MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', user_id: null, name: 'Salary & Client Pay', type: 'income' },
  { id: 'cat-2', user_id: null, name: 'Investments & Dividends', type: 'income' },
  { id: 'cat-3', user_id: null, name: 'Housing & Rent', type: 'expense' },
  { id: 'cat-4', user_id: null, name: 'Groceries & Food', type: 'expense' },
  { id: 'cat-5', user_id: null, name: 'Software & Cloud Services', type: 'expense' },
  { id: 'cat-6', user_id: null, name: 'Transit & Fuel', type: 'expense' },
  { id: 'cat-7', user_id: null, name: 'Healthcare & Fitness', type: 'expense' },
  { id: 'cat-8', user_id: null, name: 'Dining & Entertainment', type: 'expense' },
];

export const INITIAL_MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    user_id: 'demo-user-123',
    category_id: 'cat-1',
    amount: 5200.0,
    expense_date: new Date().toISOString().slice(0, 10),
    notes: 'Bi-weekly tech consulting payout',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    categories: INITIAL_MOCK_CATEGORIES[0],
  },
  {
    id: 'exp-2',
    user_id: 'demo-user-123',
    category_id: 'cat-3',
    amount: 1450.0,
    expense_date: new Date().toISOString().slice(0, 10),
    notes: 'Downtown apartment lease',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    categories: INITIAL_MOCK_CATEGORIES[2],
  },
  {
    id: 'exp-3',
    user_id: 'demo-user-123',
    category_id: 'cat-4',
    amount: 184.5,
    expense_date: new Date().toISOString().slice(0, 10),
    notes: 'Organic groceries & farmer market produce',
    created_at: new Date().toISOString(),
    categories: INITIAL_MOCK_CATEGORIES[3],
  },
  {
    id: 'exp-4',
    user_id: 'demo-user-123',
    category_id: 'cat-5',
    amount: 65.0,
    expense_date: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10),
    notes: 'GitHub Team & Cloudflare Workers bundle',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    categories: INITIAL_MOCK_CATEGORIES[4],
  },
  {
    id: 'exp-5',
    user_id: 'demo-user-123',
    category_id: 'cat-2',
    amount: 320.0,
    expense_date: new Date(Date.now() - 86400000 * 5).toISOString().slice(0, 10),
    notes: 'Index fund Q3 dividend distribution',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    categories: INITIAL_MOCK_CATEGORIES[1],
  },
  {
    id: 'exp-6',
    user_id: 'demo-user-123',
    category_id: 'cat-8',
    amount: 48.75,
    expense_date: new Date(Date.now() - 86400000 * 6).toISOString().slice(0, 10),
    notes: 'Specialty cafe coffee & team lunch',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    categories: INITIAL_MOCK_CATEGORIES[7],
  },
];
