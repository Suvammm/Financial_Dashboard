import React, { useEffect, useMemo, useState } from 'react';
import {
  PiggyBank,
  AlertTriangle,
  BadgeIndianRupee,
  Lightbulb,
  ShieldCheck,
  Target,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import useStore from '../store/useStore';
import { useInsights, useMonthlyData } from '../hooks/useFinanceData';
import { formatCurrency } from '../utils/helpers';

function toneClasses(tone) {
  return {
    blue: {
      icon: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      border: 'border-blue-100 dark:border-blue-500/20',
    },
    emerald: {
      icon: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      border: 'border-emerald-100 dark:border-emerald-500/20',
    },
    rose: {
      icon: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      border: 'border-rose-100 dark:border-rose-500/20',
    },
  }[tone];
}

function InsightTile({ icon: Icon, label, value, sub, tone = 'blue' }) {
  const style = toneClasses(tone);

  return (
    <div className={`card p-5 border ${style.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
          <p className="numeric-display text-2xl mt-2" style={{ color: 'var(--c-text)' }}>
            {value}
          </p>
          {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
        </div>
        <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${style.bg}`}>
          <Icon size={20} className={style.icon} />
        </span>
      </div>
    </div>
  );
}

function AdviceCard({ icon: Icon, title, text, impact, tone = 'blue' }) {
  const style = toneClasses(tone);

  return (
    <div className={`card p-5 border ${style.border}`}>
      <div className="flex items-start gap-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg}`}>
          <Icon size={18} className={style.icon} />
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--c-text)' }}>
              {title}
            </h3>
            {impact && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-surface-50 dark:bg-white/5 text-muted">
                {impact}
              </span>
            )}
          </div>
          <p className="text-sm text-muted mt-2">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ score }) {
  const value = Math.max(0, Math.min(score, 100));
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  const tone =
    value >= 75 ? 'text-emerald-500' :
    value >= 55 ? 'text-blue-500' :
    'text-rose-500';

  return (
    <div className="relative w-40 h-40 flex-shrink-0">
      <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--c-border)" strokeWidth="12" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="var(--c-accent)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`numeric-display text-3xl ${tone}`}>{value}</span>
        <span className="text-xs text-muted mt-1">saving score</span>
      </div>
    </div>
  );
}

