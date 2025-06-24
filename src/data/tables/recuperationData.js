// Pełna, zaktualizowana zawartość pliku: src/data/tables/recuperationData.js

// 1. Definicja dostępnych urządzeń - ROZSZERZONA
export const recuperationDevices = {
  // AERIS
  AERIS_350: { name: 'Rekuperator AERIS next 350 VV' },
  AERIS_450: { name: 'Rekuperator AERIS next 450 VV' },
  AERIS_600: { name: 'Rekuperator AERIS next 600 VV' },

  // DRAFTON
  DRAFTON_P150: { name: 'Rekuperator DRAFTON P150' },
  DRAFTON_P200: { name: 'Rekuperator DRAFTON P200' },
  DRAFTON_P300: { name: 'Rekuperator DRAFTON P300' },
  DRAFTON_V300: { name: 'Rekuperator DRAFTON V300' },
  
  // DRAFTON Professional
  DRAFTON_PRO_225: { name: 'Rekuperator DRAFTON Professional 225' },
  DRAFTON_PRO_325: { name: 'Rekuperator DRAFTON Professional 325' },
  DRAFTON_PRO_400: { name: 'Rekuperator DRAFTON Professional 400' },
  DRAFTON_PRO_450: { name: 'Rekuperator DRAFTON Professional 450' },
  DRAFTON_PRO_600: { name: 'Rekuperator DRAFTON Professional 600' },
};

// 2. Logika doboru na podstawie powierzchni - ZAKTUALIZOWANA
export const getRecommendedRecuperator = (area) => {
  const surface = Number(area);
  if (isNaN(surface) || surface <= 0) return null;
  
  if (surface <= 100) return 'DRAFTON_PRO_225'; 
  if (surface <= 120) return 'AERIS_350';
  if (surface <= 140) return 'DRAFTON_PRO_325';
  if (surface <= 160) return 'AERIS_450';
  if (surface <= 180) return 'DRAFTON_PRO_450';
  if (surface <= 220) return 'AERIS_600';
  if (surface > 220) return 'DRAFTON_PRO_600';
  
  return 'AERIS_350'; // Fallback
};

// 3. Generyczny szablon zakresu prac
const createScope = (deviceName) => [
    ['', `Centrala wentylacyjna ${deviceName}`, 'Nowoczesna centrala wentylacyjna z wysokosprawnym wymiennikiem ciepła, zapewniająca stały dopływ świeżego powietrza.', 'kpl.', '1'],
    ['', 'Zestaw montażowy centrali', 'Kompletny zestaw zawierający stelaż montażowy, syfon, taśmy uszczelniające oraz elementy tłumiące drgania.', 'kpl.', '1'],
    ['', 'Rozdzielacze powietrza nawiewnego i wywiewnego', 'Stalowe, izolowane rozdzielacze systemowe zapewniające równomierny przepływ powietrza do wszystkich pomieszczeń.', 'szt.', '2'],
    ['', 'Skrzynki rozprężne z tworzywa antybakteryjnego', 'Skrzynki montowane pod sufitem lub w ścianach, służące do podłączenia anemostatów.', 'kpl.', '1'],
    ['', 'Rury wentylacyjne PE-FLEX®', 'Antystatyczne i antygrzybiczne przewody wentylacyjne o średnicy 75mm, prowadzone w izolacji stropu lub w zabudowach g-k.', 'kpl.', '1'],
    ['', 'Czerpnia i wyrzutnia ścienna', 'Zewnętrzne elementy systemu wykonane ze stali nierdzewnej, zapewniające estetyczne i trwałe zakończenie instalacji.', 'kpl.', '1'],
    ['', 'Tłumiki akustyczne', 'Elementy instalowane na głównych kanałach wentylacyjnych w celu maksymalnego wyciszenia pracy systemu.', 'szt.', '2'],
    ['', 'Montaż i regulacja systemu', 'Profesjonalny montaż wszystkich komponentów, pomiary anemometryczne, regulacja przepływów i uruchomienie systemu.', 'kpl.', '1'],
    ['', 'Szkolenie z obsługi', 'Przekazanie instrukcji dotyczących obsługi, konserwacji i wymiany filtrów w centrali wentylacyjnej.', 'szt.', '1'],
];


// 4. Szczegółowy zakres prac dla każdego urządzenia
export const recuperationScopes = {
  // AERIS
  AERIS_350: createScope('AERIS next 350 VV'),
  AERIS_450: createScope('AERIS next 450 VV'),
  AERIS_600: createScope('AERIS next 600 VV'),

  // DRAFTON
  DRAFTON_P150: createScope('DRAFTON P150'),
  DRAFTON_P200: createScope('DRAFTON P200'),
  DRAFTON_P300: createScope('DRAFTON P300'),
  DRAFTON_V300: createScope('DRAFTON V300'),
  
  // DRAFTON Professional
  DRAFTON_PRO_225: createScope('DRAFTON Professional 225'),
  DRAFTON_PRO_325: createScope('DRAFTON Professional 325'),
  DRAFTON_PRO_400: createScope('DRAFTON Professional 400'),
  DRAFTON_PRO_450: createScope('DRAFTON Professional 450'),
  DRAFTON_PRO_600: createScope('DRAFTON Professional 600'),
};
