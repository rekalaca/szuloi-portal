'use client';

import React, { useState, useEffect } from 'react';
import { AppStore } from '@/lib/store';
import ConfirmModal from '@/components/modals/ConfirmModal';

export default function AdminTab({ onNotify }) {
  const [adminSection, setAdminSection] = useState('finances'); // 'finances' | 'news' | 'users' | 'email' | 'namedays'

  const students = AppStore.getStudents();

  // Settings state
  const [settings, setSettings] = useState(() => AppStore.getSettings());

  // Finances state
  const [finances, setFinances] = useState(() => AppStore.getFinances());
  const [finMethodFilter, setFinMethodFilter] = useState('all'); // 'all' | 'bank' | 'cash'
  const [finForm, setFinForm] = useState({
    type: 'income',
    paymentMethod: 'bank', // 'bank' | 'cash'
    category: 'class_fee', // income: 'class_fee' | 'trip' | 'arrears' | 'other_income' ; expense: 'nameday' | 'bank_cost' | 'cash_withdrawal' | 'other_expense'
    studentName: students[0] || '',
    note: '',
    amount: '3000',
    date: new Date().toISOString().split('T')[0]
  });

  // News state
  const [newsList, setNewsList] = useState(() => AppStore.getNews());
  const [newsForm, setNewsForm] = useState({ title: '', category: 'Pénzügy', content: '', author: 'Rékási László (SZMK)', image: '', pinned: false, badge: 'Új' });

  // Users state
  const [users, setUsers] = useState(() => AppStore.getUsers());

  // Email state
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', message: '' });
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Edit Assigned Child state
  const [editingChildUser, setEditingChildUser] = useState(null); // { user, selectedChild }

  // Nameday state
  const [teachers, setTeachers] = useState(() => AppStore.getTeachers());
  const [namedayStatus, setNamedayStatus] = useState(null);
  const [testingTeacherId, setTestingTeacherId] = useState(null);

  // Modal Dialogs state (replaces native browser confirm and alert popups)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: null,
    type: 'danger',
    confirmText: 'Igen, törlés',
    cancelText: 'Mégse',
    isAlertOnly: false,
    onConfirm: null
  });

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const handleSaveAssignedChild = async (user, newChildName) => {
    const updated = users.map(u => {
      if (u.id === user.id || u.email?.toLowerCase() === user.email?.toLowerCase()) {
        return { ...u, childName: newChildName };
      }
      return u;
    });
    await AppStore.saveUsers(updated);
    setUsers(AppStore.getUsers());
    setEditingChildUser(null);
    onNotify?.(`Tanuló sikeresen hozzárendelve: ${user.email} ➔ ${newChildName || 'Nincs'}`);
  };

  const showAlert = (title, message, type = 'warning') => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      type,
      confirmText: 'Rendben',
      isAlertOnly: true,
      onConfirm: closeConfirmDialog
    });
  };

  // Load nameday status
  useEffect(() => {
    if (adminSection === 'namedays') {
      fetch('/api/nameday-reminder')
        .then(r => r.json())
        .then(data => setNamedayStatus(data))
        .catch(console.error);
    }
  }, [adminSection]);

  const handleSendTestNamedayReminder = async (teacher) => {
    setTestingTeacherId(teacher.id);
    try {
      const res = await fetch('/api/nameday-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'rekalaca@gmail.com',
          teacherName: teacher.name,
          subject: teacher.subject,
          namedayDisplay: teacher.namedayDisplay,
          daysLeft: 3
        })
      });
      const data = await res.json();
      if (data.success) {
        onNotify?.(`🎂 Teszt emlékeztető elküldve (${teacher.name}) -> rekalaca@gmail.com`);
      } else {
        showAlert('Teszt E-mail Hiba', data.error || 'Nem sikerült elküldeni az emlékeztető e-mailt.', 'danger');
      }
    } catch (err) {
      showAlert('Hálózati Hiba', 'Nem sikerült kapcsolatot létesíteni a szerverrel: ' + err.message, 'danger');
    } finally {
      setTestingTeacherId(null);
    }
  };

  // --- Handlers for Settings ---
  const handleToggleTripContribution = async () => {
    const nextVal = !(settings?.showTripContributionOnHome === true);
    const updated = {
      ...settings,
      showTripContributionOnHome: nextVal
    };
    await AppStore.saveSettings(updated);
    setSettings(AppStore.getSettings());
    onNotify?.(
      nextVal
        ? '🚌 Kirándulási hozzájárulás megjelenítése a szülői főoldalon: BEKAPCSOLVA'
        : '🚌 Kirándulási hozzájárulás megjelenítése a szülői főoldalon: KIKAPCSOLVA'
    );
  };

  // --- Handlers for Finances ---
  const handleAddFinance = (e) => {
    e.preventDefault();
    if (!finForm.amount) return;

    let computedTitle = '';
    const methodTag = finForm.paymentMethod === 'cash' ? ' (💵 Készpénz)' : ' (🏦 Bank)';
    if (finForm.type === 'income') {
      if (finForm.category === 'class_fee') {
        computedTitle = `[Osztálypénz] ${finForm.studentName || 'Tanuló'}${methodTag}`;
      } else if (finForm.category === 'trip') {
        computedTitle = `[Kirándulás] ${finForm.studentName || 'Tanuló'}${methodTag}`;
      } else if (finForm.category === 'arrears') {
        computedTitle = `[Elmaradás rendezése] ${finForm.studentName || 'Tanuló'}${methodTag}`;
      } else {
        computedTitle = `[Egyéb bevétel] ${finForm.note || 'Egyéb forrás'}${methodTag}`;
      }
    } else {
      const expMethodTag = finForm.paymentMethod === 'cash' ? ' (💵 Kp)' : '';
      if (finForm.category === 'nameday') {
        computedTitle = `[Névnap] ${finForm.note || 'Tanári köszöntés'}${expMethodTag}`;
      } else if (finForm.category === 'bank_cost') {
        computedTitle = `[Banki költség] Számlavezetési díj`;
      } else if (finForm.category === 'cash_withdrawal') {
        computedTitle = `[Banki díj] Készpénzfelvételi költség`;
      } else {
        computedTitle = `[Egyéb kiadás] ${finForm.note || 'Kiadási tétel'}${expMethodTag}`;
      }
    }

    const itemToSave = {
      ...finForm,
      paymentMethod: finForm.paymentMethod || 'bank',
      title: computedTitle
    };

    AppStore.addFinance(itemToSave);
    setFinances(AppStore.getFinances());
    setFinForm({
      type: finForm.type,
      paymentMethod: finForm.paymentMethod || 'bank',
      category: finForm.category,
      studentName: finForm.studentName || students[0] || '',
      note: '',
      amount: finForm.type === 'income' && finForm.category === 'class_fee' ? '3000' : '',
      date: new Date().toISOString().split('T')[0]
    });
    onNotify?.(`Pénzügyi tétel rögzítve: ${computedTitle}`);
  };

  const handleDeleteFinance = (f) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Pénzügyi Tétel Törlése',
      type: 'danger',
      confirmText: '🗑️ Tétel Törlése',
      cancelText: 'Mégse',
      isAlertOnly: false,
      message: (
        <div>
          <p style={{ marginBottom: '0.85rem', fontSize: '0.92rem' }}>
            Biztosan törölni szeretné ezt a pénzügyi tételt?
          </p>
          <div style={{ background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
            <span className={`badge ${f.type === 'income' ? 'badge-success' : 'badge-danger'}`} style={{ marginRight: '6px' }}>
              {f.type === 'income' ? '+ Bevétel' : '- Kiadás'}
            </span>
            <span
              className="badge"
              style={{
                background: f.paymentMethod === 'cash' ? '#fef3c7' : '#e0e7ff',
                color: f.paymentMethod === 'cash' ? '#92400e' : '#3730a3',
                border: `1px solid ${f.paymentMethod === 'cash' ? '#fde68a' : '#c7d2fe'}`,
                marginRight: '6px'
              }}
            >
              {f.paymentMethod === 'cash' ? '💵 Készpénz (KP)' : '🏦 Banki utalás'}
            </span>
            <strong>{f.title}</strong>
            <div style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Dátum: {f.date} • Összeg: <strong>{Number(f.amount).toLocaleString('hu-HU')} Ft</strong>
            </div>
          </div>
        </div>
      ),
      onConfirm: () => {
        AppStore.deleteFinance(f.id);
        setFinances(AppStore.getFinances());
        onNotify?.('Pénzügyi tétel sikeresen törölve.');
      }
    });
  };

  // --- Handlers for News ---
  const handleAddNews = (e) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) return;
    AppStore.addNews(newsForm);
    setNewsList(AppStore.getNews());
    setNewsForm({ title: '', category: 'Pénzügy', content: '', author: 'Rékási László (SZMK)', image: '', pinned: false, badge: 'Új' });
    onNotify?.('Hír sikeresen közzétéve!');
  };

  const handleDeleteNews = (n) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Hír / Esemény Törlése',
      type: 'danger',
      confirmText: '🗑️ Hír Törlése',
      cancelText: 'Mégse',
      isAlertOnly: false,
      message: (
        <div>
          <p style={{ marginBottom: '0.85rem', fontSize: '0.92rem' }}>
            Biztosan törölni szeretné az alábbi hírt / bejegyzést?
          </p>
          <div style={{ background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
            <strong>{n.pinned ? '📌 ' : ''}{n.title}</strong>
            <div style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Kategória: {n.category} • Dátum: {n.date} • Szerző: {n.author}
            </div>
          </div>
        </div>
      ),
      onConfirm: () => {
        AppStore.deleteNews(n.id);
        setNewsList(AppStore.getNews());
        onNotify?.('Hír sikeresen törölve.');
      }
    });
  };

  // --- Handlers for Users ---
  const isFixedAdmin = (email) => {
    const clean = (email || '').trim().toLowerCase();
    return clean === 'rekalaca@gmail.com' || clean === 'haritunde11@gmail.com';
  };

  const handleToggleAdminRole = (u) => {
    if (isFixedAdmin(u.email)) {
      onNotify?.('Az állandó SZMK vezetők adminisztrátori jogosultsága nem módosítható!');
      return;
    }

    const isCurrentlyAdmin = u.role === 'admin';
    const nextRole = isCurrentlyAdmin ? 'parent' : 'admin';

    setConfirmDialog({
      isOpen: true,
      title: isCurrentlyAdmin ? 'Adminisztrátori Jog Visszavonása' : 'Adminisztrátori Jog Adása',
      type: isCurrentlyAdmin ? 'danger' : 'warning',
      confirmText: isCurrentlyAdmin ? '👤 Visszavonás (Szülővé tétel)' : '👑 Adminná Kinevezés',
      cancelText: 'Mégse',
      isAlertOnly: false,
      message: (
        <div>
          <p style={{ marginBottom: '0.85rem', fontSize: '0.95rem' }}>
            Biztosan módosítani szeretné <strong style={{ color: 'var(--brand-accent)' }}>{u.email}</strong> felhasználó jogosultságát?
          </p>
          <div style={{ background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '0.85rem', fontSize: '0.88rem' }}>
            Jelenlegi szerepkör: <strong>{isCurrentlyAdmin ? '👑 Adminisztrátor' : '👤 Szülő'}</strong> ➔ Új szerepkör: <strong>{nextRole === 'admin' ? '👑 Adminisztrátor' : '👤 Szülő'}</strong>
          </div>
          <div style={{ background: isCurrentlyAdmin ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.1)', border: `1px solid ${isCurrentlyAdmin ? 'rgba(239, 68, 68, 0.25)' : 'rgba(212, 175, 55, 0.3)'}`, padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.82rem' }}>
            {nextRole === 'admin' ? (
              <span>👑 <strong>Figyelem:</strong> Az új adminisztrátor teljes hozzáférést kap a pénzügyi könyveléshez, hírekhez és felhasználók kezeléséhez.</span>
            ) : (
              <span>👤 <strong>Figyelem:</strong> A felhasználó a jövőben kizárólag a saját gyermeke szülői felületét éri el.</span>
            )}
          </div>
        </div>
      ),
      onConfirm: async () => {
        const updated = users.map(user => {
          if (user.id === u.id || user.email?.toLowerCase() === u.email?.toLowerCase()) {
            return { ...user, role: nextRole };
          }
          return user;
        });
        await AppStore.saveUsers(updated);
        setUsers(AppStore.getUsers());
        onNotify?.(`Jogosultság módosítva: ${u.email} (${nextRole === 'admin' ? 'Adminisztrátor' : 'Szülő'})`);
      }
    });
  };

  const handleDeleteUser = (u) => {
    if (isFixedAdmin(u.email)) {
      onNotify?.('Az állandó SZMK vezetői fiókok nem törölhetők!');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Regisztráció / Szülői Fiók Törlése',
      type: 'danger',
      confirmText: '🗑️ Végleges Törlés',
      cancelText: 'Mégse',
      isAlertOnly: false,
      message: (
        <div>
          <p style={{ marginBottom: '0.85rem', fontSize: '0.95rem' }}>
            Biztosan véglegesen törölni szeretné a(z) <strong style={{ color: 'var(--brand-accent)' }}>{u.email}</strong> felhasználói fiókot?
          </p>
          {u.childName && (
            <div style={{ background: 'var(--bg-input)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '0.85rem', fontSize: '0.88rem' }}>
              🎓 Hozzárendelt tanuló (11. D): <strong>{u.childName}</strong>
            </div>
          )}
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--danger-text)', fontSize: '0.82rem', fontWeight: 600 }}>
            ⚠️ <strong>Figyelem:</strong> A törlést követően a szülő elveszíti hozzáférését a portálhoz, és a tanulóhoz új regisztrációs hely szabadul fel.
          </div>
        </div>
      ),
      onConfirm: async () => {
        await AppStore.deleteUser(u);
        const updated = AppStore.getUsers();
        setUsers(updated);
        onNotify?.(`Felhasználó (${u.email}) törölve.`);
      }
    });
  };

  // --- Send Direct Email via Gmail SMTP ---
  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailForm.to || !emailForm.subject || !emailForm.message) return;

    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailForm.to,
          subject: emailForm.subject,
          html: `
            <div style="font-family: sans-serif; background: #0f172a; color: #fff; padding: 25px; border-radius: 8px;">
              <h2 style="color: #38bdf8; margin-top: 0;">Nyíregyházi SZC Széchenyi István Technikum - 11. D</h2>
              <div style="background: #1e293b; padding: 20px; border-radius: 6px; margin: 15px 0; font-size: 15px; line-height: 1.6; white-space: pre-line;">
                ${emailForm.message}
              </div>
              <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #334155; padding-top: 10px;">
                Küldő: SZMK Vezetőség • rekalaca@gmail.com
              </p>
            </div>
          `
        })
      });

      const data = await res.json();
      if (data.success) {
        onNotify?.('✉️ Email sikeresen elküldve a megadott címre!');
        setEmailForm({ to: '', subject: '', message: '' });
      } else {
        showAlert('Email Küldési Hiba', data.error || 'Ismeretlen hiba történt a levél küldésekor.', 'danger');
      }
    } catch (err) {
      showAlert('Szerverkapcsolati Hiba', 'Hiba történt a küldés közben: ' + err.message, 'danger');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Tab definitions matching the premium main navigation style
  const adminTabs = [
    { id: 'finances', label: 'Pénzügyek', icon: '💰', count: finances.length },
    { id: 'news', label: 'Hírek', icon: '📰', count: newsList.length },
    { id: 'users', label: 'Szülők', icon: '👥', count: users.length },
    { id: 'email', label: 'Email Küldés (Gmail)', icon: '✉️' },
    { id: 'namedays', label: 'Névnapi Értesítések', icon: '🎂', count: teachers.length }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Admin Header with Prominent Glass Navigation */}
      <div className="admin-header-card">
        <div className="admin-header-top">
          <div className="admin-header-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span className="badge badge-warning admin-title-badge">🛡️ Rendszergazda</span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.78rem',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  background: 'rgba(212, 175, 55, 0.12)',
                  color: 'var(--brand-accent)'
                }}
                title="Főoldal megnyitása új böngészőlapon"
              >
                🌐 Weboldal megnyitása új ablakban ↗
              </a>
            </div>
            <h2 className="admin-header-title">Adminisztrációs Kezelőpult</h2>
            <p className="admin-header-subtitle">
              Pénzügyek, hírek, szülői regisztrációk és közvetlen Gmail értesítések kezelése
            </p>
          </div>

          <div className="admin-nav-bar">
            {adminTabs.map((tab) => {
              const isActive = adminSection === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setAdminSection(tab.id)}
                >
                  <span className="admin-nav-icon">{tab.icon}</span>
                  <span className="admin-nav-label">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`admin-nav-count ${isActive ? 'active' : ''}`}>
                      ({tab.count})
                    </span>
                  )}
                  {isActive && <span className="admin-nav-active-glow" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. FINANCES TAB */}
      {adminSection === 'finances' && (() => {
        const bankIncomesTotal = finances
          .filter(f => f.type === 'income' && f.paymentMethod !== 'cash')
          .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

        const cashIncomesTotal = finances
          .filter(f => f.type === 'income' && f.paymentMethod === 'cash')
          .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

        const totalExpensesAmt = finances
          .filter(f => f.type === 'expense')
          .reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

        const filteredFinances = [...finances]
          .filter(f => {
            if (finMethodFilter === 'cash') return f.paymentMethod === 'cash';
            if (finMethodFilter === 'bank') return f.paymentMethod !== 'cash';
            return true;
          })
          .reverse();

        const cashCount = finances.filter(f => f.paymentMethod === 'cash').length;
        const bankCount = finances.filter(f => f.paymentMethod !== 'cash').length;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Setting: Show Trip Contribution on Home */}
            <div
              className="table-card"
              style={{
                padding: '0.85rem 1.25rem',
                marginBottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🚌 Kirándulási hozzájárulás megjelenítése a szülői főoldalon
                </strong>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Ha be van kapcsolva, a szülők a 3. tanévi gyermek adatainál látják a kirándulás hozzájárulási összeget (év végi elszámoláskor ajánlott).
                </p>
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={settings?.showTripContributionOnHome === true}
                  onChange={handleToggleTripContribution}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--brand-accent)' }}
                />
                <span>{settings?.showTripContributionOnHome ? '✅ Bekapcsolva' : '❌ Kikapcsolva'}</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {/* Add finance form */}
            <div className="table-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
                ➕ Új Pénzügyi Tétel Rögzítése (3. Tanév)
              </h3>
              <form onSubmit={handleAddFinance}>
                <div className="form-group">
                  <label>Pénzügyi Művelet Típusa</label>
                  <select
                    value={finForm.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setFinForm(prev => ({
                        ...prev,
                        type: newType,
                        category: newType === 'income' ? 'class_fee' : 'nameday',
                        amount: newType === 'income' ? '3000' : ''
                      }));
                    }}
                  >
                    <option value="income">🟢 Bevétel (Befizetés, támogatás)</option>
                    <option value="expense">🔴 Kiadás (Vásárlás, költség)</option>
                  </select>
                </div>

                {/* Payment method selector (Bank transfer vs Cash) */}
                <div className="form-group">
                  <label>Fizetési Mód / Teljesítés formája *</label>
                  <select
                    value={finForm.paymentMethod}
                    onChange={(e) => setFinForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  >
                    <option value="bank">🏦 Banki átutalás (OTP Bankszámla)</option>
                    <option value="cash">💵 Készpénz (Házipénztár / Készpénzes befizetés)</option>
                  </select>
                  <small style={{ color: finForm.paymentMethod === 'cash' ? 'var(--brand-accent)' : 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: finForm.paymentMethod === 'cash' ? 700 : 400 }}>
                    {finForm.paymentMethod === 'cash'
                      ? '💵 Készpénzes tételként kerül rögzítésre és a kimutatásban készpénzes jelöléssel jelenik meg.'
                      : '🏦 Hivatalos OTP banki átutalásként kerül rögzítésre.'}
                  </small>
                </div>

                {/* Income subcategories */}
                {finForm.type === 'income' && (
                  <div className="form-group">
                    <label>Bevétel Kategóriája (Almenü)</label>
                    <select
                      value={finForm.category}
                      onChange={(e) => setFinForm(prev => ({
                        ...prev,
                        category: e.target.value,
                        amount: e.target.value === 'class_fee' ? '3000' : prev.amount
                      }))}
                    >
                      <option value="class_fee">💰 Osztálypénz (Havi 3 000 Ft)</option>
                      <option value="trip">🚌 Kirándulás hozzájárulás</option>
                      <option value="arrears">⚖️ Elmaradás rendezése</option>
                      <option value="other_income">📦 Egyéb bevétel</option>
                    </select>
                  </div>
                )}

                {/* Student selection for class_fee, trip, or arrears */}
                {finForm.type === 'income' && ['class_fee', 'trip', 'arrears'].includes(finForm.category) && (
                  <div className="form-group">
                    <label>Tanuló Kiválasztása (37 fős lista) *</label>
                    <div className="input-with-icon">
                      <span className="input-icon">🎓</span>
                      <select
                        value={finForm.studentName}
                        onChange={(e) => setFinForm(prev => ({ ...prev, studentName: e.target.value }))}
                        required
                      >
                        {students.map((name, idx) => (
                          <option key={idx} value={name}>{idx + 1}. {name}</option>
                        ))}
                      </select>
                    </div>
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                      ℹ️ A tétel automatikusan jóváírásra kerül a 3. tanévi banki elszámolásban és a szülői felületen!
                    </small>
                  </div>
                )}

                {/* Note field for other_income */}
                {finForm.type === 'income' && finForm.category === 'other_income' && (
                  <div className="form-group">
                    <label>Megjegyzés / Bevételi Forrás *</label>
                    <input
                      type="text"
                      placeholder="Pl. Támogatás, szülői felajánlás, kamat..."
                      value={finForm.note}
                      onChange={(e) => setFinForm(prev => ({ ...prev, note: e.target.value }))}
                      required
                    />
                  </div>
                )}

                {/* Expense subcategories */}
                {finForm.type === 'expense' && (
                  <div className="form-group">
                    <label>Kiadás Kategóriája (Almenü)</label>
                    <select
                      value={finForm.category}
                      onChange={(e) => setFinForm(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="nameday">🎂 Névnapok</option>
                      <option value="bank_cost">🏦 Banki költségek</option>
                      <option value="cash_withdrawal">🏧 Készpénzfelvételi díj</option>
                      <option value="other_expense">🧾 Egyéb kiadás</option>
                    </select>
                  </div>
                )}

                {/* Expense Note for Nameday and Other */}
                {finForm.type === 'expense' && (finForm.category === 'nameday' || finForm.category === 'other_expense') && (
                  <div className="form-group">
                    <label>Megjegyzés / Részletek *</label>
                    <input
                      type="text"
                      placeholder={finForm.category === 'nameday' ? 'Pl. Füzesiné Tóth Ildikó virágcsokor' : 'Pl. Rendezvény kellékek, nyomtatás...'}
                      value={finForm.note}
                      onChange={(e) => setFinForm(prev => ({ ...prev, note: e.target.value }))}
                      required
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Összeg (Ft) *</label>
                    <input
                      type="number"
                      placeholder="3000"
                      value={finForm.amount}
                      onChange={(e) => setFinForm(prev => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Dátum *</label>
                    <input
                      type="date"
                      value={finForm.date}
                      onChange={(e) => setFinForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  💾 Tétel Rögzítése és Könyvelése
                </button>
              </form>
            </div>

            {/* Finances list */}
            <div className="table-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>📋 Rögzített Tételek</h3>

                {/* Filter pills: All / Bank / Cash */}
                <div style={{ display: 'inline-flex', gap: '4px', background: 'var(--bg-input)', padding: '3px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
                  <button
                    type="button"
                    onClick={() => setFinMethodFilter('all')}
                    style={{
                      background: finMethodFilter === 'all' ? 'var(--brand-accent)' : 'transparent',
                      color: finMethodFilter === 'all' ? '#000' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Összes ({finances.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinMethodFilter('bank')}
                    style={{
                      background: finMethodFilter === 'bank' ? '#4338ca' : 'transparent',
                      color: finMethodFilter === 'bank' ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🏦 Bank ({bankCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinMethodFilter('cash')}
                    style={{
                      background: finMethodFilter === 'cash' ? '#d97706' : 'transparent',
                      color: finMethodFilter === 'cash' ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    💵 Készpénz ({cashCount})
                  </button>
                </div>
              </div>

              {/* Quick mini-summary pill bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                <div style={{ background: 'var(--bg-input)', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <small style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>🏦 Banki bevételek</small>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--success-text)' }}>{bankIncomesTotal.toLocaleString('hu-HU')} Ft</strong>
                </div>
                <div style={{ background: 'var(--bg-input)', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <small style={{ fontSize: '0.7rem', color: 'var(--brand-accent)', display: 'block' }}>💵 Készpénz bevétel</small>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--brand-accent)' }}>{cashIncomesTotal.toLocaleString('hu-HU')} Ft</strong>
                </div>
                <div style={{ background: 'var(--bg-input)', padding: '0.45rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <small style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>🔴 Kiadások</small>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--danger-text)' }}>{totalExpensesAmt.toLocaleString('hu-HU')} Ft</strong>
                </div>
              </div>

              {filteredFinances.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem 0' }}>
                  {finances.length === 0
                    ? 'Még nincsenek egyedi tételek rögzítve a 3. tanévre.'
                    : 'Nincs a kiválasztott szűrésnek megfelelő tétel.'}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {filteredFinances.map((f) => (
                    <div
                      key={f.id}
                      style={{
                        background: 'var(--bg-input)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginBottom: '3px' }}>
                          <span className={`badge ${f.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                            {f.type === 'income' ? '+ Bevétel' : '- Kiadás'}
                          </span>
                          <span
                            className="badge"
                            style={{
                              background: f.paymentMethod === 'cash' ? '#fef3c7' : '#e0e7ff',
                              color: f.paymentMethod === 'cash' ? '#92400e' : '#3730a3',
                              border: `1px solid ${f.paymentMethod === 'cash' ? '#fde68a' : '#c7d2fe'}`
                            }}
                          >
                            {f.paymentMethod === 'cash' ? '💵 Készpénz' : '🏦 Banki utalás'}
                          </span>
                        </div>
                        <strong>{f.title}</strong>
                        <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {f.date} • {Number(f.amount).toLocaleString('hu-HU')} Ft
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteFinance(f)}
                        title="Tétel törlése"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        );
      })()}

      {/* 2. NEWS TAB */}
      {adminSection === 'news' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="table-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>✍️ Új Hír / Esemény Létrehozása</h3>
            <form onSubmit={handleAddNews}>
              <div className="form-group">
                <label>Hír címe *</label>
                <input
                  type="text"
                  placeholder="Pl. Szülői értekezlet időpontja..."
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Kategória</label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                  >
                    <option value="Pénzügy">Pénzügy</option>
                    <option value="Iskolai élet">Iskolai élet</option>
                    <option value="Esemény">Esemény</option>
                    <option value="Kirándulás">Kirándulás</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Jelvény / Badge</label>
                  <input
                    type="text"
                    placeholder="Fontos / Új / Esemény"
                    value={newsForm.badge}
                    onChange={(e) => setNewsForm({ ...newsForm, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Kép URL (Opcionális)</label>
                <input
                  type="text"
                  placeholder="/pictures/osztalypenz.png vagy külső link"
                  value={newsForm.image}
                  onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Hír szövege *</label>
                <textarea
                  rows={4}
                  placeholder="A hír részletes leírása..."
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  required
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newsForm.pinned}
                    onChange={(e) => setNewsForm({ ...newsForm, pinned: e.target.checked })}
                  />
                  <span>📌 Hír kitűzése a lista elejére</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                🚀 Hír Közzététele
              </button>
            </form>
          </div>

          <div className="table-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>📰 Meglévő Hírek</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {newsList.map((n) => (
                <div
                  key={n.id}
                  style={{
                    background: 'var(--bg-input)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ overflow: 'hidden', paddingRight: '0.5rem' }}>
                    <strong>{n.pinned ? '📌 ' : ''}{n.title}</strong>
                    <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {n.date} • {n.category} • Szerző: {n.author}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteNews(n)}
                    title="Hír törlése"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. USERS TAB */}
      {adminSection === 'users' && (
        <div className="table-card">
          <div className="table-header-row">
            <div>
              <h3 className="table-title">👥 Regisztrált Szülői & Admin Fiókok ({users.length})</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Tanulónként legfeljebb 2 szülői fiók engedélyezett (GDPR és biztonsági szabály)
              </p>
            </div>
          </div>

          <div className="responsive-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>E-mail cím</th>
                  <th>Hozzárendelt Tanuló (11. D)</th>
                  <th>Szerepkör</th>
                  <th>Státusz</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const regCount = u.childName ? AppStore.getRegistrationCountForChild(u.childName) : 0;
                  return (
                    <tr key={u.id}>
                      <td><strong>{u.email}</strong></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <div>
                            <strong>{u.childName || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Nincs hozzárendelve</span>}</strong>
                            {u.childName && (
                              <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                (Regisztrált szülők száma a diákhoz: {regCount}/2)
                              </small>
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingChildUser({ user: u, selectedChild: u.childName || students[0] })}
                            title="Hozzárendelt tanuló módosítása"
                            style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', borderRadius: '4px', flexShrink: 0 }}
                          >
                            ✏️
                          </button>
                        </div>
                      </td>
                      <td>
                        {isFixedAdmin(u.email) ? (
                          <span className="badge badge-warning" style={{ background: 'linear-gradient(135deg, #d4af37, #f39c12)', color: '#000', fontWeight: 800, border: 'none' }}>
                            👑 SZMK Vezető (Admin)
                          </span>
                        ) : (
                          <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                            {u.role === 'admin' ? '👑 Adminisztrátor' : '👤 Szülő'}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-success">✓ Megerősítve</span>
                      </td>
                      <td>
                        {isFixedAdmin(u.email) ? (
                          <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>—</span>
                        ) : (
                          <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className={`btn btn-sm ${u.role === 'admin' ? 'btn-secondary' : 'btn-primary'}`}
                              onClick={() => handleToggleAdminRole(u)}
                              title={u.role === 'admin' ? 'Admin jog megvonása (szülővé tétel)' : 'Adminisztrátori jog adása'}
                              style={{ padding: '0.32rem 0.65rem', fontSize: '0.78rem' }}
                            >
                              {u.role === 'admin' ? '👤 Szülővé tétel' : '👑 Legyen Admin'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteUser(u)}
                              title="Fiók törlése"
                              style={{ padding: '0.32rem 0.65rem', fontSize: '0.78rem' }}
                            >
                              🗑️ Törlés
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. EMAIL DISPATCHER TAB (GMAIL SMTP) */}
      {adminSection === 'email' && (
        <div className="table-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            ✉️ Közvetlen Email Küldése Szülőnek (Gmail SMTP)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            A leveleket a szerver automatikusan a hitelesített <strong>rekalaca@gmail.com</strong> címről küldi el.
          </p>

          <form onSubmit={handleSendEmail}>
            <div className="form-group">
              <label>Címzett E-mail címe *</label>
              <input
                type="email"
                placeholder="pelda@szulo.hu"
                value={emailForm.to}
                onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Tárgya *</label>
              <input
                type="text"
                placeholder="Pl. Tájékoztatás osztálypénz befizetésről"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Üzenet szövege *</label>
              <textarea
                rows={6}
                placeholder="Kedves Szülő! ..."
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-accent btn-block"
              disabled={isSendingEmail}
            >
              {isSendingEmail ? '⏳ Küldés folyamatban...' : '🚀 Email Elküldése Gmailen Keresztül'}
            </button>
          </form>
        </div>
      )}

      {/* 5. NAMEDAYS DISPATCHER TAB */}
      {adminSection === 'namedays' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="table-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  🎂 Tanári Névnapi Automatikus Emlékeztető Rendszer
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  A rendszer automatikusan ellenőrzi a tanárok névnapjait, és <strong>3 nappal a névnap előtt</strong> emlékeztető emailt küld a <strong>rekalaca@gmail.com</strong> címre, hogy időben fel tudjunk készülni (virág, ajándék, köszöntés).
                </p>
              </div>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--accent-gold)', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
                🔔 Cél email: <strong>rekalaca@gmail.com</strong>
              </div>
            </div>

            <div className="responsive-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tanár Neve</th>
                    <th>Tantárgy</th>
                    <th>Magyar Névnap</th>
                    <th>Hátralévő Idő</th>
                    <th>Művelet (Teszt küldés)</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => {
                    const statusItem = namedayStatus?.teachers?.find(x => x.id === t.id);
                    const daysLeft = statusItem ? statusItem.daysUntil : null;
                    const isUpcoming3Days = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;

                    return (
                      <tr key={t.id} style={isUpcoming3Days ? { background: 'rgba(212, 175, 55, 0.08)' } : undefined}>
                        <td>
                          <strong>{t.name}</strong>
                          {isUpcoming3Days && (
                            <span className="badge badge-warning" style={{ marginLeft: '8px', fontSize: '0.7rem' }}>
                              ⚠️ Közelgő!
                            </span>
                          )}
                        </td>
                        <td>{t.subject}</td>
                        <td>
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                            {t.namedayDisplay || t.nameday}
                          </span>
                        </td>
                        <td>
                          {daysLeft !== null ? (
                            daysLeft === 0 ? (
                              <span className="badge badge-success">🎉 MA VAN!</span>
                            ) : (
                              <span className={`badge ${daysLeft <= 3 ? 'badge-warning' : 'badge-primary'}`}>
                                {daysLeft} nap múlva
                              </span>
                            )
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>Számítás...</span>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleSendTestNamedayReminder(t)}
                            disabled={testingTeacherId === t.id}
                            title="Azonnali teszt emlékeztető küldése a rekalaca@gmail.com címre"
                          >
                            {testingTeacherId === t.id ? '⏳ Küldés...' : '✉️ Teszt Emlékeztető'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Elegant Custom Confirmation / Alert Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        isAlertOnly={confirmDialog.isAlertOnly}
        onConfirm={confirmDialog.onConfirm}
        onClose={closeConfirmDialog}
      />

      {/* Student Assignment Modal */}
      {editingChildUser && (
        <div className="modal-overlay" onClick={() => setEditingChildUser(null)}>
          <div className="modal-card" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>🎓 Tanuló Hozzárendelése / Módosítása</h3>
              <button type="button" className="close-btn" onClick={() => setEditingChildUser(null)}>✕</button>
            </div>
            <div style={{ padding: '1.25rem 0' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                Válassza ki, hogy <strong style={{ color: 'var(--brand-accent)' }}>{editingChildUser.user.email}</strong> melyik 11. D osztályos tanulóhoz tartozzon:
              </p>
              <div className="form-group">
                <label>11. D Tanuló Neve (37 fős névsor):</label>
                <select
                  value={editingChildUser.selectedChild}
                  onChange={e => setEditingChildUser({ ...editingChildUser, selectedChild: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                >
                  <option value="">— Nincs tanuló hozzárendelve —</option>
                  {students.map((student, idx) => (
                    <option key={idx} value={student}>{idx + 1}. {student}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingChildUser(null)}>Mégse</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSaveAssignedChild(editingChildUser.user, editingChildUser.selectedChild)}
              >
                💾 Mentés
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
