import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Expense, TimeFilter } from '@/types/database';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  const val = Number(amount || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatDateDisplay(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Filter an array of expenses by time filter relative to a reference date (YYYY-MM-DD)
 */
export function filterExpensesByTime(
  expenses: Expense[],
  filter: TimeFilter,
  refDateStr: string = getTodayDateString()
): Expense[] {
  const [refYear, refMonth, refDay] = refDateStr.split('-').map(Number);
  const refDate = new Date(refYear, refMonth - 1, refDay);

  return expenses.filter((item) => {
    if (!item.expense_date) return false;
    const [year, month, day] = item.expense_date.split('-').map(Number);
    const itemDate = new Date(year, month - 1, day);

    switch (filter) {
      case 'daily': {
        return (
          itemDate.getFullYear() === refDate.getFullYear() &&
          itemDate.getMonth() === refDate.getMonth() &&
          itemDate.getDate() === refDate.getDate()
        );
      }
      case 'weekly': {
        // Find Monday of reference week
        const dayOfWeek = refDate.getDay(); // 0 is Sunday
        const diffToMonday = refDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
        const startOfWeek = new Date(refDate.getFullYear(), refDate.getMonth(), diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return itemDate >= startOfWeek && itemDate <= endOfWeek;
      }
      case 'monthly': {
        return (
          itemDate.getFullYear() === refDate.getFullYear() &&
          itemDate.getMonth() === refDate.getMonth()
        );
      }
      case 'yearly': {
        return itemDate.getFullYear() === refDate.getFullYear();
      }
      default:
        return true;
    }
  });
}

/**
 * CSV Export utility
 */
export function exportExpensesToCsv(expenses: Expense[], filename = 'expansio_ledger.csv') {
  const headers = ['Date', 'Category', 'Type', 'Amount', 'Notes', 'Created At'];
  const rows = expenses.map((e) => [
    e.expense_date || '',
    `"${(e.categories?.name || 'Uncategorized').replace(/"/g, '""')}"`,
    e.categories?.type || 'expense',
    e.amount ?? 0,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
    e.created_at || '',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
