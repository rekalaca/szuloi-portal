'use client';

import React from 'react';

export default function SubHeaderNav({ activeTab, onSelectTab, isAdmin }) {
  const tabs = [
    { id: 'home', label: 'Főoldal' },
    { id: 'bank-sheet-y3', label: '3. tanév (2026/27)' },
    { id: 'bank-sheet-y2', label: '2. tanév (2025/26)' },
    { id: 'bank-sheet-y1', label: '1. tanév (2024/25)' },
    { id: 'news', label: 'Hírek & Események' },
    { id: 'szmk', label: 'SZMK Kapcsolat' },
    { id: 'info', label: 'Tanárok' }
  ];

  if (isAdmin) {
    tabs.push({ id: 'admin', label: 'Adminisztráció' });
  }

  return (
    <div className="sub-header-nav-container">
      <div className="sub-header-nav-inner">
        <nav className="modern-glass-nav" aria-label="Fő navigáció">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`glass-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectTab(tab.id)}
              >
                <span className="glass-nav-label">{tab.label}</span>
                {isActive && <span className="glass-nav-active-glow" />}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
