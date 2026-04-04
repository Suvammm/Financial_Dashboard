import { useMemo } from 'react';
import useStore from '../store/useStore';
import { CATEGORY_COLORS, MONTHS } from '../data/mockData';

export function useMonthlyData() {
  const transactions = useStore((s) => s.transactions);

  return useMemo(() => {
    const map = {};

    transactions.forEach(({ date, amount, type }) => {
      const key = date.slice(0, 7);
      if (!map[key]) map[key] = { income: 0, expenses: 0 };
      if (type === 'income')  map[key].income   += amount;
      if (type === 'expense') map[key].expenses += amount;
    });

    const sorted = Object.keys(map).sort();
    let runningBalance = 0;

    return sorted.map((key, i) => {
      const { income, expenses } = map[key];
      runningBalance += income - expenses;
      return {
        month:    MONTHS[i] ?? key,
        income,
        expenses,
        balance:  runningBalance,
        savings:  income - expenses,
      };
    });
  }, [transactions]);
}

export function useCategoryData(monthKey = 'all') {
  const transactions = useStore((s) => s.transactions);

  return useMemo(() => {
    const expense = transactions.filter((t) =>
      t.type === 'expense' && (monthKey === 'all' || t.date.slice(0, 7) === monthKey)
    );
    const map = {};

    expense.forEach(({ category, amount }) => {
      map[category] = (map[category] ?? 0) + amount;
    });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value, fill: CATEGORY_COLORS[name] ?? '#888' }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, monthKey]);
}

export function useInsights() {
  const transactions = useStore((s) => s.transactions);
  const monthlyData  = useMonthlyData();
  const categoryData = useCategoryData();

  return useMemo(() => {
    const totalIncome  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const highestCategory = categoryData[0] ?? null;

    const last  = monthlyData[monthlyData.length - 1];
    const prev  = monthlyData[monthlyData.length - 2];
    const expenseChange = last && prev
      ? ((last.expenses - prev.expenses) / prev.expenses) * 100
      : 0;
    const incomeChange  = last && prev
      ? ((last.income - prev.income) / prev.income) * 100
      : 0;

    const avgMonthlyExpense = monthlyData.length
      ? totalExpense / monthlyData.length
      : 0;

    const freqMap = {};
    transactions.filter((t) => t.type === 'expense').forEach((t) => {
      freqMap[t.category] = (freqMap[t.category] ?? 0) + 1;
    });
    const mostFrequentCategory = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    return {
      totalIncome,
      totalExpense,
      savings:              totalIncome - totalExpense,
      savingsRate:          totalIncome ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
      highestCategory,
      expenseChange,
      incomeChange,
      avgMonthlyExpense,
      mostFrequentCategory,
      currentMonth:         last?.month ?? '—',
      previousMonth:        prev?.month ?? '—',
    };
  }, [transactions, monthlyData, categoryData]);
}
