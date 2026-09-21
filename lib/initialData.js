export const DEFAULT_TEACHERS = [
  {
    id: 't-1',
    name: 'Füzesiné Tóth Ildikó',
    role: 'Osztályfőnök',
    subject: 'Matematika',
    isHeadTeacher: true,
    badge: '⭐ Osztályfőnök',
    nameday: '03-10',
    namedayDisplay: 'március 10.'
  },
  {
    id: 't-2',
    name: 'Medve Norbert',
    role: 'Szakmai oktató',
    subject: 'Asztali alkalmazások fejlesztése',
    isHeadTeacher: false,
    badge: 'Szakmai tantárgy',
    nameday: '06-06',
    namedayDisplay: 'június 6.'
  },
  {
    id: 't-3',
    name: 'Juhászné Kovács Ildikó',
    role: 'Szakmai oktató',
    subject: 'Webprogramozás',
    isHeadTeacher: false,
    badge: 'Szakmai tantárgy',
    nameday: '03-10',
    namedayDisplay: 'március 10.'
  },
  {
    id: 't-4',
    name: 'Vidáné Vaszil Edit',
    role: 'Nyelvtanár',
    subject: 'Angol nyelv',
    isHeadTeacher: false,
    badge: 'Idegen nyelv',
    nameday: '09-16',
    namedayDisplay: 'szeptember 16.'
  },
  {
    id: 't-5',
    name: 'Mikó-Váraljai Tímea',
    role: 'Közismereti tanár',
    subject: 'Magyar nyelv és Irodalom',
    isHeadTeacher: false,
    badge: 'Közismeret',
    nameday: '05-03',
    namedayDisplay: 'május 3.'
  },
  {
    id: 't-6',
    name: 'Kolonics Edit Anna',
    role: 'Közismereti tanár',
    subject: 'Történelem',
    isHeadTeacher: false,
    badge: 'Közismeret',
    nameday: '07-26',
    namedayDisplay: 'július 26.'
  },
  {
    id: 't-7',
    name: 'Tar Sándor',
    role: 'Közismereti tanár',
    subject: 'Fizika',
    isHeadTeacher: false,
    badge: 'Közismeret',
    nameday: '03-18',
    namedayDisplay: 'március 18.'
  },
  {
    id: 't-8',
    name: 'Révész Csaba',
    role: 'Testnevelő tanár',
    subject: 'Testnevelés',
    isHeadTeacher: false,
    badge: 'Testnevelés',
    nameday: '07-06',
    namedayDisplay: 'július 6.'
  },
  {
    id: 't-9',
    name: 'Rehó János',
    role: 'Szakmai oktató',
    subject: 'Informatika',
    isHeadTeacher: false,
    badge: 'Szakmai tantárgy',
    nameday: '06-26',
    namedayDisplay: 'június 26.'
  },
  {
    id: 't-10',
    name: 'Kiss László',
    role: 'Nyelvtanár',
    subject: 'Angol nyelv',
    isHeadTeacher: false,
    badge: 'Idegen nyelv',
    nameday: '06-27',
    namedayDisplay: 'június 27.'
  }
];

export const STAT_CARDS_DATA = {
  broughtForward: 1247421, // 2. tanévről áthozott nyitó egyenleg a 3. tanévre: 1.247.421 Ft
  currentBalance: 1247421, // Aktuális OTP számla egyenleg (nyitó): 1.247.421 Ft
  monthlyFee: 3000         // Havi osztálypénz: 3.000 Ft
};

