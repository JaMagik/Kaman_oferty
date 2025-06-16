// src/data/tables/insulationData.js

// Definicje materiałów izolacyjnych
export const insulationMaterialTypes = {
  'STYRO_GRAFIT_FS15_031': {
    name: 'Styropian grafitowy FASADA λ 031',
    description: 'Płyty styropianowe do izolacji cieplnej ścian zewnętrznych metodą lekką-mokrą.',
    datasheets: ['/pdf_templates/elevation/karta_styropian_grafit.pdf'] // Przykładowa ścieżka
  },
  'STYRO_BIALY_FS15_040': {
    name: 'Styropian biały FASADA λ 040',
    description: 'Standardowe płyty styropianowe do izolacji cieplnej ścian zewnętrznych.',
    datasheets: ['/pdf_templates/elevation/karta_styropian_bialy.pdf']
  },
  'WELNA_SKALNA_15': {
    name: 'Wełna mineralna skalna 15 cm',
    description: 'Płyty z wełny skalnej do izolacji termicznej i akustycznej stropów i poddaszy.',
    datasheets: ['/pdf_templates/elevation/karta_welna_skalna.pdf']
  },
  'STYRODUR_XPS_10': {
    name: 'Polistyren ekstrudowany (Styrodur XPS) 10 cm',
    description: 'Płyty o wysokiej odporności na wilgoć i uszkodzenia mechaniczne, do izolacji fundamentów i piwnic.',
    datasheets: ['/pdf_templates/elevation/karta_styrodur_xps.pdf']
  },
};

// Zakresy prac dla różnych typów ocieplenia
export const wallScope = [
    ['', 'Przygotowanie podłoża', 'Oczyszczenie, odtłuszczenie i gruntowanie ścian zewnętrznych preparatem gruntującym.', 'kpl.', '1'],
    ['', 'Montaż listwy startowej', 'Instalacja systemowej listwy cokołowej w celu równego rozpoczęcia prac ociepleniowych.', 'mb.', ''],
    ['', 'Przyklejenie płyt izolacyjnych', 'Montaż płyt styropianowych lub wełnianych na zaprawie klejowej z zachowaniem prawidłowego układu mijankowego.', 'm²', ''],
    ['', 'Kołkowanie mechaniczne', 'Dodatkowe mocowanie płyt izolacyjnych za pomocą łączników mechanicznych (kołków).', 'm²', ''],
    ['', 'Wykonanie warstwy zbrojonej', 'Nałożenie zaprawy klejowej i zatopienie w niej siatki z włókna szklanego w celu wzmocnienia systemu.', 'm²', ''],
    ['', 'Nałożenie tynku zewnętrznego', 'Aplikacja tynku silikonowego lub akrylowego w wybranym kolorze i o wskazanej fakturze (np. baranek 1,5 mm).', 'm²', ''],
    ['', 'Montaż obróbek blacharskich i parapetów', 'Instalacja parapetów zewnętrznych oraz obróbek attyki, balkonów i innych elementów.', 'kpl.', '1'],
    ['', 'Malowanie elewacji (opcjonalnie)', 'Dwukrotne malowanie fasady farbą elewacyjną w uzgodnionym kolorze.', 'm²', ''],
];

export const roofScope = [
    ['', 'Przygotowanie konstrukcji dachowej', 'Oczyszczenie i sprawdzenie stanu więźby dachowej, ewentualne drobne naprawy.', 'kpl.', '1'],
    ['', 'Montaż wieszaków i stelaża systemowego', 'Przygotowanie konstrukcji nośnej (np. z profili CD/UD) pod wełnę mineralną i płyty g-k.', 'm²', ''],
    ['', 'Ułożenie pierwszej warstwy ocieplenia', 'Instalacja wełny mineralnej pomiędzy krokwiami dachowymi.', 'm²', ''],
    ['', 'Ułożenie drugiej warstwy ocieplenia', 'Instalacja wełny mineralnej pod krokwiami w celu eliminacji mostków termicznych.', 'm²', ''],
    ['', 'Montaż folii paroizolacyjnej', 'Zabezpieczenie ocieplenia przed wnikaniem pary wodnej z wnętrza budynku.', 'm²', ''],
    ['', 'Montaż płyt gipsowo-kartonowych', 'Przykręcenie płyt g-k do stelaża, przygotowanie podłoża pod szpachlowanie.', 'm²', ''],
    ['', 'Szpachlowanie i szlifowanie spoin', 'Wykonanie spoinowania połączeń płyt g-k z użyciem taśm zbrojących.', 'm²', ''],
];

export const basementScope = [
    ['', 'Odkopanie i przygotowanie ścian fundamentowych', 'Mechaniczne lub ręczne odsłonięcie ścian fundamentowych do wymaganej głębokości.', 'mb.', ''],
    ['', 'Oczyszczenie i naprawa powierzchni', 'Mechaniczne usunięcie starych powłok, ziemi i luźnych fragmentów. Uzupełnienie ubytków.', 'm²', ''],
    ['', 'Wykonanie hydroizolacji', 'Nałożenie masy bitumicznej lub innej powłoki hydroizolacyjnej w celu ochrony przed wilgocią.', 'm²', ''],
    ['', 'Montaż płyt izolacyjnych (Styrodur XPS)', 'Przyklejenie płyt z polistyrenu ekstrudowanego na masie klejącej.', 'm²', ''],
    ['', 'Zabezpieczenie warstwy ocieplenia', 'Montaż folii kubełkowej w celu ochrony mechanicznej i zapewnienia drenażu.', 'm²', ''],
    ['', 'Zasypanie wykopu', 'Stopniowe zasypywanie i zagęszczanie gruntu wokół fundamentów.', 'kpl.', '1'],
];