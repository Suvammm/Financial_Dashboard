// src/components/Header.jsx
// Top navigation bar — title, search shortcut, mobile menu toggle

import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import useStore from '../store/useStore';

const PAGE_TITLES = {
  overview:     'Overview',
  transactions: 'Transactions',
  insights:     'Insights',
  analysis:     'AI Analyse',
};

export default function Header({ onMenuToggle }) {
  const activePage = useStore((s) => s.activePage);
  const role       = useStore((s) => s.role);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header
      className="flex items-center justify-between px-3 sm:px-5 h-14 border-b border-theme flex-shrink-0 gap-3"
      style={{ background: 'var(--c-surface)' }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          className="md:hidden p-1.5 rounded-lg text-muted hover:text-current transition-colors"
          onClick={onMenuToggle}
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display font-bold text-base sm:text-lg truncate" style={{ color: 'var(--c-text)' }}>
          {PAGE_TITLES[activePage]}
        </h1>
      </div>

      {/* Right: role pill + bell */}
      <div className="flex items-center gap-1 sm:gap-3 relative flex-shrink-0">
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
            role === 'admin'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300'
              : 'bg-surface-100 text-muted dark:bg-white/5'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-blue-500' : 'bg-muted'}`} />
          {role === 'admin' ? 'Admin' : 'Viewer'}
        </span>

        <button className="relative p-1.5 rounded-lg text-muted hover:text-current transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        {/* Avatar */}
        <button
          onClick={() => setShowProfileMenu((v) => !v)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-surface-50 dark:hover:bg-white/5 transition-colors"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'var(--c-accent)' }}
          >
            JD
          </div>
          <ChevronDown size={14} className="text-muted hidden sm:block" />
        </button>

        {showProfileMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
            <div
              className="absolute top-full right-0 mt-2 z-20 card py-1 min-w-[180px]"
              style={{ background: 'var(--c-surface)' }}
            >
              {[
                { label: 'My Profile', Icon: User },
                { label: 'Settings', Icon: Settings },
                { label: 'Sign Out', Icon: LogOut },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-muted hover:text-current hover:bg-surface-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
