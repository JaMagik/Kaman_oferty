// Nowy plik: src/data/tables/recuperationData.js

// 1. Definicja dostępnych urządzeń
export const recuperationDevices = {
  AERIS_350: { name: 'Rekuperator AERIS next 350 VV' },
  AERIS_450: { name: 'Rekuperator AERIS next 450 VV' },
  AERIS_600: { name: 'Rekuperator AERIS next 600 VV' },
};

// 2. Logika doboru na podstawie powierzchni (z pliku Excel)
export const getRecommendedRecuperator = (area) => {
  const surface = Number(area);
  if (isNaN(surface) || surface <= 0) return null;
  if (surface <= 120) return 'AERIS_350';
  if (surface <= 160) return 'AERIS_450';
  if (surface <= 220) return 'AERIS_600';
  return 'AERIS_600'; // Domyślnie największy dla powierzchni > 220
};

// 3. Szczegółowy zakres prac dla każdego urządzenia
export const recuperationScopes = {
  AERIS_350: [
    ['', 'Centrala wentylacyjna AERIS next 350 VV', 'Najwyższej jakości centrala wentylacyjna z odzyskiem ciepła i wilgoci, sterowana za pomocą modułu Wi-Fi.', 'kpl.', '1'],
    ['', 'Zestaw montażowy centrali', 'Kompletny zestaw zawierający stelaż montażowy, syfon, taśmy uszczelniające oraz elementy tłumiące drgania.', 'kpl.', '1'],
    ['', 'Rozdzielacze powietrza nawiewnego i wywiewnego', 'Stalowe, izolowane rozdzielacze systemowe zapewniające równomierny przepływ powietrza do wszystkich pomieszczeń.', 'szt.', '2'],
    ['', 'Skrzynki rozprężne z tworzywa antybakteryjnego', 'Skrzynki montowane pod sufitem lub w ścianach, służące do podłączenia anemostatów.', 'kpl.', '1'],
    ['', 'Rury wentylacyjne PE-FLEX®', 'Antystatyczne i antygrzybiczne przewody wentylacyjne o średnicy 75mm, prowadzone w izolacji stropu lub w zabudowach g-k.', 'kpl.', '1'],
    ['', 'Czerpnia i wyrzutnia ścienna', 'Zewnętrzne elementy systemu wykonane ze stali nierdzewnej, zapewniające estetyczne i trwałe zakończenie instalacji.', 'kpl.', '1'],
    ['', 'Tłumiki akustyczne', 'Elementy instalowane na głównych kanałach wentylacyjnych w celu maksymalnego wyciszenia pracy systemu.', 'szt.', '2'],
    ['', 'Montaż i regulacja systemu', 'Profesjonalny montaż wszystkich komponentów, pomiary anemometryczne, regulacja przepływów i uruchomienie systemu.', 'kpl.', '1'],
    ['', 'Szkolenie z obsługi', 'Przekazanie instrukcji dotyczących obsługi, konserwacji i wymiany filtrów w centrali wentylacyjnej.', 'szt.', '1'],
  ],
  AERIS_450: [
    ['', 'Centrala wentylacyjna AERIS next 450 VV', 'Wydajna centrala wentylacyjna z odzyskiem ciepła i wilgoci, idealna dla większych domów, sterowana przez Wi-Fi.', 'kpl.', '1'],
    ['', 'Zestaw montażowy centrali', 'Kompletny zestaw zawierający stelaż montażowy, syfon, taśmy uszczelniające oraz elementy tłumiące drgania.', 'kpl.', '1'],
    ['', 'Rozdzielacze powietrza nawiewnego i wywiewnego', 'Stalowe, izolowane rozdzielacze systemowe zapewniające równomierny przepływ powietrza do wszystkich pomieszczeń.', 'szt.', '2'],
    ['', 'Skrzynki rozprężne z tworzywa antybakteryjnego', 'Skrzynki montowane pod sufitem lub w ścianach, służące do podłączenia anemostatów.', 'kpl.', '1'],
    ['', 'Rury wentylacyjne PE-FLEX®', 'Antystatyczne i antygrzybiczne przewody wentylacyjne o średnicy 75mm, prowadzone w izolacji stropu lub w zabudowach g-k.', 'kpl.', '1'],
    ['', 'Czerpnia i wyrzutnia ścienna', 'Zewnętrzne elementy systemu wykonane ze stali nierdzewnej, zapewniające estetyczne i trwałe zakończenie instalacji.', 'kpl.', '1'],
    ['', 'Tłumiki akustyczne', 'Elementy instalowane na głównych kanałach wentylacyjnych w celu maksymalnego wyciszenia pracy systemu.', 'szt.', '2'],
    ['', 'Montaż i regulacja systemu', 'Profesjonalny montaż wszystkich komponentów, pomiary anemometryczne, regulacja przepływów i uruchomienie systemu.', 'kpl.', '1'],
    ['', 'Szkolenie z obsługi', 'Przekazanie instrukcji dotyczących obsługi, konserwacji i wymiany filtrów w centrali wentylacyjnej.', 'szt.', '1'],
  ],
  AERIS_600: [
    ['', 'Centrala wentylacyjna AERIS next 600 VV', 'Najwyższej wydajności centrala wentylacyjna z odzyskiem ciepła i wilgoci do dużych rezydencji, sterowana przez Wi-Fi.', 'kpl.', '1'],
    ['', 'Zestaw montażowy centrali', 'Kompletny zestaw zawierający stelaż montażowy, syfon, taśmy uszczelniające oraz elementy tłumiące drgania.', 'kpl.', '1'],
    ['', 'Rozdzielacze powietrza nawiewnego i wywiewnego', 'Stalowe, izolowane rozdzielacze systemowe zapewniające równomierny przepływ powietrza do wszystkich pomieszczeń.', 'szt.', '2'],
    ['', 'Skrzynki rozprężne z tworzywa antybakteryjnego', 'Skrzynki montowane pod sufitem lub w ścianach, służące do podłączenia anemostatów.', 'kpl.', '1'],
    ['', 'Rury wentylacyjne PE-FLEX®', 'Antystatyczne i antygrzybiczne przewody wentylacyjne o średnicy 75mm, prowadzone w izolacji stropu lub w zabudowach g-k.', 'kpl.', '1'],
    ['', 'Czerpnia i wyrzutnia ścienna', 'Zewnętrzne elementy systemu wykonane ze stali nierdzewnej, zapewniające estetyczne i trwałe zakończenie instalacji.', 'kpl.', '1'],
    ['', 'Tłumiki akustyczne', 'Elementy instalowane na głównych kanałach wentylacyjnych w celu maksymalnego wyciszenia pracy systemu.', 'szt.', '2'],
    ['', 'Montaż i regulacja systemu', 'Profesjonalny montaż wszystkich komponentów, pomiary anemometryczne, regulacja przepływów i uruchomienie systemu.', 'kpl.', '1'],
    ['', 'Szkolenie z obsługi', 'Przekazanie instrukcji dotyczących obsługi, konserwacji i wymiany filtrów w centrali wentylacyjnej.', 'szt.', '1'],
  ],
};