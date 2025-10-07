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
export const windowOptionDefinitions = [
  {
    id: 'internal-sills',
    label: 'Parapety wewnetrzne MDF lakierowane',
    summaryBullet: 'Kompleksowe przygotowanie i montaz parapetow wewnetrznych lakierowanych w kolorze dobranym do stolarki.',
    description: 'Parapety MDF przygotowane na wymiar wraz z zabezpieczeniem powierzchni i spadkow, silikonowaniem oraz finalnym czyszczeniem stanowiska.',
    details: [
      'Pomiary w stanie surowym oraz po montazu okien z kontrola spadkow i wysokosci',
      'Dociecie elementow z uwzglednieniem obrobki otworow, oslony czoelowe i listwy dylatacyjne',
      'Uszczelnienie styku z rama i sciana silikonem w kolorze stolarki oraz czyszczenie koncowe',
    ],
    unit: 'kpl.',
    quantity: '1',
    priceNote: 'W cenie zakresu glownych prac',
    pdfPath: '/pdf_templates/okna_nest/opcje/parapety_wewnetrzne.pdf',
    defaultSelected: true,
  },
  {
    id: 'external-sills',
    label: 'Parapety zewnetrzne stal powlekana',
    summaryBullet: 'Systemowe parapety zewnetrzne w kolorze stolarki z uszczelnieniem podokiennym i zabezpieczeniem akustycznym.',
    description: 'Dostawa oraz montaz parapetow stalowych powlekanych wraz z tasma uszczelniajaca, klinami antyhalasowymi i obrobka boczna.',
    details: [
      'Dociecie parapetow pod katem i dopasowanie do obrobki elewacyjnej',
      'Zastosowanie tasmy podokiennej oraz klinow wyciszajacych kapanie deszczu',
      'Szczelne uszczelnienie styku z murem oraz zabezpieczenie antykorozyjne krawedzi',
    ],
    unit: 'kpl.',
    quantity: '1',
    priceNote: 'W cenie zakresu glownych prac',
    pdfPath: '/pdf_templates/okna_nest/opcje/parapety_zewnetrzne.pdf',
    defaultSelected: true,
  },
  {
    id: 'external-blinds',
    label: 'Rolety zewnetrzne adaptacyjne Z90',
    summaryBullet: 'Kaseta adaptacyjna z lamela Z90 sterowana automatycznie, przygotowana do integracji z systemem inteligentnego domu.',
    description: 'Kompletny system rolet adaptacyjnych z lamela aluminiowa Z90, prowadz nicami i napedem rurowym z mozliwoscia sterowania zdalnego.',
    details: [
      'Kaseta aluminiowa z rewizja zewnetrzna i izolacja akustyczna',
      'Prowadnice w kolorze stolarki, uszczelki szczotkowe ograniczajace halas i swiatlo',
      'Sterowanie radiowe, pilot wielostrefowy oraz przygotowanie do integracji KAMAN Smart',
    ],
    unit: 'kpl.',
    quantity: '1',
    priceNote: 'Wycena indywidualna zgodnie z liczba okien i sposobem sterowania',
    pdfPath: '/pdf_templates/okna_nest/opcje/rolety_zewnetrzne.pdf',
    defaultSelected: false,
  },
  {
    id: 'insect-screens',
    label: 'Moskitiera ramkowa Slim',
    summaryBullet: 'Moskitiera o waskim profilu aluminiowym dopasowanym do stolarki, zdejmowana sezonowo bez narzedzi.',
    description: 'Lekka moskitiera ramkowa typu Slim z lacznikami stalowymi i siatka w kolorze antracyt, montowana na zaczepy obrotowe.',
    details: [
      'Profil aluminiowy o wysokosci 11 mm, lakier proszkowy dopasowany do stolarki',
      'Siatka z wlokien szklanych w kolorze czarnym, zabezpieczona przed UV i rozciaganiem',
      'Zestaw zaczepow obrotowych oraz paskow montazowych ulatwiajacych sezonowy demontaz',
    ],
    unit: 'szt.',
    quantity: 'wg liczby otwieranych skrzydel',
    priceNote: 'Opcja dodatkowa, kalkulacja po inwentaryzacji',
    pdfPath: '/pdf_templates/okna_nest/opcje/moskitiera.pdf',
    defaultSelected: false,
  },
  {
    id: 'trickle-vents',
    label: 'Nawiewniki higrosterowane',
    summaryBullet: 'Samoregulujace nawiewniki montowane w ramie okiennej dla poprawy wentylacji i kontroli wilgotnosci.',
    description: 'Dostawa i montaz nawiewnikow sterowanych wilgotnoscia z zabudowa w gornym profilu skrzydla lub ramy.',
    details: [
      'Dobor wydajnosci na podstawie projektu wentylacji i kubatury pomieszczen',
      'Wykonanie frezow w profilu, uszczelnienie i maskowanie elementow montazowych',
      'Instruktaz obslugi dla uzytkownika oraz karta serwisowa dla przegladow okresowych',
    ],
    unit: 'szt.',
    quantity: 'wg projektu',
    priceNote: 'Opcja dodatkowa, dostosowana do wymogow wentylacyjnych',
    pdfPath: '/pdf_templates/okna_nest/opcje/nawiewniki.pdf',
    defaultSelected: false,
  },
  {
    id: 'security-package',
    label: 'Pakiet antywlamaniowy RC2',
    summaryBullet: 'Wzmocnione okucia z zaczepami antywywazeniowymi, klamki z kluczem i szyby P4 zgodne z klasa RC2.',
    description: 'Rozszerzony pakiet bezpieczenstwa obejmujacy dodatkowe zaczepy, okucia klasy RC2 oraz zabezpieczenia klamki.',
    details: [
      'Blokady otwarcia z podniesionym poziomem zabezpieczen na skrzydlach uchylno-rozwieranych',
      'Klamki z kluczem i zabezpieczeniem przeciw przesuwaniu zabkow meczka',
      'Mozliwosc doplaty do szyb laminowanych P4 z ramkami cieplnymi',
    ],
    unit: 'kpl.',
    quantity: '1',
    priceNote: 'Opcja dodatkowa obejmujaca material i robocizne montazowa',
    pdfPath: '/pdf_templates/okna_nest/opcje/pakiet_rc2.pdf',
    defaultSelected: false,
  },
  {
    id: 'smart-control',
    label: 'Sterowanie inteligentne KAMAN Smart',
    summaryBullet: 'Integracja okien, rolet i czujnikow z platforma KAMAN Smart wraz z aplikacja mobilna.',
    description: 'Projekt oraz wdrozenie systemu inteligentnego sterowania oknami i roletami z panelem mobilnym i scenami automatycznymi.',
    details: [
      'Centralka KAMAN Smart z komunikacja Wi-Fi/LAN oraz wsparciem dla sterowania rolet i nawiewnikow',
      'Konfiguracja scen (np. noc, urlop, szybkie wietrzenie) wraz z harmonogramami',
      'Szkolenie uzytkownikow i przekazanie instrukcji wraz z dokumentacja konfiguracyjna',
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
        label: 'Pakiet RC2 (okucia + klamka z kluczem)',
        summaryLabel: 'Pakiet RC2',
      },
      {
        id: 'feature-vsg',
        label: 'Szyba laminowana VSG / P4A',
        summaryLabel: 'Szyba laminowana',
      },
    ],
  },
  {
    id: 'comfort',
    label: 'Wentylacja i wygoda',
    items: [
      {
        id: 'feature-trickle',
        label: 'Nawiewnik (podaj typ: higro/manualny)',
        summaryLabel: 'Nawiewniki',
        detailLabel: 'Typ nawiewnika',
        detailPlaceholder: 'np. higrosterowany',
      },
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
        id: 'feature-warm-spacer',
        label: 'Ciepla ramka dystansowa',
        summaryLabel: 'Ciepla ramka',
      },
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
    items: [
      {
        id: 'feature-premium-color',
        label: 'Okleina / kolor premium (w tym dwukolor)',
        summaryLabel: 'Kolor premium',
      },
      {
        id: 'feature-muntins',
        label: 'Szprosy (podaj typ/szerokosc)',
        summaryLabel: 'Szprosy',
        detailLabel: 'Typ szprosow',
        detailPlaceholder: 'np. miedzyszybowe 26 mm',
      },
    ],
  },
  {
    id: 'terrace',
    label: 'Taras / balkon',
    items: [
      {
        id: 'feature-low-threshold',
        label: 'Niski prog w drzwiach balkonowych',
        summaryLabel: 'Niski prog',
      },
      {
        id: 'feature-mosquito',
        label: 'Moskitiera (ramkowa/rolo/plisa/przesuwna)',
        summaryLabel: 'Moskitiera',
        detailLabel: 'Typ moskitiery',
        detailPlaceholder: 'np. rolo w kasecie',
      },
      {
        id: 'feature-external-blinds',
        label: 'Rolety zewnetrzne (adapt./podtynk./nadstawne - podaj typ)',
        summaryLabel: 'Rolety zewnetrzne',
        detailLabel: 'Typ rolet',
        detailPlaceholder: 'np. adaptacyjne Z90',
      },
    ],
  },
];

