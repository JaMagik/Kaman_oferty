// ścieżka: src/data/tables/viessmannTables.js

// --- VIESSMANN Vitocal 150-A (Monoblok) ---

const viessmannVitocal150A_10kW_base = [
  ['1', 'Pompa ciepła – monoblok 10kW (Vitocal 150-A A10)', 'szt.', '1', 'Viessmann Vitocal 150-A | Monoblok | 10,0kW, 230V | A10. Pompa ciepła powietrze-woda, wysoka efektywność, zintegrowany moduł hydrauliczny, praca na czynniki R32, do ogrzewania i przygotowania CWU.'],
  ['3', 'Pompa obiegowa CO IBO PRO', 'szt.', '1', 'Zapewnia prawidłowy obieg czynnika grzewczego w instalacji.'],

 ['4', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['5', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['6', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['7', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody.'],
  ['8', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['9', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['10', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['11', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['12', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['13', 'Dokumentacja powykonawcza i protokoły odbioru', 'kpl.', '1', 'Komplet dokumentów do zgłoszenia instalacji oraz rozliczenia dotacji.'],
  ['14', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie w przygotowaniu wniosku i dokumentów do programu „Czyste Powietrze”.', 'common'],
  ['15', 'Gwarancja i serwis', 'kpl.', '1', 'Pompa ciepła objęta 5-letnią gwarancją przy rejestracji – zapewniamy wsparcie techniczne i serwisowe.'],
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
