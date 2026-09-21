/**
 * admin.js - Adminisztrátori műveletek és felületkezelés
 * Hírek és pénzügyi tételek rögzítése, tanulói regisztrációk kezelése,
 * és új ablakban megnyitás gomb.
 */

class AdminManager {
    constructor() {
        this.selectedTab = 'finances'; // 'finances' | 'news' | 'users'
    }

    renderAdminPanel(container) {
        if (!container) return;

        const users = window.dataStore.getUsers();
        const students = window.dataStore.getStudents();
        const news = window.dataStore.getNews();
        const finances = window.dataStore.getFinances();
        const stats = window.dataStore.getFinanceStats();

        container.innerHTML = `
            <div class="admin-dashboard animate-fade-in">
                <div class="admin-header-bar">
                    <div class="admin-badge">
                        <span class="icon">🛡️</span>
                        <div>
                            <h2>Adminisztrátori Kezelőpult</h2>
                            <p>Nyíregyházi SZC Széchenyi István Technikum - 11. D Osztály</p>
                        </div>
                    </div>
                    <div class="admin-header-actions">
                        <button class="btn btn-secondary btn-sm" onclick="window.adminManager.openSiteInNewWindow()">
                            🌐 Weboldal megnyitása új ablakban
                        </button>
                        <span class="admin-user-pill">Bejelentkezve: <strong>Rékási László (Admin)</strong></span>
                    </div>
                </div>

                <!-- Admin Tab Nav -->
                <div class="admin-nav-tabs">
                    <button class="admin-tab-btn ${this.selectedTab === 'finances' ? 'active' : ''}" onclick="window.adminManager.switchTab('finances')">
                        💰 Pénzügyek kezelése (${finances.length})
                    </button>
                    <button class="admin-tab-btn ${this.selectedTab === 'news' ? 'active' : ''}" onclick="window.adminManager.switchTab('news')">
                        📰 Hírek kezelése (${news.length})
                    </button>
                    <button class="admin-tab-btn ${this.selectedTab === 'users' ? 'active' : ''}" onclick="window.adminManager.switchTab('users')">
                        👥 Szülők & Tanulók (${users.length} fiók)
                    </button>
                </div>

                <!-- Tab Tartalmak -->
                <div class="admin-tab-content">
                    ${this.renderActiveTabContent({ users, students, news, finances, stats })}
                </div>
            </div>
        `;
    }

    openSiteInNewWindow() {
        window.open(window.location.href, '_blank');
    }

    switchTab(tabName) {
        this.selectedTab = tabName;
        const container = document.getElementById('dashboard-tab-content') || document.getElementById('admin-content-area');
        if (container) {
            this.renderAdminPanel(container);
        }
    }

