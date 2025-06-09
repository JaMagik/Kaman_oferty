// ścieżka: src/data/tables/viessmannTables.js

// --- VIESSMANN Vitocal 150-A (Monoblok) ---

const viessmannVitocal150A_10kW_base = [
  ['1', 'Pompa ciepła – monoblok 10kW (Vitocal 150-A A10)', 'szt.', '1', 'Viessmann Vitocal 150-A | Monoblok | 10,0kW, 230V | A10. Pompa ciepła powietrze-woda, wysoka efektywność, zintegrowany moduł hydrauliczny, praca na czynniki R32, do ogrzewania i przygotowania CWU.'],
  ['2', 'Zasobnik CWU (dynamicznie dobierany)', 'szt.', '', 'Emaliowany lub nierdzewny zasobnik ciepłej wody użytkowej – dobór i pojemność zależna od potrzeb inwestycji.'],
  ['3', 'Bufor ciepła (dynamicznie dobierany)', 'szt.', '', 'Bufor z króćcami i armaturą do stabilizacji pracy układu i rozdziału obiegów grzewczych.'],
  ['4', 'Dwa czujniki temperatury NTC 10 kOhm', 'kpl.', '1', 'Komplet czujników do sterowania temperaturą układu grzewczego i CWU.'],
  ['5', 'Komplet elementów hydraulicznych i elektrycznych', 'kpl.', '1', 'Zawory, kształtki, filtry, odpowietrzniki, okablowanie, zabezpieczenia oraz rozdzielnia zgodnie z wymaganiami producenta.'],
  ['6', 'Grupa bezpieczeństwa CWU (6 bar)', 'szt.', '1', 'Zawór bezpieczeństwa, zawór zwrotny i manometr – zabezpieczenie zasobnika ciepłej wody.'],
  ['7', 'Grupa bezpieczeństwa C.O. (2,5 bar)', 'kpl.', '1', 'Zawór bezpieczeństwa, manometr i odpowietrznik automatyczny – ochrona obiegu grzewczego.'],
  ['8', 'Sterownik internetowy Viessmann (Vitoconnect lub odpowiednik)', 'kpl.', '1', 'Moduł umożliwiający zdalne zarządzanie pracą pompy ciepła przez aplikację.'],
  ['9', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Otuliny z pianki technicznej chroniące przewody wodne przed stratami ciepła.'],
  ['10', 'Stojak lub wieszak pod pompę ciepła', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dopasowana do miejsca montażu i modelu urządzenia.'],
  ['11', 'Montaż, dojazd, uruchomienie oraz szkolenie użytkownika', 'kpl.', '1', 'Kompleksowy montaż urządzeń, uruchomienie systemu, napełnienie i odpowietrzenie instalacji, test szczelności, szkolenie użytkownika oraz przekazanie dokumentacji.'],
  ['12', 'Regulator pokojowy bezprzewodowy', 'kpl.', '1', 'Sterownik pokojowy Viessmann do zarządzania temperaturą pomieszczenia.'],
];

const viessmannVitocal150A_13kW_base = viessmannVitocal150A_10kW_base.map(row =>
  row[0] === '1'
    ? ['1', 'Pompa ciepła – monoblok 13kW (Vitocal 150-A A13)', 'szt.', '1', 'Viessmann Vitocal 150-A | Monoblok | 13,0kW, 230V | A13. Pompa ciepła powietrze-woda, wysoka efektywność, zintegrowany moduł hydrauliczny, praca na czynniki R32, do ogrzewania i przygotowania CWU.']
    : [...row]
);

// --- Mapping nazw ---
export const viessmannBaseTables = {
  'VIESSMANN': {
    '10 kW': viessmannVitocal150A_10kW_base,
    '13 kW': viessmannVitocal150A_13kW_base,
  },
  // Dodaj tu inne serie Viessmann jeśli potrzeba
};
