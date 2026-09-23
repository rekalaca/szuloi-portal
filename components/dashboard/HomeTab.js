'use client';

import React from 'react';
import { AppStore } from '@/lib/store';

export default function HomeTab({ currentUser, onNavigateTab }) {
  const students = AppStore.getStudentsList();
  const bankY3 = AppStore.getBankRecordsY3();
  const settings = AppStore.getSettings();
  const showTripContribution = settings?.showTripContributionOnHome === true;

  const childRecord = currentUser?.childName
    ? bankY3.find((r) => r.name.toLowerCase() === currentUser.childName.toLowerCase())
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome / Child Summary Card (Current 3rd Year) */}
      {childRecord && (
        <div className="table-card" style={{ border: '1px solid var(--brand-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                <span className="badge badge-warning">⭐ 3. tanév (2026/2027)</span>
                <span className="badge badge-primary">🎓 Gyermeked adatai</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{childRecord.name} (11. D)</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Informatika és távközlés ágazat • Havi osztálypénz: 3 000 Ft (30 000 Ft/év)
              </p>
              {childRecord.note && (
                <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--brand-accent)', fontWeight: 600 }}>
                  ℹ️ {childRecord.note}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--bg-input)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center', minWidth: '130px' }}>
                <small style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Befizetett osztálypénz</small>
                <strong style={{ fontSize: '1.2rem', color: 'var(--success-text)' }}>{childRecord.total}</strong>
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center', minWidth: '130px' }}>
                <small style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Tartozás (3. tanév)</small>
                <strong style={{ fontSize: '1.2rem', color: childRecord.debt === '0 Ft' ? 'var(--text-main)' : 'var(--danger-text)' }}>
                  {childRecord.debt}
                </strong>
              </div>
              {showTripContribution && (
                <div style={{ background: 'var(--bg-input)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', textAlign: 'center', minWidth: '130px' }}>
                  <small style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Kirándulás hozzájárulás</small>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--brand-accent)' }}>{childRecord.trip || '0 Ft'}</strong>
                </div>
              )}
              {childRecord.prevDebt && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center', minWidth: '130px' }}>
                  <small style={{ color: 'var(--danger-text)', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>Korábbi elmaradás</small>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--danger-text)' }}>
                    {childRecord.prevDebt}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bank Account Info Card */}
      <div className="table-card bank-info-card">
        <div className="bank-info-flex-container">
          <div className="bank-info-text-col">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              💳 Hivatalos OTP Banki Utalási Adatok
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
              Kérlek, az utalás közlemény rovatába mindig írd be a tanuló nevét a gyors és pontos azonosításhoz!
            </p>
          </div>
          <div className="bank-account-badge-col">
            <div className="bank-account-badge">
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Bankszámlaszám (OTP Bank)
              </div>
              <code style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-accent)', letterSpacing: '1.2px', display: 'block' }}>
                11773449-03543429
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Class Students Roster Grid */}
      <div className="table-card">
        <div className="table-header-row">
          <div>
            <h3 className="table-title">
              👥 11. D Osztálynévsor <span className="roster-count-wrap">(37 Tanuló)</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Nyíregyházi SZC Széchenyi István Technikum és Kollégium
            </p>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={() => onNavigateTab('bank-sheet-y3')}>
            📊 3. tanévi banki elszámolás megtekintése →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
          {students.map((student) => {
            const isUserChild = currentUser?.childName?.toLowerCase() === student.name.toLowerCase();
            return (
              <div
                key={student.id}
                style={{
                  background: isUserChild ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-input)',
                  border: isUserChild ? '2px solid var(--brand-accent)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isUserChild ? 'var(--brand-accent)' : 'var(--border-color)',
                  color: isUserChild ? '#000' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem'
                }}>
                  {student.id}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {student.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {student.class} • {student.specialization}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