export const installationVariants = [
  {
    value: 'standard',
    label: 'Standard (piana PUR + uszczelnienie zewnetrzne)',
    summaryLabel: 'Standard (piana + uszczelnienie zewn)',
  },
  {
    value: 'warm-tapes',
    label: 'Cieply montaz (tasmy) - wew. paroszczelna + PUR + zew. paroprzepuszczalna',
    summaryLabel: 'Cieply montaz (tasmy)',
  },
  {
    value: 'insulation-layer',
    label: 'W warstwie ocieplenia (konsolki / system ram + tasmy)',
    summaryLabel: 'Montaz w warstwie ocieplenia',
  },
];

export const installationExtras = [
  { id: 'extra-demontaz', label: 'Demontaz i utylizacja starych okien', summaryLabel: 'Demontaz' },
  { id: 'extra-delivery', label: 'Dostawa i wniesienie', summaryLabel: 'Dostawa' },
  { id: 'extra-plaster-trims', label: 'Listwy tynkarskie / maskujace', summaryLabel: 'Listwy tynkarskie' },
  { id: 'extra-warm-sill', label: 'Cieply parapet XPS / listwa podparapetowa', summaryLabel: 'Cieply parapet' },
  { id: 'extra-interior-sills', label: 'Montaz parapetow wewnetrznych', summaryLabel: 'Parapety wew' },
  { id: 'extra-exterior-sills', label: 'Montaz parapetow zewnetrznych', summaryLabel: 'Parapety zewn' },
  { id: 'extra-blinds-install', label: 'Montaz rolet / zaluzji (jesli w zamowieniu)', summaryLabel: 'Montaz rolet' },
  { id: 'extra-threshold-extensions', label: 'Poszerzenia / podklad progowy pod drzwi balkonowe', summaryLabel: 'Poszerzenia progowe' },
  { id: 'extra-hst-drainage', label: 'Odwodnienie / odprowadzenie skroplin dla HST', summaryLabel: 'Odwodnienie HST' },
  { id: 'extra-hst-reinforced', label: 'Wzmocniony prog HST', summaryLabel: 'Prog HST wzmocniony' },
];

