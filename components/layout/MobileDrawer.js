'use client';

import React from 'react';

export default function MobileDrawer({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  currentUser,
  onLogout
}) {
  const tabs = [
    { id: 'home', label: 'Főoldal & Tanulók', icon: '🎓' },
    { id: 'bank-sheet-y3', label: '3. tanév (2026/27) Aktuális', icon: '⭐' },
    { id: 'bank-sheet-y2', label: '2. tanév (2025/26) Elszámolás', icon: '🏦' },
    { id: 'bank-sheet-y1', label: '1. tanév (2024/25) Archívum', icon: '📂' },
    { id: 'news', label: 'Hírek & Események', icon: '📰' },
    { id: 'szmk', label: 'SZMK Kapcsolat', icon: '👨‍👩‍👧‍👦' },
    { id: 'info', label: 'Tanárok', icon: '👩‍🏫' }
  ];

  if (currentUser?.role === 'admin') {
    tabs.push({ id: 'admin', label: 'Adminisztráció', icon: '🛡️', isAdmin: true });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`mobile-nav-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Slide-in Drawer */}
      <aside className={`mobile-nav-drawer ${isOpen ? 'active' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <img src="/logo.png" alt="Logó" className="mobile-drawer-logo" />
            <div>
              <strong>11. D Portál</strong>
              <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Gyorsmenü</small>
            </div>
          </div>
          <button
            className="mobile-drawer-close-btn"
            onClick={onClose}
            aria-label="Menü bezárása"
          >
            ✕
          </button>
        </div>

        {/* User Profile Badge in Mobile Drawer */}
        {currentUser && (
          <div className="mobile-user-profile-badge">
            <div className="user-avatar-outline" style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.06)' }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.email}
              </div>
              <span className="user-badge-role" style={{ display: 'inline-block', marginTop: '3px' }}>
                {currentUser.role === 'admin' ? 'Rendszergazda' : 'Szülő'}
              </span>
            </div>
          </div>
        )}

        {/* Mobile Navigation List */}
        <nav className="mobile-nav-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`mobile-nav-item ${activeTab === tab.id ? 'active' : ''} ${tab.isAdmin ? 'admin-item' : ''}`}
              onClick={() => {
                onSelectTab(tab.id);
                onClose();
              }}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Drawer Footer with Logout */}
        {currentUser && (
          <div className="mobile-drawer-footer">
            <button
              className="btn btn-block btn-secondary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <span>Kijelentkezés a fiókból</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
