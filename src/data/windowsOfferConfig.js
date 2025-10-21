// src/data/windowsOfferConfig.js

export const profileTypeOptions = [
  { value: 'veka', label: 'VEKA' },
  { value: 'vital', label: 'VITAL' },
  { value: 'deko', label: 'DEKO' },
  { value: 'rehau', label: 'REHAU' },
  { value: 'custom', label: 'Dopisz recznie' },
];

export const glassTypeOptions = [
  { value: 'standard-4-6', label: 'Szyba standardowa 4-6 mm' },
  { value: 'tempered', label: 'Hartowana szyba' },
  { value: 'laminated', label: 'Laminowana szyba' },
  { value: 'custom', label: 'Dopisz recznie' },
];

export const hardwareThicknessOptions = [
  { value: 'standard-12', label: 'Standard (wzmocnienie profilu 1,2-2,0 mm)' },
  { value: 'reinforced-20', label: 'Premium (stal 2,0 mm w kazdym oknie)' },
  { value: 'heavy-20', label: 'Specjalne wzmocnienie (stal 2,0 mm do konstrukcji ciezkich)' },
];

export const assemblyTypeOptions = [
  { value: 'standard-foam', label: 'Standardowy (piana + kotwa)' },
  { value: 'sealed-tape', label: 'Szczelny montaz (tasmy)' },
  { value: 'titan-wings', label: 'Szczelny montaz (Titan Wings)' },
];

export const profileColorOptions = [
  { value: 'white', label: 'Bialy mat RAL 9016' },
  { value: 'anthracite', label: 'Antracyt struktura RAL 7016' },
  { value: 'golden-oak', label: 'Okleina zlote drzewo (Golden Oak)' },
  { value: 'two-color', label: 'Dwukolor: bialy od srodka, antracyt na zewnatrz' },
];

// Pliki PDF dla opcji dodatkowych umiesc w public/pdf_templates/okna_nest/opcje/
export const additionalOfferIds = [
  'internal-sills',
  'external-sills',
  'external-blinds',
  'insect-screens',
  'insect-screens-plisse',
  'system-extensions',
  'smart-control',
];

