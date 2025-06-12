// ścieżka: src/data/tables/photovoltaicsData.js

export const panelTypesData = {
  'CANADIAN_SOLAR_460': {
    name: 'Panel fotowoltaiczny Canadian Solar 460 Wp',
    power: 0.460,
    description: 'Wysokowydajny moduł monokrystaliczny z technologią PERC.',
    datasheets: [
      '/pdf_templates/photovoltaics/panels/canadian_solar_460/CS_460_DS1.pdf',
      '/pdf_templates/photovoltaics/panels/canadian_solar_460/CS_460_DS2.pdf',
    ]
  },
};

export const inverterTypesData = {
  // Falowniki Hybrydowe
  'DEYE_HYBRID': {
    name: 'Falownik hybrydowy DEYE',
    type: 'Hybrid Inverter',
    isHybrid: true,
    description: 'Nowoczesny, trójfazowy inwerter hybrydowy z funkcją zasilania awaryjnego. Może pracować jako retrofit.',
    datasheets: [
      '/pdf_templates/photovoltaics/inverters/deye/DEYE_HYBRID_DS1.pdf',
      '/pdf_templates/photovoltaics/inverters/deye/DEYE_HYBRID_DS2.pdf',
    ]
  },
  'SUNGROW_SG_RS': {
    name: 'Falownik hybrydowy SUNGROW Seria SG-SH RS',
    type: 'Hybrid Inverter',
    isHybrid: true,
    description: 'Zaawansowany inwerter hybrydowy, kompatybilny z magazynami energii.',
    datasheets: [
      '/pdf_templates/photovoltaics/inverters/sungrow/SUNGROW_SG_SH_RS_DS1.pdf',
    ]
  },
  // Ładowarki AC (Retrofit)
  'FOXESS_AC3': {
    name: 'Ładowarka AC FoxESS AC3 (Retrofit)',
    type: 'AC Charger',
    isHybrid: false,
    description: 'Inteligentna ładowarka AC do integracji magazynu energii z istniejącą instalacją fotowoltaiczną dowolnego producenta.',
    datasheets: [
      '/pdf_templates/photovoltaics/inverters/foxess/FOXESS_R_G3_DS1.pdf',
      '/pdf_templates/photovoltaics/inverters/foxess/FOXESS_R_G3_DS2.pdf',
    ] // Uzupełnij ścieżki
  },
  // Zwykłe falowniki PV
  'FOXESS_T_G3': {
    name: 'Falownik FOXESS Seria T (G3)',
    type: 'PV Inverter',
    isHybrid: false,
    description: 'Wysokowydajny, trójfazowy falownik sieciowy (on-grid).',
    datasheets: [
      '/pdf_templates/photovoltaics/inverters/foxess/FOXESS_T_G3_DS1.pdf',
      '/pdf_templates/photovoltaics/inverters/foxess/FOXESS_T_G3_DS2.pdf',
    ]
  },
};

