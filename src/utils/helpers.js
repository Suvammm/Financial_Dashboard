// src/utils/helpers.js

/** Format a number as INR currency */
export function formatCurrency(amount, opts = {}) {
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    maximumFractionDigits: opts.decimals ?? 2,
    ...opts,
  }).format(amount);
}

/** Format a date string (YYYY-MM-DD) to a readable label */
export function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}

/** Shorten a date to "Jan 3" */
export function shortDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
  });
}

/** Clamp a number between min and max */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/** Export transactions to CSV */
export function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows    = transactions.map((t) =>
    [t.date, `"${t.description}"`, t.category, t.type, t.amount].join(',')
  );
  const csv     = [headers.join(','), ...rows].join('\n');
  downloadFile(csv, 'transactions.csv', 'text/csv');
}

/** Export transactions to JSON */
export function exportToJSON(transactions) {
  const json = JSON.stringify(transactions, null, 2);
  downloadFile(json, 'transactions.json', 'application/json');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Generate a simple unique ID */
export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/** Today's date in YYYY-MM-DD format */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
