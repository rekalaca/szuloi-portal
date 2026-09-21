'use client';

import React from 'react';

export default function Header({
  currentUser,
  theme,
  onToggleTheme,
  onOpenSearch,
  onToggleMobileMenu,
  isMobileMenuOpen,
  onLogout,
  onNavigateHome
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand */}
        <div
          className="school-brand"
          onClick={onNavigateHome}
          role="button"
          tabIndex={0}
          title="Ugrás a Főoldal tetejére"
        >
          <img
            src="/logo.png"
            alt="Széchenyi István Technikum Logó"
            className="header-logo"
          />
          <div className="brand-titles desktop-brand-titles">
            <h1 className="header-school-name">Nyíregyházi SZC Széchenyi István Technikum és Kollégium</h1>
            <span className="class-subtitle">11. D osztály • Informatika és távközlés ágazat • 2025/2026. tanév</span>
          </div>
          <div className="mobile-brand-titles">
            <span className="mobile-brand-name">11. D Portál</span>
          </div>
        </div>

        {/* Actions */}
        <div className="header-actions">
          {/* Floating search button - Only when logged in */}
          {currentUser && (
            <button
              className="header-search-circle-btn"
              onClick={onOpenSearch}
              aria-label="Keresés a portálon"
              title="Keresés a portálon"
            >
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
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          )}

          {/* Theme toggle - Sun & Moon Glass Switch */}
          <button
            className={`glass-theme-toggle ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
            onClick={onToggleTheme}
            aria-label="Világos / Éjjeli mód váltása"
            title={theme === 'dark' ? 'Váltás világos módra' : 'Váltás éjjeli módra'}
          >
            <span className="theme-toggle-icon sun-icon">☀️</span>
            <span className="theme-toggle-icon moon-icon">🌙</span>
            <span className="theme-toggle-thumb" />
          </button>

          {/* Logged in User info */}
          {currentUser && (
            <>
              <div className="desktop-user-pill" title={currentUser.email}>
                {/* Outlined green avatar contour */}
                <div className="user-avatar-outline user-avatar-green">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="user-text-info">
                  <span className="user-email-text">{currentUser.email}</span>
                  <span className="user-badge-role">{currentUser.role === 'admin' ? 'Admin' : 'Szülő'}</span>
                </div>
              </div>

              {/* Logout with cool arrow icon */}
              <div className="desktop-logout-action">
                <button
                  className="glass-logout-btn"
                  onClick={onLogout}
                  title="Kijelentkezés"
                  aria-label="Kijelentkezés"
                >
                  <span className="logout-text">Kijelentkezés</span>
                  <svg
                    className="logout-arrow-icon"
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
            </>
          )}

          {/* Animated Hamburger Button (Mobile & Tablet) */}
          <button
            className={`mobile-hamburger-btn ${isMobileMenuOpen ? 'is-active' : ''}`}
            onClick={onToggleMobileMenu}
            aria-label="Mobil Menü Megnyitása"
            title="Menü"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
