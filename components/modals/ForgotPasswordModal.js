'use client';

import React, { useState } from 'react';
import { AppStore } from '@/lib/store';

export default function ForgotPasswordModal({ isOpen, onClose, onNotify }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email })
      });

      const data = await res.json();
      if (data.success) {
        setStep(2);
      } else {
        setErrorMsg(data.error || 'Hiba történt a kód küldésekor.');
      }
    } catch (err) {
      setErrorMsg('Hálózati hiba: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      setErrorMsg('A két jelszó nem egyezik meg!');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code })
      });

      const data = await res.json();
      if (data.success && data.verified) {
        // Update user password in store
        const users = AppStore.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          user.passwordHash = newPassword;
          AppStore.saveUsers(users);
        }
        onNotify?.('Jelszó sikeresen frissítve! Most már bejelentkezhet.');
        onClose();
        setStep(1);
        setEmail('');
        setCode('');
        setNewPassword('');
        setNewPasswordConfirm('');
      } else {
        setErrorMsg(data.error || 'Helytelen vagy lejárt visszaállító kód!');
      }
    } catch (err) {
      setErrorMsg('Hiba a jelszó mentésekor: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔑 Jelszó visszaállítása</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1Submit}>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Add meg a regisztrációkor használt e-mail címed, és küldünk egy 6 számjegyű visszaállító kódot.
              </p>

              {errorMsg && (
                <div style={{ color: 'var(--danger-text)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="form-group">
                <label>Regisztrált e-mail cím</label>
                <div className="input-with-icon">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Mégse</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Küldés...' : 'Kód küldése'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit}>
            <div className="modal-body">
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--brand-accent)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', margin: 0 }}>
                  ✉️ Visszaállító kódot küldtünk a(z) <strong style={{ color: 'var(--brand-accent)' }}>{email}</strong> címre.
                </p>
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px', fontSize: '0.78rem' }}>
                  Kérlek, nézd meg a beérkező leveleidet (és a spam mappát), majd írd be az alábbi mezőbe a kódot!
                </small>
              </div>

              {errorMsg && (
                <div style={{ color: 'var(--danger-text)', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="form-group">
                <label>Visszaállító kód (6 számjegy)</label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                  style={{ textAlign: 'center', fontSize: '1.3rem', letterSpacing: '6px', fontWeight: 800 }}
                />
              </div>

              <div className="form-group">
                <label>Új jelszó</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Új jelszó megerősítése</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    required
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                    {showPasswordConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Mentés...' : 'Jelszó mentése'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
