export type UserTier = 'free' | 'donor' | 'admin';

export interface Profile {
  id: string;
  tier: UserTier;
  currency: string; // ISO-4217 code, defaults to 'USD'
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string | null;
  name: string;
  type: 'expense' | 'income';
  created_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  expense_date: string; // YYYY-MM-DD
  notes: string | null;
  created_at?: string;
  updated_at?: string;
  // joined category
  categories?: Category | null;
}

export type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface FilterState {
  timeFilter: TimeFilter;
  selectedDate: string; // reference ISO date string (e.g. today)
  categoryFilter: string | 'all';
  typeFilter: 'all' | 'expense' | 'income';
  searchQuery: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  rating: number | null; // 1..5
  message: string;
  page: string | null;
  created_at: string;
}
