/**
 * auth.js - Hitelesítési, Regisztrációs és Jogosultságkezelő modul
 * Automatikus admin szerepkör rekalaca@gmail.com esetén.
 * Kezeli az e-mail megerősítést, jelszó-visszaállítást és a 2 fiók/tanuló korlátot.
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.pendingRegistration = null;
        this.loadSession();
    }

    loadSession() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            if (saved) {
                this.currentUser = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Hiba a munkamenet betöltésekor:', e);
            this.currentUser = null;
        }
    }

    saveSession(user) {
        this.currentUser = user;
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        if (window.app) {
            window.app.renderApp();
            window.app.showToast('👋 Sikeresen kijelentkezett.', 'info');
        }
    }

    // Egységes bejelentkezés (Admin vagy Szülő)
    login(email, password) {
        const cleanEmail = email.trim().toLowerCase();
        
        // 1. Elsődleges admin ellenőrzése
        if (cleanEmail === 'rekalaca@gmail.com' && password === 'Webdesign2025?') {
            const adminUser = {
                id: 'usr-admin',
                email: 'rekalaca@gmail.com',
                name: 'Rékási László',
                childName: 'Rékási László',
                role: 'admin',
                isVerified: true,
                loginTime: new Date().toISOString()
            };
            this.saveSession(adminUser);
            return { success: true, user: adminUser };
        }

        // 2. Szülői felhasználó ellenőrzése az adatbázisban
        const users = window.dataStore.getUsers();
        const found = users.find(u => u.email.toLowerCase() === cleanEmail && u.passwordHash === password);

        if (found) {
            // Ha rekalaca@gmail.com más jelszóval, de admin jogosultsággal szerepel
            if (cleanEmail === 'rekalaca@gmail.com') {
                found.role = 'admin';
            }
            this.saveSession(found);
            return { success: true, user: found };
        }

        return { success: false, error: 'Érvénytelen e-mail cím vagy jelszó!' };
    }

    // Regisztráció kezdeményezése (Email megerősítő kód küldés szimulációval)
    initiateRegistration({ email, password, childName, privacyAccepted }) {
        if (!email || !password || !childName) {
            return { success: false, error: 'Kérjük töltsön ki minden mezőt!' };
        }

        if (!privacyAccepted) {
            return { success: false, error: 'A regisztrációhoz el kell fogadnia az Adatkezelési hozzájárulást!' };
        }

        const cleanEmail = email.trim().toLowerCase();
        const trimmedChild = childName.trim();
        const users = window.dataStore.getUsers();

        // E-mail egyediség ellenőrzése
        if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
            return { success: false, error: 'Ezzel az e-mail címmel már regisztráltak!' };
        }

        // Tanulónkénti regisztrációs szám ellenőrzése (MAX 2!)
        const count = window.dataStore.getRegistrationCountForChild(trimmedChild);
        if (count >= 2) {
            this.showChildLimitExceededModal(trimmedChild);
            return {
                success: false,
                limitExceeded: true,
                error: `A kiválasztott tanulóhoz (${trimmedChild}) már betelt a maximális 2 regisztráció.`
            };
        }

        // Generálunk egy 6 számjegyű ellenőrző kódot
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        this.pendingRegistration = {
            id: 'usr-' + Date.now(),
            email: cleanEmail,
            passwordHash: password,
            childName: trimmedChild,
            role: cleanEmail === 'rekalaca@gmail.com' ? 'admin' : 'parent',
            verificationCode: verificationCode,
            acceptedPrivacyAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        // Megnyitjuk az email megerősítő modalt
        this.openEmailVerifyModal(cleanEmail, verificationCode);
        return { success: true, needsVerification: true };
    }

    // Email megerősítő kód jóváhagyása
    confirmEmailVerification(enteredCode) {
        if (!this.pendingRegistration) {
            return { success: false, error: 'Nincs folyamatban lévő regisztráció.' };
        }

        if (enteredCode.trim() !== this.pendingRegistration.verificationCode) {
            return { success: false, error: 'Hibás megerősítő kód! Kérjük ellenőrizze a megadott kódot.' };
        }

        // Sikeres aktiválás
        const newUser = {
            ...this.pendingRegistration,
            isVerified: true
        };
        delete newUser.verificationCode;

        const users = window.dataStore.getUsers();
        users.push(newUser);
        window.dataStore.saveUsers(users);
        this.saveSession(newUser);
        this.pendingRegistration = null;
        this.closeEmailVerifyModal();

        return { success: true, user: newUser };
    }

    // Jelszó visszaállítás kezdeményezése
    requestPasswordReset(email) {
        const cleanEmail = email.trim().toLowerCase();
        const users = window.dataStore.getUsers();
        const user = users.find(u => u.email.toLowerCase() === cleanEmail) || (cleanEmail === 'rekalaca@gmail.com' ? { email: 'rekalaca@gmail.com' } : null);

        if (!user) {
            return { success: false, error: 'Ezzel az e-mail címmel nem található regisztrált fiók a rendszerben.' };
        }

        // Jelszó visszaállító kód küldés szimuláció
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        this.pendingReset = {
            email: cleanEmail,
            resetCode: resetCode
        };

        return { success: true, email: cleanEmail, code: resetCode };
    }

    // Jelszó sikeres megváltoztatása
    completePasswordReset(email, code, newPassword) {
        if (!this.pendingReset || this.pendingReset.email !== email.trim().toLowerCase()) {
            return { success: false, error: 'Nincs érvényes jelszó-visszaállítási folyamat.' };
        }

        if (code.trim() !== this.pendingReset.resetCode) {
            return { success: false, error: 'Érvénytelen visszaállító kód!' };
        }

        const users = window.dataStore.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

        if (user) {
            user.passwordHash = newPassword;
            window.dataStore.saveUsers(users);
        }

        this.pendingReset = null;
        this.closeForgotPasswordModal();
        return { success: true };
    }

    // Modálok kezelése
    showChildLimitExceededModal(childName) {
        const modal = document.getElementById('child-limit-modal');
        const studentSpan = document.getElementById('limit-modal-student-name');
        if (modal) {
            if (studentSpan) {
                studentSpan.textContent = childName;
            }
            modal.classList.add('active');
        }
    }

    closeChildLimitModal() {
        const modal = document.getElementById('child-limit-modal');
        if (modal) modal.classList.remove('active');
    }

    openPrivacyModal() {
        const modal = document.getElementById('privacy-policy-modal');
        if (modal) modal.classList.add('active');
    }

    closePrivacyModal() {
        const modal = document.getElementById('privacy-policy-modal');
        if (modal) modal.classList.remove('active');
    }

    openForgotPasswordModal() {
        const modal = document.getElementById('forgot-password-modal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('forgot-step-1').classList.remove('hidden');
            document.getElementById('forgot-step-2').classList.add('hidden');
        }
    }

    closeForgotPasswordModal() {
        const modal = document.getElementById('forgot-password-modal');
        if (modal) modal.classList.remove('active');
    }

    openEmailVerifyModal(email, demoCode) {
        const modal = document.getElementById('email-verify-modal');
        const emailSpan = document.getElementById('verify-modal-email');
        const demoCodeSpan = document.getElementById('demo-verification-code');
        if (modal) {
            if (emailSpan) emailSpan.textContent = email;
            if (demoCodeSpan) demoCodeSpan.textContent = demoCode;
            modal.classList.add('active');
        }
    }

    closeEmailVerifyModal() {
        const modal = document.getElementById('email-verify-modal');
        if (modal) modal.classList.remove('active');
    }
}

window.authManager = new AuthManager();
