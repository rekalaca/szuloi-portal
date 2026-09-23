'use client';

import React from 'react';
import { AppStore } from '@/lib/store';

export default function NewsTab() {
  const newsList = AppStore.getNews();

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📰 Hírek, Közlemények & Események</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.35rem auto 0', maxWidth: '600px' }}>
          A 11. D osztály szülői munkaközösségének és iskolavezetésének hivatalos tájékoztatói
        </p>
      </div>

      <div className="news-grid">
        {newsList.map((item) => (
          <article key={item.id} className="news-card">
            {item.image && (
              <div className="news-card-img-wrap">
                <img
                  src={item.image}
                  alt={item.title}
                  className="news-card-img"
                />
              </div>
            )}
            <div className="news-card-body">
              <div className="news-meta">
                <span>📅 {item.date}</span>
              </div>

              <h3 className="news-title">
                {item.pinned && <span style={{ marginRight: '6px' }}>📌</span>}
                {item.title}
              </h3>

              <div className="news-content">
                {item.content}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