export const storageTypesData = {
  'DEYE_STORAGE_LV': {
    name: 'Magazyn energii DEYE LV Series',
    capacity: 5.11,
    brand: 'DEYE',
    description: 'Niskonapięciowy (48V) system magazynowania energii oparty na technologii LiFePO₄.',
    datasheets: [
      'pdf_templates/photovoltaics/storage/deye/DEYE_STORAGE_LV_DS1.pdf',
      'pdf_templates/photovoltaics/storage/deye/DEYE_STORAGE_LV_DS2.pdf',
      'pdf_templates/photovoltaics/storage/deye/DEYE_STORAGE_LV_DS3.pdf',
    ]
  },
};
export const pvRoofMountScope = [
    ['', 'Weryfikacja warunków lokalnych', 'Ocena stanu i nośności dachu, nasłonecznienia, zacienienia oraz możliwości prowadzenia tras kablowych.', 'szt.', '1'],
    ['', 'Dostarczenie systemu montażowego', 'Kompletny, certyfikowany zestaw konstrukcyjny przeznaczony do montażu na dachu danego typu.', 'kpl.', '1'],
    ['', 'Montaż systemu mocowań do dachu', 'Instalacja haków lub szpilek z zachowaniem pełnej szczelności pokrycia dachowego.', 'kpl.', '1'],
    ['', 'Montaż profili aluminiowych', 'Instalacja szyn montażowych, na których spoczną moduły fotowoltaiczne.', 'kpl.', '1'],
    ['', 'Montaż modułów fotowoltaicznych', 'Mocowanie paneli z zachowaniem odstępów dylatacyjnych i norm montażowych.', 'kpl.', '1'],
    ['', 'Wykonanie okablowania po stronie DC', 'Połączenie modułów w łańcuchy (stringi) przewodami solarnymi odpornymi na UV.', 'kpl.', '1'],
    ['', 'Zabezpieczenie przewodów w osłonach', 'Prowadzenie tras kablowych w peszlach lub korytkach w celu ochrony przed uszkodzeniami.', 'kpl.', '1'],
    ['', 'Wprowadzenie przewodów DC do budynku', 'Estetyczne i bezpieczne doprowadzenie przewodów do lokalizacji falownika, z wykonaniem szczelnych przejść.', 'szt.', '1'],
    ['', 'Montaż falownika w wyznaczonym miejscu', 'Instalacja falownika wewnątrz budynku (np. garaż, kotłownia) zgodnie z wymaganiami producenta.', 'szt.', '1'],
    ['', 'Wykonanie rozdzielnicy i zabezpieczeń DC', 'Montaż rozdzielnicy DC z zabezpieczeniami nadprądowymi, rozłącznikami i ogranicznikami przepięć.', 'kpl.', '1'],
    ['', 'Wykonanie układu uziemienia', 'Uziemienie konstrukcji montażowej oraz połączenia ochronne dla komponentów systemu.', 'kpl.', '1'],
    ['', 'Podłączenie po stronie prądu zmiennego (AC)', 'Podłączenie do instalacji wewnętrznej, instalacja zabezpieczeń nadprądowych, RCD i przepięciowych.', 'kpl.', '1'],
    ['', 'Uruchomienie instalacji i pomiary', 'Konfiguracja falownika, synchronizacja z siecią oraz wykonanie pomiarów elektrycznych.', 'szt.', '1'],
    ['', 'Wprowadzenie instalacji do systemu monitorowania', 'Rejestracja instalacji w systemie online producenta i przekazanie dostępu użytkownikowi.', 'szt.', '1'],
    ['', 'Przygotowanie dokumentacji powykonawczej', 'Sporządzenie schematów podłączenia, protokołów pomiarowych i raportu uruchomienia.', 'kpl.', '1'],
    ['', 'Instruktaż dla użytkownika końcowego', 'Szkolenie z obsługi, zasad bezpieczeństwa, interpretacji wskazań falownika oraz informacji o gwarancjach.', 'szt.', '1'],
    ['', 'Zgłoszenie mikroinstalacji do OSD', 'Przygotowanie i złożenie kompletnego wniosku o przyłączenie mikroinstalacji do sieci.', 'szt.', '1'],
    ['', 'Wsparcie w procesie pozyskania dofinansowania', 'Pomoc w przygotowaniu wniosku, np. w ramach programu „Mój Prąd”, i przekazanie niezbędnej dokumentacji.', 'szt.', '1'],
];

