import {
  DEFAULT_TEACHERS,
  STAT_CARDS_DATA,
  DEFAULT_BANK_RECORDS_Y1,
  DEFAULT_BANK_SUMMARY_Y1,
  DEFAULT_BANK_RECORDS_Y2,
  DEFAULT_BANK_SUMMARY_Y2,
  DEFAULT_CASH_FLOW_Y2,
  DEFAULT_BANK_RECORDS_Y3,
  DEFAULT_BANK_SUMMARY_Y3,
  DEFAULT_NEWS,
  SZMK_REPRESENTATIVES,
  DEFAULT_USERS
} from './initialData';
import { db } from './firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  USERS: 'szechenyi_11d_users',
  STUDENTS: 'szechenyi_11d_students',
  NEWS: 'szechenyi_11d_news',
  BANK_RECORDS_Y1: 'szechenyi_11d_bank_records_y1',
  BANK_RECORDS_Y2: 'szechenyi_11d_bank_records_y2',
  TEACHERS: 'szechenyi_11d_teachers',
  FINANCES: 'szechenyi_11d_finances',
  CURRENT_USER: 'szechenyi_11d_current_user',
  THEME: 'szechenyi_theme',
  SETTINGS: 'szechenyi_11d_settings'
};

export const AppStore = {
  // Init data in browser and sync with Firestore
  async init() {
    if (typeof window === 'undefined') return;

    // 1. Initial Local Setup
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    } else {
      const users = this.getUsers();
      let changed = false;
      DEFAULT_USERS.forEach(defUser => {
        const existing = users.find(u => u.email.toLowerCase() === defUser.email.toLowerCase());
        if (!existing) {
          users.push(defUser);
          changed = true;
        } else if (defUser.role === 'admin' && existing.role !== 'admin') {
          existing.role = 'admin';
          changed = true;
        }
      });
      if (changed) {
        this.saveUsers(users);
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(DEFAULT_NEWS));
    }

    // 2. Cloud Sync from Firestore
    await this.syncFromCloud();
  },

  notifyUpdate() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('szechenyi_store_updated'));
    }
  },

  async syncFromCloud() {
    if (!db || typeof window === 'undefined') return;

    try {
      // Sync Users
      const usersSnap = await getDocs(collection(db, 'users'));
      if (!usersSnap.empty) {
        const cloudUsers = [];
        usersSnap.forEach(d => {
          const u = { id: d.id, ...d.data() };
          const cleanEmail = u.email?.toLowerCase();
          if (cleanEmail === 'rekalaca@gmail.com' || cleanEmail === 'haritunde11@gmail.com') {
            u.role = 'admin';
          }
          cloudUsers.push(u);
        });
        DEFAULT_USERS.forEach(defUser => {
          if (!cloudUsers.some(u => u.email.toLowerCase() === defUser.email.toLowerCase())) {
            cloudUsers.push(defUser);
          }
        });
        if (cloudUsers.length > 0) {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cloudUsers));
        }
      } else {
        // Seed default users to Firestore
        const localUsers = this.getUsers();
        for (const u of localUsers) {
          const docId = u.email.replace(/[^a-zA-Z0-9]/g, '_');
          await setDoc(doc(db, 'users', docId), u, { merge: true });
        }
      }

      // Sync News
      const newsSnap = await getDocs(collection(db, 'news'));
      if (!newsSnap.empty) {
        const cloudNews = [];
        newsSnap.forEach(d => cloudNews.push({ id: d.id, ...d.data() }));
        if (cloudNews.length > 0) {
          localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(cloudNews));
        }
      } else {
        // Seed default news to Firestore
        const localNews = this.getNews();
        for (const n of localNews) {
          const docId = String(n.id);
          await setDoc(doc(db, 'news', docId), n, { merge: true });
        }
      }

      // Sync Finances
      const finSnap = await getDocs(collection(db, 'finances'));
      if (!finSnap.empty) {
        const cloudFin = [];
        finSnap.forEach(d => cloudFin.push({ id: d.id, ...d.data() }));
        localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(cloudFin));
      }

      this.notifyUpdate();
    } catch (err) {
      console.warn('Firestore sync notice (offline or rules fallback):', err.message);
    }
  },

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getUsers() {
    if (typeof window === 'undefined') return DEFAULT_USERS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  },

  async saveUsers(users) {
    if (typeof window === 'undefined') return;
    const sanitizedUsers = users.map(u => {
      const cleanEmail = u.email?.toLowerCase();
      if (cleanEmail === 'rekalaca@gmail.com' || cleanEmail === 'haritunde11@gmail.com') {
        return { ...u, role: 'admin' };
      }
      return u;
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sanitizedUsers));
    this.notifyUpdate();

    if (db) {
      try {
        for (const u of sanitizedUsers) {
          const docId = u.email.replace(/[^a-zA-Z0-9]/g, '_');
          await setDoc(doc(db, 'users', docId), u, { merge: true });
        }
      } catch (err) {
        console.warn('Could not save users to Firestore:', err.message);
      }
    }
  },

  async deleteUser(u) {
    if (typeof window === 'undefined') return;
    const targetEmail = (typeof u === 'string' ? u : u?.email || '').trim().toLowerCase();
    const targetId = (typeof u === 'object' ? u?.id : '') || '';

    // Állandó SZMK vezetői védelem
    if (targetEmail === 'rekalaca@gmail.com' || targetEmail === 'haritunde11@gmail.com') {
      console.warn('Az állandó SZMK adminisztrátorok fiókja védett, nem törölhető.');
      return;
    }

    let users = this.getUsers();
    users = users.filter(user => {
      if (targetEmail && user.email?.toLowerCase() === targetEmail) return false;
      if (targetId && user.id === targetId) return false;
      return true;
    });

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notifyUpdate();

    if (db) {
      try {
        if (targetEmail) {
          const docId = targetEmail.replace(/[^a-zA-Z0-9]/g, '_');
          await deleteDoc(doc(db, 'users', docId));
        }
        if (targetId) {
          await deleteDoc(doc(db, 'users', targetId));
        }
      } catch (err) {
        console.warn('Could not delete user from Firestore:', err.message);
      }
    }
  },

  getRegistrationCountForChild(childName) {
    const users = this.getUsers();
    const clean = childName.trim().toLowerCase();
    return users.filter(u => u.childName && u.childName.trim().toLowerCase() === clean).length;
  },

  getStudents() {
    return DEFAULT_BANK_RECORDS_Y2.map(r => r.name);
  },

  getStudentsList() {
    return DEFAULT_BANK_RECORDS_Y2.map((r, index) => ({
      id: r.id || (index + 1),
      name: r.name,
      class: "11. D",
      specialization: "Informatika és távközlés",
      subSpecialization: "Szoftverfejlesztő / Rendszerüzemeltető"
    }));
  },

  getBankRecordsY1() {
    return DEFAULT_BANK_RECORDS_Y1;
  },

  getBankSummaryY1() {
    return DEFAULT_BANK_SUMMARY_Y1;
  },

  getBankRecordsY2() {
    return DEFAULT_BANK_RECORDS_Y2;
  },

  getBankSummaryY2() {
    return DEFAULT_BANK_SUMMARY_Y2;
  },

  getCashFlowY2() {
    return DEFAULT_CASH_FLOW_Y2;
  },

  getBankRecordsY3() {
    const baseRecords = DEFAULT_BANK_RECORDS_Y3.map(r => ({ ...r }));
    const finances = this.getFinances();

    finances.forEach(f => {
      const amt = Number(f.amount) || 0;
      if (amt <= 0) return;

      if (f.type === 'income' && f.studentName) {
        const cleanName = f.studentName.trim().toLowerCase();
        const record = baseRecords.find(r => r.name.toLowerCase() === cleanName);
        if (record) {
          let monthKey = 'm09';
          if (f.date) {
            const m = f.date.split('-')[1];
            if (m === '09') monthKey = 'm09';
            else if (m === '10') monthKey = 'm10';
            else if (m === '11') monthKey = 'm11';
            else if (m === '12') monthKey = 'm12';
            else if (m === '01') monthKey = 'm01';
            else if (m === '02') monthKey = 'm02';
            else if (m === '03') monthKey = 'm03';
            else if (m === '04') monthKey = 'm04';
            else if (m === '05') monthKey = 'm05';
            else if (m === '06') monthKey = 'm06';
          }

          if (f.category === 'class_fee' || !f.category || f.category === 'Osztálypénz') {
            const currVal = parseInt((record[monthKey] || '0').replace(/\D/g, ''), 10) || 0;
            record[monthKey] = (currVal + amt).toLocaleString('hu-HU') + ' Ft';

            const currTotal = parseInt((record.total || '0').replace(/\D/g, ''), 10) || 0;
            const newTotal = currTotal + amt;
            record.total = newTotal.toLocaleString('hu-HU') + ' Ft';

            const targetFee = record.name.toLowerCase().includes('hudák levente') ? 28000 : 30000;
            const remainingDebt = Math.max(0, targetFee - newTotal);
            record.debt = remainingDebt.toLocaleString('hu-HU') + ' Ft';
            if (f.paymentMethod === 'cash') {
              record.note = (record.note ? record.note + ' • ' : '') + `Készpénzes osztálypénz (${amt.toLocaleString('hu-HU')} Ft)`;
            }
          } else if (f.category === 'trip' || f.category === 'Kirándulás') {
            const currTrip = parseInt((record.trip || '0').replace(/\D/g, ''), 10) || 0;
            record.trip = (currTrip + amt).toLocaleString('hu-HU') + ' Ft';
            if (f.paymentMethod === 'cash') {
              record.note = (record.note ? record.note + ' • ' : '') + `Készpénzes kirándulás (${amt.toLocaleString('hu-HU')} Ft)`;
            }
          } else if (f.category === 'arrears' || f.category === 'Elmaradás rendezése') {
            const currPrev = parseInt((record.prevDebt || '0').replace(/\D/g, ''), 10) || 0;
            const newPrev = Math.max(0, currPrev - amt);
            record.prevDebt = newPrev === 0 ? '' : newPrev.toLocaleString('hu-HU') + ' Ft';
            if (newPrev === 0) {
              record.note = (record.note ? record.note + ' • ' : '') + 'Korábbi elmaradás rendezve!';
            }
            if (f.paymentMethod === 'cash') {
              record.note = (record.note ? record.note + ' • ' : '') + `Készpénzes elmaradás rendezés (${amt.toLocaleString('hu-HU')} Ft)`;
            }
          }
        }
      }
    });

    return baseRecords;
  },

  getBankSummaryY3() {
    const records = this.getBankRecordsY3();
    const finances = this.getFinances();

    let totalDebt = 0;
    let totalTrip = 0;

    const monthlyTotals = {
      m09: 0, m10: 0, m11: 0, m12: 0, m01: 0, m02: 0, m03: 0, m04: 0, m05: 0, m06: 0
    };

    records.forEach(r => {
      ['m09', 'm10', 'm11', 'm12', 'm01', 'm02', 'm03', 'm04', 'm05', 'm06'].forEach(m => {
        const val = parseInt((r[m] || '0').replace(/\D/g, ''), 10) || 0;
        monthlyTotals[m] += val;
      });
      totalDebt += parseInt((r.debt || '0').replace(/\D/g, ''), 10) || 0;
      totalTrip += parseInt((r.trip || '0').replace(/\D/g, ''), 10) || 0;
    });

    const sumMonthlyIncome = Object.values(monthlyTotals).reduce((a, b) => a + b, 0);

    let totalIncomeAmt = 0;
    finances.forEach(f => {
      if (f.type === 'income') {
        totalIncomeAmt += Number(f.amount) || 0;
      }
    });

    const effectiveTotalIncome = totalIncomeAmt > 0 ? totalIncomeAmt : (sumMonthlyIncome + totalTrip);

    const expenseCategories = {
      nameday: { name: 'Névnapok', total: 0 },
      bank_cost: { name: 'Banki költség', total: 0 },
      cash_withdrawal: { name: 'Banki költség kp felv.', total: 0 },
      other_expense: { name: 'Egyéb kiadás', total: 0 }
    };

    let totalExpenseAmt = 0;
    finances.forEach(f => {
      if (f.type === 'expense') {
        const amt = Number(f.amount) || 0;
        totalExpenseAmt += amt;
        const cat = f.category || 'other_expense';
        const target = expenseCategories[cat] || expenseCategories.other_expense;
        target.total += amt;
      }
    });

    const formatM = (num) => num > 0 ? num.toLocaleString('hu-HU') + ' Ft' : '';

    return {
      monthlyIncomeTotals: {
        m09: formatM(monthlyTotals.m09),
        m10: formatM(monthlyTotals.m10),
        m11: formatM(monthlyTotals.m11),
        m12: formatM(monthlyTotals.m12),
        m01: formatM(monthlyTotals.m01),
        m02: formatM(monthlyTotals.m02),
        m03: formatM(monthlyTotals.m03),
        m04: formatM(monthlyTotals.m04),
        m05: formatM(monthlyTotals.m05),
        m06: formatM(monthlyTotals.m06),
        total: sumMonthlyIncome.toLocaleString('hu-HU') + ' Ft',
        debtTotal: totalDebt.toLocaleString('hu-HU') + ' Ft',
        tripTotal: totalTrip.toLocaleString('hu-HU') + ' Ft'
      },
      monthlyExpenses: Object.values(expenseCategories).map(c => ({
        name: c.name,
        total: c.total > 0 ? c.total.toLocaleString('hu-HU') + ' Ft' : '0 Ft'
      })),
      openingBalance: 1247421,
      totalIncome: effectiveTotalIncome,
      totalExpenses: totalExpenseAmt,
      closingOtpBalance: 1247421 + effectiveTotalIncome - totalExpenseAmt
    };
  },

  getStatCardsData() {
    return STAT_CARDS_DATA;
  },

  getSZMK() {
    return SZMK_REPRESENTATIVES;
  },

  getTeachers() {
    if (typeof window === 'undefined') return DEFAULT_TEACHERS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      return data ? JSON.parse(data) : DEFAULT_TEACHERS;
    } catch {
      return DEFAULT_TEACHERS;
    }
  },

  getNews() {
    if (typeof window === 'undefined') return DEFAULT_NEWS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NEWS);
      return data ? JSON.parse(data) : DEFAULT_NEWS;
    } catch {
      return DEFAULT_NEWS;
    }
  },

  async saveNews(newsList) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newsList));
    this.notifyUpdate();
  },

  async addNews(item) {
    const list = this.getNews();
    const newItem = {
      ...item,
      id: 'news-' + Date.now(),
      date: item.date || new Date().toISOString().split('T')[0]
    };
    list.unshift(newItem);
    await this.saveNews(list);

    if (db) {
      try {
        await setDoc(doc(db, 'news', String(newItem.id)), newItem);
      } catch (err) {
        console.warn('Could not save news to Firestore:', err.message);
      }
    }
    return newItem;
  },

  async deleteNews(id) {
    let list = this.getNews();
    list = list.filter(n => n.id !== id);
    await this.saveNews(list);

    if (db) {
      try {
        await deleteDoc(doc(db, 'news', String(id)));
      } catch (err) {
        console.warn('Could not delete news from Firestore:', err.message);
      }
    }
  },

  getFinances() {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FINANCES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveFinances(finances) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(finances));
    this.notifyUpdate();
  },

  async addFinance(item) {
    const list = this.getFinances();
    const newItem = {
      ...item,
      id: 'fin-' + Date.now(),
      date: item.date || new Date().toISOString().split('T')[0]
    };
    list.unshift(newItem);
    await this.saveFinances(list);

    if (db) {
      try {
        await setDoc(doc(db, 'finances', String(newItem.id)), newItem);
      } catch (err) {
        console.warn('Could not save finance to Firestore:', err.message);
      }
    }
    return newItem;
  },

  async deleteFinance(id) {
    let list = this.getFinances();
    list = list.filter(f => f.id !== id);
    await this.saveFinances(list);

    if (db) {
      try {
        await deleteDoc(doc(db, 'finances', String(id)));
      } catch (err) {
        console.warn('Could not delete finance from Firestore:', err.message);
      }
    }
  },

  getFinanceStats() {
    const finances = this.getFinances();
    const baseStats = this.getStatCardsData();
    let totalIncome = 0;
    let totalExpense = 0;

    finances.forEach(f => {
      const amt = Number(f.amount) || 0;
      if (f.type === 'income') totalIncome += amt;
      else if (f.type === 'expense') totalExpense += amt;
    });

    return {
      broughtForward: baseStats.broughtForward,
      currentBalance: baseStats.currentBalance + totalIncome - totalExpense,
      monthlyFee: baseStats.monthlyFee,
      totalIncome,
      totalExpense
    };
  },

  getSettings() {
    if (typeof window === 'undefined') return { showTripContributionOnHome: false };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { showTripContributionOnHome: false };
    } catch {
      return { showTripContributionOnHome: false };
    }
  },

  async saveSettings(settings) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.notifyUpdate();

    if (db) {
      try {
        await setDoc(doc(db, 'settings', 'general'), settings, { merge: true });
      } catch (err) {
        console.warn('Could not save settings to Firestore:', err.message);
      }
    }
  }
};
