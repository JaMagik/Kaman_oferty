// ścieżka: src/data/tables/viessmannTables.js

// --- VIESSMANN Vitocal 150-A ---
// Modele A10 (10 kW) i A13 (13 kW) zidentyfikowane w starym script.js
const viessmannVitocal150A_10kW_base = [
  ['1', 'POMPA CIEPŁA VITOCAL 150-A typ MONOBLOK A10', 'szt.', '1'],
  // Zasobnik i bufor będą dodawane dynamicznie przez getTableData
  [' ', 'DWA CZUJNIKI TEM. NTC 10 kOhm', 'kpl.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6bar)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 bar)', 'kpl.', '1'],
  [' ', 'INTERNET', 'kpl.', '1'],
  [' ', 'OTULINA NA PRZEWODY HYDRAULICZNE', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
  [' ', 'REGULATOR POKOJOWY BEZPRZEWODOWY', 'kpl.', '1'],
];

const viessmannVitocal150A_13kW_base = [
  ['1', 'POMPA CIEPŁA VITOCAL 150-A typ MONOBLOK A13', 'szt.', '1'],
  // Zasobnik i bufor będą dodawane dynamicznie
  [' ', 'DWA CZUJNIKI TEM. NTC 10 kOhm', 'kpl.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA CWU (6bar)', 'szt.', '1'],
  [' ', 'GRUPA BEZPIECZEŃSTWA C.O (2.5 bar)', 'kpl.', '1'],
  [' ', 'INTERNET', 'kpl.', '1'],
  [' ', 'OTULINA NA PRZEWODY HYDRAULICZNE', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ, DOJAZD, URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
  [' ', 'REGULATOR POKOJOWY BEZPRZEWODOWY', 'kpl.', '1'],
];

export const viessmannBaseTables = {
  'VIESSMANN': { // Ten klucz użyjesz w formularzu i pdfTemplateSets
    '10 kW': viessmannVitocal150A_10kW_base,
    '13 kW': viessmannVitocal150A_13kW_base,
    // Dodaj inne moce, jeśli są dostępne i mają podobną strukturę
  },
  // Możesz tu dodać inne serie Viessmann, np. 'VIESSMANN-Vitocal-200S': { ... }
};