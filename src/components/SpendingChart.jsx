import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import useStore from '../store/useStore';
import { useCategoryData } from '../hooks/useFinanceData';
import { formatCurrency } from '../utils/helpers';

const RADIAN = Math.PI / 180;

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const r  = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x  = cx + r * Math.cos(-midAngle * RADIAN);
  const y  = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight="600" fontFamily="DM Sans">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
        <span className="font-semibold" style={{ color: 'var(--c-text)' }}>{d.name}</span>
      </div>
      <p className="text-muted text-sm mt-1">{formatCurrency(d.value)}</p>
    </div>
  );
};

export default function SpendingChart() {
  const transactions = useStore((s) => s.transactions);
  const [view, setView] = useState('pie'); // 'pie' | 'bar'
  const [range, setRange] = useState('all');
  const data = useCategoryData(range);

  const monthOptions = useMemo(() => (
    [...new Set(transactions.map((t) => t.date.slice(0, 7)))]
      .sort()
      .map((key) => ({
        value: key,
        label: new Date(`${key}-01T00:00:00`).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
      }))
  ), [transactions]);

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-lg" style={{ color: 'var(--c-text)' }}>
            Spending Breakdown
          </h3>
          <p className="text-sm text-muted mt-0.5">
            {range === 'all' ? 'By category across all transactions' : `By category for ${monthOptions.find((m) => m.value === range)?.label ?? range}`}
          </p>
        </div>

        <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-theme text-xs font-medium outline-none cursor-pointer bg-transparent"
            style={{ color: 'var(--c-text)' }}
          >
            <option value="all">All Transactions</option>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>

          <div className="flex bg-surface-100 dark:bg-white/5 rounded-lg p-0.5 gap-0.5 border border-theme self-start sm:self-auto">
            {['pie', 'bar'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                  view === v
                    ? 'bg-white dark:bg-white/10 shadow-sm'
                    : 'text-muted hover:text-current'
                }`}
                style={{ color: view === v ? 'var(--c-text)' : undefined }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!data.length ? (
        <div className="flex items-center justify-center h-[220px] text-sm text-muted text-center px-6">
          No expense transactions found for this selection.
        </div>
      ) : view === 'pie' ? (
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={95}
                innerRadius={40}
                dataKey="value"
                labelLine={false}
                label={<PieLabel />}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          </div>

          <ul className="flex flex-col gap-2 min-w-0 w-full md:w-auto md:min-w-[140px]">
            {data.slice(0, 7).map((d) => (
              <li key={d.name} className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                <span className="text-muted truncate">{d.name}</span>
                <span className="ml-auto font-semibold font-mono text-xs" style={{ color: 'var(--c-text)' }}>
                  {formatCurrency(d.value, { decimals: 0 })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--c-border)" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => `Rs ${v}`}
              tick={{ fill: 'var(--c-muted)', fontSize: 11, fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'var(--c-muted)', fontSize: 12, fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
