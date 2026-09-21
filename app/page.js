'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import SubHeaderNav from '@/components/layout/SubHeaderNav';
import MobileDrawer from '@/components/layout/MobileDrawer';
import FloatingSearch from '@/components/layout/FloatingSearch';

import StatsOverview from '@/components/dashboard/StatsOverview';
import HomeTab from '@/components/dashboard/HomeTab';
import BankSheetY3Tab from '@/components/dashboard/BankSheetY3Tab';
import BankSheetY2Tab from '@/components/dashboard/BankSheetY2Tab';
import BankSheetY1Tab from '@/components/dashboard/BankSheetY1Tab';
import NewsTab from '@/components/dashboard/NewsTab';
import SzmkTab from '@/components/dashboard/SzmkTab';
import InfoTab from '@/components/dashboard/InfoTab';
import AdminTab from '@/components/dashboard/AdminTab';

import AuthCard from '@/components/auth/AuthCard';
import StudentLimitModal from '@/components/auth/StudentLimitModal';
import EmailVerifyModal from '@/components/modals/EmailVerifyModal';
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal';
import PrivacyModal from '@/components/modals/PrivacyModal';

import { AppStore } from '@/lib/store';

export default function HomePage() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [mounted, setMounted] = useState(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  const [studentLimitName, setStudentLimitName] = useState(null);
  const [pendingVerification, setPendingVerification] = useState(null); // { email, childName, password, demoCode }

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [, setStoreVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setStoreVersion(v => v + 1);
    };
    window.addEventListener('szechenyi_store_updated', handleUpdate);

    const initApp = async () => {
      await AppStore.init();
      const user = AppStore.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
      setMounted(true);
      setStoreVersion(v => v + 1);
    };
    initApp();

    const storedTheme = localStorage.getItem('szechenyi_theme') || 'dark';
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);

    return () => {
      window.removeEventListener('szechenyi_store_updated', handleUpdate);
    };
  }, []);

  // Automatic 3-day Nameday reminder check
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetch('/api/nameday-reminder?trigger=true&email=rekalaca@gmail.com')
        .then((r) => r.json())
        .then((data) => {
          if (data?.sentCount > 0) {
            showToast(`🎂 ${data.sentCount} db névnapi emlékeztető kiküldve a rekalaca@gmail.com címre!`);
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('szechenyi_theme', next);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleLogout = () => {
    AppStore.setCurrentUser(null);
    setCurrentUser(null);
    setActiveTab('home');
    showToast('Sikeresen kijelentkezett.');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('home');
    showToast(`Üdvözöljük, ${user.email}!`);
  };

  const handleVerifySuccess = async () => {
    if (!pendingVerification) return;

    const { email, childName, password } = pendingVerification;
    const users = AppStore.getUsers();

    const newUser = {
      id: 'usr-' + Date.now(),
      email,
      passwordHash: password,
      childName,
      role: 'parent',
      isVerified: true,
      acceptedPrivacyAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await AppStore.saveUsers(users);
    AppStore.setCurrentUser(newUser);
    setCurrentUser(newUser);
    setPendingVerification(null);
    setActiveTab('home');
    showToast('Sikeres regisztráció és belépés!');
  };

  const stats = AppStore.getFinanceStats();

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <Header
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onLogout={handleLogout}
        onNavigateHome={() => setActiveTab('home')}
      />

      {/* Sub-header Tab Bar (When logged in) */}
      {currentUser && (
        <SubHeaderNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isAdmin={currentUser.role === 'admin'}
        />
      )}

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Floating Universal Search */}
      <FloatingSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentUser={currentUser}
        onSelectResult={(tab) => {
          if (currentUser) setActiveTab(tab);
        }}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {!currentUser ? (
          /* View 1: Auth View (Login / Register) */
          <AuthCard
            onLoginSuccess={handleLoginSuccess}
            onOpenPrivacy={() => setIsPrivacyOpen(true)}
            onOpenForgotPassword={() => setIsForgotPassOpen(true)}
            onRequireEmailVerify={(data) => setPendingVerification(data)}
            onStudentLimitExceeded={(name) => setStudentLimitName(name)}
          />
        ) : (
          /* View 2: Logged-in Dashboard */
          <div>
            {/* Top 3 Stat Cards - Hidden on Admin tab as requested */}
            {activeTab !== 'admin' && <StatsOverview stats={stats} />}

            {/* Active Tab View */}
            {activeTab === 'home' && (
              <HomeTab currentUser={currentUser} onNavigateTab={setActiveTab} />
            )}

            {activeTab === 'bank-sheet-y3' && (
              <BankSheetY3Tab currentUser={currentUser} />
            )}

            {activeTab === 'bank-sheet-y2' && (
              <BankSheetY2Tab currentUser={currentUser} />
            )}

            {activeTab === 'bank-sheet-y1' && (
              <BankSheetY1Tab currentUser={currentUser} />
            )}

            {activeTab === 'news' && (
              <NewsTab />
            )}

            {activeTab === 'szmk' && (
              <SzmkTab />
            )}

            {activeTab === 'info' && (
              <InfoTab />
            )}

            {activeTab === 'admin' && currentUser.role === 'admin' && (
              <AdminTab onNotify={showToast} />
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <StudentLimitModal
        isOpen={!!studentLimitName}
        studentName={studentLimitName}
        onClose={() => setStudentLimitName(null)}
      />

      <EmailVerifyModal
        isOpen={!!pendingVerification}
        email={pendingVerification?.email}
        demoCode={pendingVerification?.demoCode}
        onClose={() => setPendingVerification(null)}
        onVerifySuccess={handleVerifySuccess}
      />

      <ForgotPasswordModal
        isOpen={isForgotPassOpen}
        onClose={() => setIsForgotPassOpen(false)}
        onNotify={showToast}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-popup">
          {toastMsg}
        </div>
      )}
    </>
  );
}
