/**
 * app.js - Fő alkalmazásvezérlő
 * Kezeli az 1. és 2. tanév Banki elszámolás táblázatait, a valós híreket képekkel,
 * a rögzített navigációs menüt, a lebegő keresőt és a jelszó-szem funkciót.
 */

class App {
    constructor() {
        this.currentTheme = localStorage.getItem('szechenyi_theme') || 'dark';
        this.searchQuery = '';
        this.currentView = 'auth';
        this.activeDashboardTab = 'home'; // 'home' | 'bank-sheet-y2' | 'bank-sheet-y1' | 'news' | 'szmk' | 'info' | 'admin'
        this.init();
    }

    navigateToHome(event) {
        if (event) event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.authManager && window.authManager.currentUser) {
            this.switchDashboardTab('home');
        }
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.populateStudentDropdown();
        this.renderApp();
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('szechenyi_theme', theme);
        const themeIcon = document.getElementById('theme-toggle-icon');
        const themeText = document.getElementById('theme-toggle-text');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        if (themeText) {
            themeText.textContent = theme === 'dark' ? 'Világos mód' : 'Sötét mód';
        }
    }

    toggleTheme() {
        const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
    }

    togglePasswordVisibility(inputId, btnEl) {
        const input = document.getElementById(inputId);
        if (!input) return;

        if (input.type === 'password') {
            input.type = 'text';
            if (btnEl) btnEl.innerHTML = '🙈';
        } else {
            input.type = 'password';
            if (btnEl) btnEl.innerHTML = '👁️';
        }
    }

    toggleFloatingSearch() {
        const overlay = document.getElementById('floating-search-overlay');
        const input = document.getElementById('floating-search-input');
        if (!overlay) return;

        const isOpening = !overlay.classList.contains('active');
        if (isOpening) {
            overlay.classList.add('active');
            if (input) {
                input.value = '';
                input.focus();
            }
            this.handleLiveSearch('');
        } else {
            overlay.classList.remove('active');
        }
    }

    closeFloatingSearch() {
        const overlay = document.getElementById('floating-search-overlay');
        if (overlay) overlay.classList.remove('active');
    }

    handleLiveSearch(query) {
        const resultsContainer = document.getElementById('floating-search-results');
        if (!resultsContainer) return;

        const cleanQuery = query.toLowerCase().trim();
        if (cleanQuery.length < 2) {
            resultsContainer.innerHTML = '<p class="text-muted text-center" style="padding: 1rem 0; font-size: 0.85rem;">Írjon be legalább 2 betűt vagy számot a kereséshez...</p>';
            return;
        }

        const students = window.dataStore.getStudentsList();
        const bankY1 = window.dataStore.getBankRecordsY1();
        const bankY2 = window.dataStore.getBankRecordsY2();
        const news = window.dataStore.getNews();
        const szmk = window.dataStore.getSZMK();

        const matchedStudents = students.filter(s => s.name.toLowerCase().includes(cleanQuery));
        const matchedBankY2 = bankY2.filter(r => r.name.toLowerCase().includes(cleanQuery) || r.total.toLowerCase().includes(cleanQuery));
        const matchedBankY1 = bankY1.filter(r => r.name.toLowerCase().includes(cleanQuery) || r.total.toLowerCase().includes(cleanQuery));
        const matchedNews = news.filter(n => n.title.toLowerCase().includes(cleanQuery) || n.content.toLowerCase().includes(cleanQuery));
        const matchedSZMK = szmk.filter(s => s.name.toLowerCase().includes(cleanQuery) || s.role.toLowerCase().includes(cleanQuery));

        let html = '';

        if (matchedStudents.length > 0) {
            html += `<div class="search-result-category-title">🎓 11. D Tanulók (${matchedStudents.length})</div>`;
            matchedStudents.slice(0, 5).forEach(s => {
                html += `
                    <div class="search-result-item" onclick="window.app.switchDashboardTab('home'); window.app.closeFloatingSearch();">
                        <div>
                            <strong>${this.escapeHtml(s.name)}</strong>
                            <small class="d-block text-muted">${s.class} • ${s.specialization}</small>
                        </div>
                        <span class="badge badge-primary">Főoldal</span>
                    </div>
                `;
            });
        }

        if (matchedBankY2.length > 0) {
            html += `<div class="search-result-category-title">🏦 2. tanév (2025/26) tételek (${matchedBankY2.length})</div>`;
            matchedBankY2.slice(0, 4).forEach(item => {
                html += `
                    <div class="search-result-item" onclick="window.app.switchDashboardTab('bank-sheet-y2'); window.app.closeFloatingSearch();">
                        <div>
                            <strong>#${item.id} Befizetés sor</strong>
                            <small class="d-block text-muted">Összes: ${item.total} • Kirándulás: ${item.trip || '—'}</small>
                        </div>
                        <span class="badge badge-primary">Megnyitás</span>
                    </div>
                `;
            });
        }

        if (matchedBankY1.length > 0) {
            html += `<div class="search-result-category-title">🏦 1. tanév (2024/25) tételek (${matchedBankY1.length})</div>`;
            matchedBankY1.slice(0, 3).forEach(item => {
                html += `
                    <div class="search-result-item" onclick="window.app.switchDashboardTab('bank-sheet-y1'); window.app.closeFloatingSearch();">
                        <div>
                            <strong>#${item.id} Befizetés sor</strong>
                            <small class="d-block text-muted">Összes: ${item.total} • Kirándulás: ${item.trip || '—'}</small>
                        </div>
                        <span class="badge badge-secondary">Megnyitás</span>
                    </div>
                `;
            });
        }

        if (matchedNews.length > 0) {
            html += `<div class="search-result-category-title">📰 Hírek & Közlemények (${matchedNews.length})</div>`;
            matchedNews.forEach(item => {
                html += `
                    <div class="search-result-item" onclick="window.app.switchDashboardTab('news'); window.app.closeFloatingSearch();">
                        <div>
                            <strong>${this.escapeHtml(item.title)}</strong>
                            <small class="d-block text-muted">📅 ${item.date}</small>
                        </div>
                        <span class="badge badge-primary">Elolvasom</span>
                    </div>
                `;
            });
        }

        if (matchedSZMK.length > 0) {
            html += `<div class="search-result-category-title">👥 SZMK Szülők (${matchedSZMK.length})</div>`;
            matchedSZMK.forEach(item => {
                html += `
                    <div class="search-result-item" onclick="window.app.switchDashboardTab('szmk'); window.app.closeFloatingSearch();">
                        <div>
                            <strong>${this.escapeHtml(item.name)}</strong>
                            <small class="d-block text-muted">${item.role}</small>
                        </div>
                        <span class="badge badge-primary">Kapcsolat</span>
                    </div>
                `;
            });
        }

        if (!html) {
            html = `<p class="text-muted text-center" style="padding: 1.2rem 0; font-size: 0.85rem;">Nincs találat a következőre: "<strong>${this.escapeHtml(query)}</strong>"</p>`;
        }

        resultsContainer.innerHTML = html;
    }

    populateStudentDropdown() {
        const select = document.getElementById('reg-child-select');
        if (!select) return;

        const students = window.dataStore.getStudents();
        select.innerHTML = '<option value="" disabled selected>-- Válassza ki a tanulót a 37 fős listából --</option>';
        students.forEach((student, idx) => {
            const count = window.dataStore.getRegistrationCountForChild(student);
            const isFull = count >= 2;
            const option = document.createElement('option');
            option.value = student;
            option.textContent = `${idx + 1}. ${student} ${isFull ? '(⚠️ Betelt: 2/2 szülői fiók)' : `(${count}/2 fiók)`}`;
            if (isFull) {
                option.classList.add('option-full');
            }
            select.appendChild(option);
        });
    }

    renderApp() {
        const user = window.authManager.currentUser;
        const authSection = document.getElementById('auth-view-container');
        const dashboardSection = document.getElementById('parent-dashboard-view');
        const subHeaderNav = document.getElementById('sub-header-nav-container');
        const headerUserInfo = document.getElementById('header-user-info');
        const mainHeaderActions = document.getElementById('main-header-actions');
        const mobileHamburgerBtn = document.getElementById('mobile-hamburger-btn');

        this.closeMobileMenu();

        // Reset views
        if (authSection) authSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.add('hidden');
        if (subHeaderNav) subHeaderNav.classList.add('hidden');

        if (!user) {
            this.currentView = 'auth';
            this.activeDashboardTab = 'bank-sheet-y2';
            if (authSection) authSection.classList.remove('hidden');
            if (headerUserInfo) headerUserInfo.innerHTML = '';
            if (mainHeaderActions) mainHeaderActions.classList.add('hidden');
            if (mobileHamburgerBtn) mobileHamburgerBtn.classList.add('hidden');
            this.populateStudentDropdown();
        } else {
            this.currentView = 'parent-dashboard';
            if (dashboardSection) dashboardSection.classList.remove('hidden');
            if (subHeaderNav) subHeaderNav.classList.remove('hidden');
            if (mainHeaderActions) mainHeaderActions.classList.remove('hidden');
            if (mobileHamburgerBtn) mobileHamburgerBtn.classList.remove('hidden');

            if (user.role === 'admin') {
                if (headerUserInfo) {
                    headerUserInfo.innerHTML = `
                        <div class="user-pill-tag admin-tag">
                            <span class="avatar">🛡️</span>
                            <div>
                                <strong>Rékási László</strong>
                                <small>Adminisztrátor</small>
                            </div>
                        </div>
                    `;
                }
            } else {
                if (headerUserInfo) {
                    headerUserInfo.innerHTML = `
                        <div class="user-pill-tag">
                            <span class="avatar">👨‍👩‍👦</span>
                            <div>
                                <strong>${user.childName} szülője</strong>
                                <small>${user.email}</small>
                            </div>
                        </div>
                    `;
                }
            }

            this.renderTabNav();
            this.renderMobileTabNav();
            this.renderParentDashboard();
        }
    }

    toggleMobileMenu() {
        const drawer = document.getElementById('mobile-nav-drawer');
        const backdrop = document.getElementById('mobile-nav-backdrop');
        const btn = document.getElementById('mobile-hamburger-btn');
        if (!drawer) return;

        const isOpen = drawer.classList.contains('active');
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            drawer.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
            if (btn) btn.classList.add('is-active');
            document.body.style.overflow = 'hidden';
            this.renderMobileTabNav();
        }
    }

    closeMobileMenu() {
        const drawer = document.getElementById('mobile-nav-drawer');
        const backdrop = document.getElementById('mobile-nav-backdrop');
        const btn = document.getElementById('mobile-hamburger-btn');
        if (drawer) drawer.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        if (btn) btn.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    renderMobileTabNav() {
        const navContainer = document.getElementById('mobile-tab-nav');
        const profileBadge = document.getElementById('mobile-user-profile-badge');
        if (!navContainer) return;

        const user = window.authManager.currentUser;
        if (!user) return;
        const isAdmin = user.role === 'admin';

        if (profileBadge) {
            profileBadge.innerHTML = `
                <div class="user-avatar-small">${isAdmin ? '🛡️' : '👨‍👩‍👦'}</div>
                <div style="min-width: 0; flex: 1;">
                    <strong style="font-size: 0.95rem; color: var(--text-main); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${isAdmin ? 'Rékási László (Admin)' : `${user.childName} szülője`}
                    </strong>
                    <small class="text-muted" style="font-size: 0.78rem; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${user.email}
                    </small>
                </div>
            `;
        }

        navContainer.innerHTML = `
            <button class="mobile-nav-item ${this.activeDashboardTab === 'home' ? 'active' : ''}" onclick="window.app.switchDashboardTab('home'); window.app.closeMobileMenu();">
                <span class="nav-text">Főoldal (Névsor & Tanáraink)</span>
            </button>
            <button class="mobile-nav-item ${this.activeDashboardTab === 'bank-sheet-y2' ? 'active' : ''}" onclick="window.app.switchDashboardTab('bank-sheet-y2'); window.app.closeMobileMenu();">
                <span class="nav-text">2. tanév (2025/26) Banki elszámolás</span>
            </button>
            <button class="mobile-nav-item ${this.activeDashboardTab === 'bank-sheet-y1' ? 'active' : ''}" onclick="window.app.switchDashboardTab('bank-sheet-y1'); window.app.closeMobileMenu();">
                <span class="nav-text">1. tanév (2024/25) Banki elszámolás</span>
            </button>
            <button class="mobile-nav-item ${this.activeDashboardTab === 'news' ? 'active' : ''}" onclick="window.app.switchDashboardTab('news'); window.app.closeMobileMenu();">
                <span class="nav-text">Hírek & Közlemények</span>
            </button>
            <button class="mobile-nav-item ${this.activeDashboardTab === 'szmk' ? 'active' : ''}" onclick="window.app.switchDashboardTab('szmk'); window.app.closeMobileMenu();">
                <span class="nav-text">SZMK Szülők</span>
            </button>
            <button class="mobile-nav-item ${this.activeDashboardTab === 'info' ? 'active' : ''}" onclick="window.app.switchDashboardTab('info'); window.app.closeMobileMenu();">
                <span class="nav-text">Osztály & Fizetési Infók</span>
            </button>
            ${isAdmin ? `
                <button class="mobile-nav-item admin-item ${this.activeDashboardTab === 'admin' ? 'active' : ''}" onclick="window.app.switchDashboardTab('admin'); window.app.closeMobileMenu();">
                    <span class="nav-icon">🛡️</span>
                    <span class="nav-text">Admin felület</span>
                </button>
            ` : ''}
        `;
    }

    renderTabNav() {
        const navContainer = document.getElementById('main-tab-nav');
        if (!navContainer) return;

        const user = window.authManager.currentUser;
        const isAdmin = user && user.role === 'admin';

        navContainer.innerHTML = `
            <button class="tab-btn ${this.activeDashboardTab === 'home' ? 'active' : ''}" data-tab="home" onclick="window.app.switchDashboardTab('home')">
                🏠 Főoldal
            </button>
            <button class="tab-btn ${this.activeDashboardTab === 'bank-sheet-y2' ? 'active' : ''}" data-tab="bank-sheet-y2" onclick="window.app.switchDashboardTab('bank-sheet-y2')">
                🏦 2. tanév (2025/26) Banki elszámolás
            </button>
            <button class="tab-btn ${this.activeDashboardTab === 'bank-sheet-y1' ? 'active' : ''}" data-tab="bank-sheet-y1" onclick="window.app.switchDashboardTab('bank-sheet-y1')">
                🏦 1. tanév (2024/25) Banki elszámolás
            </button>
            <button class="tab-btn ${this.activeDashboardTab === 'news' ? 'active' : ''}" data-tab="news" onclick="window.app.switchDashboardTab('news')">
                📰 Hírek & Közlemények
            </button>
            <button class="tab-btn ${this.activeDashboardTab === 'szmk' ? 'active' : ''}" data-tab="szmk" onclick="window.app.switchDashboardTab('szmk')">
                👥 SZMK Szülők
            </button>
            <button class="tab-btn ${this.activeDashboardTab === 'info' ? 'active' : ''}" data-tab="info" onclick="window.app.switchDashboardTab('info')">
                ℹ️ Osztály & Fizetési Infók
            </button>
            ${isAdmin ? `
                <button class="tab-btn ${this.activeDashboardTab === 'admin' ? 'active' : ''}" data-tab="admin" style="color: var(--brand-accent);" onclick="window.app.switchDashboardTab('admin')">
                    🛡️ Admin felület
                </button>
            ` : ''}
        `;
    }

    renderParentDashboard() {
        this.renderStats();
        this.renderDashboardContent();
    }

    renderStats() {
        const stats = window.dataStore.getStatCardsData();
        const broughtEl = document.getElementById('stat-brought-forward');
        const balanceEl = document.getElementById('stat-current-balance');
        const monthlyEl = document.getElementById('stat-monthly-fee');

        if (broughtEl) broughtEl.textContent = `${stats.broughtForward.toLocaleString('hu-HU')} Ft`;
        if (balanceEl) balanceEl.textContent = `${stats.currentBalance.toLocaleString('hu-HU')} Ft`;
        if (monthlyEl) monthlyEl.textContent = `${stats.monthlyFee.toLocaleString('hu-HU')} Ft`;
    }

    switchDashboardTab(tab) {
        this.activeDashboardTab = tab;
        this.renderTabNav();
        this.renderMobileTabNav();
        this.renderDashboardContent();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderStudentsGrid(students, userChildName) {
        return students.map((s, idx) => {
            const isMyChild = userChildName && s.name.trim().toLowerCase() === userChildName;
            return `
                <div class="student-roster-card ${isMyChild ? 'my-child-highlight' : ''}" data-student-name="${s.name.toLowerCase()}">
                    <div class="student-num-badge">${idx + 1}</div>
                    <div class="student-card-info">
                        <div class="student-card-name">
                            ${this.escapeHtml(s.name)}
                            ${isMyChild ? '<span class="my-child-pill" style="margin-left: 6px;">🎯 Saját gyermek</span>' : ''}
                        </div>
                        <div class="student-card-sub">
                            11. D • Informatika és távközlés
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterStudentsRoster(query) {
        const container = document.getElementById('students-grid-container');
        if (!container) return;
        const q = (query || '').trim().toLowerCase();
        const cards = container.querySelectorAll('.student-roster-card');
        cards.forEach(card => {
            const name = card.getAttribute('data-student-name') || '';
            if (!q || name.includes(q)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    renderDashboardContent() {
        const container = document.getElementById('dashboard-tab-content');
        if (!container) return;

        const user = window.authManager.currentUser;
        const isAdmin = user && user.role === 'admin';
        const userChildName = (user && user.childName) ? user.childName.trim().toLowerCase() : '';

        if (this.activeDashboardTab === 'admin') {
            window.adminManager.renderAdminPanel(container);
            return;
        }

        // ==========================================
        // FŐOLDAL: OSZTÁLYNÉVSOR & TANÁRAINK
        // ==========================================
        if (this.activeDashboardTab === 'home') {
            const students = window.dataStore.getStudentsList();
            const teachers = window.dataStore.getTeachers();

            container.innerHTML = `
                <div class="home-section animate-fade-in">
                    <!-- Főoldal Iskolanév & Osztály Hero Fejléc -->
                    <div class="home-hero-header-card">
                        <div class="home-hero-inner">
                            <h1 class="school-main-title">Nyíregyházi SZC Széchenyi István Technikum és Kollégium</h1>
                            <div class="class-main-subtitle">
                                <span class="class-badge">🎓 11. D osztály</span>
                                <span class="spec-badge">Informatika és távközlés ágazat</span>
                                <span class="year-badge">2025/2026. tanév</span>
                            </div>
                            <p class="home-hero-desc">
                                Hivatalos szülői portál, banki elszámolások, osztálypénz nyilvántartás, osztálynévsor és oktatóink.
                            </p>
                        </div>
                    </div>

                    <!-- 1. OSZTÁLYNÉVSOR KÁRTYA -->
                    <div class="home-card-block">
                        <div class="home-card-header-flex">
                            <div>
                                <h3 class="roster-title-block">
                                    <span>👥 11. D Osztály Névsor</span>
                                    <span class="student-count-sub">(${students.length} tanuló)</span>
                                </h3>
                                <p class="text-muted" style="font-size: 0.85rem; margin-top: 4px;">
                                    A 11. D osztály hivatalos tanulói névsora
                                </p>
                            </div>
                            <div>
                                <input type="text" 
                                       id="roster-search-input" 
                                       class="roster-search-input" 
                                       placeholder="🔍 Tanuló keresése név szerint..." 
                                       oninput="window.app.filterStudentsRoster(this.value)">
                            </div>
                        </div>

                        <div class="students-grid" id="students-grid-container">
                            ${this.renderStudentsGrid(students, userChildName)}
                        </div>
                    </div>

                    <!-- 2. TANÁRAINK SZEKCIÓ -->
                    <div class="home-card-block">
                        <div class="home-card-header-flex">
                            <div>
                                <h3>👨‍🏫 Oktatóink és Tanáraink</h3>
                                <p class="text-muted" style="font-size: 0.85rem; margin-top: 2px;">
                                    A 11. D osztály tantárgyait oktató pedagógusok és szaktanárok
                                </p>
                            </div>
                        </div>

                        <div class="teachers-notice-banner">
                            <span class="banner-icon">📋</span>
                            <div>
                                <strong>11. D Oktatói és Tanári Névsor:</strong>
                                <p>A 11. D osztályban tanító pedagógusok és szaktanárok hivatalos listája. A névsor folyamatosan bővül a további szaktanárokkal.</p>
                            </div>
                        </div>

                        <div class="teachers-grid">
                            ${teachers.map(t => `
                                <div class="teacher-card ${t.isHeadTeacher ? 'head-teacher-card' : ''}">
                                    <div class="teacher-header">
                                        <div class="teacher-avatar-box">${t.icon || '👨‍🏫'}</div>
                                        <span class="teacher-status-pill ${t.isHeadTeacher ? 'head-teacher-pill' : ''}">
                                            ${this.escapeHtml(t.badge || t.role)}
                                        </span>
                                    </div>
                                    <div class="teacher-name">${this.escapeHtml(t.name)}</div>
                                    <div class="teacher-role">${this.escapeHtml(t.role)}</div>
                                    <div class="teacher-subject"><strong>Tantárgy:</strong> ${this.escapeHtml(t.subject)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // ==========================================
        // 2. TANÉV (2025/2026) TÁBLÁZAT MEGJELENÍTÉSE
        // ==========================================
        if (this.activeDashboardTab === 'bank-sheet-y2') {
            const records = window.dataStore.getBankRecordsY2();
            const summary = window.dataStore.getBankSummaryY2();

            container.innerHTML = `
                <div class="bank-sheet-card animate-fade-in">
                    <div class="bank-sheet-header">
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 800;">🏦 2. tanév Banki és Osztálypénz Elszámolása (2025/2026)</h3>
                            <p class="text-muted" style="font-size: 0.85rem; margin-top: 2px;">
                                A Nyíregyházi SZC Széchenyi István Technikum 11. D osztály tételes havi befizetései és kiadásai.
                            </p>
                        </div>
                        <div class="privacy-notice-badge ${isAdmin ? 'admin-notice' : ''}">
                            ${isAdmin 
                                ? '🛡️ Adminisztrátori nézet (Teljes névsor látható)' 
                                : '🔒 Adatvédelmi nézet (Csak a saját gyermek neve látható, a többi elmosva • Minden adat látható)'
                            }
                        </div>
                    </div>

                    <div class="mobile-table-hint">
                        <span>👉 Vízszintesen lapozható táblázat (Húzza oldalra az összes hónaphoz)</span>
                    </div>

                    <div class="bank-table-scroll-wrapper">
                        <table class="bank-data-table">
                            <thead>
                                <tr>
                                    <th class="col-num">#</th>
                                    <th class="col-name">Tanuló neve</th>
                                    <th>2025.09.</th>
                                    <th>2025.10.</th>
                                    <th>2025.11.</th>
                                    <th>2025.12.</th>
                                    <th>2026.01.</th>
                                    <th>2026.02.</th>
                                    <th>2026.03.</th>
                                    <th>2026.04.</th>
                                    <th>2026.05.</th>
                                    <th>2026.06.</th>
                                    <th>Összes befizetés</th>
                                    <th>Tartozás</th>
                                    <th>Osztálykirándulás</th>
                                    <th>Előző tartozás</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${records.map((r, idx) => {
                                    const isMyChild = userChildName && r.name.trim().toLowerCase() === userChildName;
                                    let displayNameHtml = '';

                                    if (isAdmin) {
                                        displayNameHtml = `<strong>${r.name}</strong>`;
                                    } else if (isMyChild) {
                                        displayNameHtml = `
                                            <span class="student-name-active">
                                                <strong>${r.name}</strong>
                                                <span class="my-child-pill">Saját gyermek</span>
                                            </span>
                                        `;
                                    } else {
                                        displayNameHtml = `
                                            <span class="student-name-blurred" title="🔒 Adatvédelmi okokból elhomályosítva (GDPR)">
                                                ${r.name}
                                            </span>
                                        `;
                                    }

                                    return `
                                        <tr class="${isMyChild ? 'my-child-row' : ''}">
                                            <td class="col-num">${idx + 1}.</td>
                                            <td class="col-name">${displayNameHtml}</td>
                                            <td>${r.m09 || '—'}</td>
                                            <td>${r.m10 || '—'}</td>
                                            <td>${r.m11 || '—'}</td>
                                            <td>${r.m12 || '—'}</td>
                                            <td>${r.m01 || '—'}</td>
                                            <td>${r.m02 || '—'}</td>
                                            <td>${r.m03 || '—'}</td>
                                            <td>${r.m04 || '—'}</td>
                                            <td>${r.m05 || '—'}</td>
                                            <td>${r.m06 || '—'}</td>
                                            <td><strong class="text-success">${r.total}</strong></td>
                                            <td>${r.debt && r.debt !== '0 Ft' ? `<strong class="text-danger">${r.debt}</strong>` : '0 Ft'}</td>
                                            <td>${r.trip || '—'}</td>
                                            <td>${r.prevDebt ? `${r.prevDebt} ${r.note ? `(${r.note})` : ''}` : '—'}</td>
                                        </tr>
                                    `;
                                }).join('')}

                                <tr class="bank-table-summary-row">
                                    <td colspan="2" class="col-name"><strong>ÖSSZES BEFIZETÉS:</strong></td>
                                    <td>${summary.monthlyIncomeTotals.m09}</td>
                                    <td>${summary.monthlyIncomeTotals.m10}</td>
                                    <td>${summary.monthlyIncomeTotals.m11}</td>
                                    <td>${summary.monthlyIncomeTotals.m12}</td>
                                    <td>${summary.monthlyIncomeTotals.m01}</td>
                                    <td>${summary.monthlyIncomeTotals.m02}</td>
                                    <td>${summary.monthlyIncomeTotals.m03}</td>
                                    <td>${summary.monthlyIncomeTotals.m04}</td>
                                    <td>${summary.monthlyIncomeTotals.m05}</td>
                                    <td>${summary.monthlyIncomeTotals.m06}</td>
                                    <td><strong class="text-success">${summary.monthlyIncomeTotals.total}</strong></td>
                                    <td><strong>${summary.monthlyIncomeTotals.debtTotal}</strong></td>
                                    <td><strong>${summary.monthlyIncomeTotals.tripTotal}</strong></td>
                                    <td>—</td>
                                </tr>

                                ${summary.monthlyExpenses.map(e => `
                                    <tr style="background: rgba(220, 38, 38, 0.03);">
                                        <td colspan="2" class="col-name"><span class="text-muted">🔴 Kiadás:</span> <strong>${e.name}</strong></td>
                                        <td>${e.m09 || '—'}</td>
                                        <td>${e.m10 || '—'}</td>
                                        <td>${e.m11 || '—'}</td>
                                        <td>${e.m12 || '—'}</td>
                                        <td>${e.m01 || '—'}</td>
                                        <td>${e.m02 || '—'}</td>
                                        <td>${e.m03 || '—'}</td>
                                        <td>${e.m04 || '—'}</td>
                                        <td>${e.m05 || '—'}</td>
                                        <td>${e.m06 || '—'}</td>
                                        <td colspan="4" class="text-right"><strong class="text-danger">-${e.total}</strong></td>
                                    </tr>
                                `).join('')}

                                <tr class="bank-table-summary-row" style="background: var(--bg-surface-elevated);">
                                    <td colspan="2" class="col-name"><strong>ÖSSZES KIADÁS:</strong></td>
                                    <td>${summary.monthlyExpenseTotals.m09}</td>
                                    <td>${summary.monthlyExpenseTotals.m10}</td>
                                    <td>${summary.monthlyExpenseTotals.m11}</td>
                                    <td>${summary.monthlyExpenseTotals.m12}</td>
                                    <td>${summary.monthlyExpenseTotals.m01}</td>
                                    <td>${summary.monthlyExpenseTotals.m02}</td>
                                    <td>${summary.monthlyExpenseTotals.m03}</td>
                                    <td>${summary.monthlyExpenseTotals.m04}</td>
                                    <td>${summary.monthlyExpenseTotals.m05}</td>
                                    <td>${summary.monthlyExpenseTotals.m06}</td>
                                    <td colspan="4" class="text-right"><strong class="text-danger">-${summary.monthlyExpenseTotals.total}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Összesítő Mérleg Kártyák az Excel táblázat aljáról -->
                    <div class="bank-summary-grid">
                        <div class="bank-summary-box">
                            <strong>2024-25. Tanévről áthozott:</strong>
                            <div class="val">${summary.carriedForward2024.toLocaleString('hu-HU')} Ft</div>
                        </div>
                        <div class="bank-summary-box">
                            <strong>2025-26. Tanév befizetések:</strong>
                            <div class="val" style="color: var(--success-text);">+${summary.yearIncome2025.toLocaleString('hu-HU')} Ft</div>
                        </div>
                        <div class="bank-summary-box">
                            <strong>Összes kiadás:</strong>
                            <div class="val" style="color: var(--danger-text);">-${summary.totalExpenses.toLocaleString('hu-HU')} Ft</div>
                        </div>
                        <div class="bank-summary-box">
                            <strong>Egyéb bevétel:</strong>
                            <div class="val" style="color: var(--success-text);">+${summary.otherIncome.toLocaleString('hu-HU')} Ft</div>
                            <small class="text-muted">(Tartozás befizetés + kirándulás maradvány)</small>
                        </div>
                        <div class="bank-summary-box" style="border: 1px solid var(--brand-accent); grid-column: span 1 / -1;">
                            <strong style="color: var(--brand-accent);">🏦 OTP SZÁMLA ZÁRÓ EGYENLEG:</strong>
                            <div class="val" style="font-size: 1.4rem; color: var(--brand-accent);">${summary.closingOtpBalance.toLocaleString('hu-HU')} Ft</div>
                            <small class="text-muted">(Áthozott: 627 081 + Befizetések: 714 000 - Kiadás: 118 660 + Egyéb bevétel: 25 000 = 1 247 421 Ft)</small>
                        </div>
                    </div>
                </div>
            `;
        }

        // ==========================================
        // 1. TANÉV (2024/2025) TÁBLÁZAT MEGJELENÍTÉSE
        // ==========================================
        else if (this.activeDashboardTab === 'bank-sheet-y1') {
            const records = window.dataStore.getBankRecordsY1();
            const summary = window.dataStore.getBankSummaryY1();

            container.innerHTML = `
                <div class="bank-sheet-card animate-fade-in">
                    <div class="bank-sheet-header">
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 800;">🏦 1. tanév Banki és Osztálypénz Elszámolása (2024/2025)</h3>
                            <p class="text-muted" style="font-size: 0.85rem; margin-top: 2px;">
                                A 10. évfolyamos tanév lezárt banki nyilvántartása és záró egyenlege.
                            </p>
                        </div>
                        <div class="privacy-notice-badge ${isAdmin ? 'admin-notice' : ''}">
                            ${isAdmin 
                                ? '🛡️ Adminisztrátori nézet (Teljes névsor látható)' 
                                : '🔒 Adatvédelmi nézet (Csak a saját gyermek neve látható, a többi elmosva • Minden adat látható)'
                            }
                        </div>
                    </div>

                    <div class="mobile-table-hint">
                        <span>👉 Vízszintesen lapozható táblázat (Húzza oldalra az összes hónaphoz)</span>
                    </div>

                    <div class="bank-table-scroll-wrapper">
                        <table class="bank-data-table">
                            <thead>
                                <tr>
                                    <th class="col-num">#</th>
                                    <th class="col-name">Tanuló neve</th>
                                    <th>2024.09.</th>
                                    <th>2024.10.</th>
                                    <th>2024.11.</th>
                                    <th>2024.12.</th>
                                    <th>2025.01.</th>
                                    <th>2025.02.</th>
                                    <th>2025.03.</th>
                                    <th>2025.04.</th>
                                    <th>2025.05.</th>
                                    <th>2025.06.</th>
                                    <th>Összes befizetés</th>
                                    <th>Tartozás</th>
                                    <th>Kirándulás</th>
                                    <th>Egyéb / Temetés</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${records.map((r, idx) => {
                                    const isMyChild = userChildName && r.name.trim().toLowerCase() === userChildName;
                                    let displayNameHtml = '';

                                    if (isAdmin) {
                                        displayNameHtml = `<strong>${r.name}</strong>`;
                                    } else if (isMyChild) {
                                        displayNameHtml = `
                                            <span class="student-name-active">
                                                <strong>${r.name}</strong>
                                                <span class="my-child-pill">Saját gyermek</span>
                                            </span>
                                        `;
                                    } else {
                                        displayNameHtml = `
                                            <span class="student-name-blurred" title="🔒 Adatvédelmi okokból elhomályosítva (GDPR)">
                                                ${r.name}
                                            </span>
                                        `;
                                    }

                                    return `
                                        <tr class="${isMyChild ? 'my-child-row' : ''}">
                                            <td class="col-num">${idx + 1}.</td>
                                            <td class="col-name">${displayNameHtml}</td>
                                            <td>${r.m09 || '—'}</td>
                                            <td>${r.m10 || '—'}</td>
                                            <td>${r.m11 || '—'}</td>
                                            <td>${r.m12 || '—'}</td>
                                            <td>${r.m01 || '—'}</td>
                                            <td>${r.m02 || '—'}</td>
                                            <td>${r.m03 || '—'}</td>
                                            <td>${r.m04 || '—'}</td>
                                            <td>${r.m05 || '—'}</td>
                                            <td>${r.m06 || '—'}</td>
                                            <td><strong class="text-success">${r.total}</strong></td>
                                            <td>${r.debt && r.debt !== '0 Ft' ? `<strong class="text-danger">${r.debt}</strong>` : '0 Ft'}</td>
                                            <td>${r.trip || '—'}</td>
                                            <td>${r.funeral || '—'}</td>
                                        </tr>
                                    `;
                                }).join('')}

                                <tr class="bank-table-summary-row">
                                    <td colspan="2" class="col-name"><strong>ÖSSZES BEFIZETÉS:</strong></td>
                                    <td>${summary.monthlyIncomeTotals.m09}</td>
                                    <td>${summary.monthlyIncomeTotals.m10}</td>
                                    <td>${summary.monthlyIncomeTotals.m11}</td>
                                    <td>${summary.monthlyIncomeTotals.m12}</td>
                                    <td>${summary.monthlyIncomeTotals.m01}</td>
                                    <td>${summary.monthlyIncomeTotals.m02}</td>
                                    <td>${summary.monthlyIncomeTotals.m03}</td>
                                    <td>${summary.monthlyIncomeTotals.m04}</td>
                                    <td>${summary.monthlyIncomeTotals.m05}</td>
                                    <td>${summary.monthlyIncomeTotals.m06}</td>
                                    <td><strong class="text-success">${summary.monthlyIncomeTotals.total}</strong></td>
                                    <td><strong>${summary.monthlyIncomeTotals.debtTotal}</strong></td>
                                    <td><strong>${summary.monthlyIncomeTotals.tripTotal}</strong></td>
                                    <td>—</td>
                                </tr>

                                ${summary.monthlyExpenses.map(e => `
                                    <tr style="background: rgba(220, 38, 38, 0.03);">
                                        <td colspan="2" class="col-name"><span class="text-muted">🔴 Kiadás:</span> <strong>${e.name}</strong></td>
                                        <td>${e.m09 || '—'}</td>
                                        <td>${e.m10 || '—'}</td>
                                        <td>${e.m11 || '—'}</td>
                                        <td>${e.m12 || '—'}</td>
                                        <td>${e.m01 || '—'}</td>
                                        <td>${e.m02 || '—'}</td>
                                        <td>${e.m03 || '—'}</td>
                                        <td>${e.m04 || '—'}</td>
                                        <td>${e.m05 || '—'}</td>
                                        <td>${e.m06 || '—'}</td>
                                        <td colspan="4" class="text-right"><strong class="text-danger">-${e.total}</strong></td>
                                    </tr>
                                `).join('')}

                                <tr class="bank-table-summary-row" style="background: var(--bg-surface-elevated);">
                                    <td colspan="2" class="col-name"><strong>ÖSSZES KIADÁS:</strong></td>
                                    <td colspan="10"></td>
                                    <td colspan="4" class="text-right"><strong class="text-danger">-${summary.totalExpenses.toLocaleString('hu-HU')} Ft</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- 1. Tanév Összegzés -->
                    <div class="bank-summary-grid">
                        <div class="bank-summary-box">
                            <strong>Összes befizetés:</strong>
                            <div class="val" style="color: var(--success-text);">+684 000 Ft</div>
                        </div>
                        <div class="bank-summary-box">
                            <strong>Összes elszámolt kiadás:</strong>
                            <div class="val" style="color: var(--danger-text);">-67 919 Ft</div>
                        </div>
                        <div class="bank-summary-box">
                            <strong>Osztálypénz alap egyenleg:</strong>
                            <div class="val">${summary.baseBalance.toLocaleString('hu-HU')} Ft</div>
                        </div>
                        <div class="bank-summary-box" style="border: 1px solid var(--brand-accent);">
                            <strong style="color: var(--brand-accent);">🏦 SZÁMLÁN MARADT (ZÁRÓ EGYENLEG):</strong>
                            <div class="val" style="font-size: 1.35rem; color: var(--brand-accent);">${summary.closingAccountBalance.toLocaleString('hu-HU')} Ft</div>
                            <small class="text-muted">(Átkerült a 2. tanév nyitó egyenlegébe)</small>
                        </div>
                    </div>
                </div>
            `;
        }

        // ==========================================
        // HÍREK & KÖZLEMÉNYEK KÉPEKKEL
        // ==========================================
        else if (this.activeDashboardTab === 'news') {
            const news = window.dataStore.getNews();
            container.innerHTML = `
                <div class="news-section animate-fade-in">
                    <div class="section-title-row news-section-title-row">
                        <div class="news-title-wrapper">
                            <h3 class="news-centered-title">Hírek</h3>
                        </div>
                    </div>

                    <div class="news-grid">
                        ${news.map(item => `
                            <article class="news-card ${item.pinned ? 'pinned-news' : ''}">
                                ${item.pinned ? '<div class="pin-ribbon">📌 Kiemelt hír</div>' : ''}
                                
                                ${item.image ? `
                                    <div class="news-image-wrap" onclick="window.app.openImageModal('${item.image}', '${this.escapeHtml(item.title)}')">
                                        <img src="${item.image}" alt="${this.escapeHtml(item.title)}" class="news-card-img">
                                    </div>
                                ` : ''}

                                <div class="news-card-header">
                                    <span class="badge ${item.pinned ? 'badge-primary' : 'badge-secondary'}">${this.escapeHtml(item.badge || item.category)}</span>
                                    <span class="news-date">📅 ${item.date}</span>
                                </div>
                                <h4 class="news-title">${this.escapeHtml(item.title)}</h4>
                                <div class="news-content">
                                    ${this.escapeHtml(item.content)}
                                </div>
                                <div class="news-card-footer">
                                    <span class="news-author">✍️ ${this.escapeHtml(item.author || 'Adminisztráció')}</span>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // ==========================================
        // SZMK SZÜLŐK
        // ==========================================
        else if (this.activeDashboardTab === 'szmk') {
            const szmkList = window.dataStore.getSZMK();
            container.innerHTML = `
                <div class="szmk-section animate-fade-in">
                    <div class="section-title-row szmk-section-title-row">
                        <div class="szmk-title-wrapper">
                            <h3 class="szmk-centered-title">SZMK szülők elérhetőségei.</h3>
                        </div>
                    </div>

                    <div class="szmk-grid">
                        ${szmkList.map(person => `
                            <div class="szmk-card">
                                <div class="szmk-avatar-wrap">
                                    ${person.image 
                                        ? `<img src="${person.image}" alt="${person.name}" class="szmk-avatar-img" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'szmk-avatar-icon\\'>👤</span>';">`
                                        : `<span class="szmk-avatar-icon">👤</span>`
                                    }
                                </div>
                                <div class="szmk-info">
                                    <h4 class="szmk-name">${person.name}</h4>
                                    <span class="szmk-role-badge">${person.role}</span>
                                    <p class="szmk-desc">${person.description}</p>
                                    
                                    ${(person.email || person.phone) ? `
                                        <div class="szmk-contacts-list">
                                            ${person.email ? `
                                                <div class="szmk-contact-item">
                                                    <span class="contact-icon">📧</span>
                                                    <a href="mailto:${person.email}">${person.email}</a>
                                                </div>
                                            ` : ''}
                                            ${person.phone ? `
                                                <div class="szmk-contact-item">
                                                    <span class="contact-icon">📞</span>
                                                    <a href="tel:${person.phoneRaw || person.phone}">${person.phone}</a>
                                                </div>
                                            ` : ''}
                                        </div>
                                    ` : ''}
                                    
                                    <div class="szmk-action-buttons">
                                        ${person.facebookUrl ? `
                                            <a href="${person.facebookUrl}" 
                                               target="_blank" 
                                               rel="noopener noreferrer"
                                               class="btn-social btn-facebook"
                                               onclick="window.app.handleSocialClick(event, '${person.facebookAppUrl}', '${person.facebookUrl}')">
                                                <span class="social-icon">🌐</span> Facebook Profil
                                            </a>
                                        ` : ''}

                                        ${person.messengerUrl ? `
                                            <a href="${person.messengerUrl}" 
                                               target="_blank" 
                                               rel="noopener noreferrer"
                                               class="btn-social btn-messenger"
                                               onclick="window.app.handleSocialClick(event, '${person.messengerAppUrl}', '${person.messengerUrl}')">
                                                <span class="social-icon">💬</span> Messenger Üzenet
                                            </a>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // ==========================================
        // INFORMÁCIÓK
        // ==========================================
        else if (this.activeDashboardTab === 'info') {
            container.innerHTML = `
                <div class="info-section animate-fade-in">
                    <div class="info-grid">
                        <div class="info-card">
                            <h3>🏫 Osztály Információk</h3>
                            <ul class="info-list">
                                <li><strong>Iskola:</strong> Nyíregyházi SZC Széchenyi István Technikum és Kollégium</li>
                                <li><strong>Osztály:</strong> 11. D osztály (37 tanuló)</li>
                                <li><strong>Szakág:</strong> Informatika és távközlés</li>
                                <li><strong>Tanév:</strong> 2025/2026. tanév</li>
                                <li><strong>Osztályterem:</strong> 1. emelet 102. terem</li>
                            </ul>
                        </div>
                        <div class="info-card">
                            <h3>💳 Osztálypénz Befizetési Tudnivalók</h3>
                            <ul class="info-list">
                                <li><strong>Havi osztálypénz:</strong> 3.000 Ft / hó / tanuló</li>
                                <li class="bank-acc-info-item">
                                    <div class="bank-acc-label"><strong>OTP Bankszámlaszám:</strong></div>
                                    <div class="bank-acc-details-row">
                                        <code class="bank-acc-code">11773449-03543429</code>
                                        <button type="button" class="btn-copy-acc" onclick="navigator.clipboard.writeText('11773449-03543429'); window.app.showToast('Számlaszám kimásolva: 11773449-03543429', 'success');" title="Számlaszám másolása">📋 Másolás</button>
                                    </div>
                                </li>
                                <li><strong>Közlemény:</strong> Gyermek neve (a beazonosítás miatt)</li>
                                <li><strong>Aktuális OTP egyenleg:</strong> 1.247.421 Ft</li>
                            </ul>
                        </div>
                        <div class="info-card">
                            <h3 class="info-card-single-line-title">🔒 Adatkezelés és kapcsolat</h3>
                            <ul class="info-list">
                                <li><strong>Adatkezelő:</strong> Rékási László</li>
                                <li><strong>E-mail:</strong> <a href="mailto:rekalaca@gmail.com">rekalaca@gmail.com</a></li>
                                <li><strong>Adatkezelési cél:</strong> 11. D osztálypénz nyilvántartás és kapcsolattartás.</li>
                                <li><strong>Szabályzat:</strong> <button class="btn-link" onclick="window.authManager.openPrivacyModal()">Adatkezelési tájékoztató megtekintése</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Kép nagyítás modal
    openImageModal(imageSrc, imageAlt) {
        let modal = document.getElementById('image-viewer-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'image-viewer-modal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-container" style="max-width: 750px; background: #000000; border: none; padding: 0;">
                    <button class="modal-close-btn" style="position: absolute; right: 15px; top: 15px; color: #ffffff; z-index: 20; background: rgba(0,0,0,0.6); border-radius: 50%; width: 36px; height: 36px;" onclick="document.getElementById('image-viewer-modal').classList.remove('active')">✕</button>
                    <img id="viewer-modal-img" src="" alt="" style="width: 100%; height: auto; max-height: 85vh; object-fit: contain; display: block; border-radius: 12px;">
                </div>
            `;
            document.body.appendChild(modal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }
        document.getElementById('viewer-modal-img').src = imageSrc;
        document.getElementById('viewer-modal-img').alt = imageAlt;
        modal.classList.add('active');
    }

    handleSocialClick(event, appUrl, fallbackWebUrl) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile && appUrl) {
            window.location.href = appUrl;
            setTimeout(() => {
                window.open(fallbackWebUrl, '_blank');
            }, 800);
            event.preventDefault();
        }
    }

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast-notification');
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast-popup show ${type}`;
        setTimeout(() => {
            toast.className = 'toast-popup';
        }, 4000);
    }

    setupEventListeners() {
        const tabLogin = document.getElementById('auth-tab-login');
        const tabRegister = document.getElementById('auth-tab-register');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (tabLogin && tabRegister) {
            tabLogin.addEventListener('click', () => {
                tabLogin.classList.add('active');
                tabRegister.classList.remove('active');
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            });

            tabRegister.addEventListener('click', () => {
                tabRegister.classList.add('active');
                tabLogin.classList.remove('active');
                registerForm.classList.remove('hidden');
                loginForm.classList.add('hidden');
                this.populateStudentDropdown();
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                const privacyConsent = document.getElementById('login-privacy-consent');

                if (privacyConsent && !privacyConsent.checked) {
                    this.showToast('⚠️ A belépéshez fogadja el az Adatkezelési tájékoztatót!', 'error');
                    return;
                }

                const result = window.authManager.login(email, password);
                if (result.success) {
                    this.showToast(result.user.role === 'admin' ? '🛡️ Üdvözöljük, Rékási László (Adminisztrátor)!' : '✅ Sikeres bejelentkezés!', 'success');
                    this.renderApp();
                } else {
                    this.showToast(result.error || 'Hibás belépési adatok!', 'error');
                }
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('reg-email').value;
                const password = document.getElementById('reg-password').value;
                const passwordConfirm = document.getElementById('reg-password-confirm').value;
                const childSelect = document.getElementById('reg-child-select');
                const childName = childSelect ? childSelect.value : '';
                const privacyAccepted = document.getElementById('reg-privacy-consent').checked;

                if (password !== passwordConfirm) {
                    this.showToast('⚠️ A két megadott jelszó nem egyezik meg!', 'error');
                    return;
                }

                if (!childName) {
                    this.showToast('⚠️ Kérjük válassza ki a gyermeket a listából!', 'error');
                    return;
                }

                const result = window.authManager.initiateRegistration({
                    email,
                    password,
                    childName,
                    privacyAccepted
                });

                if (result.needsVerification) {
                    this.showToast('📧 Megerősítő kódot küldtünk a megadott e-mail címre!', 'info');
                } else if (!result.limitExceeded && !result.success) {
                    this.showToast(result.error || 'Hiba történt a regisztráció során!', 'error');
                }
            });
        }

        const verifyForm = document.getElementById('email-verify-form');
        if (verifyForm) {
            verifyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const code = document.getElementById('verify-code-input').value;
                const res = window.authManager.confirmEmailVerification(code);
                if (res.success) {
                    this.showToast('🎉 E-mail cím sikeresen megerősítve! Üdvözöljük a Széchenyi szülői portálon!', 'success');
                    this.renderApp();
                } else {
                    this.showToast(res.error, 'error');
                }
            });
        }

        const forgotStep1Form = document.getElementById('forgot-step1-form');
        if (forgotStep1Form) {
            forgotStep1Form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('forgot-email-input').value;
                const res = window.authManager.requestPasswordReset(email);
                if (res.success) {
                    document.getElementById('forgot-step-1').classList.add('hidden');
                    document.getElementById('forgot-step-2').classList.remove('hidden');
                    document.getElementById('demo-reset-code').textContent = res.code;
                    this.showToast('📧 Visszaállító kódot küldtünk az e-mail címre!', 'info');
                } else {
                    this.showToast(res.error, 'error');
                }
            });
        }

        const forgotStep2Form = document.getElementById('forgot-step2-form');
        if (forgotStep2Form) {
            forgotStep2Form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('forgot-email-input').value;
                const code = document.getElementById('forgot-code-input').value;
                const newPass = document.getElementById('forgot-newpass-input').value;
                const newPassConf = document.getElementById('forgot-newpass-conf-input').value;

                if (newPass !== newPassConf) {
                    this.showToast('⚠️ Az új jelszavak nem egyeznek!', 'error');
                    return;
                }

                const res = window.authManager.completePasswordReset(email, code, newPass);
                if (res.success) {
                    this.showToast('✅ A jelszó sikeresen megváltoztatva! Most már bejelentkezhet az új jelszóval.', 'success');
                } else {
                    this.showToast(res.error, 'error');
                }
            });
        }

        const floatingInput = document.getElementById('floating-search-input');
        if (floatingInput) {
            floatingInput.addEventListener('input', (e) => {
                this.handleLiveSearch(e.target.value);
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeFloatingSearch();
                const imgModal = document.getElementById('image-viewer-modal');
                if (imgModal) imgModal.classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
