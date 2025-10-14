// src/data/tables/recuperationData.js

export const recuperationDevices = {
  AERIS_350: {
    name: 'Rekuperator AERIS next 350 VV',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła >= 90%.',
    type: 'central',
  },
  AERIS_450: {
    name: 'Rekuperator AERIS next 450 VV',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła >= 90%.',
    type: 'central',
  },
  AERIS_600: {
    name: 'Rekuperator AERIS next 600 VV',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła >= 90%.',
    type: 'central',
  },
  DRAFTON_PRO_225: {
    name: 'Rekuperator DRAFTON Professional 225',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła >= 90%.',
    type: 'central',
  },
  DRAFTON_PRO_325: {
    name: 'Rekuperator DRAFTON Professional 325',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła >= 90%.',
    type: 'central',
  },
  DRAFTON_PRO_450: {
    name: 'Rekuperator DRAFTON Professional 450',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła >= 90%.',
    type: 'central',
  },
  DRAFTON_PRO_600: {
    name: 'Rekuperator DRAFTON Professional 600',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła >= 90%.',
    type: 'central',
  },
};

export const getRecommendedRecuperator = (area) => {
  const surface = Number(area);
  if (Number.isNaN(surface) || surface <= 0) {
    return 'AERIS_350';
  }
  if (surface <= 110) return 'AERIS_350';
  if (surface <= 140) return 'DRAFTON_PRO_325';
  if (surface <= 180) return 'AERIS_450';
  if (surface <= 220) return 'DRAFTON_PRO_450';
  return 'AERIS_600';
};

export const DRILLING_ITEM_ID = '12';

export const recuperationMainItems = [
  {
    id: '1',
    name: 'Centrala wentylacyjna',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła >= 90 %',
    unit: 'szt.',
    quantity: '1',
  },
  {
    id: '2',
    name: 'Uchwyt montażowy centrali',
    description: 'Konsola ścienno-stropowa, kotwy, tłumiki drgań',
    unit: 'kpl.',
    quantity: '1',
  },
  {
    id: '3',
    name: 'Przewody NEO Flex DN63 / DN75 + magistrale Spiro',
    description:
      'Elastyczne kanały z mikro-srebrem (właściwości przeciwgrzybiczne), gładkie wnętrze klasy L1 oraz magistrale nawiewne Spiro do rozdzielnicy',
    unit: 'mb',
    quantity: 'wg projektu',
  },
  {
    id: '4',
    name: 'Skrzynki rozprężne',
    description:
      'Skrzynki DN125 – obniżenie ciśnienia i hałasu, równomierny rozdział strumieni',
    unit: 'szt.',
    quantity: 'wg projektu',
  },
  {
    id: '5',
    name: 'Rozdzielacze powietrza',
    description:
      'DN63 lub DN75 (zależnie od projektu), liczba króćców wg projektu',
    unit: 'szt.',
    quantity: '2',
  },
  {
    id: '6',
    name: 'Tłumiki akustyczne',
    description: 'Tłumiki Ø125 – Ø200 mm, redukcja hałasu >= 10 dB',
    unit: 'kpl.',
    quantity: '2',
  },
  {
    id: '7',
    name: 'Przewody główne Spiro',
    description:
      'Kanały stalowe Ø125 – Ø200 mm (czerpnia, wyrzutnia, centrala)',
    unit: 'mb',
    quantity: 'wg projektu',
  },
  {
    id: '9',
    name: 'Czerpnia / wyrzutnia + redukcje',
    description:
      'Stal nierdzewna, redukcje w izolacji dla zmniejszenia hałasu',
    unit: 'szt.',
    quantity: '2',
  },
  {
    id: '10',
    name: 'Sterownik rekuperatora',
    description:
      'Urządzenie do zarządzania pracą systemu (tryby, harmonogramy, serwis)',
    unit: 'szt.',
    quantity: '1',
  },
  {
    id: '11',
    name: 'Akcesoria montażowe',
    description: 'Obejmy, taśmy, uszczelniacze, zawiesia, złączki',
    unit: 'kpl.',
    quantity: '1',
  },
  {
    id: '12',
    name: 'Wiercenie otworów koroną',
    description:
      'Otwory Ø125 – Ø350 mm w stropach/ścianach, zgodnie z projektem',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: '13',
    name: 'Montaż kanałów (Flex + Spiro)',
    description:
      'Rozprowadzenie przewodów; dobór długości i średnic dla minimalnych oporów',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: '14',
    name:
      'Montaż skrzynek + kanałów czerpni/wyrzutni + izolacja',
    description:
      'Osadzenie skrzynek, prowadzenie kanałów do elewacji/dachu, pełne zaizolowanie',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: '15',
    name: 'Montaż rekuperatora',
    description:
      'Poziomowanie, podłączenie kondensatu i obejść serwisowych',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: '16',
    name: 'Podłączenie elektryczne / komunikacyjne',
    description:
      'Zasilanie centrali, podłączenie sterownika, integracja z automatyką (jeśli przewidziano)',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: '17',
    name: 'Uruchomienie i kalibracja',
    description:
      'Pomiary nawiew/wywiew, ustawienie bilansu, protokół rozruchu',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: '18',
    name: 'Szkolenie użytkownika',
    description:
      'Obsługa sterownika, wymiana filtrów, harmonogramy serwisowe',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: '19',
    name: 'Dokumentacja powykonawcza',
    description:
      'Schemat instalacji, karta gwarancyjna, raport pomiarów',
    unit: 'kpl.',
    quantity: '1',
  },
  {
    id: '20',
    name: 'Gwarancja i serwis',
    description:
      '5 lat na centralę (po rejestracji), 2 lata na montaż, opcjonalne przeglądy roczne',
    unit: 'usł.',
    quantity: '1',
  },
];

export const recuperationItemsById = recuperationMainItems.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

export const recuperationVariants = {
  installationOnly: {
    key: 'installationOnly',
    label: 'Montaż samej rekuperacji',
    itemIds: ['2', '3', '5', '6', '9', '10', '12', '13', '14', '15'],
  },
  withInfrastructure: {
    key: 'withInfrastructure',
    label: 'Rekuperacja + przygotowanie infrastruktury',
    itemIds: ['1', '3', '4', '7', '9', '10', '11', '12', '13', '16', '17', '18', '19', '20'],
  },
};

