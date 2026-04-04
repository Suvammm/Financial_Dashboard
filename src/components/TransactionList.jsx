// src/components/TransactionList.jsx
// Displays a scrollable list of transactions with edit/delete (admin only)

import React, { useState } from 'react';
import {
  ArrowUpCircle, ArrowDownCircle, Pencil, Trash2,
  ShoppingBag, Utensils, Car, Zap, Heart, GraduationCap,
  Plane, TrendingUp, Briefcase, DollarSign,
} from 'lucide-react';
import useStore from '../store/useStore';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CATEGORY_COLORS } from '../data/mockData';
import TransactionModal from './TransactionModal';

// Category → icon mapping
const CATEGORY_ICONS = {
  Food:          Utensils,
  Utilities:     Zap,
  Entertainment: ShoppingBag,
  Health:        Heart,
  Transport:     Car,
  Shopping:      ShoppingBag,
  Education:     GraduationCap,
  Travel:        Plane,
  Salary:        DollarSign,
  Freelance:     Briefcase,
  Investment:    TrendingUp,
};

function CategoryIcon({ category, size = 16 }) {
  const Icon = CATEGORY_ICONS[category] ?? DollarSign;
  const color = CATEGORY_COLORS[category] ?? '#888';
  return <Icon size={size} style={{ color }} />;
}

// Single transaction row
function TransactionRow({ tx, isAdmin, onEdit, onDelete }) {
  const isIncome = tx.type === 'income';

  return (
    <div className="flex items-start sm:items-center gap-3 px-3 sm:px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-white/5 transition-colors group">
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${CATEGORY_COLORS[tx.category] ?? '#888'}18` }}
      >
        <CategoryIcon category={tx.category} />
      </div>

      {/* Description + Category */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--c-text)' }}>
          {tx.description}
        </p>
        <p className="text-xs text-muted">{tx.category} · {formatDate(tx.date)}</p>
        <div className="flex items-center justify-between gap-3 mt-2 sm:hidden">
          <span
            className={`font-mono font-semibold text-sm ${
              isIncome ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
          </span>

          {isAdmin && (
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => onEdit(tx)}
                className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-muted hover:text-blue-500 transition-colors"
                title="Edit"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => onDelete(tx.id)}
                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-muted hover:text-rose-500 transition-colors"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Amount */}
      <span
        className={`hidden sm:inline-flex font-mono font-semibold text-sm flex-shrink-0 ${
          isIncome ? 'text-emerald-500' : 'text-rose-500'
        }`}
      >
        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
      </span>

      {/* Admin actions (hidden unless hovered) */}
      {isAdmin && (
        <div className="hidden sm:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(tx)}
            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-muted hover:text-blue-500 transition-colors"
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(tx.id)}
            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 text-muted hover:text-rose-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

// Empty state
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-surface-100 dark:bg-white/5 flex items-center justify-center mb-3">
        <ArrowDownCircle size={22} className="text-muted" />
      </div>
      <p className="font-semibold" style={{ color: 'var(--c-text)' }}>No transactions found</p>
      <p className="text-sm text-muted mt-1">Try adjusting your filters or search query.</p>
    </div>
  );
}

export default function TransactionList({ transactions, compact = false }) {
  const role             = useStore((s) => s.role);
  const deleteTransaction = useStore((s) => s.deleteTransaction);
  const isAdmin          = role === 'admin';

  const [editingTx, setEditingTx] = useState(null);

  const visible = compact ? transactions.slice(0, 6) : transactions;

  if (!transactions.length) return <EmptyState />;

  return (
    <>
      <div className="divide-y divide-transparent -mx-1">
        {visible.map((tx) => (
          <TransactionRow
            key={tx.id}
            tx={tx}
            isAdmin={isAdmin}
            onEdit={setEditingTx}
            onDelete={deleteTransaction}
          />
        ))}
      </div>

      {/* Edit modal */}
      {editingTx && (
        <TransactionModal
          initial={editingTx}
          onClose={() => setEditingTx(null)}
        />
      )}
    </>
  );
}
