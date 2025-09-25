// src/data/tables/panasonicTables.js

// Ułatwienie: kopiujemy bazę i podmieniamy opis 1. wiersza (jednostka zewn.)
const makePowerVariant = (baseTable, kw, label) =>
  baseTable.map(row =>
    row[0] === '1'
      ? ['1', `Pompa ciepła – jed. zewnętrzna ${kw} kW (${label})`, 'szt.', '1', row[4]]
      : [...row]
  );

/* ============================== */
/*        BAZY – CYLINDER         */
/* ============================== */

// HP cylinder 1F – baza
const hp_cyl_1f_base = [
  ['1', 'Pompa ciepła – jed. zewnętrzna 3 kW (HP cylinder 1F)', 'szt.', '1',
    'Aquarea High Performance K – wersja jednofazowa, współpraca z jednostką wewnętrzną cylinder, czynnik R32.'],
  ['2', 'Jednostka wewnętrzna typu Cylinder', 'szt.', '1',
    'Zintegrowany zbiornik CWU, grzałka elektryczna, automatyka.'],
  ['3', 'Pompa obiegowa CO KAMAN PRO', 'szt.', '1', 'Zapewnia prawidłowy obieg czynnika grzewczego w instalacji.'],
  ['4', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'Zawory, filtry, zabezpieczenia, złączki.'],
  ['5', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie zasilająco–sterujące wraz z zabezpieczeniami.'],
  ['6', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawór bezpieczeństwa, odpowietrzniki, manometr.'],
  ['7', 'Grupa bezpieczeństwa CWU (6 bar)', 'kpl.', '1', 'Zawór bezpieczeństwa 6 bar, zawór zwrotny, manometr.'],
  ['8', 'Połączenia chłodnicze (miedź) z izolacją', 'kpl.', '1', 'Rury miedziane w izolacji odpornej na UV.'],
  ['9', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Ogranicza straty ciepła, montaż zgodnie ze sztuką.'],
  ['10', 'Konstrukcja pod jednostkę zewnętrzną', 'szt.', '1', 'Stojak/wieszak do posadowienia na gruncie/ścianie.'],
  ['11', 'Sterownik pokojowy', 'szt.', '1', 'Regulator dedykowany do serii Aquarea.'],
  ['12', 'Podłączenie do instalacji CO/CWU i uruchomienie', 'kpl.', '1', 'Wpięcie układu, próby szczelności, rozruch.'],
  ['13', 'Dokumentacja i protokoły', 'kpl.', '1', 'Instrukcje, protokoły odbiorowe.'],
  ['14', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie „Czyste Powietrze”.', 'common'],
];

// HP cylinder 3F – baza (opis 1F → 3F)
const hp_cyl_3f_base = hp_cyl_1f_base.map(r =>
  r[0] === '1'
    ? ['1', 'Pompa ciepła – jed. zewnętrzna 9 kW (HP cylinder 3F)', 'szt.', '1',
       'Aquarea High Performance K – wersja trójfazowa, współpraca z jednostką wewnętrzną cylinder, czynnik R32.']
    : [...r]
);

// T-CAP cylinder 1F – baza
const tcap_cyl_1f_base = hp_cyl_1f_base.map(r =>
  r[0] === '1'
    ? ['1', 'Pompa ciepła – jed. zewnętrzna 9 kW (T-CAP cylinder 1F)', 'szt.', '1',
       'Aquarea T-CAP K – utrzymanie mocy nominalnej przy niskich temp., wersja jednofazowa, cylinder.']
    : [...r]
);

// T-CAP cylinder 3F – baza
const tcap_cyl_3f_base = tcap_cyl_1f_base.map(r =>
  r[0] === '1'
    ? ['1', 'Pompa ciepła – jed. zewnętrzna 12 kW (T-CAP cylinder 3F)', 'szt.', '1',
       'Aquarea T-CAP K – wersja trójfazowa, cylinder.']
    : [...r]
);

/* ============================== */
/*        BAZY – HYDROBOX         */
/* ============================== */

// HP hydrobox 1F – baza (pozycja 2: Hydrobox)
const hp_hydro_1f_base = hp_cyl_1f_base.map(r =>
  r[0] === '2'
    ? ['2', 'Jednostka wewnętrzna typu Hydrobox', 'szt.', '1', 'Moduł hydrauliczny bez zbiornika CWU.']
    : [...r]
);
// pierwszy wiersz – opis
hp_hydro_1f_base[0] = ['1', 'Pompa ciepła – jed. zewnętrzna 5 kW (HP hydrobox 1F)', 'szt.', '1',
  'Aquarea High Performance K – wersja jednofazowa, Hydrobox.'];

// HP hydrobox 3F – baza
const hp_hydro_3f_base = hp_hydro_1f_base.map(r =>
  r[0] === '1'
    ? ['1', 'Pompa ciepła – jed. zewnętrzna 12 kW (HP hydrobox 3F)', 'szt.', '1',
       'Aquarea High Performance K – wersja trójfazowa, Hydrobox.']
    : [...r]
);

// T-CAP hydrobox 1F – baza
const tcap_hydro_1f_base = hp_hydro_1f_base.map(r =>
  r[0] === '1'
    ? ['1', 'Pompa ciepła – jed. zewnętrzna 9 kW (T-CAP hydrobox 1F)', 'szt.', '1',
       'Aquarea T-CAP K – wersja jednofazowa, Hydrobox.']
    : [...r]
);

// T-CAP hydrobox 3F – baza
const tcap_hydro_3f_base = hp_hydro_3f_base.map(r =>
  r[0] === '1'
    ? ['1', 'Pompa ciepła – jed. zewnętrzna 16 kW (T-CAP hydrobox 3F)', 'szt.', '1',
       'Aquarea T-CAP K – wersja trójfazowa, Hydrobox.']
    : [...r]
);

/* ============================== */
/*            EXPORT              */
/*  Klucze = dokładnie wartości   */
/*  z <option value="...">        */
/* ============================== */

export const panasonicBaseTables = {
  // HP cylinder
  'Panasonic-HP-cylinder-1f': {
    '3 kW': hp_cyl_1f_base,
    '5 kW': makePowerVariant(hp_cyl_1f_base, 5, 'HP cylinder 1F'),
    '7 kW': makePowerVariant(hp_cyl_1f_base, 7, 'HP cylinder 1F'),
  },
  'Panasonic-HP-cylinder-3f': {
    '9 kW':  hp_cyl_3f_base,
    '12 kW': makePowerVariant(hp_cyl_3f_base, 12, 'HP cylinder 3F'),
    '16 kW': makePowerVariant(hp_cyl_3f_base, 16, 'HP cylinder 3F'),
  },

  // T-CAP cylinder
  'Panasonic-K-cylinder-1f': {
    '9 kW':  tcap_cyl_1f_base,
    '12 kW': makePowerVariant(tcap_cyl_1f_base, 12, 'T-CAP cylinder 1F'),
  },
  'Panasonic-K-cylinder-3f': {
    '9 kW': tcap_cyl_3f_base,
    '12 kW': tcap_cyl_3f_base,
    '16 kW': makePowerVariant(tcap_cyl_3f_base, 16, 'T-CAP cylinder 3F'),
  },

  // HP hydrobox
  'Panasonic-HP-hydrobox-1f': {
    '5 kW': hp_hydro_1f_base,
    '7 kW': makePowerVariant(hp_hydro_1f_base, 7, 'HP hydrobox 1F'),
  },
  'Panasonic-HP-hydrobox-3f': {
    '9 kW':  hp_hydro_3f_base,
    '12 kW': makePowerVariant(hp_hydro_3f_base, 12, 'HP hydrobox 3F'),
    '16 kW': makePowerVariant(hp_hydro_3f_base, 16, 'HP hydrobox 3F'),
  },

  // T-CAP hydrobox
  'Panasonic-K-hydrobox-1f': {
    '9 kW':  tcap_hydro_1f_base,
    '12 kW': makePowerVariant(tcap_hydro_1f_base, 12, 'T-CAP hydrobox 1F'),
  },
  'Panasonic-K-hydrobox-3f': {
    '9 kW': tcap_hydro_3f_base,
    '12 kW': tcap_hydro_3f_base,
    '16 kW': makePowerVariant(tcap_hydro_3f_base, 16, 'T-CAP hydrobox 3F'),
  },
};

