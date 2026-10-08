'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Category, Expense, Profile, TimeFilter, UserTier } from '@/types/database';
import {
  INITIAL_MOCK_CATEGORIES,
  INITIAL_MOCK_EXPENSES,
  INITIAL_MOCK_PROFILE,
} from '@/lib/mockData';
import {
  filterExpensesByTime,
  getTodayDateString,
  exportExpensesToCsv,
} from '@/lib/utils';
import TopNavigation from './TopNavigation';
import MetricCards from './MetricCards';
import SidebarFilters from './SidebarFilters';
import SpreadsheetLedger from './SpreadsheetLedger';
import DonorModal from './DonorModal';
import CategoryModal from './CategoryModal';
import SettingsModal from './SettingsModal';
import FeedbackModal from './FeedbackModal';
import EnvConfigBanner from './EnvConfigBanner';

export default function DashboardShell() {
  const configured = isSupabaseConfigured();

  // Profile & User State
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<UserTier>('free');
  const [currency, setCurrency] = useState<string>('USD');

  // Ledger Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Saving states per row (e.g. { 'exp-1': 'saving' | 'saved' | 'error' })
  const [savingRowIds, setSavingRowIds] = useState<Record<string, 'saving' | 'saved' | 'error'>>({});

  // Filter States
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>('monthly');
  const [referenceDate, setReferenceDate] = useState<string>(getTodayDateString());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [donorModalOpen, setDonorModalOpen] = useState<boolean>(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);

  // Excel export (server-backed) in-flight flag
  const [excelExporting, setExcelExporting] = useState<boolean>(false);

  // Debounce timers for inline saving
  const saveTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Initialize data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      if (!configured) {
        // Load demo data
        const savedDemo = localStorage.getItem('expansio_demo_user');
        if (savedDemo) {
          try {
            const parsed = JSON.parse(savedDemo);
            setUserEmail(parsed.email || 'demo@expansio.local');
            if (parsed.tier) setUserTier(parsed.tier);
          } catch {}
        } else {
          setUserEmail('demo@expansio.local');
        }

        const savedCurrency = localStorage.getItem('expansio_currency');
        if (savedCurrency) setCurrency(savedCurrency);

        const savedExpenses = localStorage.getItem('expansio_mock_expenses');
        if (savedExpenses) {
          try {
            setExpenses(JSON.parse(savedExpenses));
          } catch {
            setExpenses(INITIAL_MOCK_EXPENSES);
          }
        } else {
          setExpenses(INITIAL_MOCK_EXPENSES);
        }

        const savedCategories = localStorage.getItem('expansio_mock_categories');
        if (savedCategories) {
          try {
            setCategories(JSON.parse(savedCategories));
          } catch {
            setCategories(INITIAL_MOCK_CATEGORIES);
          }
        } else {
          setCategories(INITIAL_MOCK_CATEGORIES);
        }

        setIsLoading(false);
        return;
      }

      // Live Supabase Mode
      try {
        const supabase = createClient();

        // 1. Get authenticated user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          // If not logged in, fallback gracefully
          setUserEmail('guest@expansio.local');
          setIsLoading(false);
          return;
        }

        setUserEmail(user.email ?? null);
        setUserId(user.id);

        // 2. Fetch profile tier + currency preference
        const { data: profileData } = await supabase
          .from('profiles')
          .select('tier, currency')
          .eq('id', user.id)
          .single();

        if (profileData?.tier) {
          setUserTier(profileData.tier as UserTier);
        }
        if (profileData?.currency) {
          setCurrency(profileData.currency as string);
        }

        // 3. Fetch categories (global or user specific)
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (!catError && catData && catData.length > 0) {
          setCategories(catData);
        } else {
          // If no categories yet in db, provide defaults
          setCategories(INITIAL_MOCK_CATEGORIES);
        }

        // 4. Fetch expenses with joined category
        const { data: expData, error: expError } = await supabase
          .from('expenses')
          .select('*, categories(*)')
          .order('expense_date', { ascending: false })
          .order('created_at', { ascending: false });

        if (!expError && expData) {
          setExpenses(expData);
        }
      } catch (err) {
        console.error('Error fetching Supabase data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [configured]);

  // Persist demo changes to localStorage
  const persistDemoExpenses = (newExpenses: Expense[]) => {
    if (!configured) {
      localStorage.setItem('expansio_mock_expenses', JSON.stringify(newExpenses));
    }
  };

  const persistDemoCategories = (newCategories: Category[]) => {
    if (!configured) {
      localStorage.setItem('expansio_mock_categories', JSON.stringify(newCategories));
    }
  };

  // Perform background auto-save to Supabase
  const executeSaveToSupabase = useCallback(
    async (id: string, updates: Partial<Expense>) => {
      setSavingRowIds((prev) => ({ ...prev, [id]: 'saving' }));

      if (!configured) {
        // Simulated latency for smooth feedback
        await new Promise((r) => setTimeout(r, 300));
        setSavingRowIds((prev) => ({ ...prev, [id]: 'saved' }));
        setTimeout(() => {
          setSavingRowIds((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }, 1200);
        return;
      }

      try {
        const supabase = createClient();
        // Prepare DB fields (exclude client joined category object)
        const dbPayload: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };

        if (updates.amount !== undefined) dbPayload.amount = updates.amount;
        if (updates.expense_date !== undefined) dbPayload.expense_date = updates.expense_date;
        if (updates.category_id !== undefined) dbPayload.category_id = updates.category_id;
        if (updates.notes !== undefined) dbPayload.notes = updates.notes;

        const { error } = await supabase.from('expenses').update(dbPayload).eq('id', id);

        if (error) {
          console.error('Supabase update error:', error);
          setSavingRowIds((prev) => ({ ...prev, [id]: 'error' }));
        } else {
          setSavingRowIds((prev) => ({ ...prev, [id]: 'saved' }));
          setTimeout(() => {
            setSavingRowIds((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          }, 1200);
        }
      } catch (err) {
        console.error('Error auto-saving expense:', err);
        setSavingRowIds((prev) => ({ ...prev, [id]: 'error' }));
      }
    },
    [configured]
  );

  // Inline update handler (called on input change / blur)
  const handleUpdateExpense = async (id: string, updates: Partial<Expense>) => {
    // 1. Optimistic UI update
    setExpenses((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const nextItem = { ...item, ...updates };
          // If category_id changed, sync joined categories object
          if (updates.category_id) {
            const matchedCategory = categories.find((c) => c.id === updates.category_id);
            if (matchedCategory) {
              nextItem.categories = matchedCategory;
            }
          }
          return nextItem;
        }
        return item;
      });
      persistDemoExpenses(updated);
      return updated;
    });

    // 2. Debounce auto-save by 400ms for text inputs or immediate for selects
    if (saveTimeoutRef.current[id]) {
      clearTimeout(saveTimeoutRef.current[id]);
    }

    saveTimeoutRef.current[id] = setTimeout(() => {
      executeSaveToSupabase(id, updates);
    }, 350);
  };

  // Add new row handler
  const handleAddRow = async () => {
    const defaultCat = categories[0] || null;
    const tempId = `exp-${Date.now()}`;
    const newDate = referenceDate || getTodayDateString();

    const newExpense: Expense = {
      id: tempId,
      user_id: userId || 'demo-user-123',
      // Guard: never pass an empty string "" for a UUID column — use null
      category_id: defaultCat?.id || null,
      amount: 0,
      expense_date: newDate,
      notes: '',
      created_at: new Date().toISOString(),
      categories: defaultCat,
    };

    // Optimistically insert row at top of ledger
    setExpenses((prev) => {
      const updated = [newExpense, ...prev];
      persistDemoExpenses(updated);
      return updated;
    });

    if (!configured) {
      setSavingRowIds((prev) => ({ ...prev, [tempId]: 'saved' }));
      setTimeout(() => {
        setSavingRowIds((prev) => {
          const next = { ...prev };
          delete next[tempId];
          return next;
        });
      }, 1200);
      return;
    }

    // Must have a real user_id before inserting — RLS will reject anonymous writes
    if (!userId) {
      console.error('[Expansio] handleAddRow: userId is null, cannot insert expense without authenticated user.');
      setSavingRowIds((prev) => ({ ...prev, [tempId]: 'error' }));
      return;
    }

    try {
      setSavingRowIds((prev) => ({ ...prev, [tempId]: 'saving' }));
      const supabase = createClient();

      const insertPayload: Record<string, unknown> = {
        user_id: userId,                           // explicit, never null
        category_id: defaultCat?.id ?? null,       // null-safe: no empty string
        amount: 0,
        expense_date: newDate,
        notes: '',
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert(insertPayload)
        .select('*, categories(*)')
        .single();

      if (error) {
        // Log full Supabase error details (message + details + hint + code)
        console.error('[Expansio] Error inserting expense into Supabase:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          full: error,
        });
        setSavingRowIds((prev) => ({ ...prev, [tempId]: 'error' }));
        // Roll back optimistic row on failure
        setExpenses((prev) => prev.filter((e) => e.id !== tempId));
      } else if (data) {
        // Swap temp ID with live Supabase UUID
        setExpenses((prev) =>
          prev.map((e) => (e.id === tempId ? { ...data, categories: data.categories || defaultCat } : e))
        );
        setSavingRowIds((prev) => ({ ...prev, [data.id]: 'saved' }));
        setTimeout(() => {
          setSavingRowIds((prev) => {
            const next = { ...prev };
            delete next[data.id];
            return next;
          });
        }, 1200);
      }
    } catch (err: unknown) {
      console.error('[Expansio] Unexpected error in handleAddRow:', err);
      setSavingRowIds((prev) => ({ ...prev, [tempId]: 'error' }));
      setExpenses((prev) => prev.filter((e) => e.id !== tempId));
    }
  };

  // Delete row handler
  const handleDeleteExpense = async (id: string) => {
    setExpenses((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      persistDemoExpenses(filtered);
      return filtered;
    });

    if (configured) {
      try {
        const supabase = createClient();
        await supabase.from('expenses').delete().eq('id', id);
      } catch (err) {
        console.error('Error deleting expense:', err);
      }
    }
  };

  // Add custom category
  const handleAddCategory = async (name: string, type: 'expense' | 'income') => {
    const tempId = `cat-${Date.now()}`;
    const newCategory: Category = {
      id: tempId,
      user_id: userId,
      name,
      type,
      created_at: new Date().toISOString(),
    };

    if (!configured) {
      const nextCategories = [...categories, newCategory];
      setCategories(nextCategories);
      persistDemoCategories(nextCategories);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name,
        type,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    } else if (data) {
      setCategories((prev) => [...prev, data]);
    }
  };

  // Seed standard starter categories
  const handleSeedDefaultCategories = async () => {
    const starterList: { name: string; type: 'expense' | 'income' }[] = [
      { name: 'Salary & Client Pay', type: 'income' },
      { name: 'Investments & Dividends', type: 'income' },
      { name: 'Housing & Rent', type: 'expense' },
      { name: 'Groceries & Food', type: 'expense' },
      { name: 'Software & Cloud Services', type: 'expense' },
      { name: 'Transit & Fuel', type: 'expense' },
      { name: 'Healthcare & Fitness', type: 'expense' },
      { name: 'Dining & Entertainment', type: 'expense' },
    ];

    if (!configured) {
      const seeded: Category[] = starterList.map((item, idx) => ({
        id: `cat-seed-${idx}`,
        user_id: null,
        name: item.name,
        type: item.type,
        created_at: new Date().toISOString(),
      }));
      setCategories(seeded);
      persistDemoCategories(seeded);
      return;
    }

    const supabase = createClient();
    const rowsToInsert = starterList.map((item) => ({
      user_id: userId,
      name: item.name,
      type: item.type,
    }));

    const { data, error } = await supabase
      .from('categories')
      .insert(rowsToInsert)
      .select('*');

    if (error) {
      throw error;
    } else if (data) {
      setCategories((prev) => [...prev, ...data]);
    }
  };

  // Tier update handler (e.g. Upgrade to Donor)
  const handleUpdateTier = async (newTier: UserTier) => {
    setUserTier(newTier);

    if (!configured) {
      const saved = localStorage.getItem('expansio_demo_user');
      const parsed = saved ? JSON.parse(saved) : {};
      localStorage.setItem(
        'expansio_demo_user',
        JSON.stringify({ ...parsed, tier: newTier })
      );
      return;
    }

    if (userId) {
      const supabase = createClient();
      await supabase.from('profiles').update({ tier: newTier }).eq('id', userId);
    }
  };

  // Currency preference update (Account Settings modal)
  const handleUpdateCurrency = async (newCurrency: string) => {
    if (!/^[A-Z]{3}$/.test(newCurrency)) {
      throw new Error('Invalid currency code.');
    }
    setCurrency(newCurrency);

    if (!configured) {
      localStorage.setItem('expansio_currency', newCurrency);
      return;
    }

    if (!userId) throw new Error('Not signed in — cannot save currency.');

    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ currency: newCurrency })
      .eq('id', userId);

    if (error) throw error;
  };

  // Filtered expenses based on time horizon, category, type, and search query
  const filteredExpenses = useMemo(() => {
    // 1. Time horizon filter
    let list = filterExpensesByTime(expenses, activeTimeFilter, referenceDate);

    // 2. Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((e) => e.category_id === selectedCategory);
    }

    // 3. Type filter
    if (selectedType !== 'all') {
      list = list.filter((e) => {
        const cat = e.categories || categories.find((c) => c.id === e.category_id);
        return cat?.type === selectedType;
      });
    }

    // 4. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) => {
        const notesMatch = (e.notes || '').toLowerCase().includes(q);
        const catMatch = (e.categories?.name || '').toLowerCase().includes(q);
        return notesMatch || catMatch;
      });
    }

    return list;
  }, [
    expenses,
    activeTimeFilter,
    referenceDate,
    selectedCategory,
    selectedType,
    searchQuery,
    categories,
  ]);

  // Dynamically calculate metrics based on the active filtered expenses
  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const item of filteredExpenses) {
      const cat = item.categories || categories.find((c) => c.id === item.category_id);
      const isIncome = cat?.type === 'income';
      const amount = Number(item.amount) || 0;

      if (isIncome) {
        income += amount;
      } else {
        expense += amount;
      }
    }

    return {
      totalIncome: income,
      totalExpenses: expense,
      netBalance: income - expense,
      transactionCount: filteredExpenses.length,
    };
  }, [filteredExpenses, categories]);

  // CSV Export handler
  const handleExportCsv = () => {
    const filename = `expansio_${activeTimeFilter}_${referenceDate}.csv`;
    exportExpensesToCsv(filteredExpenses, filename);
  };

  // Excel Export — donor gated. Live mode posts filtered rows to
  // /api/export/excel, where the tier is re-validated server-side against
  // profiles.tier (the UI gate is UX only, the API gate is the real one).
  const handleExportExcel = async () => {
    const rows = filteredExpenses.map((e) => ({
      expense_date: e.expense_date,
      category: e.categories?.name || 'Uncategorized',
      type: e.categories?.type || 'expense',
      amount: e.amount,
      notes: e.notes || '',
    }));

    if (rows.length === 0) {
      alert('Nothing to export in the current view — adjust your filters.');
      return;
    }

    const filename = `expansio_ledger_${activeTimeFilter}_${referenceDate}.xlsx`;

    // Demo mode (no Supabase): build the workbook entirely client-side
    if (!configured) {
      const XLSX = await import('xlsx');
      const aoa = [
        ['Date', 'Category', 'Type', 'Amount', 'Notes'],
        ...rows.map((r) => [r.expense_date, r.category, r.type, r.amount, r.notes]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      ws['!cols'] = [{ wch: 12 }, { wch: 26 }, { wch: 10 }, { wch: 14 }, { wch: 48 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Ledger');
      const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const url = URL.createObjectURL(new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    setExcelExporting(true);
    try {
      const res = await fetch('/api/export/excel', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows, periodLabel: activeTimeFilter }),
      });

      if (res.status === 403) {
        // Server says what the UI missed — force the upgrade path
        setDonorModalOpen(true);
        return;
      }
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || `Export failed (HTTP ${res.status})`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[Expansio] Excel export failed:', err);
      alert(err instanceof Error ? err.message : 'Excel export failed. Please try again.');
    } finally {
      setExcelExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col font-sans">
      {/* Top Header */}
      <TopNavigation
        userEmail={userEmail}
        userTier={userTier}
        onOpenDonorModal={() => setDonorModalOpen(true)}
        onOpenCategoryModal={() => setCategoryModalOpen(true)}
        onOpenSettingsModal={() => setSettingsModalOpen(true)}
        onOpenFeedbackModal={() => setFeedbackModalOpen(true)}
        onTierChange={handleUpdateTier}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Supabase Notice Banner if not connected */}
        <EnvConfigBanner />

        {/* Section 1: Top Metric Cards */}
        <div className="mb-8">
          <MetricCards
            totalIncome={metrics.totalIncome}
            totalExpenses={metrics.totalExpenses}
            netBalance={metrics.netBalance}
            transactionCount={metrics.transactionCount}
            activeTimeFilter={activeTimeFilter}
            currency={currency}
          />
        </div>

        {/* Section 2 & 3: Sidebar / Quick Views + Spreadsheet Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Sidebar / Quick Views Panel */}
          <div className="lg:col-span-1 space-y-6">
            <SidebarFilters
              activeTimeFilter={activeTimeFilter}
              onTimeFilterChange={setActiveTimeFilter}
              userTier={userTier}
              onOpenDonorModal={() => setDonorModalOpen(true)}
              onExportCsv={handleExportCsv}
              onExportExcel={handleExportExcel}
              excelExporting={excelExporting}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedType={selectedType}
              onSelectType={setSelectedType}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              referenceDate={referenceDate}
              onReferenceDateChange={setReferenceDate}
            />
          </div>

          {/* Right Column: Spreadsheet Ledger Grid */}
          <div className="lg:col-span-3">
            <SpreadsheetLedger
              expenses={filteredExpenses}
              categories={categories}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
              onAddRow={handleAddRow}
              savingRowIds={savingRowIds}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <DonorModal
        isOpen={donorModalOpen}
        onClose={() => setDonorModalOpen(false)}
        currentTier={userTier}
        onUpdateTier={handleUpdateTier}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onSeedDefaultCategories={handleSeedDefaultCategories}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        currency={currency}
        userTier={userTier}
        userEmail={userEmail}
        onSaveCurrency={handleUpdateCurrency}
      />

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        userTier={userTier}
      />
    </div>
  );
}
