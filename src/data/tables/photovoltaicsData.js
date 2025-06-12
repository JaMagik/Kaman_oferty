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
  'DEYE_HYBRID': {
    name: 'Falownik hybrydowy DEYE',
    brand: 'DEYE',
    isHybrid: true,
    description: 'Nowoczesny, trójfazowy inwerter hybrydowy z funkcją zasilania awaryjnego.',
    datasheets: [
      '/pdf_templates/photovoltaics/inverters/deye/DEYE_HYBRID_DS1.pdf',
      '/pdf_templates/photovoltaics/inverters/deye/DEYE_HYBRID_DS2.pdf',
    ]
  },
  'FOXESS_T_G3': {
    name: 'Falownik FOXESS Seria T (G3)',
    brand: 'FOXESS',
    isHybrid: false,
    description: 'Wysokowydajny, trójfazowy falownik sieciowy (on-grid).',
    datasheets: [
      '/pdf_templates/photovoltaics/inverters/foxess/FOXESS_T_G3_DS1.pdf',
      '/pdf_templates/photovoltaics/inverters/foxess/FOXESS_T_G3_DS2.pdf',
    ]
  },
  'SUNGROW_SG_RS': {
    name: 'Falownik hybrydowy SUNGROW Seria SG-SH RS',
    brand: 'SUNGROW',
    isHybrid: true,
    description: 'Zaawansowany inwerter hybrydowy, kompatybilny z magazynami energii.',
    datasheets: [
      '/pdf_templates/photovoltaics/inverters/sungrow/SUNGROW_SG_SH_RS_DS1.pdf',
    ]
  },
};

export const storageTypesData = {
  'DEYE_STORAGE_LV': {
    name: 'Magazyn energii DEYE LV Series',
    brand: 'DEYE',
    description: 'Niskonapięciowy system magazynowania energii oparty na technologii LiFePO4.',
    datasheets: [
      '/pdf_templates/photovoltaics/storage/deye/DEYE_STORAGE_LV_DS1.pdf',
    ]
  },
};

// NOWY, EKSPORTOWANY ELEMENT - tego brakowało
export const photovoltaicsBaseItems = [
    { name: 'Konstrukcja montażowa CORAB (lub równoważna)', quantity: 1, unit: 'kpl.' },
    { name: 'Okablowanie AC/DC, zabezpieczenia, uziemienie', quantity: 1, unit: 'kpl.' },
    { name: 'Montaż, uruchomienie, dokumentacja, zgłoszenie do OSD', quantity: 1, unit: 'kpl.' }
];

export const pvOfferCommons = {
  coverPage: '/pdf_templates/photovoltaics/common/PV_OKLADKA.pdf',
  contactPage: '/pdf_templates/common/5_kontakt.pdf',
};