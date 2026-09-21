'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppStore } from '@/lib/store';

export default function FloatingSearch({ isOpen, onClose, onSelectResult, currentUser }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    students: [],
    bankY2: [],
    bankY1: [],
    news: [],
    szmk: []
  });
  const inputRef = useRef(null);
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (text) => {
    setQuery(text);
    const clean = text.toLowerCase().trim();

    if (clean.length < 2) {
      setResults({ students: [], bankY2: [], bankY1: [], news: [], szmk: [] });
      return;
    }

    const students = AppStore.getStudentsList().filter(s => {
      if (isAdmin) return s.name.toLowerCase().includes(clean);
      return currentUser?.childName?.toLowerCase() === s.name.toLowerCase() && s.name.toLowerCase().includes(clean);
    });

    const bankY3 = AppStore.getBankRecordsY3().filter(r => {
      if (isAdmin) {
        return r.name.toLowerCase().includes(clean) || (r.total && r.total.toLowerCase().includes(clean));
      }
      return currentUser?.childName?.toLowerCase() === r.name.toLowerCase() && r.name.toLowerCase().includes(clean);
    });

    const bankY2 = AppStore.getBankRecordsY2().filter(r => {
      if (isAdmin) {
        return r.name.toLowerCase().includes(clean) || (r.total && r.total.toLowerCase().includes(clean));
      }
      return currentUser?.childName?.toLowerCase() === r.name.toLowerCase() && r.name.toLowerCase().includes(clean);
    });

    const bankY1 = AppStore.getBankRecordsY1().filter(r => {
      if (isAdmin) {
        return r.name.toLowerCase().includes(clean) || (r.total && r.total.toLowerCase().includes(clean));
      }
      return currentUser?.childName?.toLowerCase() === r.name.toLowerCase() && r.name.toLowerCase().includes(clean);
    });

    const news = AppStore.getNews().filter(n => n.title.toLowerCase().includes(clean) || n.content.toLowerCase().includes(clean));
    const szmk = AppStore.getSZMK().filter(s => s.name.toLowerCase().includes(clean) || s.role.toLowerCase().includes(clean));

    setResults({ students, bankY3, bankY2, bankY1, news, szmk });
  };

  const totalResults =
    results.students.length +
    (results.bankY3 ? results.bankY3.length : 0) +
    results.bankY2.length +
    results.bankY1.length +
    results.news.length +
    results.szmk.length;

  return (
    <div className={`floating-search-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="floating-search-container" onClick={(e) => e.stopPropagation()}>
        <div className="floating-search-input-wrap">
          <span style={{ fontSize: '1.2rem' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="floating-search-input"
            placeholder="Keresés a portálon, hírekben, SZMK infókban..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.1rem', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div className="floating-search-results">
          {query.trim().length < 2 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem 0', fontSize: '0.85rem' }}>
              Írjon be legalább 2 betűt a gyorskereséshez...
            </p>
          ) : totalResults === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem 0', fontSize: '0.85rem' }}>
              Nincs találat erre: <strong>&quot;{query}&quot;</strong>
            </p>
          ) : (
            <>
              {results.students.length > 0 && (
                <div>
                  <div className="search-result-category-title">🎓 Tanulók ({results.students.length})</div>
                  {results.students.map((s) => (
                    <div
                      key={s.id}
                      className="search-result-item"
                      onClick={() => {
                        onSelectResult('home');
                        onClose();
                      }}
                    >
                      <div>
                        <strong>{s.name}</strong>
                        <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {s.class} • {s.specialization}
                        </small>
                      </div>
                      <span className="badge badge-primary">Főoldal</span>
                    </div>
                  ))}
                </div>
              )}

              {results.bankY3 && results.bankY3.length > 0 && (
                <div>
                  <div className="search-result-category-title">⭐ 3. tanév (2026/27) tételek ({results.bankY3.length})</div>
                  {results.bankY3.map((item) => (
                    <div
                      key={item.id}
                      className="search-result-item"
                      onClick={() => {
                        onSelectResult('bank-sheet-y3');
                        onClose();
                      }}
                    >
                      <div>
                        <strong>{item.name}</strong>
                        <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          Befizetve: {item.total} • Tartozás: {item.debt}
                        </small>
                      </div>
                      <span className="badge badge-warning">3. Tanév</span>
                    </div>
                  ))}
                </div>
              )}

              {results.bankY2.length > 0 && (
                <div>
                  <div className="search-result-category-title">🏦 2. tanév (2025/26) tételek ({results.bankY2.length})</div>
                  {results.bankY2.map((item) => (
                    <div
                      key={item.id}
                      className="search-result-item"
                      onClick={() => {
                        onSelectResult('bank-sheet-y2');
                        onClose();
                      }}
                    >
                      <div>
                        <strong>{item.name}</strong>
                        <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          Befizetve: {item.total} • Kirándulás: {item.trip || '—'}
                        </small>
                      </div>
                      <span className="badge badge-success">2. Tanév</span>
                    </div>
                  ))}
                </div>
              )}

              {results.bankY1.length > 0 && (
                <div>
                  <div className="search-result-category-title">📂 1. tanév (2024/25) tételek ({results.bankY1.length})</div>
                  {results.bankY1.map((item) => (
                    <div
                      key={item.id}
                      className="search-result-item"
                      onClick={() => {
                        onSelectResult('bank-sheet-y1');
                        onClose();
                      }}
                    >
                      <div>
                        <strong>{item.name}</strong>
                        <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          Befizetve: {item.total} • Kirándulás: {item.trip || '—'}
                        </small>
                      </div>
                      <span className="badge badge-warning">1. Tanév</span>
                    </div>
                  ))}
                </div>
              )}

              {results.news.length > 0 && (
                <div>
                  <div className="search-result-category-title">📰 Hírek ({results.news.length})</div>
                  {results.news.map((item) => (
                    <div
                      key={item.id}
                      className="search-result-item"
                      onClick={() => {
                        onSelectResult('news');
                        onClose();
                      }}
                    >
                      <div>
                        <strong>{item.title}</strong>
                        <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {item.date} • {item.category}
                        </small>
                      </div>
                      <span className="badge badge-primary">Hírek</span>
                    </div>
                  ))}
                </div>
              )}

              {results.szmk.length > 0 && (
                <div>
                  <div className="search-result-category-title">👨‍👩‍👧‍👦 SZMK Tagok ({results.szmk.length})</div>
                  {results.szmk.map((item) => (
                    <div
                      key={item.id}
                      className="search-result-item"
                      onClick={() => {
                        onSelectResult('szmk');
                        onClose();
                      }}
                    >
                      <div>
                        <strong>{item.name}</strong>
                        <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {item.role}
                        </small>
                      </div>
                      <span className="badge badge-warning">SZMK</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
