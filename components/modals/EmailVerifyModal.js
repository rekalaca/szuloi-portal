'use client';

import React, { useState } from 'react';

export default function EmailVerifyModal({
  isOpen,
  email,
  onClose,
  onVerifySuccess,
  demoCode
}) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Hiányzó e-mail cím!');
      return;
    }
    if (!code || code.length !== 6) {
      setErrorMsg('Kérjük, adja meg a 6 számjegyű kódot!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code })
      });

      const data = await res.json();
      if (data.success && data.verified) {
        onVerifySuccess();
      } else {
        setErrorMsg(data.error || 'Helytelen megerősítő kód!');
      }
    } catch (err) {
      setErrorMsg('Hálózati hiba: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMsg('Hiányzó e-mail cím!');
      return;
    }
    setErrorMsg('');
    setInfoMsg('');
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email })
      });
      const data = await res.json();
      if (data.success) {
        setInfoMsg('✉️ Új megerősítő kód elküldve az e-mail címedre!');
      } else {
        setErrorMsg(data.error || 'Hiba az újraküldés során.');
      }
    } catch {
      setErrorMsg('Hiba az újraküldés során.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📧 E-mail cím megerősítése</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--brand-accent)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', margin: 0 }}>
                ✉️ Megerősítő kódot küldtünk a(z) <strong style={{ color: 'var(--brand-accent)' }}>{email}</strong> címre.
              </p>
              <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px', fontSize: '0.78rem' }}>
                Kérlek, írd be az e-mailben kapott 6 számjegyű kódot a regisztrációd véglegesítéséhez!
              </small>
            </div>

            {errorMsg && (
              <div style={{ color: 'var(--danger-text)', background: 'var(--danger-bg)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 700 }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {infoMsg && (
              <div style={{ color: 'var(--success-text)', background: 'var(--success-bg)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 700 }}>
                {infoMsg}
              </div>
            )}

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label>6 számjegyű megerősítő kód</label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                required
                style={{
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  letterSpacing: '6px',
                  fontWeight: 800,
                  padding: '0.75rem'
                }}
              />
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button type="button" className="btn-link" style={{ fontSize: '0.8rem' }} onClick={handleResend}>
                Nem kaptad meg? Új kód küldése
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Mégse
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Ellenőrzés...' : 'Megerősítés & Belépés'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
