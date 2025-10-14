// src/data/windowsOfferConfig.js

export const profileTypeOptions = [
  { value: 'nest-82', label: 'Nest 82 (7-komorowy, 82 mm)' },
  { value: 'nest-92', label: 'Nest 92 (8-komorowy, 92 mm)' },
  { value: 'nest-aluline', label: 'Nest AluLine (profil aluminiowy nakladkowy)' },
  { value: 'nest-slim', label: 'Nest Slim (profil waski do fasad)' },
];

export const hardwareThicknessOptions = [
  { value: 'standard-2mm', label: 'Okucia standard 2,0 mm' },
  { value: 'premium-25mm', label: 'Okucia wzmocnione 2,5 mm' },
  { value: 'security-3mm', label: 'Okucia antywlamaniowe 3,0 mm' },
];

export const assemblyTypeOptions = [
  { value: 'warm-complete', label: 'Cieply montaz kompletny (tasmy paro i paroprzepuszczalne, listwy podwalinowe)' },
  { value: 'standard-foam', label: 'Montaz standardowy na piance i silikonie' },
  { value: 'renovation', label: 'Montaz renowacyjny w istniejacej ramie' },
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
  'smart-control',
];

export const windowOptionDefinitions = [
  {
    id: 'internal-sills',
    label: 'Parapety wewnetrzne kamienne',
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
    label: 'Parapety zewnetrzne stal powlekana 0,5-0,7 mm',
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
    label: 'Zaluzje fasadowe',
    summaryBullet: 'Aluminiowe zaluzje fasadowe z automatyka i dopasowaniem kolorystycznym do elewacji.',
    description: 'System zaluzji fasadowych z prowadnicami, napedem rurowym oraz przygotowaniem pod sterowanie inteligentne.',
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
    label: 'Moskitiera ramkowa plisowana',
    summaryBullet: 'Plisowana moskitiera ramkowa z latwym demontazem sezonowym.',
    description: 'Aluminiowa moskitiera plisowana dopasowana do profilu okna, montowana na zaczepy obrotowe.',
    details: [
      'Profil aluminiowy lakierowany proszkowo',
      'Plisowana siatka w kolorze grafitowym',
      'Zaczepy obrotowe do szybkiego demontazu',
    ],
    unit: 'szt.',
    quantity: 'wg liczby otwieranych skrzydel',
    priceNote: 'Opcja dodatkowa, kalkulacja po inwentaryzacji',
    pdfPath: '/pdf_templates/okna_nest/opcje/moskitiera.pdf',
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
        label: 'Mikrowentylacja / stopniowanie uchylu',
        summaryLabel: 'Mikrowentylacja',
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
  { id: 'extra-demontaz', label: 'Demontaz i utylizacja starych okien', summaryLabel: 'Demontaz' },
  { id: 'extra-delivery', label: 'Dostawa i wniesienie', summaryLabel: 'Dostawa' },
  { id: 'extra-warm-sill', label: 'Cieply parapet XPS / listwa podparapetowa', summaryLabel: 'Cieply parapet' },
  { id: 'extra-interior-sills', label: 'Montaz parapetow wewnetrznych', summaryLabel: 'Parapety wew' },
  { id: 'extra-exterior-sills', label: 'Montaz parapetow zewnetrznych', summaryLabel: 'Parapety zewn' },
  { id: 'extra-blinds-install', label: 'Montaz rolet / zaluzji (jesli w zamowieniu)', summaryLabel: 'Montaz rolet' },
  { id: 'extra-threshold-extensions', label: 'Poszerzenia / podklad progowy pod drzwi balkonowe', summaryLabel: 'Poszerzenia progowe' },
];

export const demolitionOptions = [
  { value: 'cut-frames', label: 'Przeciecie ram' },
  { value: 'whole', label: 'Demontaz calosciowy' },
];