export const windowOptionDefinitions = [
  {
    id: 'internal-sills',
    label: 'Parapety wewnetrzne (kamienne)',
    summaryBullet: 'Kamienne parapety dociete na wymiar i osadzone po montazu stolarki.',
    description: 'Naturalny kamien lub konglomerat montowany na kleju i silikonie dopasowanym do stolarki.',
    details: [
      'Pomiary i dociecia pod skosy oraz wneki',
      'Stabilne osadzenie i silikonowanie w kolorze stolarki',
    ],
    unit: 'kpl.',
    quantity: '1',
    priceNote: 'W cenie zakresu glownych prac',
    pdfPath: '/pdf_templates/okna_nest/opcje/parapety_wewnetrzne.pdf',
    defaultSelected: true,
  },
  {
    id: 'external-sills',
    label: 'Parapety zewnetrzne - stal powlekana',
    summaryBullet: 'Parapety stalowe 0,5-0,7 mm w kolorze stolarki z kompletnym uszczelnieniem podokiennym.',
    description: 'Dostawa oraz montaz parapetow stalowych powlekanych wraz z tasma uszczelniajaca, obrobkami bocznymi i zabezpieczeniem krawedzi.',
    details: [
      'Dociecie parapetow pod katem i dopasowanie do elewacji',
      'Zastosowanie tasmy podokiennej i zabezpieczenie krawedzi przed korozja',
    ],
    unit: 'kpl.',
    quantity: '1',
    priceNote: 'W cenie zakresu glownych prac',
    pdfPath: '/pdf_templates/okna_nest/opcje/parapety_zewnetrzne.pdf',
    defaultSelected: true,
  },
  {
    id: 'external-blinds',
    label: 'Rolety zewnetrzne',
    summaryBullet: 'Rolety zewnetrzne z automatyka i dopasowaniem kolorystycznym do elewacji.',
    description: 'System rolet zewnetrznych z prowadnicami, napedem rurowym oraz przygotowaniem pod sterowanie inteligentne.',
    details: [
      'Kaseta i prowadnice w kolorze stolarki',
      'Sterowanie automatyczne z pilotem lub aplikacja',
      'Integracja z systemem sterowania inteligentnego domu',
    ],
    unit: 'kpl.',
    quantity: '1',
    priceNote: 'Wycena indywidualna zgodnie z liczba okien i sposobem sterowania',
    pdfPath: '/pdf_templates/okna_nest/opcje/rolety_zewnetrzne.pdf',
    defaultSelected: false,
  },
  {
    id: 'insect-screens',
    label: 'Moskitiera ramkowa',
    summaryBullet: 'Moskitiera ramkowa dopasowana do profilu okna z szybkim demontazem sezonowym.',
    description: 'Aluminiowa moskitiera ramkowa montowana na zaczepy obrotowe, dostosowana do profili Nest.',
    details: [
      'Profil aluminiowy lakierowany proszkowo',
      'Siatka w kolorze grafitowym',
      'Zaczepy obrotowe do szybkiego demontazu',
    ],
    unit: 'szt.',
    quantity: 'wg liczby otwieranych skrzydel',
    priceNote: 'Opcja dodatkowa, kalkulacja po inwentaryzacji',
    pdfPath: '/pdf_templates/okna_nest/opcje/moskitiera.pdf',
    defaultSelected: false,
  },
  {
    id: 'insect-screens-plisse',
    label: 'Moskitiera plisowana',
    summaryBullet: 'Moskitiera plisowana do duzych przeszklen i drzwi tarasowych.',
    description: 'System moskitier plisowanych z niskim progiem i prowadnicami bocznymi.',
    details: [
      'Stabilna prowadnica dolna o niskim progu',
      'Plisowana siatka odporna na UV',
      'Latwe czyszczenie i demontaz',
    ],
    unit: 'szt.',
    quantity: 'wg szerokosci przejscia',
    priceNote: 'Opcja dodatkowa, kalkulacja po inwentaryzacji',
    defaultSelected: false,
  },
  {
    id: 'system-extensions',
    label: 'Poszerzenia systemowe / podwaliny systemowe',
    summaryBullet: 'Fabryczne poszerzenia systemowe oraz podwaliny stabilizujace montaz stolarki.',
    description: 'Dostarczamy i montujemy poszerzenia systemowe oraz podwaliny stabilizujace prog i ramy.',
    details: [
      'Dobor elementow systemowych zgodnie z projektem',
      'Stabilizacja progow i ram okiennych',
      'Dostosowanie wysokosci posadowienia do podlogi finalnej',
    ],
    unit: 'kpl.',
    quantity: 'wg projektu',
    priceNote: 'Opcja dodatkowa, kalkulacja po inwentaryzacji',
    defaultSelected: false,
  },
  {
    id: 'security-package',
    label: 'Pakiet antywlamaniowy RC 1-8',
    summaryBullet: 'Konfiguracja zabezpieczen w klasach RC 1-8 wraz z wzmocnionymi okuciami i klamkami z kluczem.',
    description: 'Dobor akcesoriow antywlamaniowych w zakresie klas RC, dodatkowe zaczepy, blokady oraz okucia o podwyzszonej odpornosci.',
    details: [
      'Dobor zaczepow i blokad zgodnie z wymagana klasa RC',
      'Klamki z kluczem oraz oslonami antyrozwierceniowymi',
      'Opcja szyb laminowanych P4 i dodatkowych czujnikow otwarcia',
    ],
    unit: 'kpl.',
    quantity: '1',
    priceNote: 'Opcja dodatkowa obejmujaca material i robocizne montazowa',
    pdfPath: '/pdf_templates/okna_nest/opcje/pakiet_rc2.pdf',
    defaultSelected: false,
  },
  {
    id: 'smart-control',
    label: 'Sterowanie inteligentne',
    summaryBullet: 'Integracja okien, oslon i napedow z systemem sterowania inteligentnego domu.',
    description: 'Projekt oraz wdrozenie systemu sterowania oknami i zaluzjami z aplikacja mobilna, harmonogramami i scenami automatycznymi.',
    details: [
      'Centralka komunikujaca sie przez Wi-Fi lub LAN do sterowania napedami',
      'Konfiguracja scen (noc, urlop, wietrzenie) wraz z harmonogramami',
      'Szkolenie uzytkownikow i przekazanie instrukcji z dokumentacja konfiguracji',
    ],
    unit: 'kpl.',
    quantity: '1',
    priceNote: 'Opcja dodatkowa, koszt zalezy od zakresu integracji oraz ilosci urzadzen',
    pdfPath: '/pdf_templates/okna_nest/opcje/smart_control.pdf',
    defaultSelected: false,
  },
];

