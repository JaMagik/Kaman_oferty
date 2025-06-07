// --- Kaisai Arctic Split Hydrobox 10 kW ---
const kaisaiHydrobox_10kW_base = [
  ['1', 'Pompa ciepła – jed. zew. 10kW (KHA-10RY1-B)', 'szt.', '1', 'Kaisai Arctic | Split | 10,0kW, 230V, R32 KHA-10RY1-B. Jednostka zewnętrzna typu Split, przeznaczona do współpracy z hydroboxem.'],
  ['2', 'Moduł wewnętrzny Hydrobox (KHA-10RY1-B)', 'szt.', '1', 'Kaisai Arctic | hydrobox | bez zintegrowanego zasobnika CWU | grzałka 3/6 kW, 230V | naczynie wzbiorcze 10L | do ogrzewania i przygotowania CWU przez zewnętrzny zbiornik.'],
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody.'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (Kaisai)', 'szt.', '1', 'Sterownik bezprzewodowy Kaisai do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.'],
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
