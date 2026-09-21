'use client';

import React from 'react';

export default function StudentLimitModal({ isOpen, studentName, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚠️ Regisztrációs korlátozás</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👨‍👩‍👦</div>
            <h4 style={{ color: 'var(--danger-text)', fontSize: '1.1rem', fontWeight: 800 }}>
              Egy tanulóhoz maximum 2 regisztráció tartozhat!
            </h4>
            <p style={{ marginTop: '0.75rem', fontSize: '0.88rem' }}>
              A kiválasztott diákhoz (<strong>{studentName || 'Tanuló'}</strong>) már rögzítésre került a megengedett <strong>2 szülői felhasználói fiók</strong>.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
            <strong>Mit tehet most?</strong>
            <ul style={{ marginLeft: '1.2rem', marginTop: '0.4rem', lineHeight: '1.6' }}>
              <li>Kérjük, egyeztessen a már regisztrált családtaggal a belépési adatokról.</li>
              <li>Ha elfelejtette jelszavát, használja az „Elfelejtett jelszó” funkciót.</li>
              <li>Módosítási igény esetén vegye fel a kapcsolatot az adminisztrátorral: <a href="mailto:rekalaca@gmail.com" style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>rekalaca@gmail.com</a> (Rékási László).</li>
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Értem, rendben
          </button>
        </div>
      </div>
    </div>
  );
}