export const pvGroundMountScope = [
    ['', 'Weryfikacja warunków lokalnych', 'Ocena ukształtowania terenu, nasłonecznienia, dostępności miejsca montażu oraz możliwości prowadzenia tras kablowych.', 'szt.', '1'],
    ['', 'Dostarczenie i rozładunek systemu wsporczo-montażowego', 'Kompletny zestaw konstrukcyjny przeznaczony do montażu modułów fotowoltaicznych w układzie pionowym (2V).', 'kpl.', '1'],
    ['', 'Wytyczenie osi i rozmieszczenia konstrukcji', 'Wyznaczenie lokalizacji rzędów konstrukcyjnych z uwzględnieniem optymalnego kąta nachylenia i odstępów.', 'szt.', '1'],
    ['', 'Wykonanie fundamentów gruntowych', 'Zastosowanie stalowych pali fundamentowych (kotwionych mechanicznie) bez użycia betonu.', 'kpl.', '1'],
    ['', 'Montaż elementów nośnych konstrukcji', 'Instalacja słupów pionowych, poziomych profili prowadzących oraz systemów mocowania.', 'kpl.', '1'],
    ['', 'Montaż modułów fotowoltaicznych', 'Mocowanie paneli w układzie pionowym z zachowaniem odstępów dylatacyjnych i norm montażowych.', 'kpl.', '1'],
    ['', 'Wykonanie okablowania po stronie DC', 'Połączenie modułów w łańcuchy (stringi) przewodami odpornymi na warunki atmosferyczne.', 'kpl.', '1'],
    ['', 'Zabezpieczenie przewodów w osłonach mechanicznych', 'Prowadzenie tras kablowych w peszlach, rurach ochronnych lub kanałach, częściowo podziemnie.', 'kpl.', '1'],
    ['', 'Wprowadzenie przewodów DC do miejsca montażu falownika', 'Estetyczne i bezpieczne doprowadzenie przewodów DC do lokalizacji falownika.', 'szt.', '1'],
    ['', 'Montaż falownika w wyznaczonym miejscu', 'Instalacja falownika zgodnie z wymaganiami dot. wentylacji, dostępu serwisowego i ochrony IP.', 'szt.', '1'],
    ['', 'Wykonanie rozdzielnicy i zabezpieczeń DC', 'Montaż rozdzielnicy DC z zabezpieczeniami nadprądowymi, rozłącznikami i ogranicznikami przepięć.', 'kpl.', '1'],
    ['', 'Wykonanie układu uziemienia i połączeń wyrównawczych', 'Połączenia ochronne dla komponentów systemu zgodnie z normami PN-HD 60364 i PN-EN 62305.', 'kpl.', '1'],
    ['', 'Podłączenie po stronie prądu zmiennego (AC)', 'Poprowadzenie przewodów do instalacji wewnętrznej, montaż zabezpieczeń nadprądowych, RCD i przepięciowych.', 'kpl.', '1'],
    ['', 'Uruchomienie instalacji i pomiary kontrolne', 'Konfiguracja falownika, synchronizacja z siecią oraz wykonanie pomiarów elektrycznych.', 'szt.', '1'],
    ['', 'Test funkcjonalny systemu PV', 'Sprawdzenie pracy poszczególnych łańcuchów i analiza parametrów pod kątem zgodności z projektem.', 'szt.', '1'],
    ['', 'Wprowadzenie instalacji do systemu monitorowania', 'Rejestracja instalacji w systemie monitorującym i przekazanie dostępu użytkownikowi.', 'szt.', '1'],
    ['', 'Przygotowanie dokumentacji powykonawczej', 'Sporządzenie schematów podłączenia, protokołów pomiarowych i raportu uruchomienia.', 'kpl.', '1'],
    ['', 'Instruktaż dla użytkownika końcowego', 'Szkolenie z obsługi, zasad bezpieczeństwa oraz przekazanie informacji o gwarancji.', 'szt.', '1'],
    ['', 'Zgłoszenie mikroinstalacji do OSD', 'Przygotowanie i złożenie kompletnego wniosku o przyłączenie mikroinstalacji do sieci.', 'szt.', '1'],
    ['', 'Wsparcie w procesie pozyskania dofinansowania', 'Pomoc w przygotowaniu wniosku, np. w ramach programu „Mój Prąd”, przekazanie dokumentacji i zdjęć.', 'szt.', '1'],
];

