# 🎓 Széchenyi 11. D Osztálypénz és Szülői Portál (Next.js + Firebase)

A **Nyíregyházi SZC Széchenyi István Technikum és Kollégium 11. D osztályának** hivatalos szülői és osztálypénz nyilvántartó webalkalmazása.

---

## 🌟 Főbb funkciók és modulok

### 1. 🔒 Szigorú GDPR Adatvédelem és Elmosási Védelem
- **Szülői nézet**: A bejelentkezett szülők **kizárólag a saját gyermekük nevét és havi befizetéseit látják tisztán** a táblázatokban.
- **Többi tanuló maszkolása**: A többi diák neve el van rejtve (`🔒 11. D Tanuló #X`), és a befizetési cellák el vannak homályosítva (`•••• Ft`), így a szülők nem látják egymás fizetési elmaradásait.
- **Adminisztrátori nézet**: Az adminisztrátor (`rekalaca@gmail.com`) minden adatot lát a pénzügyek egyeztetéséhez.
- **2 Szülő / Tanuló Limit**: Egy diákhoz legfeljebb 2 szülői fiók regisztrálható (a 3. regisztrációt letiltja a rendszer).

### 2. ✉️ Valós Gmail SMTP Integráció (Nodemailer)
- **Regisztrációs megerősítés (`/api/verify-code`)**: 6 számjegyű ellenőrző kód kiküldése szép HTML sablonnal a szülő e-mail címére.
- **Elfelejtett jelszó (`/api/forgot-password`)**: Biztonsági kód küldése és jelszó visszaállítás.
- **Közvetlen értesítő körlevelek (`/api/send-email`)**: Az adminisztrátori felületről közvetlen levélküldés a szülőknek a `rekalaca@gmail.com` címről.

### 3. 🏦 Banki Elszámolások
- **2. tanév (2025/2026)**: Havi bontású osztálypénz (3 000 Ft/hó), kirándulási befizetések, névnapi és banki kiadások, aktuális OTP egyenleg (1 247 421 Ft).
- **1. tanév (2024/2025)**: Archív tanévi elszámolás és áthozott maradvány (627 081 Ft).

### 4. 📰 Hírek, SZMK & Tanárok
- **Hírek & Események**: Képes közlemények, kitűzött posztok, fontos dátumok.
- **SZMK Kapcsolat**: Harsányi Tünde és Rékási László közvetlen telefon, email, Messenger és Facebook elérhetőségekkel.
- **Osztály & Tanári Kar**: Füzesiné Tóth Ildikó osztályfőnök és a szaktanárok névsora.

### 5. 🛡️ Adminisztrátori Kezelőpult
- Új bevételek és kiadások rögzítése, azonnali automatikus egyenleg-újraszámolás.
- Új hírek és események közzététele képpel és kategóriával.
- Szülői fiókok és diák-hozzárendelések megtekintése, törlése.
- Közvetlen Gmail email küldés szülőknek.

---

## 🛠️ Technológiai Architektúra

| Réteg | Megvalósítás |
| :--- | :--- |
| **Keretrendszer** | **Next.js 15 (App Router)** & React 19 |
| **Stílus & Dizájn** | **Vanilla CSS** tokenek, HSL színpaletta, Montserrat betűtípus, Dark/Light mód |
| **Email Szolgáltatás** | **Nodemailer** + Gmail SMTP (Alkalmazásjelszó: `itbd rcqb ohpo gnsz`) |
| **Adatbázis & Auth** | **Firebase (Firestore & Auth)** és Reaktív Lokális Adatréteg |

---

## 🚀 Telepítés és Futtatás Helyileg

```bash
# 1. Függőségek telepítése
npm install

# 2. Fejlesztői szerver indítása
npm run dev

# 3. Éles build és tesztelés
npm run build
```

Böngészőben: **http://localhost:3000** (vagy http://localhost:3001)

---

## 🔑 Teszt Bejelentkezési Fiókok

| Szerepkör | E-mail cím | Jelszó | Megjegyzés |
| :--- | :--- | :--- | :--- |
| **Rendszergazda (Admin)** | `rekalaca@gmail.com` | `Webdesign2025?` | Minden tanuló és pénzügyi adat látható, admin kezelőpult elérhető |
| **Szülő 1** | `agoston.szulo@gmail.com` | `jelszo123` | Gyermek: *Ágoston Alex* (Kizárólag saját diák látható, többi elmosva) |
| **Szülő 2** | `agoston.szulo2@gmail.com` | `jelszo123` | Gyermek: *Ágoston Alex* (2. szülői fiók a diákhoz) |

---

## 📅 Következő lépések (Holnapi folytatáshoz)
1. Firebase Cloud Firestore élő adatbázis közvetlen felhőszinkronizáció beállítása (ha szükséges élesben hosztolni Vercel-en / Firebase Hosting-on).
2. További kényelmi funkciók (pl. Excel exportálás letöltése, automatikus fizetési emlékeztető időzítés).
