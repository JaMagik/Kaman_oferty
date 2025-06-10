// --- Kaisai Arctic Split Hydrobox 10 kW ---
const kaisaiHydrobox_10kW_base = [
  ['1', 'Pompa ciepła – jed. zew. 10kW (KHA-10RY1-B)', 'szt.', '1', 'Kaisai Arctic | Split | 10,0kW, 230V, R32 KHA-10RY1-B. Jednostka zewnętrzna typu Split, przeznaczona do współpracy z hydroboxem.'],
  ['2', 'Moduł wewnętrzny Hydrobox (KHA-10RY1-B)', 'szt.', '1', 'Kaisai Arctic | hydrobox | bez zintegrowanego zasobnika CWU | grzałka 3/6 kW, 230V | naczynie wzbiorcze 10L | do ogrzewania i przygotowania CWU przez zewnętrzny zbiornik.'],
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

// --- Kaisai Arctic Split Hydrobox 12 kW ---
const kaisaiHydrobox_12kW_base = kaisaiHydrobox_10kW_base.map(row =>
  row[0] === '1'
    ? ['1', 'Pompa ciepła – jed. zew. 12kW (KHA-12RY3-B)', 'szt.', '1', 'Kaisai Arctic | Split | 12,0kW, 400V, R32 KHA-12RY3-B. Jednostka zewnętrzna typu Split, przeznaczona do współpracy z hydroboxem.']
    : row[0] === '2'
      ? ['2', 'Moduł wewnętrzny Hydrobox (KHA-12RY3-B)', 'szt.', '1', 'Kaisai Arctic | hydrobox | bez zintegrowanego zasobnika CWU | grzałka 3/6 kW, 400V | naczynie wzbiorcze 10L | do ogrzewania i przygotowania CWU przez zewnętrzny zbiornik.']
      : [...row]
);

// --- Mapping nazw ---
export const kaisaiHydroboxBaseTables = {
    'Kaisai': { // Klucz odpowiadający 'deviceType' dla Kaisai Hydrobox
  '10 kW': kaisaiHydrobox_10kW_base,
  '12 kW': kaisaiHydrobox_12kW_base,
    }
};
