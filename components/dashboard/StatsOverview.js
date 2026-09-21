'use client';

import React from 'react';

export default function StatsOverview({ stats }) {
  const formatFt = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString('hu-HU') + ' Ft';
    }
    return val;
  };

  return (
    <div className="top-3-stats-grid">
      <div className="stat-card-mini stat-carried">
        <div className="stat-icon-wrap">📂</div>
        <div className="stat-info">
          <div className="stat-label">Előző évről áthozott összeg</div>
          <div className="stat-value">{formatFt(stats.broughtForward)}</div>
        </div>
      </div>

      <div className="stat-card-mini stat-current-otp">
        <div className="stat-icon-wrap">🏦</div>
        <div className="stat-info">
          <div className="stat-label">Aktuális OTP számla egyenleg</div>
          <div className="stat-value">{formatFt(stats.currentBalance)}</div>
        </div>
      </div>

      <div className="stat-card-mini stat-monthly-fee">
        <div className="stat-icon-wrap">💳</div>
        <div className="stat-info">
          <div className="stat-label">Havi osztálypénz</div>
          <div className="stat-value">{formatFt(stats.monthlyFee)}</div>
        </div>
      </div>
    </div>
  );
}
