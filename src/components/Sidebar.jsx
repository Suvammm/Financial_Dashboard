import React from 'react';
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb, Sparkles,
  Moon, Sun, ChevronDown, Shield, Eye,
} from 'lucide-react';
import useStore from '../store/useStore';

const NAV_ITEMS = [
  { id: 'overview',     label: 'Overview',     Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     Icon: Lightbulb       },
  { id: 'analysis',     label: 'AI Analyse',   Icon: Sparkles        },
];

export default function Sidebar({ onClose }) {
  const activePage    = useStore((s) => s.activePage);
  const setActivePage = useStore((s) => s.setActivePage);
  const role          = useStore((s) => s.role);
  const setRole       = useStore((s) => s.setRole);
  const darkMode      = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);

  const navigate = (page) => {
    setActivePage(page);
    onClose?.();
  };

  return (
    <aside
      className="flex flex-col h-full"
      style={{ background: 'var(--c-surface)', borderRight: '1px solid var(--c-border)' }}
    >
      <div className="px-6 pt-6 pb-5 border-b border-theme">
        <div className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'var(--c-accent)' }}
          >
            F
          </span>
          <span className="font-display font-bold text-base" style={{ color: 'var(--c-text)' }}>
            FinGrow
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-3 pt-5 flex-1">
        <p className="text-xs font-semibold text-muted uppercase tracking-widest px-3 mb-2">
          Menu
        </p>

        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all ${
                active
                  ? 'text-white'
                  : 'text-muted hover:text-current hover:bg-surface-50 dark:hover:bg-white/5'
              }`}
              style={active ? { background: 'var(--c-accent)', color: '#fff' } : {}}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 2} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5 flex flex-col gap-3">
        <div className="px-3 py-3 rounded-xl border border-theme">
          <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">Role</p>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm font-semibold pr-6 outline-none cursor-pointer"
              style={{ color: 'var(--c-text)' }}
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <ChevronDown size={13} className="absolute right-0 top-1 text-muted pointer-events-none" />
          </div>
          <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
            role === 'admin' ? 'text-blue-500' : 'text-muted'
          }`}>
            {role === 'admin' ? <Shield size={11} /> : <Eye size={11} />}
            {role === 'admin' ? 'Full access' : 'Read-only'}
          </div>
        </div>

        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-theme text-sm font-medium text-muted hover:text-current hover:border-current transition-colors w-full"
        >
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </aside>
  );
}
