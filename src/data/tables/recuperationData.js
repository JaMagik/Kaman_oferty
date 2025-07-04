// src/data/tables/recuperationData.js

// 1. Definicje wybieralnych komponentów
export const installationSystems = {
  'R_VENT_GOLD': { name: 'Elementy instalacji R-VENT Flex 63 (NeoFlex GOLD)', description: 'Elastyczne kanały z mikro-srebrem (właściwości przeciwgrzybiczne), gładkie wnętrze klasy L1.' },
  'NEO_FLEX_PRO': { name: 'Elementy instalacji NEO FLEX DN63 (NeoFLEX PRO)', description: 'Elastyczny system przewodów wentylacyjnych z powłoką antybakteryjną, zapewniający cichą i wydajną pracę.' },
  'NEO_FLEX_STD': { name: 'Elementy instalacji NEO Flex DN 75 (Neoflex STD)', description: 'Standardowy, ekonomiczny system dystrybucji powietrza oparty na przewodach elastycznych o średnicy 75mm.' },
};

export const otherElements = {
    'SPIRO_GWC': { name: 'Elementy instalacji Stal SPIRO z GWC', description: 'Prowadzenie kanałów czerpni i wyrzutni, podłączenie rozdzielaczy, siłownik do GWC i cały osprzęt.' },
    'CRD_PREMIUM': { name: 'Elementy instalacji CRD (Premium)', description: 'Najwyższa szczelność i wyciszenie instalacji (prowadzenie kanałów czerpni i wyrzutni oraz podłączenie rozdzielaczy).' }
};

export const recuperationDevices = {
  AERIS_350: { name: 'Rekuperator AERIS next 350 VV', description: 'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła > 90%.' },
  AERIS_450: { name: 'Rekuperator AERIS next 450 VV', description: 'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła > 90%.' },
  AERIS_600: { name: 'Rekuperator AERIS next 600 VV', description: 'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła > 90%.' },
  DRAFTON_PRO_225: { name: 'Rekuperator DRAFTON Professional 225', description: 'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła > 90%.' },
  DRAFTON_PRO_325: { name: 'Rekuperator DRAFTON Professional 325', description: 'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła > 90%.' },
  DRAFTON_PRO_450: { name: 'Rekuperator DRAFTON Professional 450', description: 'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła > 90%.' },
  DRAFTON_PRO_600: { name: 'Rekuperator DRAFTON Professional 600', description: 'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła > 90%.' },
};

// 2. Logika doboru urządzenia
export const getRecommendedRecuperator = (area) => {
  const surface = Number(area);
  if (isNaN(surface) || surface <= 0) return 'AERIS_350';
  if (surface <= 100) return 'DRAFTON_PRO_225'; 
  if (surface <= 120) return 'AERIS_350';
  if (surface <= 140) return 'DRAFTON_PRO_325';
  if (surface <= 160) return 'AERIS_450';
  if (surface <= 180) return 'DRAFTON_PRO_450';
  if (surface <= 220) return 'AERIS_600';
  if (surface > 220) return 'DRAFTON_PRO_600';
  return 'AERIS_350';
};

// 3. STAŁA tabela z zakresem prac montażowych
export const recuperationBaseScope = [
    ['', 'Uchwyt montażowy centrali', 'Konsola ścienno-stropowa, kotwy, tłumiki drgań', 'kpl.', '1'],
    ['', 'Skrzynki rozprężne', 'Skrzynki DN125 - obniżenie ciśnienia i hałasu, równomierny rozdział strumieni', 'szt.', 'wg projektu'],
    ['', 'Rozdzielacze powietrza', 'DN63 lub DN75 (zależnie od projektu), liczba króćców wg projektu', 'szt.', '2'],
    ['', 'Tłumiki akustyczne', 'Tłumiki Ø125 - Ø200 mm, redukcja hałasu ≥ 10 dB', 'kpl.', '2'],
    ['', 'Przewody główne Spiro', 'Kanały stalowe Ø125 - Ø200 mm (czerpnia, wyrzutnia, centrala)', 'mb', 'wg projektu'],
    ['', 'Izolacja wełna + folie alu', 'Wełna 30 - 50 mm (dobierana do temperatury powietrza, zapobiega kondensacji)', 'mb', 'wg projektu'],
    ['', 'Czerpnia / wyrzutnia + redukcje', 'Stal nierdzewna, redukcje w izolacji dla zmniejszenia hałasu', 'szt.', '2'],
    ['', 'Sterownik rekuperatora', 'Urządzenie do zarządzania pracą systemu (tryby, harmonogramy, serwis)', 'szt.', '1'],
    ['', 'Akcesoria montażowe', 'Obejmy, taśmy, uszczelniacze, zawiesia, złączki', 'kpl.', '1'],
    ['', 'Wiercenie otworów koroną', 'Otwory Ø125 - Ø350 mm w stropach/ścianach, zgodnie z projektem', 'kpl.', '1'],
    ['', 'Montaż kanałów (Flex + Spiro)', 'Rozprowadzenie przewodów; dobór długości i średnic dla minimalnych oporów', 'usł.', '1'],
    ['', 'Montaż skrzynek + kanałów czerpni/wyrzutni + izolacja', 'Osadzenie skrzynek, prowadzenie kanałów do elewacji/dachu, pełne zaizolowanie', 'usł.', '1'],
    ['', 'Montaż rekuperatora', 'Poziomowanie, podłączenie kondensatu i obejść serwisowych', 'usł.', '1'],
    ['', 'Podłączenie elektryczne / komunikacyjne', 'Zasilanie centrali, podłączenie sterownika, integracja z automatyką (jeśli przewidziano)', 'usł.', '1'],
    ['', 'Uruchomienie i kalibracja', 'Pomiary nawiewu/wywiewu, ustawienie bilansu, protokół rozruchu', 'usł.', '1'],
    ['', 'Szkolenie użytkownika', 'Obsługa sterownika, wymiana filtrów, harmonogramy serwisowe', 'usł.', '1'],
    ['', 'Dokumentacja powykonawcza', 'Schemat instalacji, karta gwarancyjna, raport pomiarów', 'kpl.', '1'],
    ['', 'Gwarancja i serwis', '5 lat na centralę (po rejestracji), 2 lata na montaż, opcjonalne przeglądy roczne', 'usł.', '1'],
];