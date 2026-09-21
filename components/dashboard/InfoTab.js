'use client';

import React from 'react';
import { AppStore } from '@/lib/store';

// Helper to calculate days until nameday
function getDaysUntilNameday(namedayStr) {
  if (!namedayStr) return 999;
  const [monthStr, dayStr] = namedayStr.split('-');
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  const now = new Date();
  const currentYear = now.getFullYear();
  
  let targetDate = new Date(currentYear, month, day, 0, 0, 0);
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  if (targetDate < todayZero) {
    targetDate = new Date(currentYear + 1, month, day, 0, 0, 0);
  }

  const diffMs = targetDate.getTime() - todayZero.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export default function InfoTab() {
  const teachers = AppStore.getTeachers();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Teachers List */}
      <div className="table-card">
        <h3 className="table-title">Oktatóink és Tantárgyak (11. D)</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          A 11. D osztályban tanító oktatók és tantárgyaik listája névnaptárral
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {teachers.map((teacher) => {
            const daysLeft = teacher.nameday ? getDaysUntilNameday(teacher.nameday) : 999;
            const isUpcoming = daysLeft <= 7;
            const isToday = daysLeft === 0;

            return (
              <div
                key={teacher.id}
                style={{
                  background: isToday ? 'rgba(212, 175, 55, 0.2)' : teacher.isHeadTeacher ? 'rgba(212, 175, 55, 0.12)' : 'var(--bg-input)',
                  border: isToday ? '2px solid var(--brand-accent)' : teacher.isHeadTeacher ? '2px solid var(--brand-accent)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  position: 'relative'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  {teacher.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                  {teacher.subject}
                </div>

                {/* Nameday Display */}
                {teacher.namedayDisplay && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                    <span>🎂 Névnap:</span>
                    <strong style={{ color: isUpcoming ? 'var(--brand-accent)' : 'var(--text-main)' }}>
                      {teacher.namedayDisplay}
                    </strong>
                    {isToday && (
                      <span className="badge badge-warning" style={{ marginLeft: '4px' }}>🎉 MA VAN!</span>
                    )}
                    {!isToday && isUpcoming && (
                      <span className="badge badge-primary" style={{ marginLeft: '4px' }}>{daysLeft} nap múlva</span>
                    )}
                  </div>
                )}

                <div style={{ marginTop: '4px' }}>
                  <span
                    className={`badge ${teacher.isHeadTeacher ? 'badge-warning' : 'badge-primary'}`}
                  >
                    {teacher.badge || teacher.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
