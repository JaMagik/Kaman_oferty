// --- Toshiba 6 kW 1F ---
const toshibaCylinder_6kW_base = [
  ['1', 'Pompa ciepła – jed. zew. 6kW (601HWE)', 'szt.', '1', 'Toshiba | Inverter | Split | 6,0kW, 230V, R32 601HWE. Jednostka zewnętrzna typu Split, energooszczędna, cicha praca.'],
  ['2', 'Hydrobox – jednostka wewnętrzna', 'szt.', '1', 'Toshiba | Split | grzałka 6 kW, 230V | naczynie wzbiorcze 10L | grzanie.'],
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

// --- Toshiba 8 kW 1F ---
const toshibaCylinder_8kW_base = toshibaCylinder_6kW_base.map(row =>
  row[0] === '1'
    ? ['1', 'Pompa ciepła – jed. zew. 8kW (801HQR/WE)', 'szt.', '1', 'Toshiba | Inverter | Split | 8,0kW, 230V, R32 801HQR/WE. Jednostka zewnętrzna typu Split, energooszczędna, cicha praca.']
    : [...row]
);

// --- Toshiba 11 kW 1F ---
const toshibaCylinder_11kW_base = toshibaCylinder_6kW_base.map(row =>
  row[0] === '1'
    ? ['1', 'Pompa ciepła – jed. zew. 11kW (1101HQR/WE)', 'szt.', '1', 'Toshiba | Inverter | Split | 11,0kW, 230V, R32 1101HQR/WE. Jednostka zewnętrzna typu Split, energooszczędna, cicha praca.']
    : [...row]
);

// --- Mapping nazw ---
export const toshiba1fBaseTables = {
  'Toshiba 1F':  {
  '6 kW': toshibaCylinder_6kW_base,
  '8 kW': toshibaCylinder_8kW_base,
  '11 kW': toshibaCylinder_11kW_base,
  }
};


export default toshiba1fBaseTables;
