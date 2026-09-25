/**
 * data.js - Széchenyi 11. D Osztály Portál Adatkezelő
 * Kezeli az 1. és 2. tanév banki adatait, a valós híreket és a profilképes SZMK elérhetőségeket.
 */

const STORAGE_KEYS = {
    USERS: 'szechenyi_11d_users',
    STUDENTS: 'szechenyi_11d_students',
    NEWS: 'szechenyi_11d_news',
    BANK_RECORDS_Y1: 'szechenyi_11d_bank_records_y1',
    BANK_RECORDS_Y2: 'szechenyi_11d_bank_records_y2',
    TEACHERS: 'szechenyi_11d_teachers',
    FINANCES: 'szechenyi_11d_finances',
    SETTINGS: 'szechenyi_11d_settings',
    CURRENT_USER: 'szechenyi_11d_current_user'
};

// Tanáraink hivatalos lista (11. D)
const DEFAULT_TEACHERS = [
    {
        id: 't-1',
        name: 'Füzesiné Tóth Ildikó',
        role: 'Osztályfőnök',
        subject: 'Matematika',
        isHeadTeacher: true,
        icon: '👩‍🏫',
        badge: '⭐ Osztályfőnök'
    },
    {
        id: 't-2',
        name: 'Medve Norbert',
        role: 'Szakmai oktató',
        subject: 'Asztali alkalmazások fejlesztése',
        isHeadTeacher: false,
        icon: '👨‍💻',
        badge: 'Szakmai tantárgy'
    },
    {
        id: 't-3',
        name: 'Juhászné Kovács Ildikó',
        role: 'Szakmai oktató',
        subject: 'Webprogramozás',
        isHeadTeacher: false,
        icon: '👩‍💻',
        badge: 'Szakmai tantárgy'
    },
    {
        id: 't-4',
        name: 'Vidáné Vaszil Edit',
        role: 'Nyelvtanár',
        subject: 'Angol nyelv',
        isHeadTeacher: false,
        icon: '👩‍🏫',
        badge: 'Idegen nyelv'
    },
    {
        id: 't-5',
        name: 'Mikó-Váraljai Tímea',
        role: 'Közismereti tanár',
        subject: 'Magyar nyelv és Irodalom',
        isHeadTeacher: false,
        icon: '👩‍🏫',
        badge: 'Közismeret'
    },
    {
        id: 't-6',
        name: 'Kolonics Edit Anna',
        role: 'Közismereti tanár',
        subject: 'Történelem',
        isHeadTeacher: false,
        icon: '👩‍🏫',
        badge: 'Közismeret'
    },
    {
        id: 't-7',
        name: 'Tar Sándor',
        role: 'Közismereti tanár',
        subject: 'Fizika',
        isHeadTeacher: false,
        icon: '👨‍🏫',
        badge: 'Közismeret'
    },
    {
        id: 't-8',
        name: 'Révész Csaba',
        role: 'Testnevelő tanár',
        subject: 'Testnevelés',
        isHeadTeacher: false,
        icon: '🏃‍♂️',
        badge: 'Testnevelés'
    }
];

// 3 kis kártya alapadatok
const STAT_CARDS_DATA = {
    broughtForward: 627081,  // Előző évről áthozott összeg: 627.081 Ft
    currentBalance: 1247421, // Aktuális OTP számla egyenleg: 1.247.421 Ft
    monthlyFee: 3000         // Havi osztálypénz: 3.000 Ft
};

