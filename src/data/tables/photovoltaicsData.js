// ścieżka: src/data/tables/photovoltaicsData.js

export const panelTypesData = {
  'CANADIAN_SOLAR_460': { // Klucz identyfikujący panel
    name: 'Canadian Solar 460 Wp',
    power: 0.460, // Moc w kWp
    datasheets: [ // Tablica ścieżek do PDF-ów z kartami katalogowymi tego panelu
      '/pdf_templates/photovoltaics/panels/canadian_solar_460/CS_460_DS1.pdf',
      // Możesz dodać więcej, jeśli karta ma wiele stron lub są różne dokumenty
       '/pdf_templates/photovoltaics/panels/canadian_solar_460/CS_460_DS2.pdf',
    ]
  },
  // W przyszłości możesz dodać inne typy paneli:
  // 'JINKO_475': { name: 'JINKO Solar 475 Wp', power: 0.475, datasheets: ['...'] },
};

export const inverterTypesData = {
  'FOXESS_T_G3': { // Klucz identyfikujący falownik
    name: 'Falownik FOXESS Seria T (G3)',
    brand: 'FOXESS',
    // Możesz dodać inne specyficzne właściwości, jeśli potrzebne
    datasheets: [
      '/pdf_templates/photovoltaics/inverters/foxess/FOXESS_T_G3_DS1.pdf',
     '/pdf_templates/photovoltaics/inverters/foxess/FOXESS_T_G3_DS2.pdf',
    ]
  },
  'SUNGROW_SG_RS': {
    name: 'Falownik hybrydowy SUNGROW Seria SG-SH RS',
    brand: 'SUNGROW',
    isHybrid: true,
    datasheets: [
      '/pdf_templates/photovoltaics/inverters/sungrow/SUNGROW_SG_SH_RS_DS1.pdf',
    ]
  },
  'DEYE_HYBRID': {
    name: 'Falownik hybrydowy DEYE',
    brand: 'DEYE',
    isHybrid: true,
    datasheets: [
      '/pdf_templates/photovoltaics/inverters/deye/DEYE_HYBRID_DS1.pdf',
      '/pdf_templates/photovoltaics/inverters/deye/DEYE_HYBRID_DS2.pdf',

    ]
  },
  // Dodaj inne modele falowników, jeśli potrzebujesz
};

export const storageTypesData = {
  'DEYE_STORAGE_LV': { // Klucz identyfikujący magazyn
    name: 'Magazyn energii DEYE LV Series',
    brand: 'DEYE',
    // Pojemność itp. może być wybierana w formularzu lub predefiniowana
    datasheets: [
      '/pdf_templates/photovoltaics/storage/deye/DEYE_STORAGE_LV_DS1.pdf',
    ]
  },
  // W przyszłości inne magazyny
};

// Ścieżki do ogólnych plików PDF dla ofert PV
export const pvOfferCommons = {
  coverPage: '/pdf_templates/photovoltaics/common/PV_OKLADKA.pdf', // Twoja główna okładka PV
  // Możesz dodać stronę z ogólnymi opcjami dodatkowymi dla PV, jeśli taka istnieje
  // optionsPage: '/pdf_templates/photovoltaics/common/PV_OPCJE_DODATKOWE.pdf',
  contactPage: '/pdf_templates/common/5_kontakt.pdf', // Wspólna strona kontaktowa
  // lastPage: '/pdf_templates/photovoltaics/common/PV_PODSUMOWANIE.pdf', // Jakaś ogólna strona końcowa
};