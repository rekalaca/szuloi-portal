'use client';

import React, { useState } from 'react';
import { AppStore } from '@/lib/store';

export default function AuthCard({
  onLoginSuccess,
  onOpenPrivacy,
  onOpenForgotPassword,
  onRequireEmailVerify,
  onStudentLimitExceeded
}) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const students = AppStore.getStudents();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginPrivacyConsent, setLoginPrivacyConsent] = useState(true);

  // Register form state
  const [regEmail, setRegEmail] = useState('');
  const [regChild, setRegChild] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegPasswordConfirm, setShowRegPasswordConfirm] = useState(false);
  const [regPrivacyConsent, setRegPrivacyConsent] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginPrivacyConsent) {
      setErrorMsg('Kérjük, fogadja el az Adatkezelési tájékoztatót!');
      return;
    }

    const users = AppStore.getUsers();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      setErrorMsg('Nem található ilyen e-mail címmel regisztrált felhasználó!');
      return;
    }

    if (user.passwordHash !== loginPassword) {
      setErrorMsg('Helytelen jelszó! Kérjük, próbálja újra.');
      return;
    }

    // Success
    AppStore.setCurrentUser(user);
    onLoginSuccess(user);
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regChild) {
      setErrorMsg('Kérjük, válassza ki gyermeke nevét a 37 fős listából!');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setErrorMsg('A megadott jelszavak nem egyeznek meg!');
      return;
    }

    if (!regPrivacyConsent) {
      setErrorMsg('A regisztrációhoz kötelező elfogadni az Adatkezelési tájékoztatót!');
      return;
    }

    const users = AppStore.getUsers();
    const cleanEmail = regEmail.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      setErrorMsg('Ezzel az e-mail címmel már létezik felhasználói fiók!');
      return;
    }

    // Check 2-parent limit for chosen student
    const existingParentsCount = AppStore.getRegistrationCountForChild(regChild);
    if (existingParentsCount >= 2) {
      onStudentLimitExceeded(regChild);
      return;
    }

    // Send 6-digit email verification code via Gmail SMTP
    setIsLoading(true);
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: cleanEmail })
      });

      const data = await res.json();
      if (data.success) {
        onRequireEmailVerify({
          email: cleanEmail,
          childName: regChild,
          password: regPassword,
          demoCode: data.demoCode
        });
      } else {
        setErrorMsg(data.error || 'Hiba a megerősítő kód küldésekor.');
      }
    } catch (err) {
      setErrorMsg('Hálózati hiba: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-view-wrapper">
      <div className="auth-card-container">
        <h2 className="auth-card-title">SZÜLŐI PORTÁL</h2>

        {/* Tab Switcher */}
        <div className="auth-tab-switch">
          <button
            type="button"
            className={`tab-switch-btn ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
          >
            🔑 Bejelentkezés
          </button>
          <button
            type="button"
            className={`tab-switch-btn ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
          >
            📝 Regisztráció
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {authMode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>E-mail cím</label>
              <div className="input-with-icon">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Jelszó</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                type="button"
                className="btn-link"
                style={{ fontSize: '0.8rem' }}
                onClick={onOpenForgotPassword}
              >
                Elfelejtett jelszó?
              </button>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={loginPrivacyConsent}
                  onChange={(e) => setLoginPrivacyConsent(e.target.checked)}
                  required
                />
                <span>
                  Elfogadom az{' '}
                  <button type="button" className="btn-link" onClick={onOpenPrivacy}>
                    Adatkezelési tájékoztatót
                  </button>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Belépés a Portálra
            </button>
          </form>
        ) : (
          /* 2. REGISTER FORM */
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>E-mail cím *</label>
              <div className="input-with-icon">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Gyermek neve (11. D tanuló) *</label>
              <div className="input-with-icon">
                <span className="input-icon">🎓</span>
                <select
                  value={regChild}
                  onChange={(e) => setRegChild(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Válassza ki a tanulót a 37 fős listából --</option>
                  {students.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                ℹ️ Egy tanulóhoz maximum 2 szülői fiók regisztrálható.
              </small>
            </div>

            <div className="form-group">
              <label>Jelszó *</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                >
                  {showRegPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Jelszó megerősítése *</label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showRegPasswordConfirm ? 'text' : 'password'}
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowRegPasswordConfirm(!showRegPasswordConfirm)}
                  title={showRegPasswordConfirm ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'}
                >
                  {showRegPasswordConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={regPrivacyConsent}
                  onChange={(e) => setRegPrivacyConsent(e.target.checked)}
                  required
                />
                <span>
                  Elolvastam és elfogadom az{' '}
                  <button type="button" className="btn-link" onClick={onOpenPrivacy}>
                    Adatkezelési tájékoztatót
                  </button>
                  {' '}és hozzájárulok adataim kezeléséhez. *
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-accent btn-block" disabled={isLoading}>
              {isLoading ? 'Kód küldése...' : '✨ Fiók Regisztrálása'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
