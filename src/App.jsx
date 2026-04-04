// src/App.jsx
// Root application — layout with sidebar, header, and page router

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import Analysis from './pages/Analysis';
import useStore from './store/useStore';

// Page router
function Page() {
  const activePage = useStore((s) => s.activePage);
  switch (activePage) {
    case 'overview':     return <Overview />;
    case 'transactions': return <Transactions />;
    case 'insights':     return <Insights />;
    case 'analysis':     return <Analysis />;
    default:             return <Overview />;
  }
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const darkMode = useStore((s) => s.darkMode);

  // Ensure dark class is set on mount when persisted
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--c-bg)' }}>

      {/* ── Desktop Sidebar ── */}
      <div className="hidden md:flex md:w-56 lg:w-60 flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div
            className="fixed left-0 top-0 bottom-0 z-50 w-60 md:hidden"
            style={{ animation: 'slideRight 0.25s ease' }}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen((v) => !v)} />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Page />
        </main>
      </div>

      {/* Mobile slide animation */}
      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
