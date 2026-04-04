import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useMonthlyData } from '../hooks/useFinanceData';
import { formatCurrency } from '../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="font-semibold mb-1" style={{ color: 'var(--c-text)' }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
          <span className="text-muted capitalize">{entry.name}:</span>
          <span className="font-semibold ml-auto pl-4" style={{ color: 'var(--c-text)' }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceChart() {
  const data = useMonthlyData();

  return (
    <div className="card p-6">
      <div className="mb-5">
        <h3 className="font-display font-bold text-lg" style={{ color: 'var(--c-text)' }}>
          Balance Trend
        </h3>
        <p className="text-sm text-muted mt-0.5">Track how income, spending, and balance move over time</p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--c-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--c-muted)', fontSize: 12, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `Rs ${(v / 1000).toFixed(0)}k`}
            tick={{ fill: 'var(--c-muted)', fontSize: 12, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '13px', fontFamily: 'DM Sans', color: 'var(--c-muted)', paddingTop: '12px' }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#f43f5e"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Expenses"
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="var(--c-accent)"
            strokeWidth={2.5}
            strokeDasharray="5 3"
            dot={{ r: 4, fill: 'var(--c-accent)', strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
