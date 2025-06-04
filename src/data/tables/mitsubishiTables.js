// ścieżka: src/data/tables/mitsubishiTables.js

// --- Mitsubishi Cylinder (Standard - PUD/EHST) ---
const mitsubishiCylinder_standard_6kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 400V, R32 PUD-SHWM60YAA', 'szt.', '1'],
  ['2', 'Ecodan | moduł wew. 200 litrów | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHST20D-VM60', 'szt.', '1'],
  // tankRow i bufferRow zostaną dodane dynamicznie przez getTableData
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinder_standard_8kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 400V, R32 PUD-SHWM80YAA', 'szt.', '1'],
  ['2', 'Ecodan | moduł wew. 200 litrów | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHSD-YM6/9D', 'szt.', '1'], // Uwaga: model jednostki wewnętrznej w Twoim starym kodzie był inny dla 8kW
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinder_standard_10kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 400V, R32 PUD-SHWM100YAA', 'szt.', '1'],
  ['2', 'Ecodan | moduł wew. 200 litrów | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHST20D-VM60', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinder_standard_12kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 400V, R32 PUD-SHWM120YAA', 'szt.', '1'],
  ['2', 'Ecodan | moduł wew. 200 litrów | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHST20D-VM60', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinder_standard_14kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 14,0kW, 400V, R32 PUD-SHWM140YAA', 'szt.', '1'],
  ['2', 'Ecodan | moduł wew. 300 litrów | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie EHST20D-VM60', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

// --- Mitsubishi Cylinder PUZ (3-fazowy) ---
const mitsubishiCylinderPUZ_6kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 400V, R32 PUZ-SHWM60YAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinderPUZ_8kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 400V, R32 PUZ-SHWM80YAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinderPUZ_10kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 400V, R32 PUZ-SHWM100YAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinderPUZ_12kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 400V, R32 PUZ-SHWM120YAA', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERST20F-YM9E', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinderPUZ_14kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 14,0kW, 400V, R32 PUZ-SHWM140YAA', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW, 3x400V | naczynie wz. 10L | grzanie ERST20F-YM9E', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinderPUZ_1F_6kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 230V, R32 PUZ-SHWM60VAA EHST20D-YM9E', 'szt.', '1'], // *VAA oznacza 1-fazowy
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

const mitsubishiCylinderPUZ_1F_8kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 230V, R32 PUZ-SHWM80VAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];
const mitsubishiCylinderPUZ_1F_10kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 230V, R32 PUZ-SHWM100VAA EHST20D-YM9E', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERST20F-YM9ED', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];
const mitsubishiCylinderPUZ_1F_12kW_base = [
  ['1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 230V, R32 PUZ-SHWM120VAA', 'szt.', '1'],
  ['2', 'Ecodan | Cylinder | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wz. 10L | grzanie ERST20F-YM9E', 'szt.', '1'],
  [' ', 'ELEMENTY HYDRAULICZNE I ELEKTRYCZNE DO POMPY CIEPŁA', 'kpl.', '1'],
  [' ', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1'],
  [' ', 'MIEDŹ CHŁODNICZA', 'kpl.', '1'],
  [' ', 'REGULATOR BEZPRZEWODOWY MITSUBISHI PAR-WT', 'szt.', '1'],
  [' ', 'STOJAK LUB WIESZAK POD POMPĘ CIEPŁA', 'szt.', '1'],
  [' ', 'MONTAŻ , DOJAZD , URUCHOMIENIE ORAZ SZKOLENIE UŻYTKOWNIKA', 'kpl.', '1'],
];

// --- Mitsubishi Hydrobox (Standard - PUD/EHSD) ---
// src/data/tables/mitsubishiTables.js (fragment do zaktualizowania lub dodania)

// --- Mitsubishi Hydrobox (Standard - PUD/EHSD) ---
// Format: [Lp., Nazwa główna, Jednostka, Ilość, Opis szczegółowy (opcjonalnie)]

const mitsubishiHydrobox_standard_6kW_base = [
  ['1', 'Pompa ciepła – jednostka zewnętrzna 6kW', 'szt.', '1', 'Mitsubishi PUD-SHWM60YAA – Split, moc 6,0 kW, zasilanie 3x400V, czynnik chłodniczy R32, technologia Zubadan zapewniająca stabilną pracę nawet przy niskich temperaturach.'],
  ['2', 'Hydrobox – jednostka wewnętrzna', 'szt.', '1', 'Mitsubishi EHSD-YM6/9D – z grzałką elektryczną 6/9 kW oraz wbudowanym naczyniem wzbiorczym 10 litrów. Odpowiada za zarządzanie obiegiem grzewczym.'],
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

const mitsubishiHydrobox_standard_8kW_base = [
  ['1', 'Pompa ciepła – jednostka zewnętrzna 8kW', 'szt.', '1', 'Mitsubishi PUD-SHWM80YAA – Split, moc 8,0 kW, zasilanie 3x400V, czynnik chłodniczy R32, technologia Zubadan zapewniająca stabilną pracę nawet przy niskich temperaturach.'],
  ['2', 'Hydrobox – jednostka wewnętrzna', 'szt.', '1', 'Mitsubishi EHSD-YM6/9D – z grzałką elektryczną 6/9 kW oraz wbudowanym naczyniem wzbiorczym 10 litrów. Odpowiada za zarządzanie obiegiem grzewczym.'],
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

const mitsubishiHydrobox_standard_10kW_base = [
  ['1', 'Pompa ciepła – jednostka zewnętrzna 10kW', 'szt.', '1', 'Mitsubishi PUD-SHWM100YAA – Split, moc 10,0 kW, zasilanie 3x400V, czynnik chłodniczy R32, technologia Zubadan zapewniająca stabilną pracę nawet przy niskich temperaturach.'],
  ['2', 'Hydrobox – jednostka wewnętrzna', 'szt.', '1', 'Mitsubishi EHSD-YM6/9D – z grzałką elektryczną 6/9 kW oraz wbudowanym naczyniem wzbiorczym 10 litrów. Odpowiada za zarządzanie obiegiem grzewczym.'],
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

const mitsubishiHydrobox_standard_12kW_base = [
  ['1', 'Pompa ciepła – jednostka zewnętrzna 12kW', 'szt.', '1', 'Mitsubishi PUD-SHWM120YAA – Split, moc 12,0 kW, zasilanie 3x400V, czynnik chłodniczy R32, technologia Zubadan zapewniająca stabilną pracę nawet przy niskich temperaturach.'],
  ['2', 'Hydrobox – jednostka wewnętrzna', 'szt.', '1', 'Mitsubishi EHSD-YM6/9D – z grzałką elektryczną 6/9 kW oraz wbudowanym naczyniem wzbiorczym 10 litrów. Odpowiada za zarządzanie obiegiem grzewczym.'],
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

const mitsubishiHydrobox_standard_14kW_base = [
  ['1', 'Pompa ciepła – jednostka zewnętrzna 14kW', 'szt.', '1', 'Mitsubishi PUD-SHWM140YAA – Split, moc 14,0 kW, zasilanie 3x400V, czynnik chłodniczy R32, technologia Zubadan zapewniająca stabilną pracę nawet przy niskich temperaturach.'],
  ['2', 'Hydrobox – jednostka wewnętrzna', 'szt.', '1', 'Mitsubishi EHSD-YM6/9D – z grzałką elektryczną 6/9 kW oraz wbudowanym naczyniem wzbiorczym 10 litrów. Odpowiada za zarządzanie obiegiem grzewczym.'],
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];


// Proponowane fragmenty do pliku src/data/tables/mitsubishiTables.js

// --- Mitsubishi Hydrobox PUZ (3-fazowy) ---
// Format: [Lp., Nazwa główna, Jednostka, Ilość, Opis szczegółowy (opcjonalnie)]

const mitsubishiHydroboxPUZ_6kW_base = [
  ['1', 'Pompa ciepła – jednostka zewnętrzna 6kW (PUZ-SHWM60YAA)', 'szt.', '1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 400V, R32 PUZ-SHWM60YAA. Jednostka zewnętrzna z technologią Zubadan, zapewniająca wysoką wydajność grzewczą nawet w niskich temperaturach.'],
  ['2', 'Hydrobox – jednostka wewnętrzna (ERSF-YM9E)', 'szt.', '1', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wzb. 10L | grzanie ERSF-YM9E. Moduł wewnętrzny zarządzający systemem grzewczym.'],
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

const mitsubishiHydroboxPUZ_8kW_base = [
  ['1', 'Pompa ciepła – jednostka zewnętrzna 8kW (PUZ-SHWM80YAA)', 'szt.', '1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 400V, R32 PUZ-SHWM80YAA. Jednostka zewnętrzna z technologią Zubadan.'],
  ['2', 'Hydrobox – jednostka wewnętrzna (ERSF-YM9E)', 'szt.', '1', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wzb. 10L | grzanie ERSF-YM9E. Moduł wewnętrzny.'],
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

const mitsubishiHydroboxPUZ_10kW_base = [
  ['1', 'Pompa ciepła – jednostka zewnętrzna 10kW (PUZ-SHWM100YAA)', 'szt.', '1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 400V, R32 PUZ-SHWM100YAA. Jednostka zewnętrzna z technologią Zubadan.'],
  ['2', 'Hydrobox – jednostka wewnętrzna (ERSF-YM9E)', 'szt.', '1', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wzb. 10L | grzanie ERSF-YM9E. Moduł wewnętrzny.'],
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

// Analogicznie dla PUZ_12kW i PUZ_14kW, zmieniając tylko moc i symbole w opisach jednostek:
const mitsubishiHydroboxPUZ_12kW_base = [
  ['1', 'Pompa ciepła – jednostka zewnętrzna 12kW (PUZ-SHWM120YAA)', 'szt.', '1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 400V, R32 PUZ-SHWM120YAA. Jednostka zewnętrzna z technologią Zubadan.'],
  ['2', 'Hydrobox – jednostka wewnętrzna (ERSF-YM9E)', 'szt.', '1', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wzb. 10L | grzanie ERSF-YM9E. Moduł wewnętrzny.'],
  // ... reszta 11 punktów jak wyżej
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

const mitsubishiHydroboxPUZ_14kW_base = [
  ['1', 'Pompa ciepła – jednostka zewnętrzna 14kW (PUZ-SHWM140YAA)', 'szt.', '1', 'Ecodan | Zubadan Inverter | Split | 14,0kW, 400V, R32 PUZ-SHWM140YAA. Jednostka zewnętrzna z technologią Zubadan.'],
  ['2', 'Hydrobox – jednostka wewnętrzna (ERSF-YM9E)', 'szt.', '1', 'Ecodan | Hydrobox | Split | grz. 6/9 kW, 3x400V | naczynie wzb. 10L | grzanie ERSF-YM9E. Moduł wewnętrzny.'],
  // ... reszta 11 punktów jak wyżej
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];


// --- Mitsubishi Hydrobox PUZ (1-fazowy) ---
const mitsubishiHydroboxPUZ_1F_6kW_base = [
  ['1', 'Pompa ciepła – jed. zew. 6kW 1F (PUZ-SHWM60VAA)', 'szt.', '1', 'Ecodan | Zubadan Inverter | Split | 6,0kW, 230V, R32 PUZ-SHWM60VAA. Jednostka zewnętrzna 1-fazowa z technologią Zubadan.'],
  ['2', 'Hydrobox – jed. wew. (ERSF-YM9E)', 'szt.', '1', 'Ecodan | Hydrobox | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wzb. 10L | grzanie ERSF-YM9E. Moduł wewnętrzny.'],
  // ... reszta 11 punktów jak wyżej
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

// Analogicznie dla 1F 8kW, 10kW, 12kW
const mitsubishiHydroboxPUZ_1F_8kW_base = [
  ['1', 'Pompa ciepła – jed. zew. 8kW 1F (PUZ-SHWM80VAA)', 'szt.', '1', 'Ecodan | Zubadan Inverter | Split | 8,0kW, 230V, R32 PUZ-SHWM80VAA. Jednostka zewnętrzna 1-fazowa z technologią Zubadan.'],
  ['2', 'Hydrobox – jed. wew. (ERSF-YM9E)', 'szt.', '1', 'Ecodan | Hydrobox | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wzb. 10L | grzanie ERSF-YM9E. Moduł wewnętrzny.'],
  // ... reszta 11 punktów
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

const mitsubishiHydroboxPUZ_1F_10kW_base = [
  ['1', 'Pompa ciepła – jed. zew. 10kW 1F (PUZ-SHWM100VAA)', 'szt.', '1', 'Ecodan | Zubadan Inverter | Split | 10,0kW, 230V, R32 PUZ-SHWM100VAA. Jednostka zewnętrzna 1-fazowa z technologią Zubadan.'],
  ['2', 'Hydrobox – jed. wew. (ERSF-YM9E)', 'szt.', '1', 'Ecodan | Hydrobox | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wzb. 10L | grzanie ERSF-YM9E. Moduł wewnętrzny.'],
  // ... reszta 11 punktów
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

const mitsubishiHydroboxPUZ_1F_12kW_base = [
  ['1', 'Pompa ciepła – jed. zew. 12kW 1F (PUZ-SHWM120VAA)', 'szt.', '1', 'Ecodan | Zubadan Inverter | Split | 12,0kW, 230V, R32 PUZ-SHWM120VAA. Jednostka zewnętrzna 1-fazowa z technologią Zubadan.'],
  ['2', 'Hydrobox – jed. wew. (ERSF-YM9E)', 'szt.', '1', 'Ecodan | Hydrobox | Split | grz. 6/9 kW (dopasować do fazy) | naczynie wzb. 10L | grzanie ERSF-YM9E. Moduł wewnętrzny.'],
  // ... reszta 11 punktów
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa, odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];


// --- Mitsubishi Ecoinverter (Cylinder - SUZ/EHSD) ---
// Uwaga: Dla Ecoinverter oryginalne tabele miały nieco inną strukturę komponentów. Dostosowuję je do nowego formatu z 13 punktami (bez zasobnika i bufora),
// zakładając, że "JEDNOSTKA WEWNĘTRZNA EHSD-YM9D" dla Ecoinverter Cylinder pełni rolę cylindra ze zintegrowanym sterowaniem.
const mitsubishiEcoinverter_6kW_base = [
  ['1', 'Jednostka zewnętrzna Ecoinverter 6kW (SUZ-SWM60VA)', 'szt.', '1', 'Jednostka zewnętrzna SUZ-SWM60VA, technologia Ecoinverter, moc 6kW.'],
  ['2', 'Jednostka wewnętrzna ze zintegrowanym zasobnikiem (EHSD-YM9D)', 'szt.', '1', 'Jednostka wewnętrzna EHSD-YM9D, moduł cylindryczny ze zintegrowanym zasobnikiem CWU i sterowaniem.'],
  // Punkty 3-13 jak w poprzednich przykładach (dostosowane opisy)
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O. (2.5 bar)', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa (2.5 bar), odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zintegrowanego zasobnika ciepłej wody.'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

// Analogicznie dla Ecoinverter 8kW
const mitsubishiEcoinverter_8kW_base = [
  ['1', 'Jednostka zewnętrzna Ecoinverter 8kW (SUZ-SWM80VA)', 'szt.', '1', 'Jednostka zewnętrzna SUZ-SWM80VA, technologia Ecoinverter, moc 8kW.'],
  ['2', 'Jednostka wewnętrzna ze zintegrowanym zasobnikiem (EHSD-YM9D)', 'szt.', '1', 'Jednostka wewnętrzna EHSD-YM9D, moduł cylindryczny ze zintegrowanym zasobnikiem CWU i sterowaniem.'],
  // ... reszta 11 punktów jak wyżej
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O. (2.5 bar)', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa (2.5 bar), odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zintegrowanego zasobnika ciepłej wody.'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];


// --- Mitsubishi Ecoinverter (Hydrobox - SUZ/EHSD) ---
// EHSD-YM9D to moduł cylindryczny, a nie typowy hydrobox wiszący. Upewnij się, czy to poprawna jednostka wewnętrzna dla "Ecoinverter Hydrobox".
// Jeśli EHSD-YM9D jest tu używany jako hydrobox (co jest nietypowe, bo to cylinder), to opisy poniżej są odpowiednie.
// Jeśli powinien być inny model hydroboxa (np. ERSD), nazwy i opisy jednostki wewnętrznej należałoby zmienić.
const mitsubishiEcoinverterHydrobox_6kW_base = [
  ['1', 'Jednostka zewnętrzna Ecoinverter 6kW (SUZ-SWM60VA)', 'szt.', '1', 'Jednostka zewnętrzna SUZ-SWM60VA, technologia Ecoinverter, moc 6kW.'],
  ['2', 'Moduł wewnętrzny Hydrobox (EHSD-YM9D)', 'szt.', '1', 'Jednostka wewnętrzna EHSD-YM9D (używana jako moduł sterujący typu Hydrobox). Odpowiada za zarządzanie obiegiem grzewczym.'],
  // ... reszta 11 punktów
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O. (2.5 bar)', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa (2.5 bar), odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

// Analogicznie dla Ecoinverter Hydrobox 8kW
const mitsubishiEcoinverterHydrobox_8kW_base = [
  ['1', 'Jednostka zewnętrzna Ecoinverter 8kW (SUZ-SWM80VA)', 'szt.', '1', 'Jednostka zewnętrzna SUZ-SWM80VA, technologia Ecoinverter, moc 8kW.'],
  ['2', 'Moduł wewnętrzny Hydrobox (EHSD-YM9D)', 'szt.', '1', 'Jednostka wewnętrzna EHSD-YM9D (używana jako moduł sterujący typu Hydrobox). Odpowiada za zarządzanie obiegiem grzewczym.'],
  // ... reszta 11 punktów
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O. (2.5 bar)', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa (2.5 bar), odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];


// --- Mitsubishi HP (Hyper Heating - SUZ) ---
// Zakładam, że ta seria również korzysta z hydroboxa lub podobnego modułu wewnętrznego, który nie jest cylindrem.
// Nazwy jednostek wewnętrznych dla SUZ Hyper Heating nie są jasno zdefiniowane w oryginalnym kodzie, więc używam generycznej nazwy "Moduł wewnętrzny".
const mitsubishiHP_4kW_base = [
  ['1', 'Jednostka zewnętrzna Hyper Heating 4kW', 'szt.', '1', 'Jednostka zewnętrzna Mitsubishi SUZ Hyper Heating, moc 4kW, wysoka wydajność w niskich temperaturach.'],
  ['2', 'Moduł wewnętrzny Hyper Heating', 'szt.', '1', 'Moduł wewnętrzny dedykowany do serii SUZ Hyper Heating, zarządzający systemem grzewczym.'],
  // ... reszta 11 punktów
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O. (2.5 bar)', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa (2.5 bar), odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

const mitsubishiHP_6kW_base = [
  ['1', 'Jednostka zewnętrzna Hyper Heating 6kW', 'szt.', '1', 'Jednostka zewnętrzna Mitsubishi SUZ Hyper Heating, moc 6kW, wysoka wydajność w niskich temperaturach.'],
  ['2', 'Moduł wewnętrzny Hyper Heating', 'szt.', '1', 'Moduł wewnętrzny dedykowany do serii SUZ Hyper Heating, zarządzający systemem grzewczym.'],
  // ... reszta 11 punktów
  ['3', 'Komplet elementów hydraulicznych', 'kpl.', '1', 'W tym: zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trójniki, kształtki, nyple, redukcje i pozostała armatura niezbędna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementów elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia różnicowo-prądowe i nadprądowe, rozdzielnia – zgodnie z wymaganiami producenta dla bezpiecznego działania układu.'],
  ['5', 'Grupa bezpieczeństwa C.O. (2.5 bar)', 'kpl.', '1', 'Zawiera zawór bezpieczeństwa (2.5 bar), odpowietrznik automatyczny oraz manometr – do zabezpieczenia układu grzewczego przed nadciśnieniem.'],
  ['6', 'Grupa bezpieczeństwa CWU (6bar)', 'szt.', '1', 'Zawiera zawór bezpieczeństwa 6 bar, zawór zwrotny oraz manometr – do zabezpieczenia zasobnika ciepłej wody (jeśli jest stosowany).'],
  ['7', 'Rury miedziane chłodnicze z izolacją', 'kpl.', '1', 'Połączenia pomiędzy jednostką zewnętrzną a wewnętrzną, wykonane z rur miedzianych w trwałej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Wykonana otulinami z pianki technicznej w celu ochrony przewodów wodnych przed wychładzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostkę zewnętrzną', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montażu oraz modelu pompy ciepła, przygotowana do instalacji na gruncie lub na ścianie.'],
  ['10', 'Sterownik bezprzewodowy (PAR-WT)', 'szt.', '1', 'Mitsubishi PAR-WT. Do zarządzania pracą pompy z funkcją auto adaptacji.'],
  ['11', 'Podłączenie do istniejącej instalacji C.O. i CWU', 'kpl.', '1', 'Wpięcie zgodnie z wytycznymi producenta i dokumentacją DTR tak, aby system pracował bez zarzutu.'],
  ['12', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Odpowietrzenie, próba szczelności, napełnienie, kalibracja systemu oraz konfiguracja parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['13', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Przeszkolenie z obsługi pompy, przekazanie kart gwarancyjnych, protokołów odbioru, instrukcji użytkowania i dokumentacji powykonawczej.']
];

// Główny obiekt eksportowany
export const mitsubishiBaseTables = {
  'Mitsubishi-cylinder': {
    '14 kW': mitsubishiCylinder_standard_14kW_base,
    '12 kW': mitsubishiCylinder_standard_12kW_base,
    '10 kW': mitsubishiCylinder_standard_10kW_base,
    '8 kW': mitsubishiCylinder_standard_8kW_base,
    '6 kW': mitsubishiCylinder_standard_6kW_base,
  },
  'Mitsubishi-cylinder-PUZ': {
    '14 kW': mitsubishiCylinderPUZ_14kW_base,
    '12 kW': mitsubishiCylinderPUZ_12kW_base,
    '10 kW': mitsubishiCylinderPUZ_10kW_base,
    '8 kW': mitsubishiCylinderPUZ_8kW_base,
    '6 kW': mitsubishiCylinderPUZ_6kW_base,
  },
  'Mitsubishi-cylinder-PUZ-1F': {
    '12 kW': mitsubishiCylinderPUZ_1F_12kW_base,
    '10 kW': mitsubishiCylinderPUZ_1F_10kW_base,
    '8 kW': mitsubishiCylinderPUZ_1F_8kW_base,
    '6 kW': mitsubishiCylinderPUZ_1F_6kW_base,
  },
  'Mitsubishi-hydrobox': { // To jest dla PUD/EHSD
    '14 kW': mitsubishiHydrobox_standard_14kW_base,
    '12 kW': mitsubishiHydrobox_standard_12kW_base,
    '10 kW': mitsubishiHydrobox_standard_10kW_base,
    '8 kW': mitsubishiHydrobox_standard_8kW_base,
    '6 kW': mitsubishiHydrobox_standard_6kW_base,
  },
  'Mitsubishi-hydrobox-PUZ': {
    '14 kW': mitsubishiHydroboxPUZ_14kW_base,
    '12 kW': mitsubishiHydroboxPUZ_12kW_base,
    '10 kW': mitsubishiHydroboxPUZ_10kW_base,
    '8 kW': mitsubishiHydroboxPUZ_8kW_base,
    '6 kW': mitsubishiHydroboxPUZ_6kW_base,
  },
  'Mitsubishi-hydrobox-PUZ-1F': {
    '12 kW': mitsubishiHydroboxPUZ_1F_12kW_base,
    '10 kW': mitsubishiHydroboxPUZ_1F_10kW_base,
    '8 kW': mitsubishiHydroboxPUZ_1F_8kW_base,
    '6 kW': mitsubishiHydroboxPUZ_1F_6kW_base,
  },
  'Mitsubishi-ecoinverter': { // Zakładam, że to Ecoinverter z cylindrem
    '8 kW': mitsubishiEcoinverter_8kW_base,
    '6 kW': mitsubishiEcoinverter_6kW_base,
  },
  'Mitsubishi-ecoinverter-hydrobox': {
    '8 kW': mitsubishiEcoinverterHydrobox_8kW_base,
    '6 kW': mitsubishiEcoinverterHydrobox_6kW_base,
  },
  'Mitsubishi-hp': { // Hyper Heating
    '6 kW': mitsubishiHP_6kW_base,
    '4 kW': mitsubishiHP_4kW_base,
  }
};