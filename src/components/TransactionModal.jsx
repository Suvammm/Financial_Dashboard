// src/components/TransactionModal.jsx
// Modal form to add or edit a transaction (admin only)

import React, { useState } from 'react';
import { X } from 'lucide-react';
import useStore from '../store/useStore';
import { ALL_CATEGORIES } from '../data/mockData';
import { todayISO } from '../utils/helpers';

const CATEGORIES_ONLY = ALL_CATEGORIES.filter((c) => c !== 'All');

const DEFAULT_FORM = {
  description: '',
  amount:      '',
  category:    'Food',
  type:        'expense',
  date:        todayISO(),
};

export default function TransactionModal({ initial = null, onClose }) {
  const addTransaction    = useStore((s) => s.addTransaction);
  const updateTransaction = useStore((s) => s.updateTransaction);

  const isEdit = !!initial;
  const [form, setForm] = useState(
    isEdit
      ? { ...initial, amount: String(initial.amount) }
      : DEFAULT_FORM
  );
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = { ...form, amount: parseFloat(form.amount) };
    if (isEdit) {
      updateTransaction(initial.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--c-text)' }}>
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-current hover:bg-surface-100 dark:hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Type toggle */}
          <div className="flex gap-2">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                onClick={() => set('type', t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all border ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-rose-500 text-white border-rose-500'
                    : 'border-theme text-muted hover:border-current'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Description */}
          <Field label="Description" error={errors.description}>
            <input
              type="text"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="e.g. Grocery Store"
              className={inputClass(errors.description)}
            />
          </Field>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (Rs)" error={errors.amount}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                placeholder="0.00"
                className={inputClass(errors.amount)}
              />
            </Field>
            <Field label="Date" error={errors.date}>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className={inputClass(errors.date)}
              />
            </Field>
          </div>

          {/* Category */}
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className={inputClass()}
            >
              {CATEGORIES_ONLY.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-theme text-sm font-semibold text-muted hover:text-current hover:border-current transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'var(--c-accent)' }}
          >
            {isEdit ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</label>
      {children}
      {error && <span className="text-xs text-rose-500">{error}</span>}
    </div>
  );
}

function inputClass(error) {
  return [
    'w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all',
    'border',
    error
      ? 'border-rose-400 focus:border-rose-500'
      : 'border-theme focus:border-blue-400',
    'bg-surface-50 dark:bg-white/5',
  ].join(' ');
}
