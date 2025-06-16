// src/data/tables/insulationData.js

export const insulationMaterialTypes = {
  'STYRO_GRAFIT_FS15_031': {
    name: 'Styropian grafitowy FASADA λ 031',
    description: 'Płyty styropianowe do izolacji cieplnej ścian zewnętrznych metodą lekką-mokrą.',
    datasheets: ['/pdf_templates/elevation/karta_styropian_grafit.pdf']
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

// ZMIANA: Nowa, szczegółowa struktura dla prac na ścianach
export const wallWorkItems = {
  przygotowanie: { text: 'Przygotowanie podłoża', desc: 'Oczyszczenie, odtłuszczenie i gruntowanie ścian.', appliesTo: ['komplet', 'tynk', 'malowanie'] },
  listwa: { text: 'Montaż listwy startowej', desc: 'Instalacja systemowej listwy cokołowej.', appliesTo: ['komplet'] },
  klejenie: { text: 'Przyklejenie płyt izolacyjnych', desc: 'Montaż płyt styropianowych lub wełnianych na zaprawie klejowej.', appliesTo: ['komplet'] },
  kolkowanie: { text: 'Kołkowanie mechaniczne', desc: 'Dodatkowe mocowanie płyt izolacyjnych za pomocą łączników.', appliesTo: ['komplet'] },
  zbrojenie: { text: 'Wykonanie warstwy zbrojonej', desc: 'Nałożenie kleju i zatopienie siatki z włókna szklanego.', appliesTo: ['komplet', 'tynk'] },
  tynkowanie: { text: 'Nałożenie tynku zewnętrznego', desc: 'Aplikacja tynku silikonowego lub akrylowego.', appliesTo: ['komplet', 'tynk'] },
  parapety: { text: 'Montaż obróbek blacharskich i parapetów', desc: 'Instalacja parapetów zewnętrznych i obróbek.', appliesTo: ['parapety'] },
  malowanie: { text: 'Malowanie elewacji', desc: 'Dwukrotne malowanie fasady farbą elewacyjną.', appliesTo: ['komplet', 'malowanie'] },
};

// Zakresy dla pozostałych typów prac bez zmian
export const roofScope = [
    ['', 'Przygotowanie konstrukcji dachowej', 'Oczyszczenie i sprawdzenie stanu więźby dachowej.', 'kpl.', '1'],
    ['', 'Montaż stelaża systemowego', 'Przygotowanie konstrukcji nośnej pod wełnę i płyty g-k.', 'm²', ''],
    ['', 'Ułożenie ocieplenia', 'Instalacja wełny mineralnej w dwóch warstwach.', 'm²', ''],
    ['', 'Montaż folii paroizolacyjnej', 'Zabezpieczenie ocieplenia przed wnikaniem pary wodnej.', 'm²', ''],
    ['', 'Montaż płyt gipsowo-kartonowych', 'Przykręcenie płyt g-k do stelaża.', 'm²', ''],
];

export const basementScope = [
    ['', 'Przygotowanie ścian fundamentowych', 'Odkopanie, oczyszczenie i naprawa powierzchni.', 'm²', ''],
    ['', 'Wykonanie hydroizolacji', 'Nałożenie masy bitumicznej lub innej powłoki hydroizolacyjnej.', 'm²', ''],
    ['', 'Montaż płyt izolacyjnych (Styrodur XPS)', 'Przyklejenie płyt z polistyrenu ekstrudowanego na masie klejącej.', 'm²', ''],
    ['', 'Zabezpieczenie warstwy ocieplenia', 'Montaż folii kubełkowej w celu ochrony mechanicznej.', 'm²', ''],
    ['', 'Zasypanie wykopu', 'Stopniowe zasypywanie i zagęszczanie gruntu.', 'kpl.', '1'],
];