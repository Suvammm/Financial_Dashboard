// src/store/useStore.js
// Central Zustand store — single source of truth for the dashboard

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_TRANSACTIONS } from '../data/mockData';

const useStore = create(
  persist(
    (set, get) => ({
      // ── Transactions ────────────────────────────────────
      transactions: MOCK_TRANSACTIONS,

      addTransaction: (tx) =>
        set((s) => ({
          transactions: [
            { ...tx, id: `t${Date.now()}` },
            ...s.transactions,
          ],
        })),

      updateTransaction: (id, updated) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      // ── Role ────────────────────────────────────────────
      // 'viewer' → read-only | 'admin' → full CRUD
      role: 'admin',
      setRole: (role) => set({ role }),

      // ── Filters ─────────────────────────────────────────
      filters: {
        search:   '',
        category: 'All',
        type:     'all',       // 'all' | 'income' | 'expense'
        sortBy:   'date',      // 'date' | 'amount'
        sortDir:  'desc',      // 'asc'  | 'desc'
      },

      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),

      resetFilters: () =>
        set({
          filters: {
            search:   '',
            category: 'All',
            type:     'all',
            sortBy:   'date',
            sortDir:  'desc',
          },
        }),

      // ── Active Page ─────────────────────────────────────
      activePage: 'overview',  // 'overview' | 'transactions' | 'insights'
      setActivePage: (page) => set({ activePage: page }),

      // ── Dark Mode ───────────────────────────────────────
      darkMode: false,
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          // Sync with Tailwind's dark class on <html>
          document.documentElement.classList.toggle('dark', next);
          return { darkMode: next };
        }),

      // ── Derived / Computed helpers ───────────────────────
      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        const { search, category, type, sortBy, sortDir } = filters;

        let result = [...transactions];

        // Search
        if (search.trim()) {
          const q = search.toLowerCase();
          result = result.filter(
            (t) =>
              t.description.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q)
          );
        }

        // Category
        if (category !== 'All') {
          result = result.filter((t) => t.category === category);
        }

        // Type
        if (type !== 'all') {
          result = result.filter((t) => t.type === type);
        }

        // Sort
        result.sort((a, b) => {
          const dir = sortDir === 'asc' ? 1 : -1;
          if (sortBy === 'amount') return (a.amount - b.amount) * dir;
          return (new Date(a.date) - new Date(b.date)) * dir;
        });

        return result;
      },

      getSummary: () => {
        const { transactions } = get();
        const totalIncome  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          savings: totalIncome - totalExpense,
        };
      },
    }),
    {
      name: 'finance-dashboard-state',
      // Persist only these keys to localStorage
      partialize: (s) => ({
        transactions: s.transactions,
        role:         s.role,
        darkMode:     s.darkMode,
      }),
      onRehydrateStorage: () => (state) => {
        // Re-apply dark mode class on page reload
        if (state?.darkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);

export default useStore;