// ==========================================================================
// 1. TANÉV (2024/2025) BANKI ELSZÁMOLÁS ADATAI (osztalypenz2024-25.xlsx)
// ==========================================================================
const DEFAULT_BANK_RECORDS_Y1 = [
    { id: 1, name: "Ágoston Alex", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 2, name: "Angel Zsombor", m09: "", m10: "", m11: "20 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "" },
    { id: 3, name: "Balázs Bence", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "20 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 4, name: "Bartha Levente", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "2 000 Ft" },
    { id: 5, name: "Czirják Róbert Krisztián", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "20 000 Ft", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 6, name: "Cseke Péter Ernő", m09: "", m10: "10 000 Ft", m11: "", m12: "10 000 Ft", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "" },
    { id: 7, name: "Csobai Péter", m09: "", m10: "", m11: "", m12: "", m01: "20 000 Ft", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 8, name: "Csobán Gábor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "20 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "2 000 Ft" },
    { id: 9, name: "Csőri Márk", m09: "", m10: "4 000 Ft", m11: "", m12: "4 000 Ft", m01: "2 000 Ft", m02: "2 000 Ft", m03: "2 000 Ft", m04: "2 000 Ft", m05: "4 000 Ft", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 10, name: "Dudics Dominik", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "3 000 Ft" },
    { id: 11, name: "Erlich Benedek Zsolt", m09: "", m10: "8 000 Ft", m11: "", m12: "4 000 Ft", m01: "", m02: "4 000 Ft", m03: "4 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "1 000 Ft" },
    { id: 12, name: "Gelsi Dávid", m09: "", m10: "10 000 Ft", m11: "", m12: "", m01: "10 000 Ft", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "3 000 Ft" },
    { id: 13, name: "Gonda Olivér", m09: "", m10: "10 000 Ft", m11: "", m12: "", m01: "", m02: "10 000 Ft", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 14, name: "Gubacsi Dominik", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "2 000 Ft" },
    { id: 15, name: "Hajzer Balázs", m09: "", m10: "10 000 Ft", m11: "", m12: "", m01: "10 000 Ft", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 16, name: "Hudák Levente", m09: "", m10: "", m11: "6 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "6 000 Ft", debt: "14 000 Ft", kp: "", trip: "25 000 Ft", funeral: "1 000 Ft" },
    { id: 17, name: "Kádár Bálint Miklós", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "" },
    { id: 18, name: "Kardos Bence Koppány", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "20 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 19, name: "Kocsis Ferenc", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "2 000 Ft" },
    { id: 20, name: "Márkus Péter", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 21, name: "Mészáros Szabolcs", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 22, name: "Mizsák Dávid", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 23, name: "Molnár Benedek", m09: "", m10: "4 000 Ft", m11: "2 000 Ft", m12: "2 000 Ft", m01: "2 000 Ft", m02: "2 000 Ft", m03: "2 000 Ft", m04: "2 000 Ft", m05: "2 000 Ft", m06: "2 000 Ft", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "3 000 Ft" },
    { id: 24, name: "Nyíri Ábel", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "2 000 Ft" },
    { id: 25, name: "Papp Bence József", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "10 000 Ft" },
    { id: 26, name: "Papp Hunor Attila", m09: "", m10: "", m11: "2 000 Ft", m12: "4 000 Ft", m01: "", m02: "", m03: "4 000 Ft", m04: "8 000 Ft", m05: "", m06: "", total: "18 000 Ft", debt: "2 000 Ft", kp: "", trip: "25 000 Ft", funeral: "1 000 Ft" },
    { id: 27, name: "Pfeffer Balázs", m09: "", m10: "", m11: "", m12: "20 000 Ft", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "1 000 Ft" },
    { id: 28, name: "Rékási László", m09: "", m10: "4 000 Ft", m11: "", m12: "", m01: "8 000 Ft", m02: "", m03: "6 000 Ft", m04: "", m05: "", m06: "2 000 Ft", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "2 000 Ft" },
    { id: 29, name: "Szép Levente", m09: "", m10: "10 000 Ft", m11: "", m12: "", m01: "10 000 Ft", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "1 000 Ft" },
    { id: 30, name: "Szilágyi Viktor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "0 Ft", kp: "20 000 Ft", trip: "", funeral: "1 000 Ft" },
    { id: 31, name: "Szondi Levente", m09: "", m10: "4 000 Ft", m11: "2 000 Ft", m12: "2 000 Ft", m01: "2 000 Ft", m02: "2 000 Ft", m03: "2 000 Ft", m04: "2 000 Ft", m05: "4 000 Ft", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "3 000 Ft" },
    { id: 32, name: "Szücs Gábor", m09: "", m10: "", m11: "10 000 Ft", m12: "", m01: "", m02: "", m03: "10 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "10 000 Ft" },
    { id: 33, name: "Tábori László János", m09: "", m10: "", m11: "6 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "14 000 Ft", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "" },
    { id: 34, name: "Varga Márton Balázs", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "5 000 Ft" },
    { id: 35, name: "Vincze Ádám", m09: "", m10: "4 000 Ft", m11: "4 000 Ft", m12: "", m01: "4 000 Ft", m02: "", m03: "4 000 Ft", m04: "", m05: "4 000 Ft", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "10 000 Ft" },
    { id: 36, name: "Virág Péter Szabolcs", m09: "", m10: "10 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "10 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", kp: "", trip: "25 000 Ft", funeral: "10 000 Ft" }
];

const DEFAULT_BANK_SUMMARY_Y1 = {
    monthlyIncomeTotals: { m09: "0 Ft", m10: "328 000 Ft", m11: "52 000 Ft", m12: "12 000 Ft", m01: "52 000 Ft", m02: "56 000 Ft", m03: "54 000 Ft", m04: "98 000 Ft", m05: "14 000 Ft", m06: "2 000 Ft", total: "684 000 Ft", debtTotal: "16 000 Ft", tripTotal: "875 000 Ft" },
    monthlyExpenses: [
        { name: "Névnapok", m09: "4 385 Ft", m10: "3 982 Ft", m11: "4 378 Ft", m12: "", m01: "", m02: "12 297 Ft", m03: "", m04: "19 596 Ft", m05: "", m06: "", total: "44 638 Ft" },
        { name: "Banki költség", m09: "", m10: "", m11: "", m12: "", m01: "217 Ft", m02: "217 Ft", m03: "225 Ft", m04: "225 Ft", m05: "225 Ft", m06: "225 Ft", total: "1 784 Ft" },
        { name: "Banki költség kp felv.", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "18 683 Ft", m05: "", m06: "2 814 Ft", total: "21 497 Ft" }
    ],
    totalExpenses: 67919,
    baseBalance: 616081,
    funeralSupport: 5000,
    cookoutSupport: 6000,
    closingAccountBalance: 627081
};

// ==========================================================================
// 2. TANÉV (2025/2026) BANKI ELSZÁMOLÁS ADATAI (osztalypenz2025-26.xlsx)
// ==========================================================================
const DEFAULT_BANK_RECORDS_Y2 = [
    { id: 1, name: "Ágoston Alex", m09: "10 000 Ft", m10: "10 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 2, name: "Angel Zsombor", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "Kirándulás készpénzben fizetve (40 000 Ft)" },
    { id: 3, name: "Balázs Bence", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 4, name: "Bartha Levente", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 5, name: "Czirják Róbert Krisztián", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "20 000 Ft", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 6, name: "Cseke Péter Ernő", m09: "", m10: "", m11: "20 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 7, name: "Csobai Péter", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "20 000 Ft", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 8, name: "Csobán Gábor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "20 000 Ft", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 9, name: "Csőri Márk", m09: "", m10: "4 000 Ft", m11: "", m12: "6 000 Ft", m01: "", m02: "", m03: "10 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 10, name: "Dudics Dominik", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "20 000 Ft", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 11, name: "Erlich Benedek Zsolt", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 12, name: "Gelsi Dávid", m09: "", m10: "", m11: "", m12: "10 000 Ft", m01: "", m02: "10 000 Ft", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 13, name: "Gonda Olivér", m09: "", m10: "10 000 Ft", m11: "", m12: "", m01: "10 000 Ft", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 14, name: "Gubacsi Dominik", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 15, name: "Gulácsi Máté", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "20 000 Ft", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 16, name: "Hajzer Balázs", m09: "", m10: "10 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "10 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 17, name: "Hudák Levente", m09: "", m10: "18 000 Ft", m11: "", m12: "", m01: "4 000 Ft", m02: "", m03: "", m04: "", m05: "", m06: "", total: "22 000 Ft", debt: "-2 000 Ft", trip: "40 000 Ft", prevDebt: "14 000 Ft", note: "Fizetve" },
    { id: 18, name: "Kádár Bálint Miklós", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 19, name: "Kardos Bence Koppány", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "20 000 Ft", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 20, name: "Kocsis Ferenc", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 21, name: "Márkus Péter", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 22, name: "Mészáros Szabolcs", m09: "", m10: "", m11: "20 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 23, name: "Mizsák Dávid", m09: "", m10: "", m11: "20 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 24, name: "Molnár Benedek", m09: "2 000 Ft", m10: "2 000 Ft", m11: "2 000 Ft", m12: "2 000 Ft", m01: "2 000 Ft", m02: "2 000 Ft", m03: "2 000 Ft", m04: "2 000 Ft", m05: "2 000 Ft", m06: "2 000 Ft", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 25, name: "Nyíri Ábel", m09: "", m10: "", m11: "20 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 26, name: "Papp Bence József", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "20 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 27, name: "Papp Hunor Attila", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "12 000 Ft", m06: "", total: "12 000 Ft", debt: "8 000 Ft", trip: "40 000 Ft", prevDebt: "2 000 Ft", note: "" },
    { id: 28, name: "Pfeffer Balázs", m09: "", m10: "", m11: "20 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 29, name: "Rékási László", m09: "", m10: "", m11: "", m12: "", m01: "10 000 Ft", m02: "", m03: "", m04: "10 000 Ft", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 30, name: "Szép Levente", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 31, name: "Szilágyi Viktor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "Osztálypénz (20 000 Ft) és kirándulás (40 000 Ft) készpénzben fizetve" },
    { id: 32, name: "Szondi Levente", m09: "", m10: "4 000 Ft", m11: "2 000 Ft", m12: "2 000 Ft", m01: "2 000 Ft", m02: "2 000 Ft", m03: "2 000 Ft", m04: "2 000 Ft", m05: "4 000 Ft", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 33, name: "Szücs Gábor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "20 000 Ft", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 34, name: "Tábori László János", m09: "", m10: "", m11: "20 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 35, name: "Varga Márton Balázs", m09: "20 000 Ft", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 36, name: "Vincze Ádám", m09: "", m10: "10 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "10 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
    { id: 37, name: "Virág Péter Szabolcs", m09: "20 000 Ft", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" }
];

const DEFAULT_BANK_SUMMARY_Y2 = {
    monthlyIncomeTotals: { m09: "52 000 Ft", m10: "248 000 Ft", m11: "124 000 Ft", m12: "20 000 Ft", m01: "28 000 Ft", m02: "94 000 Ft", m03: "34 000 Ft", m04: "14 000 Ft", m05: "98 000 Ft", m06: "2 000 Ft", total: "714 000 Ft", debtTotal: "6 000 Ft", tripTotal: "1 480 000 Ft" },
    monthlyExpenses: [
        { name: "Névnapok", m09: "1 500 Ft", m10: "", m11: "", m12: "", m01: "", m02: "36 919 Ft", m03: "", m04: "", m05: "", m06: "", total: "38 419 Ft" },
        { name: "Banki költség", m09: "3 632 Ft", m10: "225 Ft", m11: "225 Ft", m12: "-273 Ft", m01: "", m02: "863 Ft", m03: "344 Ft", m04: "", m05: "", m06: "", total: "5 016 Ft" },
        { name: "Banki költség kp felv.", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "39 000 Ft", m03: "10 000 Ft", m04: "", m05: "17 225 Ft", m06: "", total: "66 225 Ft" },
        { name: "Egyéb kiadások", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "9 000 Ft", m06: "", total: "9 000 Ft" }
    ],
    monthlyExpenseTotals: { m09: "5 132 Ft", m10: "225 Ft", m11: "225 Ft", m12: "-273 Ft", m01: "0 Ft", m02: "39 863 Ft", m03: "47 263 Ft", m04: "0 Ft", m05: "26 225 Ft", m06: "0 Ft", total: "118 660 Ft" },
    carriedForward2024: 627081,
    yearIncome2025: 714000,
    totalOtpIncome: 1341081,
    totalExpenses: 118660,
    netBalance: 1222421,
    otherIncome: 25000,
    closingOtpBalance: 1247421
};

const DEFAULT_CASH_FLOW_Y2 = {
    incomes: [
        { id: 1, date: "2025/2026. tanév", studentName: "Szilágyi Viktor", description: "2. tanévi osztálypénz (20 000 Ft) készpénzes befizetése", amount: 20000, formattedAmount: "20 000 Ft", category: "Osztálypénz" },
        { id: 2, date: "2025/2026. tanév", studentName: "Angel Zsombor", description: "Kirándulási díj (40 000 Ft) készpénzes befizetése", amount: 40000, formattedAmount: "40 000 Ft", category: "Kirándulás" },
        { id: 3, date: "2025/2026. tanév", studentName: "Szilágyi Viktor", description: "Kirándulási díj (40 000 Ft) készpénzes befizetése", amount: 40000, formattedAmount: "40 000 Ft", category: "Kirándulás" }
    ],
    expenses: [
        { id: 1, date: "2025.09.15.", description: "Névnap", amount: 4198, formattedAmount: "4 198 Ft", category: "Névnap" },
        { id: 2, date: "2025.11.17.", description: "Névnap", amount: 9990, formattedAmount: "9 990 Ft", category: "Névnap" },
        { id: 3, date: "2026. február", description: "Sütipénz bálra", amount: 12000, formattedAmount: "12 000 Ft", category: "Sütipénz" },
        { id: 4, date: "2026.03.12.", description: "Névnap", amount: 1800, formattedAmount: "1 800 Ft", category: "Névnap" },
        { id: 5, date: "2026.03.27.", description: "Névnap", amount: 1945, formattedAmount: "1 945 Ft", category: "Névnap" },
        { id: 6, date: "2026.05.28.", description: "Névnap", amount: 1395, formattedAmount: "1 395 Ft", category: "Névnap" },
        { id: 7, date: "2026.05.28.", description: "Főzés", amount: 2000, formattedAmount: "2 000 Ft", category: "Főzés" },
        { id: 8, date: "2026. május", description: "Főzés", amount: 13129, formattedAmount: "13 129 Ft", category: "Főzés" },
        { id: 9, date: "2026. június", description: "Kirándulási költség", amount: 50943, formattedAmount: "50 943 Ft", category: "Kirándulás" }
    ],
    totalIncome: 100000,
    formattedTotalIncome: "100 000 Ft",
    totalExpenses: 97400,
    formattedTotalExpenses: "97 400 Ft",
    closingCashBalance: 2600,
    formattedClosingCashBalance: "2 600 Ft",
    grandTotalClosingBalance: 1250021,
    formattedGrandTotalClosingBalance: "1 250 021 Ft"
};

// ==========================================================================
// HÍREK ÉS KÖZLEMÉNYEK (Valós hírek képekkel)
// ==========================================================================
const DEFAULT_NEWS = [
    {
        id: 'news-1',
        title: 'Tájékoztató az osztálypénz összegéről és befizetéséről',
        category: 'Pénzügy',
        date: '2026-09-15',
        pinned: true,
        author: 'SZMK Vezetőség',
        badge: 'Fontos',
        image: 'public/pictures/osztalypenz.png',
        content: 'Kedves Szülők! Szeretnénk tájékoztatni benneteket, hogy idén szeptembertől az osztálypénz összege 3000 Ft-ra módosul. Az utalásokat továbbra is a megszokott, 11773449-03543429-es (OTP Bank) számlaszámra várjuk. Kérjük, hogy a beazonosítás érdekében a közlemény rovatba mindenképpen írjátok be a gyermek nevét. Köszönjük szépen az együttműködést!'
    },
    {
        id: 'news-2',
        title: 'Őszi Gyümölcsnapok! (szeptember 22-24. között)',
        category: 'Iskolai élet',
        date: '2026-09-16',
        pinned: false,
        author: 'Iskolavezetés / SZMK',
        badge: 'Esemény',
        image: 'public/pictures/gyumi.jpg',
        content: `Várjuk a 9. 10. 11. évfolyam hozzájárulását néhány kg friss gyümölcs formájában. Az egészséges táplálkozáshoz szükséges finom gyümölcsöket az aulában gyűjtjük és mindenki fogyaszthatja.

• Kedden a 9. évfolyam
• Szerdán a 10. évfolyam
• Csütörtökön a 11. évfolyam

Várjuk a felajánlott gyümölcsöket!
(12-13. évfolyam a pénteki sportnapra hozhat igény szerint, nem kötelező!)`
    }
];

// ==========================================================================
// SZMK KÉPVISELŐK PROFILKÉPEKKEL ÉS PONTOS ELÉRHETŐSÉGEKKEL
// ==========================================================================
const SZMK_REPRESENTATIVES = [
    {
        id: 'szmk-1',
        name: 'Harsányi Tünde',
        role: 'SZMK képviselő',
        image: 'public/pictures/tunde.jpg',
        phone: '+36 20 217 9300',
        phoneRaw: '+36202179300',
        email: 'haritunde11@gmail.com',
        facebookUrl: 'https://www.facebook.com/tunde.harsanyi.31',
        facebookAppUrl: 'fb://facewebmodal/f?href=https://www.facebook.com/tunde.harsanyi.31',
        messengerUrl: 'https://www.facebook.com/messages/e2ee/t/8610531365636646',
        messengerAppUrl: 'fb-messenger://user-thread/8610531365636646',
        description: 'Osztálypénz elszámolás, osztályprogramok és szülői kapcsolattartás.'
    },
    {
        id: 'szmk-2',
        name: 'Rékási László',
        role: 'SZMK képviselő & Rendszergazda',
        image: 'public/pictures/laca.jpg',
        email: 'rekalaca@gmail.com',
        phone: '+36 30 444 2569',
        phoneRaw: '+36304442569',
        facebookUrl: 'https://www.facebook.com/rekalaca',
        facebookAppUrl: 'fb://facewebmodal/f?href=https://www.facebook.com/rekalaca',
        messengerUrl: 'https://m.me/rekalaca',
        messengerAppUrl: 'fb-messenger://user-thread/rekalaca',
        description: 'Adatkezelő, portál üzemeltetés és osztálypénz banki nyilvántartás.'
    }
];

// Felhasználók
const DEFAULT_USERS = [
    {
        id: 'usr-admin',
        email: 'rekalaca@gmail.com',
        passwordHash: 'Webdesign2025?',
        childName: 'Rékási László',
        role: 'admin',
        isVerified: true,
        acceptedPrivacyAt: '2026-09-01T00:00:00Z',
        createdAt: '2026-09-01T00:00:00Z'
    },
    {
        id: 'usr-parent-1',
        email: 'agoston.szulo@gmail.com',
        passwordHash: 'jelszo123',
        childName: 'Ágoston Alex',
        role: 'parent',
        isVerified: true,
        acceptedPrivacyAt: '2026-09-10T14:20:00Z',
        createdAt: '2026-09-10T14:20:00Z'
    },
    {
        id: 'usr-parent-2',
        email: 'agoston.szulo2@gmail.com',
        passwordHash: 'jelszo123',
        childName: 'Ágoston Alex',
        role: 'parent',
        isVerified: true,
        acceptedPrivacyAt: '2026-09-11T09:15:00Z',
        createdAt: '2026-09-11T09:15:00Z'
    }
];

class DataStore {
    constructor() {
        this.init();
    }

    init() {
        const names = DEFAULT_BANK_RECORDS_Y2.map(r => r.name);
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(names));
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(DEFAULT_NEWS));
        
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
        } else {
            const users = this.getUsers();
            if (!users.some(u => u.email.toLowerCase() === 'rekalaca@gmail.com')) {
                users.push(DEFAULT_USERS[0]);
                this.saveUsers(users);
            }
        }
    }

    getStudents() {
        return DEFAULT_BANK_RECORDS_Y2.map(r => r.name);
    }

    getBankRecordsY1() {
        return DEFAULT_BANK_RECORDS_Y1;
    }

    getBankSummaryY1() {
        return DEFAULT_BANK_SUMMARY_Y1;
    }

    getBankRecordsY2() {
        return DEFAULT_BANK_RECORDS_Y2;
    }

    getBankSummaryY2() {
        return DEFAULT_BANK_SUMMARY_Y2;
    }

    getStatCardsData() {
        return STAT_CARDS_DATA;
    }

    getSZMK() {
        return SZMK_REPRESENTATIVES;
    }

    getNews() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWS) || JSON.stringify(DEFAULT_NEWS));
    }

    saveNews(newsList) {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newsList));
    }

    addNews(item) {
        const list = this.getNews();
        item.id = 'news-' + Date.now();
        list.unshift(item);
        this.saveNews(list);
        return item;
    }

    deleteNews(id) {
        let list = this.getNews();
        list = list.filter(n => n.id !== id);
        this.saveNews(list);
    }

    getFinances() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.FINANCES) || '[]');
    }

    saveFinances(financesList) {
        localStorage.setItem(STORAGE_KEYS.FINANCES, JSON.stringify(financesList));
    }

    addFinance(item) {
        const list = this.getFinances();
        item.id = 'fin-' + Date.now();
        list.unshift(item);
        this.saveFinances(list);
        return item;
    }

    deleteFinance(id) {
        let list = this.getFinances();
        list = list.filter(f => f.id !== id);
        this.saveFinances(list);
    }

    getFinanceStats() {
        const summary = this.getBankSummaryY3();
        const cashFlow = this.getCashFlowY3();
        const baseStats = this.getStatCardsData();

        return {
            broughtForward: baseStats.broughtForward,
            currentBalance: summary.closingOtpBalance,
            cashBalance: cashFlow.closingCashBalance,
            totalBalance: cashFlow.grandTotalClosingBalance,
            monthlyFee: baseStats.monthlyFee,
            totalIncome: summary.totalIncome + cashFlow.totalIncome,
            totalExpense: summary.totalExpenses + cashFlow.totalExpenses
        };
    }

    getTeachers() {
        const stored = localStorage.getItem(STORAGE_KEYS.TEACHERS);
        if (!stored) return DEFAULT_TEACHERS;
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name !== 'Osztályfőnök') {
                return parsed;
            }
        } catch (e) {}
        return DEFAULT_TEACHERS;
    }

    saveTeachers(teachersList) {
        localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachersList));
    }

    getStudentsList() {
        return DEFAULT_BANK_RECORDS_Y2.map((r, index) => ({
            id: r.id || (index + 1),
            name: r.name,
            class: "11. D",
            specialization: "Informatika és távközlés",
            subSpecialization: "Szoftverfejlesztő / Rendszerüzemeltető"
        }));
    }

    getUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    }

    saveUsers(usersList) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersList));
    }

    getRegistrationCountForChild(childName) {
        const users = this.getUsers();
        const trimmedName = childName.trim().toLowerCase();
        return users.filter(u => u.childName && u.childName.trim().toLowerCase() === trimmedName).length;
    }

    getParentsForChild(childName) {
        const users = this.getUsers();
        const trimmedName = childName.trim().toLowerCase();
        return users.filter(u => u.childName && u.childName.trim().toLowerCase() === trimmedName);
    }
}

window.dataStore = new DataStore();