    renderActiveTabContent({ users, students, news, finances, stats }) {
        if (this.selectedTab === 'finances') {
            return `
                <div class="admin-section-grid">
                    <!-- Új pénzügyi tétel űrlap -->
                    <div class="admin-card form-card">
                        <h3><span class="icon">➕</span> Új tétel rögzítése</h3>
                        <form id="admin-add-finance-form" onsubmit="window.adminManager.handleSaveFinance(event)">
                            <div class="form-group">
                                <label for="fin-type">Típus</label>
                                <select id="fin-type" required class="custom-select">
                                    <option value="income">🟢 Bevétel (Befizetés, támogatás)</option>
                                    <option value="expense">🔴 Kiadás (Vásárlás, költség)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="fin-title">Megnevezés / Tárgy *</label>
                                <input type="text" id="fin-title" placeholder="Pl. 1. féléves osztálypénz, Faliújság vásárlás..." required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="fin-amount">Összeg (Ft) *</label>
                                    <input type="number" id="fin-amount" min="1" step="10" placeholder="Pl. 15000" required>
                                </div>
                                <div class="form-group">
                                    <label for="fin-date">Dátum *</label>
                                    <input type="date" id="fin-date" value="${new Date().toISOString().split('T')[0]}" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="fin-category">Kategória</label>
                                    <input type="text" id="fin-category" placeholder="Pl. Osztálypénz, Felszerelés, Kirándulás..." required>
                                </div>
                                <div class="form-group">
                                    <label for="fin-invoice">Bizonylat / Számlaszám</label>
                                    <input type="text" id="fin-invoice" placeholder="Pl. SZ-2026/001 vagy Nyugta #12">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="fin-desc">Részletes leírás / Megjegyzés</label>
                                <textarea id="fin-desc" rows="2" placeholder="Opcionális megjegyzés, elszámolási részletek..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">💾 Tétel mentése a kasszába</button>
                        </form>
                    </div>

                    <!-- Meglévő tételek listája -->
                    <div class="admin-card list-card">
                        <div class="card-header-flex">
                            <h3>Rögzített tételek listája</h3>
                            <div class="stat-pill">Egyenleg: <strong>${stats.currentBalance.toLocaleString('hu-HU')} Ft</strong></div>
                        </div>
                        <div class="table-responsive-wrapper">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Dátum</th>
                                        <th>Típus</th>
                                        <th>Megnevezés</th>
                                        <th>Összeg</th>
                                        <th>Művelet</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${finances.map(f => `
                                        <tr>
                                            <td class="text-nowrap">${f.date}</td>
                                            <td>
                                                <span class="badge ${f.type === 'income' ? 'badge-success' : 'badge-danger'}">
                                                    ${f.type === 'income' ? 'Bevétel' : 'Kiadás'}
                                                </span>
                                            </td>
                                            <td>
                                                <strong>${f.title}</strong>
                                                <small class="d-block text-muted">${f.category} ${f.invoiceNumber ? `• ${f.invoiceNumber}` : ''}</small>
                                            </td>
                                            <td class="text-nowrap font-weight-bold ${f.type === 'income' ? 'text-success' : 'text-danger'}">
                                                ${f.type === 'income' ? '+' : '-'}${Number(f.amount).toLocaleString('hu-HU')} Ft
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-icon-danger" title="Törlés" onclick="window.adminManager.deleteFinanceItem('${f.id}')">
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                    ${finances.length === 0 ? '<tr><td colspan="5" class="text-center text-muted">Nincsenek még rögzített pénzügyi tételek.</td></tr>' : ''}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        } else if (this.selectedTab === 'news') {
            return `
                <div class="admin-section-grid">
                    <!-- Új hír közzététele -->
                    <div class="admin-card form-card">
                        <h3><span class="icon">📢</span> Új hír / közlemény közzététele</h3>
                        <form id="admin-add-news-form" onsubmit="window.adminManager.handleSaveNews(event)">
                            <div class="form-group">
                                <label for="news-title">Hír címe *</label>
                                <input type="text" id="news-title" placeholder="Pl. Félévi beszámoló és kirándulás..." required>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="news-category">Kategória</label>
                                    <select id="news-category" class="custom-select">
                                        <option value="Pénzügy">💰 Pénzügy</option>
                                        <option value="Kirándulás">🚌 Kirándulás</option>
                                        <option value="Értekezlet">🏫 Szülői értekezlet</option>
                                        <option value="Osztályélet">🎓 Osztályélet</option>
                                        <option value="Egyéb">📌 Egyéb tájékoztató</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="news-badge">Címke</label>
                                    <input type="text" id="news-badge" placeholder="Pl. Fontos, Esemény, Új..." value="Fontos">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="news-author">Szerző</label>
                                <input type="text" id="news-author" value="Rékási László (SZMK képviselő)" required>
                            </div>
                            <div class="form-group">
                                <label for="news-content">Hír szövege / Tájékoztatás *</label>
                                <textarea id="news-content" rows="4" placeholder="Írja ide a szülőknek szánt részletes információkat..." required></textarea>
                            </div>
                            <div class="form-group checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="news-pinned">
                                    <span>📌 Kitűzés az oldal tetejére (kiemelt megjelenés)</span>
                                </label>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">🚀 Hír közzététele</button>
                        </form>
                    </div>

                    <!-- Meglévő hírek listája -->
                    <div class="admin-card list-card">
                        <h3>Közzétett hírek</h3>
                        <div class="admin-news-list">
                            ${news.map(n => `
                                <div class="admin-news-item">
                                    <div class="news-item-head">
                                        <div>
                                            <span class="badge ${n.pinned ? 'badge-primary' : 'badge-secondary'}">${n.badge || n.category}</span>
                                            <strong>${n.title}</strong>
                                        </div>
                                        <button class="btn btn-sm btn-icon-danger" title="Hír törlése" onclick="window.adminManager.deleteNewsItem('${n.id}')">
                                            🗑️
                                        </button>
                                    </div>
                                    <p class="news-preview">${n.content.substring(0, 120)}...</p>
                                    <small class="text-muted">📅 ${n.date} • ✍️ ${n.author}</small>
                                </div>
                            `).join('')}
                            ${news.length === 0 ? '<p class="text-muted">Nincsenek közzétett hírek.</p>' : ''}
                        </div>
                    </div>
                </div>
            `;
        } else if (this.selectedTab === 'users') {
            return `
                <div class="admin-card full-card">
                    <div class="card-header-flex">
                        <div>
                            <h3>👥 37 Tanuló és Regisztrált Szülői Fiókok (Max 2 fiók / diák)</h3>
                            <p class="text-muted">Áttekintés a 11. D tanulóiról és a hozzájuk tartozó szülői fiókokról.</p>
                        </div>
                    </div>

                    <div class="table-responsive-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tanuló neve</th>
                                    <th>Regisztrált szülők</th>
                                    <th>E-mail címek</th>
                                    <th>Státusz</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${students.map((student, idx) => {
                                    const studentParents = users.filter(u => u.childName && u.childName.trim().toLowerCase() === student.trim().toLowerCase());
                                    const count = studentParents.length;
                                    let statusBadge = '';
                                    if (count === 2) {
                                        statusBadge = '<span class="badge badge-warning">Betelt (2/2)</span>';
                                    } else if (count === 1) {
                                        statusBadge = '<span class="badge badge-success">1 szabad hely (1/2)</span>';
                                    } else {
                                        statusBadge = '<span class="badge badge-secondary">Nincs még regisztráció (0/2)</span>';
                                    }

                                    return `
                                        <tr>
                                            <td>${idx + 1}.</td>
                                            <td><strong>${student}</strong></td>
                                            <td>
                                                <div class="limit-indicator">
                                                    <div class="limit-bar">
                                                        <div class="limit-fill" style="width: ${(count / 2) * 100}%"></div>
                                                    </div>
                                                    <span>${count} / 2</span>
                                                </div>
                                            </td>
                                            <td>
                                                ${studentParents.length > 0 
                                                    ? studentParents.map(p => `
                                                        <div class="parent-pill">
                                                            <span>📧 ${p.email}</span>
                                                            <button class="btn-tiny-del" title="Fiók törlése" onclick="window.adminManager.deleteUserAccount('${p.id}', '${student}')">✕</button>
                                                        </div>
                                                    `).join('') 
                                                    : '<span class="text-muted">Még nem regisztrált szülő</span>'
                                                }
                                            </td>
                                            <td>${statusBadge}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
    }

    handleSaveFinance(e) {
        e.preventDefault();
        const type = document.getElementById('fin-type').value;
        const title = document.getElementById('fin-title').value.trim();
        const amount = Number(document.getElementById('fin-amount').value);
        const date = document.getElementById('fin-date').value;
        const category = document.getElementById('fin-category').value.trim();
        const invoiceNumber = document.getElementById('fin-invoice').value.trim();
        const description = document.getElementById('fin-desc').value.trim();

        if (!title || !amount || !date) {
            alert('Kérjük töltsön ki minden kötelező mezőt!');
            return;
        }

        window.dataStore.addFinance({
            type,
            title,
            amount,
            date,
            category,
            invoiceNumber,
            description,
            recordedBy: 'Adminisztrátor'
        });

        if (window.app) {
            window.app.showToast('✅ Pénzügyi tétel sikeresen elmentve!', 'success');
            window.app.renderStats();
        }
        this.renderAdminPanel(document.getElementById('admin-content-area') || document.getElementById('dashboard-tab-content'));
    }

    deleteFinanceItem(id) {
        if (confirm('Biztosan törölni szeretné ezt a pénzügyi tételt?')) {
            window.dataStore.deleteFinance(id);
            if (window.app) {
                window.app.showToast('🗑️ Tétel törölve.', 'info');
                window.app.renderStats();
            }
            this.renderAdminPanel(document.getElementById('admin-content-area') || document.getElementById('dashboard-tab-content'));
        }
    }

    handleSaveNews(e) {
        e.preventDefault();
        const title = document.getElementById('news-title').value.trim();
        const category = document.getElementById('news-category').value;
        const badge = document.getElementById('news-badge').value.trim();
        const author = document.getElementById('news-author').value.trim();
        const content = document.getElementById('news-content').value.trim();
        const pinned = document.getElementById('news-pinned').checked;

        if (!title || !content) {
            alert('Kérjük adja meg a hír címét és tartalmát!');
            return;
        }

        window.dataStore.addNews({
            title,
            category,
            badge,
            author,
            content,
            pinned,
            date: new Date().toISOString().split('T')[0]
        });

        if (window.app) {
            window.app.showToast('✅ Hír sikeresen közzétéve!', 'success');
        }
        this.renderAdminPanel(document.getElementById('admin-content-area') || document.getElementById('dashboard-tab-content'));
    }

    deleteNewsItem(id) {
        if (confirm('Biztosan törölni szeretné ezt a hírt?')) {
            window.dataStore.deleteNews(id);
            if (window.app) {
                window.app.showToast('🗑️ Hír törölve.', 'info');
            }
            this.renderAdminPanel(document.getElementById('admin-content-area') || document.getElementById('dashboard-tab-content'));
        }
    }

    deleteUserAccount(userId, childName) {
        if (confirm(`Biztosan törölni szeretné ezt a regisztrált szülői fiókot (${childName} diákhoz)? Ezzel felszabadul egy regisztrációs hely.`)) {
            let users = window.dataStore.getUsers();
            users = users.filter(u => u.id !== userId);
            window.dataStore.saveUsers(users);
            if (window.app) {
                window.app.showToast(`Szülői fiók törölve. Mostantól újra regisztrálható szülő ${childName} tanulóhoz.`, 'info');
                window.app.populateStudentDropdown();
            }
            this.renderAdminPanel(document.getElementById('admin-content-area') || document.getElementById('dashboard-tab-content'));
        }
    }
}

window.adminManager = new AdminManager();
