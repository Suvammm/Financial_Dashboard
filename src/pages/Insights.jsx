import React from 'react';
import {
  TrendingUp, TrendingDown, Target, Zap,
  BarChart2, Calendar, Award, Repeat,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts';
import { useInsights, useMonthlyData } from '../hooks/useFinanceData';
import { formatCurrency } from '../utils/helpers';
import { CATEGORY_COLORS } from '../data/mockData';

function InsightCard({ icon: Icon, iconColor, iconBg, label, value, sub, delay = 0 }) {
  return (
    <div
      className="card p-5 flex flex-col gap-3 animate-slide-up"
      style={{ animationDelay: `${delay * 0.07}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-center gap-3">
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={17} style={{ color: iconColor }} />
        </span>
        <span className="text-sm font-medium text-muted">{label}</span>
      </div>
      <p className="numeric-display text-2xl" style={{ color: 'var(--c-text)' }}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

function SavingsRing({ rate }) {
  const capped = Math.min(Math.max(rate, 0), 100);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (capped / 100) * circ;

  return (
    <div className="relative w-36 h-36 flex-shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--c-border)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke="var(--c-accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="numeric-display text-2xl" style={{ color: 'var(--c-text)' }}>
          {capped.toFixed(0)}%
        </span>
        <span className="text-xs text-muted">saved</span>
      </div>
    </div>
  );
}

function MonthlyComparison({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="custom-tooltip">
        <p className="font-semibold mb-1" style={{ color: 'var(--c-text)' }}>{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-muted capitalize">{p.name}:</span>
            <span className="font-semibold ml-auto pl-3" style={{ color: 'var(--c-text)' }}>
              {formatCurrency(p.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card p-6">
      <div className="mb-5">
        <h3 className="font-display font-bold text-lg" style={{ color: 'var(--c-text)' }}>
          Monthly Comparison
        </h3>
        <p className="text-sm text-muted mt-0.5">Income vs Expenses vs Savings per month</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={2} barCategoryGap="28%">
          <CartesianGrid stroke="var(--c-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--c-muted)', fontSize: 12, fontFamily: 'DM Sans' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `Rs ${(v / 1000).toFixed(0)}k`}
            tick={{ fill: 'var(--c-muted)', fontSize: 12, fontFamily: 'DM Sans' }}
            axisLine={false} tickLine={false} width={44}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income"   name="Income"   fill="#10b981" radius={[4,4,0,0]} maxBarSize={24} />
          <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4,4,0,0]} maxBarSize={24} />
          <Bar dataKey="savings"  name="Savings"  fill="var(--c-accent)" radius={[4,4,0,0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Insights() {
  const insights   = useInsights();
  const monthly    = useMonthlyData();

  const {
    totalIncome, totalExpense, savings, savingsRate,
    highestCategory, expenseChange, incomeChange,
    avgMonthlyExpense, mostFrequentCategory,
    currentMonth, previousMonth,
  } = insights;

  return (
    <div className="flex flex-col gap-6 stagger">

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <SavingsRing rate={savingsRate} />
          <div className="flex-1">
            <h3 className="font-display font-bold text-xl mb-1" style={{ color: 'var(--c-text)' }}>
              Saving Pulse
            </h3>
            <p className="text-sm text-muted mb-4">
              You've saved {formatCurrency(savings)} out of {formatCurrency(totalIncome)} earned — a {savingsRate.toFixed(1)}% savings rate.
              {savingsRate >= 20
                ? ' 🎉 Excellent! You\'re well above the recommended 20%.'
                : savingsRate >= 10
                ? ' 👍 Good, but there\'s room to improve towards the 20% target.'
                : ' ⚠️ Consider reducing expenses to reach the recommended 20% savings rate.'}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Income',   value: formatCurrency(totalIncome),  color: '#10b981' },
                { label: 'Expenses', value: formatCurrency(totalExpense),  color: '#f43f5e' },
                { label: 'Saved',    value: formatCurrency(savings),       color: 'var(--c-accent)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <p className="numeric-display text-base" style={{ color }}>
                    {value}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          icon={Award}
          iconColor="var(--c-accent)"
          iconBg="bg-blue-50 dark:bg-blue-500/10"
          label="Top Spending Category"
          value={highestCategory?.name ?? '—'}
          sub={highestCategory ? `${formatCurrency(highestCategory.value)} total spent` : ''}
          delay={0}
        />
        <InsightCard
          icon={Repeat}
          iconColor="#6366f1"
          iconBg="bg-indigo-50 dark:bg-indigo-500/10"
          label="Most Frequent Category"
          value={mostFrequentCategory}
          sub="Most transaction count"
          delay={1}
        />
        <InsightCard
          icon={BarChart2}
          iconColor="#3b82f6"
          iconBg="bg-blue-50 dark:bg-blue-500/10"
          label="Avg Monthly Expense"
          value={formatCurrency(avgMonthlyExpense)}
          sub="Over tracked period"
          delay={2}
        />
        <InsightCard
          icon={Target}
          iconColor="#10b981"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          label="Total Savings"
          value={formatCurrency(savings)}
          sub={`${savingsRate.toFixed(1)}% of income`}
          delay={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
              <TrendingDown size={17} className="text-rose-500" />
            </span>
            <div>
              <p className="text-sm font-medium text-muted">Expense Change</p>
              <p className="text-xs text-muted">{previousMonth} → {currentMonth}</p>
            </div>
          </div>
          <p className={`numeric-display text-3xl ${expenseChange > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {expenseChange > 0 ? '+' : ''}{expenseChange.toFixed(1)}%
          </p>
          <p className="text-xs text-muted mt-1">
            {expenseChange > 0
              ? 'Spending increased month-over-month'
              : 'Spending decreased month-over-month ✓'}
          </p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp size={17} className="text-emerald-500" />
            </span>
            <div>
              <p className="text-sm font-medium text-muted">Income Change</p>
              <p className="text-xs text-muted">{previousMonth} → {currentMonth}</p>
            </div>
          </div>
          <p className={`numeric-display text-3xl ${incomeChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {incomeChange > 0 ? '+' : ''}{incomeChange.toFixed(1)}%
          </p>
          <p className="text-xs text-muted mt-1">
            {incomeChange >= 0
              ? 'Income grew month-over-month ✓'
              : 'Income decreased month-over-month'}
          </p>
        </div>
      </div>

      <MonthlyComparison data={monthly} />
    </div>
  );
}
