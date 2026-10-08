/**
 * /api/export/excel
 * ─────────────────────────────────────────────────────────────────────────────
 * Tier-restricted ledger export (Excel via SheetJS/xlsx).
 *
 * SECURITY MODEL — the tier check happens HERE on the server, not in the UI:
 *   1. Verify the caller's Supabase session (auth.getUser with cookies).
 *   2. Look up profiles.tier and require 'donor' or 'admin' → 403 otherwise.
 *   3. Only then build the .xlsx workbook from the (sanitized) payload rows.
 *
 * The client sends the currently filtered rows; every row field is whitelisted
 * and the row count is capped so the route can't be abused as a general
 * spreadsheet printer.
 */

import { createClient as createSsrClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

// Mirror of the UserTier values allowed to export
const EXPORT_ALLOWED_TIERS = ['donor', 'admin'];

const MAX_ROWS = 50_000;

interface IncomingRow {
  expense_date?: string | null;
  category?: string | null;
  type?: string | null;
  amount?: number | null;
  notes?: string | null;
}

export async function POST(request: Request) {
  try {
    // ── 1. Authenticate ──────────────────────────────────────────────────────
    const supabase = await createSsrClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { error: 'Unauthorized — sign in to export your ledger.' },
        { status: 401 }
      );
    }

    // ── 2. Backend tier validation (authorisation) ───────────────────────────
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('tier, currency')
      .eq('id', user.id)
      .single();

    if (profileErr || !profile) {
      console.error('[Expansio] /api/export/excel — profile lookup failed:', profileErr);
      return NextResponse.json({ error: 'Could not verify your account tier.' }, { status: 500 });
    }

    if (!EXPORT_ALLOWED_TIERS.includes(profile.tier)) {
      return NextResponse.json(
        {
          error: 'Excel export is a Donor-tier feature.',
          yourTier: profile.tier,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // ── 3. Parse + sanitize payload ──────────────────────────────────────────
    let body: { rows?: IncomingRow[]; periodLabel?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const incoming = Array.isArray(body.rows) ? body.rows : [];
    if (incoming.length === 0) {
      return NextResponse.json({ error: 'No rows provided to export.' }, { status: 400 });
    }
    if (incoming.length > MAX_ROWS) {
      return NextResponse.json(
        { error: `Too many rows (max ${MAX_ROWS}). Narrow your filters.` },
        { status: 413 }
      );
    }

    // Whitelist fields — nothing from the client reaches the sheet unchecked
    const cleanRows = incoming.map((r) => ({
      Date: typeof r.expense_date === 'string' ? r.expense_date.slice(0, 10) : '',
      Category: typeof r.category === 'string' ? r.category.slice(0, 120) : 'Uncategorized',
      Type: r.type === 'income' ? 'income' : 'expense',
      Amount: Number.isFinite(Number(r.amount)) ? Number(r.amount) : 0,
      Notes: typeof r.notes === 'string' ? r.notes.slice(0, 2000) : '',
    }));

    // ── 4. Build the workbook ────────────────────────────────────────────────
    const headers = ['Date', 'Category', 'Type', 'Amount', 'Notes'];
    const aoa = [
      headers,
      ...cleanRows.map((r) => [r.Date, r.Category, r.Type, r.Amount, r.Notes]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    worksheet['!cols'] = [{ wch: 12 }, { wch: 26 }, { wch: 10 }, { wch: 14 }, { wch: 48 }];

    // Total row so the sheet is useful standalone
    const totalIncome = cleanRows.filter((r) => r.Type === 'income').reduce((s, r) => s + r.Amount, 0);
    const totalExpense = cleanRows.filter((r) => r.Type === 'expense').reduce((s, r) => s + r.Amount, 0);
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [['', '', 'TOTAL INCOME', totalIncome], ['', '', 'TOTAL EXPENSES', totalExpense]],
      { origin: -2 }
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ledger');

    const xlsxOut = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;

    const filename = `expansio_ledger_${new Date().toISOString().slice(0, 10)}.xlsx`;
    const currency = typeof profile.currency === 'string' ? profile.currency : 'USD';

    return new Response(xlsxOut, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Export-Currency': currency,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Expansio] POST /api/export/excel — unexpected error:', msg);
    return NextResponse.json({ error: 'Internal server error', detail: msg }, { status: 500 });
  }
}
