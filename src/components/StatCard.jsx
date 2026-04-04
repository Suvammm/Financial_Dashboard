// src/components/StatCard.jsx
// Summary card with icon, label, value, and optional trend badge

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * @param {object}  props
 * @param {string}  props.label
 * @param {string}  props.value       — Formatted string (e.g. "$12,345.00")
 * @param {React.ReactNode} props.icon
 * @param {string}  props.iconBg      — Tailwind bg class
 * @param {string}  [props.trend]     — "+12.3%" | "-5%" | null
 * @param {string}  [props.trendDir]  — 'up' | 'down' | 'neutral'
 * @param {string}  [props.subtitle]
 * @param {number}  [props.delay]     — Animation delay index
 */
export default function StatCard({ label, value, icon, iconBg, trend, trendDir, subtitle, delay = 0 }) {
  const TrendIcon =
    trendDir === 'up' ? TrendingUp :
    trendDir === 'down' ? TrendingDown : Minus;

  const trendColor =
    trendDir === 'up'   ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' :
    trendDir === 'down' ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10'         :
    'text-muted bg-surface-100 dark:bg-white/5';

  return (
    <div
      className="card p-5 flex flex-col gap-3 animate-slide-up"
      style={{ animationDelay: `${delay * 0.07}s`, animationFillMode: 'both' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted tracking-wide">{label}</span>
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </span>
      </div>

      {/* Value */}
      <p className="numeric-display text-2xl" style={{ color: 'var(--c-text)' }}>
        {value}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        {subtitle && (
          <span className="text-xs text-muted">{subtitle}</span>
        )}
        {trend && (
          <span className={`ml-auto flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${trendColor}`}>
            <TrendIcon size={11} strokeWidth={2.5} />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
