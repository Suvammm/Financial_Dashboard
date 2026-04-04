// src/pages/Transactions.jsx
// Full transaction management page — search, filter, sort, export, add

import React, { useState } from 'react';
import {
  Search, SlidersHorizontal, Plus, Download,
  ArrowUpDown, ChevronUp, ChevronDown, X,
} from 'lucide-react';
import useStore from '../store/useStore';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import { ALL_CATEGORIES } from '../data/mockData';
import { exportToCSV, exportToJSON } from '../utils/helpers';

// Filter bar component
function FilterBar() {
  const filters    = useStore((s) => s.filters);
  const setFilter  = useStore((s) => s.setFilter);
  const resetFilters = useStore((s) => s.resetFilters);

  const hasActive =
    filters.search || filters.category !== 'All' || filters.type !== 'all';

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="Search transactions…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-theme text-sm outline-none transition-all focus:border-blue-400 bg-surface-50 dark:bg-white/5"
          style={{ color: 'var(--c-text)', background: 'var(--c-surface)' }}
        />
        {filters.search && (
          <button
            onClick={() => setFilter('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-current"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter pills row */}
      <div className="flex flex-wrap gap-2">
        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => setFilter('category', e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-theme text-xs font-medium outline-none cursor-pointer bg-transparent"
          style={{ color: 'var(--c-text)' }}
        >
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
          ))}
        </select>

        {/* Type */}
        <div className="flex rounded-lg border border-theme overflow-hidden text-xs font-medium">
          {['all', 'income', 'expense'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter('type', t)}
              className={`px-3 py-1.5 capitalize transition-colors ${
                filters.type === t
                  ? 'text-white'
                  : 'text-muted hover:text-current'
              }`}
              style={
                filters.type === t
                  ? {
                      background:
                        t === 'income' ? '#10b981'
                        : t === 'expense' ? '#f43f5e'
                        : 'var(--c-accent)',
                    }
                  : {}
              }
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex rounded-lg border border-theme overflow-hidden text-xs font-medium">
          {[
            { key: 'date', label: 'Date' },
            { key: 'amount', label: 'Amount' },
          ].map(({ key, label }) => {
            const active = filters.sortBy === key;
            const SortIcon = active
              ? filters.sortDir === 'asc' ? ChevronUp : ChevronDown
              : ArrowUpDown;
            return (
              <button
                key={key}
                onClick={() => {
                  if (active) {
                    setFilter('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setFilter('sortBy', key);
                    setFilter('sortDir', 'desc');
                  }
                }}
                className={`flex items-center gap-1 px-3 py-1.5 transition-colors ${
                  active ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'text-muted hover:text-current'
                }`}
              >
                <SortIcon size={11} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Reset */}
        {hasActive && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/20 text-rose-500 text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <X size={11} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default function Transactions() {
  const filtered = useStore((s) => s.getFilteredTransactions());
  const role = useStore((s) => s.role);
  const [showModal, setShowModal] = useState(false);
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="flex flex-col gap-5 stagger">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{filtered.length} transactions</p>
        </div>

        <div className="flex items-center gap-2 relative flex-wrap">
          {/* Export menu */}
          <button
            onClick={() => setShowExport((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-theme text-xs font-semibold text-muted hover:text-current transition-colors"
          >
            <Download size={13} />
            Export
          </button>

          {showExport && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setShowExport(false)} />
              <div
                className="absolute top-full right-0 mt-1.5 z-20 card py-1 min-w-[120px]"
                style={{ background: 'var(--c-surface)' }}
              >
                {[
                  { label: 'Export CSV',  action: () => { exportToCSV(filtered);  setShowExport(false); } },
                  { label: 'Export JSON', action: () => { exportToJSON(filtered); setShowExport(false); } },
                ].map(({ label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-muted hover:text-current hover:bg-surface-50 dark:hover:bg-white/5 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

          {role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'var(--c-accent)' }}
            >
              <Plus size={13} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="card p-4">
        <FilterBar />
      </div>

      {/* ── Transaction list ── */}
      <div className="card p-4">
        <TransactionList transactions={filtered} />
      </div>

      {showModal && <TransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
