export const recuperationDevices = {
  AERIS_350: {
    name: 'Rekuperator AERIS next 350 VV',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła ≥ 90%.',
    type: 'central',
  },
  AERIS_450: {
    name: 'Rekuperator AERIS next 450 VV',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła ≥ 90%.',
    type: 'central',
  },
  AERIS_600: {
    name: 'Rekuperator AERIS next 600 VV',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła ≥ 90%.',
    type: 'central',
  },
  DRAFTON_PRO_225: {
    name: 'Rekuperator DRAFTON Professional 225',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła ≥ 90%.',
    type: 'central',
  },
  DRAFTON_PRO_325: {
    name: 'Rekuperator DRAFTON Professional 325',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła ≥ 90%.',
    type: 'central',
  },
  DRAFTON_PRO_450: {
    name: 'Rekuperator DRAFTON Professional 450',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła ≥ 90%.',
    type: 'central',
  },
  DRAFTON_PRO_600: {
    name: 'Rekuperator DRAFTON Professional 600',
    description:
      'Wysokosprawny wymiennik przeciwprądowy, wentylatory EC, odzysk ciepła ≥ 90%.',
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

export const DRILLING_ITEM_ID = 'ETAP1-6';

export const recuperationMainItems = [
  // Sam rekuperator – montaż centrali
  {
    id: 'SAM-1',
    name: 'Montaż i wypoziomowanie centrali',
    description: 'Ustawienie centrali rekuperacyjnej na konsolach z wibroizolacją.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'SAM-2',
    name: 'Odprowadzenie skroplin',
    description: 'Syfon, odpowietrzenie oraz wpięcie do kanalizacji.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'SAM-3',
    name: 'Zasilanie i automatyka',
    description: 'Podłączenie elektryczne, montaż sterownika i wstępna konfiguracja pracy.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'SAM-4',
    name: 'Połączenie z rozdzielaczami',
    description: 'Kanały stalowe Spiro – średnice i redukcje zgodnie z projektem.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'SAM-5',
    name: 'Czerpnia i wyrzutnia – kanały',
    description: 'Główne ciągi w systemie Spiro od/do centrali.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'SAM-6',
    name: 'Montaż elementów końcowych',
    description: 'Czerpnia i wyrzutnia w przygotowanych otworach, pełne uszczelnienie przejść.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'SAM-7',
    name: 'Izolacja przewodów',
    description: 'Wykonanie izolacji termicznej przewodów zgodnie z projektem lub wytycznymi.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'SAM-8',
    name: 'Tłumiki akustyczne',
    description: 'Montaż tłumików przy centrali zgodnie z projektem lub wytycznymi.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'SAM-9',
    name: 'Kratki zewnętrzne',
    description: 'Montaż kratek czerpni i wyrzutni na elewacji wraz z uszczelnieniem.',
    unit: 'szt.',
    quantity: 'wg projektu',
  },
  {
    id: 'SAM-10',
    name: 'Dostępy serwisowe',
    description: 'Zapewnienie dostępów serwisowych i króćców pomiarowych przy centrali.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'SAM-11',
    name: 'Próby i uruchomienie',
    description: 'Kontrola szczelności, kierunków przepływu oraz test trybów pracy i harmonogramów.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'SAM-12',
    name: 'Przekazanie i instruktaż',
    description: 'Obsługa systemu, protokół uruchomienia oraz zalecenia eksploatacyjno-serwisowe.',
    unit: 'usł.',
    quantity: '1',
  },

  // Etap 1 — projekt + rozprowadzenie instalacji
  {
    id: 'ETAP1-1',
    name: 'Inwentaryzacja założeń',
    description:
      'Zbieranie danych: kubatura, funkcje pomieszczeń, liczba użytkowników, źródła ciepła/kominek, lokalizacja centrali.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'ETAP1-2',
    name: 'Bilans powietrza i koncepcja pracy',
    description:
      'Wyznaczenie strumieni nawiewu/wywiewu, trybów pracy (komfort/noc/przewietrzanie) oraz średnic i liczby punktów.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'ETAP1-3',
    name: 'Projekt wykonawczy',
    description:
      'Trasy przewodów, wysokości, lokalizacje skrzynek, rozdzielaczy, czerpni i wyrzutni oraz specyfikacja materiałowa.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'ETAP1-4',
    name: 'Trasowanie instalacji',
    description:
      'Oznaczenie przebiegów przewodów, punktów anemostatów i przejść przez przegrody na obiekcie.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'ETAP1-5',
    name: 'Przepusty w przegrodach',
    description:
      'Wykonanie przepustów i otworów zgodnie z projektem, wraz z uszczelnieniem i zachowaniem odporności przegród.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP1-6',
    name: 'Wiercenie otworów koronami',
    description:
      'Przewierty rdzeniowe koronami diamentowymi przez ściany/stropy, zabezpieczenie krawędzi i odciąg pyłu.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP1-7',
    name: 'Przewody elastyczne Ø75',
    description:
      'Ułożenie przewodów elastycznych systemowych Ø75 mm między skrzynkami a rozdzielaczem, mocowanie w uchwytach.',
    unit: 'mb',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP1-8',
    name: 'Skrzynki rozprężne',
    description:
      'Montaż skrzynek nawiewnych i wywiewnych z wypoziomowaniem, uszczelnieniem i przygotowaniem pod anemostaty.',
    unit: 'szt.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP1-9',
    name: 'Rozdzielacze Ø75',
    description:
      'Montaż rozdzielaczy nawiewu i wywiewu z opisem obwodów oraz przygotowaniem pod połączenie z centralą.',
    unit: 'szt.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP1-10',
    name: 'Przejście do pomieszczenia centrali',
    description:
      'Prowadzenie przewodów od rozdzielaczy do pomieszczenia centrali, z przejściami przez stropy/ściany jeśli potrzeba.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP1-11',
    name: 'Przygotowanie pod czerpnię i wyrzutnię',
    description:
      'Wstępne przygotowanie przejść i lokalizacji pod czerpnię oraz wyrzutnię – montaż elementów końcowych w etapie 2.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP1-12',
    name: 'Zabezpieczenie instalacji',
    description:
      'Zaślepienie i zabezpieczenie końców przewodów oraz rozdzielaczy na czas dalszych prac.',
    unit: 'usł.',
    quantity: '1',
  },

  // Etap 2 — montaż centrali i uruchomienie
  {
    id: 'ETAP2-1',
    name: 'Montaż centrali',
    description: 'Ustawienie i wypoziomowanie centrali na konsolach z wibroizolacją.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'ETAP2-2',
    name: 'Odprowadzenie skroplin',
    description: 'Syfon, odpowietrzenie oraz wpięcie do kanalizacji zgodnie z wytycznymi producenta.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'ETAP2-3',
    name: 'Zasilanie i automatyka',
    description: 'Podłączenie elektryczne, montaż sterownika oraz wstępna konfiguracja pracy.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'ETAP2-4',
    name: 'Połączenie z rozdzielaczami',
    description: 'Kanały stalowe Spiro od centrali do rozdzielaczy (średnice/redukcje zgodnie z projektem).',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP2-5',
    name: 'Czerpnia i wyrzutnia — kanały',
    description: 'Wykonanie głównych ciągów czerpni i wyrzutni w systemie Spiro od/do centrali.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP2-6',
    name: 'Czerpnia/wyrzutnia — elewacja lub dach',
    description: 'Montaż elementów końcowych w przygotowanych otworach, z pełnym uszczelnieniem przejść.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP2-7',
    name: 'Izolacja przewodów',
    description: 'Wykonanie izolacji termicznej przewodów zgodnie z projektem lub wytycznymi centrali.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP2-8',
    name: 'Tłumiki akustyczne',
    description: 'Montaż tłumików przy centrali zgodnie z projektem lub wytycznymi.',
    unit: 'usł.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP2-9',
    name: 'Kratki zewnętrzne',
    description: 'Montaż kratek czerpni/wyrzutni na elewacji z uszczelnieniem.',
    unit: 'szt.',
    quantity: 'wg projektu',
  },
  {
    id: 'ETAP2-10',
    name: 'Dostępy serwisowe',
    description: 'Zapewnienie dostępów serwisowych i króćców pomiarowych przy centrali.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'ETAP2-11',
    name: 'Próby i uruchomienie',
    description: 'Test szczelności, weryfikacja kierunków przepływu, trybów pracy i harmonogramów.',
    unit: 'usł.',
    quantity: '1',
  },
  {
    id: 'ETAP2-12',
    name: 'Przekazanie i instruktaż',
    description: 'Obsługa systemu, protokół uruchomienia oraz zalecenia eksploatacyjno-serwisowe.',
    unit: 'usł.',
    quantity: '1',
  },

  // Opcja dodatkowa
  {
    id: '21',
    name: 'Filtr Aqua Clear',
    description:
      'Wysokowydajny filtr Aqua Clear poprawiający jakość powietrza oraz chroniący centralę przed zanieczyszczeniami.',
    unit: 'szt.',
    quantity: '1',
  },
];

export const recuperationItemsById = recuperationMainItems.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

export const recuperationStages = {
  samRekuperator: {
    key: 'samRekuperator',
    label: 'Urządzenie',
    itemIds: [
      'SAM-1',
      'SAM-2',
      'SAM-3',
      'SAM-4',
      'SAM-5',
      'SAM-6',
      'SAM-7',
      'SAM-8',
      'SAM-9',
      'SAM-10',
      'SAM-11',
      'SAM-12',
    ],
  },
  etap1: {
    key: 'etap1',
    label: 'Projekt i rozprowadzenie instalacji',
    itemIds: [
      'ETAP1-1',
      'ETAP1-2',
      'ETAP1-3',
      'ETAP1-4',
      'ETAP1-5',
      'ETAP1-6',
      'ETAP1-7',
      'ETAP1-8',
      'ETAP1-9',
      'ETAP1-10',
      'ETAP1-11',
      'ETAP1-12',
    ],
  },
  etap2: {
    key: 'etap2',
    label: 'Montaż rekuperatora',
    itemIds: [
      'ETAP2-1',
      'ETAP2-2',
      'ETAP2-3',
      'ETAP2-4',
      'ETAP2-5',
      'ETAP2-6',
      'ETAP2-7',
      'ETAP2-8',
      'ETAP2-9',
      'ETAP2-10',
      'ETAP2-11',
      'ETAP2-12',
    ],
  },
};

const mergeUnique = (...arrays) => Array.from(new Set(arrays.flat()));

const stageSectionTitles = {
  samRekuperator: 'Urządzenie',
  etap1: 'Projekt i rozprowadzenie instalacji',
  etap2: 'Montaż rekuperatora',
};

const createSection = (stageKey) => ({
  stageKey,
  title: stageSectionTitles[stageKey] || 'Zakres prac i komponenty systemu',
});

export const recuperationVariants = {
  samRekuperator: {
    key: 'samRekuperator',
    label: 'Urządzenie / sam rekuperator',
    itemIds: [...recuperationStages.samRekuperator.itemIds],
    sections: [createSection('samRekuperator')],
  },
  samRekuperatorProjektRozprowadzenie: {
    key: 'samRekuperatorProjektRozprowadzenie',
    label: 'Rekuperator + projekt + rozprowadzenie',
    itemIds: mergeUnique(
      recuperationStages.samRekuperator.itemIds,
      recuperationStages.etap1.itemIds
    ),
    sections: [createSection('samRekuperator'), createSection('etap1')],
  },
  samRekuperatorProjektMontaz: {
    key: 'samRekuperatorProjektMontaz',
    label: 'Rekuperator + projekt + rozprowadzenie + montaż',
    itemIds: mergeUnique(
      recuperationStages.samRekuperator.itemIds,
      recuperationStages.etap1.itemIds,
      recuperationStages.etap2.itemIds
    ),
    sections: [createSection('samRekuperator'), createSection('etap1'), createSection('etap2')],
  },
  projektMontazCentrali: {
    key: 'projektMontazCentrali',
    label: 'Rozprowadzenie + montaż centrali',
    itemIds: mergeUnique(
      recuperationStages.etap1.itemIds,
      recuperationStages.etap2.itemIds
    ),
    sections: [createSection('etap1'), createSection('etap2')],
  },
};

export const recuperationItemStageMap = Object.entries(recuperationStages).reduce(
  (acc, [stageKey, stage]) => {
    stage.itemIds.forEach((id) => {
      acc[id] = stageKey;
    });
    return acc;
  },
  {}
);

recuperationItemStageMap['21'] = recuperationItemStageMap['21'] || 'samRekuperator';