export function getOptionLabel(options, value) {
  const match = options.find((option) => option.value === value);
  return match ? match.label : value;
}


export const optionalFeatureGroups = [
  {
    id: 'safety',
    label: 'Bezpieczenstwo',
    items: [
      {
        id: 'feature-rc2',
        label: 'Pakiet antywlamaniowy RC (1-8)',
        summaryLabel: 'Pakiet RC',
      },
    ],
  },
  {
    id: 'comfort',
    label: 'Wentylacja i wygoda',
    items: [
      {
        id: 'feature-microvent',
        label: 'Klamka z funkcja mikrowentylacji',
        summaryLabel: 'Klamka z mikrowentylacja',
      },
      {
        id: 'feature-hinge-brake',
        label: 'Hamulec w klamce 0-90 stopni (blokada skrzydla)',
        summaryLabel: 'Hamulec w klamce',
      },
    ],
  },
  {
    id: 'energy',
    label: 'Energia i akustyka',
    items: [
      {
        id: 'feature-acoustic',
        label: 'Pakiet akustyczny (podwyzszona izolacyjnosc)',
        summaryLabel: 'Pakiet akustyczny',
      },
    ],
  },
  {
    id: 'aesthetics',
    label: 'Estetyka',
    items: [],
  },
  {
    id: 'terrace',
    label: 'Taras / balkon',
    items: [],
  },
];

export const installationExtras = [
  { id: 'install-sealed-tape', label: 'Szczelny montaz (tasmy)', summaryLabel: 'Szczelny montaz (tasmy)' },
  { id: 'install-titan-wings', label: 'Szczelny montaz (Titan Wings)', summaryLabel: 'Szczelny montaz (Titan Wings)' },
  { id: 'install-threshold-seal', label: 'Szczelny montaz progow (EPDM)', summaryLabel: 'Szczelny montaz progow' },
  { id: 'install-reveal-prep', label: 'Przygotowanie glifow pod szczelny montaz - zagruntowanie i wyrownanie klejem', summaryLabel: 'Przygotowanie glifow' },
  { id: 'install-prime-level', label: 'Zagruntowanie i wyrownanie klejem', summaryLabel: 'Gruntowanie i wyrownanie' },
  { id: 'install-warm-parapets', label: 'Cieple parapety XPS 700 KPA', summaryLabel: 'Cieple parapety XPS' },
  { id: 'install-purenit-extensions', label: 'Poszerzenia pod okna Purenit', summaryLabel: 'Poszerzenia Purenit' },
  {
    id: 'install-system-extensions',
    label: 'Poszerzenia systemowe / podwaliny systemowe',
    summaryLabel: 'Poszerzenia systemowe',
  },
  {
    id: 'install-inner-sills',
    label: 'Montaz parapetow wewnetrznych (kamien)',
    summaryLabel: 'Parapety wewnetrzne',
    supportsQuantity: true,
  },
  {
    id: 'install-outer-sills',
    label: 'Montaz parapetow zewnetrznych (stal powlekana)',
    summaryLabel: 'Parapety zewnetrzne',
    supportsQuantity: true,
  },
];

export const demolitionOptions = [
  { value: 'none', label: 'Brak' },
  { value: 'na', label: 'Nie dotyczy' },
  { value: 'yes', label: 'Tak' },
];

export const demolitionTypeOptions = [
  { value: 'na', label: 'Nie dotyczy' },
  { value: 'full', label: 'Calosciowy demontaz ramy' },
  { value: 'cut', label: 'Demontaz przez przeciecie ram' },
];

export const demolitionDirectionOptions = [
  { value: 'inside', label: 'Od wewnatrz' },
  { value: 'outside', label: 'Od zewnatrz' },
  { value: 'both', label: 'Dwustronnie' },
  { value: 'na', label: 'Do uzgodnienia' },
];