export default function Analysis() {
  const transactions = useStore((s) => s.transactions);
  const monthly = useMonthlyData();
  const {
    totalIncome,
    totalExpense,
    savings,
    savingsRate,
    highestCategory,
    avgMonthlyExpense,
    expenseChange,
    incomeChange,
    mostFrequentCategory,
  } = useInsights();

  const monthOptions = useMemo(
    () => monthly.map((item, index) => ({ value: index, label: item.month })),
    [monthly]
  );

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    monthOptions.length ? monthOptions.length - 1 : 0
  );

  useEffect(() => {
    if (monthOptions.length) {
      setSelectedMonthIndex(monthOptions.length - 1);
    }
  }, [monthOptions.length]);

  const analysis = useMemo(() => {
    const monthSnapshot = monthly[selectedMonthIndex] ?? monthly[monthly.length - 1] ?? null;
    const monthKey = transactions
      .map((t) => t.date.slice(0, 7))
      .filter((value, index, list) => list.indexOf(value) === index)
      .sort()[selectedMonthIndex] ?? null;

    const monthExpenses = transactions.filter((t) =>
      t.type === 'expense' && (!monthKey || t.date.slice(0, 7) === monthKey)
    );

    const monthCategoryTotals = monthExpenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] ?? 0) + tx.amount;
      return acc;
    }, {});

    const rankedCategories = Object.entries(monthCategoryTotals)
      .map(([name, value]) => ({ name, value, share: monthSnapshot?.expenses ? (value / monthSnapshot.expenses) * 100 : 0 }))
      .sort((a, b) => b.value - a.value);

    const topMonthCategory = rankedCategories[0] ?? null;
    const topThreeShare = rankedCategories.slice(0, 3).reduce((sum, item) => sum + item.share, 0);
    const recurringCount = transactions.filter((t) => t.type === 'expense' && ['Utilities', 'Entertainment', 'Health'].includes(t.category)).length;
    const targetMonthlySavings = monthSnapshot?.income ? monthSnapshot.income * 0.2 : 0;
    const monthlyGap = monthSnapshot ? Math.max(0, targetMonthlySavings - monthSnapshot.savings) : 0;

    const scoreBase =
      (savingsRate >= 20 ? 45 : Math.max(12, savingsRate * 2)) +
      (expenseChange <= 0 ? 18 : 6) +
      (incomeChange >= 0 ? 14 : 7) +
      (topThreeShare < 65 ? 12 : 5) +
      (mostFrequentCategory !== 'Food' ? 7 : 3);
    const score = Math.round(Math.max(18, Math.min(scoreBase, 95)));

    const status =
      score >= 75 ? 'Strong position' :
      score >= 55 ? 'Needs tuning' :
      'High attention needed';

    const opportunities = [];

    if (monthlyGap > 0) {
      opportunities.push({
        title: 'Close the monthly savings gap',
        text: `For ${monthSnapshot?.month ?? 'this month'}, you are short by ${formatCurrency(monthlyGap)} from a 20% savings target. Start by moving that amount into a separate savings bucket over four weekly transfers.`,
        impact: formatCurrency(monthlyGap),
        icon: PiggyBank,
        tone: 'blue',
      });
    } else {
      opportunities.push({
        title: 'Protect your current surplus',
        text: `You are already above a 20% savings pace for ${monthSnapshot?.month ?? 'the selected month'}. Keep it stable by automating savings before discretionary spending begins.`,
        impact: `${(monthSnapshot?.savings ?? 0) > 0 ? formatCurrency(monthSnapshot.savings) : 'On track'}`,
        icon: ShieldCheck,
        tone: 'emerald',
      });
    }

    if (topMonthCategory) {
      opportunities.push({
        title: `${topMonthCategory.name} is the biggest pressure point`,
        text: `${topMonthCategory.name} accounts for ${topMonthCategory.share.toFixed(1)}% of selected-month spending. Reducing it by even 10% would free up about ${formatCurrency(topMonthCategory.value * 0.1)}.`,
        impact: formatCurrency(topMonthCategory.value * 0.1),
        icon: AlertTriangle,
        tone: topMonthCategory.share > 30 ? 'rose' : 'blue',
      });
    }

    opportunities.push({
      title: 'Trim your repeat expense trail',
      text: `You have ${recurringCount} repeat-style expense entries across utility, health, and entertainment categories. Review which ones are fixed essentials and which ones can be paused or downgraded.`,
      impact: `${recurringCount} repeats`,
      icon: Target,
      tone: recurringCount >= 10 ? 'rose' : 'blue',
    });

    opportunities.push({
      title: 'Reduce category concentration risk',
      text: `Your top 3 categories make up ${topThreeShare.toFixed(1)}% of selected-month spending. Spreading tighter budgets across those areas will make your overall cash flow more stable.`,
      impact: `${topThreeShare.toFixed(0)}%`,
      icon: Sparkles,
      tone: topThreeShare > 70 ? 'rose' : 'emerald',
    });

    const actionPlan = [
      `Set a hard cap for ${topMonthCategory?.name ?? 'your top expense category'} this week.`,
      `Move ${formatCurrency(Math.max(monthlyGap / 4, 0))} every week into savings until the month closes.`,
      `Review one recurring bill before your next income date.`,
    ];

    return {
      monthSnapshot,
      topMonthCategory,
      topThreeShare,
      recurringCount,
      monthlyGap,
      score,
      status,
      opportunities,
      actionPlan,
    };
  }, [
    expenseChange,
    incomeChange,
    monthly,
    mostFrequentCategory,
    savingsRate,
    selectedMonthIndex,
    transactions,
  ]);

  return (
    <div className="flex flex-col gap-6 stagger">
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <ScoreRing score={analysis.score} />
            <div>
              <h2 className="font-display font-bold text-xl" style={{ color: 'var(--c-text)' }}>
                Advanced Saving Advisor
              </h2>
              <p className="text-sm text-muted mt-1">
                A deeper read of your cash flow, category pressure, and saving opportunities.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-50 dark:bg-white/5 text-xs font-semibold text-muted">
                <Sparkles size={13} className="text-blue-500" />
                {analysis.status}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto lg:min-w-[180px]">
            <label className="text-xs uppercase tracking-widest text-muted">Focus Month</label>
            <select
              value={selectedMonthIndex}
              onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
              className="mt-2 w-full px-3 py-2 rounded-xl border border-theme bg-transparent text-sm outline-none"
              style={{ color: 'var(--c-text)' }}
            >
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <InsightTile
            icon={BadgeIndianRupee}
            label="Total Saved"
            value={formatCurrency(savings)}
            sub={`${savingsRate.toFixed(1)}% of total income`}
            tone="emerald"
          />
          <InsightTile
            icon={TrendingDown}
            label="Avg Monthly Spend"
            value={formatCurrency(avgMonthlyExpense)}
            sub="Average expense level"
            tone="rose"
          />
          <InsightTile
            icon={TrendingUp}
            label="Monthly Trend"
            value={`${expenseChange > 0 ? '+' : ''}${expenseChange.toFixed(1)}%`}
            sub="Expense movement month-over-month"
            tone={expenseChange > 0 ? 'rose' : 'emerald'}
          />
          <InsightTile
            icon={Lightbulb}
            label="Frequent Category"
            value={mostFrequentCategory}
            sub={highestCategory ? `${highestCategory.name} is your costliest category overall` : 'Pattern not available yet'}
            tone="blue"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="font-display font-bold text-lg" style={{ color: 'var(--c-text)' }}>
                Priority Opportunities
              </h3>
              <p className="text-sm text-muted mt-1">
                Highest-impact adjustments for {analysis.monthSnapshot?.month ?? 'your recent period'}.
              </p>
            </div>
            {analysis.topMonthCategory && (
              <div className="text-left sm:text-right">
                <p className="text-xs uppercase tracking-widest text-muted">Top category</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--c-text)' }}>
                  {analysis.topMonthCategory.name}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {analysis.opportunities.map((item) => (
              <AdviceCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                text={item.text}
                impact={item.impact}
                tone={item.tone}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-4 sm:p-6">
            <h3 className="font-display font-bold text-lg" style={{ color: 'var(--c-text)' }}>
              Month Snapshot
            </h3>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">Income</p>
                <p className="numeric-display text-xl mt-1" style={{ color: 'var(--c-text)' }}>
                  {formatCurrency(analysis.monthSnapshot?.income ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">Expenses</p>
                <p className="numeric-display text-xl mt-1" style={{ color: 'var(--c-text)' }}>
                  {formatCurrency(analysis.monthSnapshot?.expenses ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">Savings Gap</p>
                <p className="numeric-display text-xl mt-1" style={{ color: 'var(--c-text)' }}>
                  {formatCurrency(analysis.monthlyGap)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">Top 3 Category Share</p>
                <p className="numeric-display text-xl mt-1" style={{ color: 'var(--c-text)' }}>
                  {analysis.topThreeShare.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="card p-4 sm:p-6">
            <h3 className="font-display font-bold text-lg" style={{ color: 'var(--c-text)' }}>
              Suggested Action Plan
            </h3>
            <div className="flex flex-col gap-3 mt-4">
              {analysis.actionPlan.map((step, index) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