export const DEFAULT_BANK_RECORDS_Y1 = [
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

export const DEFAULT_BANK_SUMMARY_Y1 = {
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

export const DEFAULT_BANK_RECORDS_Y2 = [
  { id: 1, name: "Ágoston Alex", m09: "10 000 Ft", m10: "10 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
  { id: 2, name: "Angel Zsombor", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "", prevDebt: "", note: "" },
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
  { id: 25, name: "Nyíri Ábel", m09: "", m10: "", m11: "20 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "31 000 Ft", prevDebt: "", note: "" },
  { id: 26, name: "Papp Bence József", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "20 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
  { id: 27, name: "Papp Hunor Attila", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "12 000 Ft", m06: "", total: "12 000 Ft", debt: "8 000 Ft", trip: "40 000 Ft", prevDebt: "2 000 Ft", note: "" },
  { id: 28, name: "Pfeffer Balázs", m09: "", m10: "", m11: "20 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
  { id: 29, name: "Rékási László", m09: "", m10: "", m11: "", m12: "", m01: "10 000 Ft", m02: "", m03: "", m04: "10 000 Ft", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
  { id: 30, name: "Szép Levente", m09: "", m10: "20 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
  { id: 31, name: "Szilágyi Viktor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "20 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 32, name: "Szondi Levente", m09: "", m10: "4 000 Ft", m11: "2 000 Ft", m12: "2 000 Ft", m01: "2 000 Ft", m02: "2 000 Ft", m03: "2 000 Ft", m04: "2 000 Ft", m05: "4 000 Ft", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
  { id: 33, name: "Szücs Gábor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "20 000 Ft", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
  { id: 34, name: "Tábori László János", m09: "", m10: "", m11: "20 000 Ft", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
  { id: 35, name: "Varga Márton Balázs", m09: "20 000 Ft", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
  { id: 36, name: "Vincze Ádám", m09: "", m10: "10 000 Ft", m11: "", m12: "", m01: "", m02: "", m03: "10 000 Ft", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" },
  { id: 37, name: "Virág Péter Szabolcs", m09: "20 000 Ft", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "20 000 Ft", debt: "0 Ft", trip: "40 000 Ft", prevDebt: "", note: "" }
];

export const DEFAULT_BANK_SUMMARY_Y2 = {
  monthlyIncomeTotals: { m09: "52 000 Ft", m10: "248 000 Ft", m11: "124 000 Ft", m12: "20 000 Ft", m01: "28 000 Ft", m02: "94 000 Ft", m03: "34 000 Ft", m04: "14 000 Ft", m05: "98 000 Ft", m06: "2 000 Ft", total: "714 000 Ft", debtTotal: "26 000 Ft", tripTotal: "1 391 000 Ft" },
  monthlyExpenses: [
    { name: "Névnapok", m09: "1 500 Ft", m10: "", m11: "", m12: "", m01: "", m02: "36 919 Ft", m03: "", m04: "", m05: "", m06: "", total: "38 419 Ft" },
    { name: "Banki költség", m09: "3 632 Ft", m10: "225 Ft", m11: "225 Ft", m12: "-273 Ft", m01: "", m02: "863 Ft", m03: "344 Ft", m04: "", m05: "", m06: "", total: "5 016 Ft" },
    { name: "Banki költség kp felv.", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "39 000 Ft", m03: "10 000 Ft", m04: "", m05: "17 225 Ft", m06: "", total: "66 225 Ft" }
  ],
  monthlyExpenseTotals: { m09: "5 132 Ft", m10: "225 Ft", m11: "225 Ft", m12: "-273 Ft", m01: "0 Ft", m02: "39 863 Ft", m03: "47 263 Ft", m04: "0 Ft", m05: "17 225 Ft", m06: "0 Ft", total: "109 660 Ft" },
  carriedForward2024: 627081,
  yearIncome2025: 714000,
  totalOtpIncome: 1341081,
  totalExpenses: 109660,
  netBalance: 1231421,
  otherIncome: 16000,
  closingOtpBalance: 1247421
};

export const DEFAULT_BANK_RECORDS_Y3 = [
  { id: 1, name: "Ágoston Alex", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 2, name: "Angel Zsombor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 3, name: "Balázs Bence", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 4, name: "Bartha Levente", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 5, name: "Czirják Róbert Krisztián", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 6, name: "Cseke Péter Ernő", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 7, name: "Csobai Péter", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 8, name: "Csobán Gábor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 9, name: "Csőri Márk", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 10, name: "Dudics Dominik", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 11, name: "Erlich Benedek Zsolt", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 12, name: "Gelsi Dávid", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 13, name: "Gonda Olivér", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 14, name: "Gubacsi Dominik", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 15, name: "Gulácsi Máté", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 16, name: "Hajzer Balázs", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 17, name: "Hudák Levente", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "2 000 Ft", debt: "28 000 Ft", trip: "", prevDebt: "", note: "2. tanévi túlfizetés (+2 000 Ft) jóváírva" },
  { id: 18, name: "Kádár Bálint Miklós", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 19, name: "Kardos Bence Koppány", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 20, name: "Kocsis Ferenc", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 21, name: "Márkus Péter", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 22, name: "Mészáros Szabolcs", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 23, name: "Mizsák Dávid", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 24, name: "Molnár Benedek", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 25, name: "Nyíri Ábel", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 26, name: "Papp Bence József", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 27, name: "Papp Hunor Attila", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "10 000 Ft", note: "1. évfolyamból 2 000 Ft, 2. évfolyamból 8 000 Ft elmaradás" },
  { id: 28, name: "Pfeffer Balázs", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 29, name: "Rékási László", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 30, name: "Szép Levente", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 31, name: "Szilágyi Viktor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "20 000 Ft", note: "2. évfolyamból 20 000 Ft elmaradás (kp egyeztetés alatt)" },
  { id: 32, name: "Szondi Levente", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 33, name: "Szücs Gábor", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 34, name: "Tábori László János", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 35, name: "Varga Márton Balázs", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 36, name: "Vincze Ádám", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" },
  { id: 37, name: "Virág Péter Szabolcs", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft", debt: "30 000 Ft", trip: "", prevDebt: "", note: "" }
];

export const DEFAULT_BANK_SUMMARY_Y3 = {
  monthlyIncomeTotals: { m09: "0 Ft", m10: "0 Ft", m11: "0 Ft", m12: "0 Ft", m01: "0 Ft", m02: "0 Ft", m03: "0 Ft", m04: "0 Ft", m05: "0 Ft", m06: "0 Ft", total: "0 Ft", debtTotal: "1 108 000 Ft", tripTotal: "0 Ft" },
  monthlyExpenses: [
    { name: "Névnapok", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft" },
    { name: "Banki költség", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft" },
    { name: "Banki költség kp felv.", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft" },
    { name: "Egyéb kiadás", m09: "", m10: "", m11: "", m12: "", m01: "", m02: "", m03: "", m04: "", m05: "", m06: "", total: "0 Ft" }
  ],
  monthlyExpenseTotals: { m09: "0 Ft", m10: "0 Ft", m11: "0 Ft", m12: "0 Ft", m01: "0 Ft", m02: "0 Ft", m03: "0 Ft", m04: "0 Ft", m05: "0 Ft", m06: "0 Ft", total: "0 Ft" },
  openingBalance2026: 1247421, // 2. tanévből áthozott nyitó: 1 247 421 Ft
  yearIncome2026: 0,
  totalExpenses: 0,
  closingOtpBalance: 1247421
};

export const DEFAULT_NEWS = [
  {
    id: 'news-1',
    title: 'Tájékoztató az osztálypénz összegéről és befizetéséről',
    category: 'Pénzügy',
    date: '2026-09-15',
    pinned: true,
    author: 'SZMK Vezetőség',
    badge: 'Fontos',
    image: '/pictures/osztalypenz.png',
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
    image: '/pictures/gyumi.jpg',
    content: `Várjuk a 9. 10. 11. évfolyam hozzájárulását néhány kg friss gyümölcs formájában. Az egészséges táplálkozáshoz szükséges finom gyümölcsöket az aulában gyűjtjük és mindenki fogyaszthatja.\n\n• Kedden a 9. évfolyam\n• Szerdán a 10. évfolyam\n• Csütörtökön a 11. évfolyam\n\nVárjuk a felajánlott gyümölcsöket!\n(12-13. évfolyam a pénteki sportnapra hozhat igény szerint, nem kötelező!)`
  }
];

export const SZMK_REPRESENTATIVES = [
  {
    id: 'szmk-1',
    name: 'Harsányi Tünde',
    role: 'SZMK képviselő',
    image: '/pictures/tunde.jpg',
    phone: '',
    phoneRaw: '',
    email: '',
    facebookUrl: 'https://www.facebook.com/tunde.harsanyi.31',
    messengerUrl: 'https://www.facebook.com/messages/e2ee/t/8610531365636646',
    description: 'Osztálypénz elszámolás, osztályprogramok és szülői kapcsolattartás.'
  },
  {
    id: 'szmk-2',
    name: 'Rékási László',
    role: 'SZMK képviselő',
    image: '/pictures/laca.jpg',
    email: 'rekalaca@gmail.com',
    phone: '+36 30 444 2569',
    phoneRaw: '+36304442569',
    facebookUrl: 'https://www.facebook.com/rekalaca',
    messengerUrl: 'https://m.me/rekalaca',
    description: 'Adatkezelő, portál üzemeltetés és osztálypénz banki nyilvántartás.'
  }
];

export const DEFAULT_USERS = [
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
