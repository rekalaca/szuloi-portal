'use client';

import React from 'react';
import { AppStore } from '@/lib/store';

export default function SzmkTab() {
  const szmkList = AppStore.getSZMK();

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>👨‍👩‍👧‍👦 Szülői Munkaközösség (SZMK) Elérhetőségek</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.35rem auto 0', maxWidth: '600px' }}>
          Kérdés, kérés esetén forduljon bizalommal a 11. D osztály SZMK képviselőihez!
        </p>
      </div>

      <div className="cards-grid">
        {szmkList.map((member) => (
          <div key={member.id} className="profile-card">
            <img
              src={member.image}
              alt={member.name}
              className="profile-avatar"
            />
            <h3 className="profile-name">{member.name}</h3>
            <div className="profile-role">{member.role}</div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', minHeight: '40px' }}>
              {member.description}
            </p>

            {member.email && (
              <div style={{ fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                📧 <a href={`mailto:${member.email}`} style={{ color: 'var(--brand-accent)', fontWeight: 600 }}>{member.email}</a>
              </div>
            )}

            {member.phone && (
              <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                📞 <a href={`tel:${member.phoneRaw || member.phone}`} style={{ color: 'var(--text-main)', fontWeight: 600 }}>{member.phone}</a>
              </div>
            )}

            <div className="contact-action-buttons">
              {member.phone && (
                <a href={`tel:${member.phoneRaw || member.phone}`} className="btn btn-sm btn-primary">
                  📞 Hívás
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className="btn btn-sm btn-secondary">
                  ✉️ E-mail
                </a>
              )}
              {member.messengerUrl && (
                <a href={member.messengerUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ background: '#0084ff', color: '#fff' }}>
                  💬 Messenger
                </a>
              )}
              {member.facebookUrl && (
                <a href={member.facebookUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ background: '#1877f2', color: '#fff' }}>
                  🌐 Facebook
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