// Zaktualizowana tabela dla magazynu energii
export const pvStorageScope = [
    ['', 'Weryfikacja możliwości podłączenia magazynu energii', 'Określenie trybu integracji systemu bateryjnego – bezpośrednio do falownika hybrydowego lub poprzez ładowarkę retrofit.', 'szt.', '1'],
    ['', 'Zestaw magazynowania energii DEYE SE-G5.1 Pro-B 5,11 kWh', 'Instalacja modułowego systemu akumulatorowego w technologii LiFePO₄. wraz z układem BMS zapewniający kontrolę, balans i ochronę ogniw przed przeciążeniem, zwarciem i głębokim rozładowaniem.', 'szt.', '1'], // Ilość będzie dynamicznie podmieniana
    ['', 'Weryfikacja warunków montażowych', 'Ocena miejsca montażu pod kątem przestrzeni, wentylacji, nośności i bezpieczeństwa.', 'szt.', '1'],
    ['', 'Transport i posadowienie systemu bateryjnego', 'Dostarczenie i ustawienie zestawu akumulatorowego w miejscu montażu zgodnie z wymogami.', 'szt.', '1'],
    ['', 'Montaż modułów i szafy bateryjnej', 'Instalacja modułów oraz połączeń energetycznych i komunikacyjnych zgodnie z zaleceniami producenta.', 'kpl.', '1'],
    ['', 'Podłączenie szyny komunikacyjnej', 'Zestawienie magistrali RS485 lub CAN między systemem bateryjnym a falownikiem/ładowarką.', 'szt.', '1'],
    ['', 'Podłączenie przewodów energetycznych (DC)', 'Podłączenie przewodów plus i minus do punktów przyłączeniowych z zachowaniem norm.', 'kpl.', '1'],
    ['', 'Montaż zabezpieczeń po stronie bateryjnej', 'Zastosowanie zabezpieczeń nadprądowych, rozłączników izolacyjnych i – jeśli wymagane – ograniczników przepięć w układzie DC.', 'kpl.', '1'],
    ['', 'Weryfikacja uziemienia układu bateryjnego', 'Sprawdzenie połączeń ochronnych i pomiar ciągłości przewodów PE.', 'szt.', '1'],
    ['', 'Konfiguracja parametrów systemu', 'Wprowadzenie ustawień dot. pojemności, limitów ładowania/rozładowania i trybów pracy.', 'szt.', '1'],
    ['', 'Test komunikacji i autodiagnostyki systemu', 'Sprawdzenie poprawności przesyłu danych między urządzeniami (SoC, napięcia, alarmy).', 'szt.', '1'],
    ['', 'Test działania systemu w trybach roboczych', 'Symulacja warunków pracy: ładowanie z PV, rozładowanie, reakcja na zanik napięcia z sieci.', 'szt.', '1'],
    ['', 'Integracja z systemem monitoringu', 'Rejestracja danych z magazynu energii w systemie monitorującym (jeśli dostępny).', 'szt.', '1'],
    ['', 'Pomiar parametrów instalacji bateryjnej', 'Pomiary napięć, prądów, rezystancji izolacji oraz kontrola połączeń.', 'szt.', '1'],
    ['', 'Dokumentacja montażowa i powykonawcza', 'Opracowanie dokumentacji technicznej: schematy, protokoły pomiarowe, konfiguracja.', 'kpl.', '1'],
    ['', 'Szkolenie użytkownika końcowego', 'Przekazanie instrukcji obsługi, omówienie trybów pracy i zasad bezpieczeństwa.', 'szt.', '1'],
    ['', 'Gwarancja i zdalna opieka serwisowa', 'Omówienie zasad gwarancji oraz możliwość zdalnej diagnostyki przez dział techniczny firmy.', 'kpl.', '1'],
    ['', 'Zgłoszenie lub aktualizacja systemu w OSD', 'Przygotowanie dokumentów niezbędnych do zgłoszenia lub aktualizacji instalacji w systemie Operatora Sieci.', 'szt.', '1'],
];

export const pvOfferCommons = {
  coverPage: '/pdf_templates/photovoltaics/common/PV_OKLADKA.pdf',
  contactPage: '/pdf_templates/common/5_kontakt.pdf',
};