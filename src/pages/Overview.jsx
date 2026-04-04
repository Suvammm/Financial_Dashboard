import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import StatCard from '../components/StatCard';
import BalanceChart from '../components/BalanceChart';
import SpendingChart from '../components/SpendingChart';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import useStore from '../store/useStore';
import { formatCurrency } from '../utils/helpers';

export default function Overview() {
  const getSummary    = useStore((s) => s.getSummary);
  const transactions  = useStore((s) => s.transactions);
  const role          = useStore((s) => s.role);
  const setActivePage = useStore((s) => s.setActivePage);
  const [showModal, setShowModal] = useState(false);

  const { totalIncome, totalExpense, balance } = getSummary();

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6 stagger">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Balance"
          value={formatCurrency(balance)}
          icon={<Wallet size={17} strokeWidth={2} className="text-blue-500" />}
          iconBg="bg-blue-50 dark:bg-blue-500/10"
          trend="+4.2%"
          trendDir="up"
          subtitle="All time"
          delay={0}
        />
        <StatCard
          label="Total Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp size={17} strokeWidth={2} className="text-emerald-500" />}
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          trend="+8.1%"
          trendDir="up"
          subtitle="6 months"
          delay={1}
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpense)}
          icon={<TrendingDown size={17} strokeWidth={2} className="text-rose-500" />}
          iconBg="bg-rose-50 dark:bg-rose-500/10"
          trend="+2.4%"
          trendDir="down"
          subtitle="6 months"
          delay={2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <BalanceChart />
        </div>
        <div className="lg:col-span-2">
          <SpendingChart />
        </div>
      </div>

      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display font-bold text-lg" style={{ color: 'var(--c-text)' }}>
              Recent Transactions
            </h3>
            <p className="text-sm text-muted mt-0.5">Your five latest entries</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {role === 'admin' && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'var(--c-accent)' }}
              >
                <Plus size={13} />
                Add
              </button>
            )}
            <button
              onClick={() => setActivePage('transactions')}
              className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-current transition-colors"
            >
              View all <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <TransactionList transactions={recent} compact />
      </div>

      {showModal && <TransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
