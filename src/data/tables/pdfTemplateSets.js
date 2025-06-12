// ścieżka: src/data/tables/pdfTemplateSets.js

/**
 * UWAGA:
 * Poniższe ścieżki to propozycja struktury folderów. Musisz stworzyć te foldery
 * wewnątrz `public/pdf_templates/` i umieścić w nich odpowiednie pliki PDF.
 * Nazwy plików (1_okladka.pdf, 3_katalog.pdf, itd.) są również sugerowane dla zachowania spójności.
 * Strona z ceną i tabelą (strona nr 2) jest generowana dynamicznie i nie wymaga szablonu.
 */

// Centralna ścieżka do wspólnego pliku kontaktowego, aby unikać duplikacji.
const commonContactPage = '/pdf_templates/common/5_kontakt.pdf';
const groupPage = '/pdf_templates/common/7_grupa_kaman_pdf.pdf';
const groupPage2 = '/pdf_templates/common/8_grupa_kaman_uslugi_pdf.pdf';
const oNas = '/pdf_templates/common/O_grupie.pdf';





// Domyślny zestaw szablonów, jeśli żaden inny nie pasuje (np. dla nowo dodanej opcji w formularzu)
const defaultTemplatePaths = [
  '/pdf_templates/common/1_okladka.pdf',
  '/pdf_templates/common/3_katalog_PUZ.pdf',
  '/pdf_templates/common/4_opcje.pdf',
  commonContactPage,
];

export const pdfTemplateSets = {
  // --- MITSUBISHI (Pompy Ciepła) ---
  'Mitsubishi-cylinder': [
    '/pdf_templates/mitsubishi/standard-cylinder/1_okladka.pdf',
 
     '/pdf_templates/mitsubishi/standard-cylinder/3.1_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/standard-cylinder/3.2_wewnetrzna_zubadan_ds.pdf',
     '/pdf_templates/mitsubishi/standard-cylinder/3.3_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/standard-cylinder/4.1_cylinder_standard.pdf',
    '/pdf_templates/mitsubishi/standard-cylinder/4.2_cylinder_standard.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Mitsubishi-cylinder-PUZ': [
    '/pdf_templates/mitsubishi/zubadan-cylinder/1_okladka.pdf',
          
    '/pdf_templates/mitsubishi/zubadan-cylinder/3_katalog_PUZ-1.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder/3_katalog_PUZ-2.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Mitsubishi-cylinder-PUZ-1F': [
    '/pdf_templates/mitsubishi/zubadan-cylinder-1f/1_okladka.pdf',
      
   '/pdf_templates/mitsubishi/zubadan-cylinder/3_katalog_PUZ-1.pdf',
    '/pdf_templates/mitsubishi/zubadan-cylinder/3_katalog_PUZ-2.pdf',
        oNas,
          groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Mitsubishi-hydrobox': [
    '/pdf_templates/mitsubishi/standard-hydrobox/1_okladka.pdf',
   
      '/pdf_templates/mitsubishi/standard-hydrobox/3.1_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/standard-hydrobox/3.2_wewnetrzna_zubadan_ds.pdf',
     '/pdf_templates/mitsubishi/standard-hydrobox/3.3_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/standard-hydrobox/3.1_wewnetrzna_hydrobox_ds.pdf',
    '/pdf_templates/mitsubishi/standard-hydrobox/3.2_wewnetrzna_hydrobox_ds.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Mitsubishi-hydrobox-PUZ': [
    '/pdf_templates/mitsubishi/zubadan-hydrobox/1_okladka.pdf',
       

    '/pdf_templates/mitsubishi/zubadan-hydrobox/3_katalog_PUZ-1.pdf',
    '/pdf_templates/mitsubishi/zubadan-hydrobox/3_katalog_PUZ-2.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Mitsubishi-hydrobox-PUZ-1F': [
    '/pdf_templates/mitsubishi/zubadan-hydrobox-1f/1_okladka.pdf',
      

    '/pdf_templates/mitsubishi/zubadan-hydrobox-1f/3_katalog_PUZ-1.pdf',
    '/pdf_templates/mitsubishi/zubadan-hydrobox-1f/3_katalog_PUZ-2.pdf',
      oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Mitsubishi-ecoinverter': [
    '/pdf_templates/mitsubishi/ecoinverter-cylinder/1_okladka.pdf',
  

    '/pdf_templates/mitsubishi/ecoinverter-cylinder/3.1_ecoinverter_zewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-cylinder/3.2_ecoinverter_zewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-cylinder/3.3_ecoinverter_wewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-cylinder/3.4_ecoinverter_wewnetrzna.pdf',
       oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Mitsubishi-ecoinverter-hydrobox': [
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/1_okladka.pdf',
       
        '/pdf_templates/mitsubishi/standard-cylinder/3.1_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/standard-cylinder/3.2_wewnetrzna_zubadan_ds.pdf',
     '/pdf_templates/mitsubishi/standard-cylinder/3.3_wewnetrzna_zubadan_ds.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/3.1_ecoinverter_zewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/3.2_ecoinverter_zewnetrzna.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Mitsubishi-hp': [
    '/pdf_templates/mitsubishi/hyper-heating/1_okladka.pdf',
  
    '/pdf_templates/mitsubishi/hyper-heating/2_opcje_dodatkowe.pdf',
    '/pdf_templates/mitsubishi/hyper-heating/3_katalog.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],

  // --- MITSUBISHI (Klimatyzatory) ---
  'MITSUBISHI AY': [
    '/pdf_templates/mitsubishi-klima/ay/1_okladka.pdf',
    '/pdf_templates/mitsubishi-klima/ay/3_katalog.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'MITSUBISHI HR': [
    '/pdf_templates/mitsubishi-klima/hr/1_okladka.pdf',
    '/pdf_templates/mitsubishi-klima/hr/3_katalog.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  
  // --- TOSHIBA ---
  'Toshiba 3F': [
    '/pdf_templates/toshiba/3-fazowe/1_okladka.pdf',
    '/pdf_templates/toshiba/3-fazowe/3_katalog.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Toshiba 1F': [
    '/pdf_templates/Toshiba/1-fazowe/1_okladka.pdf',
  
    '/pdf_templates/Toshiba/1-fazowe/karta_katalogowa_toshiba_1.pdf',
    '/pdf_templates/Toshiba/1-fazowe/karta_katalogowa_toshiba_2.pdf',
        '/pdf_templates/Toshiba/1-fazowe/karta_katalogowa_toshiba_3.pdf',
            '/pdf_templates/Toshiba/1-fazowe/karta_katalogowa_toshiba_4.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],

  // --- ATLANTIC ---
  'ATLANTIC': [ // Atlantic Extensa AI Duo
    '/pdf_templates/atlantic/extensa-ai-duo/1_okladka.pdf',
    '/pdf_templates/atlantic/extensa-ai-duo/3_katalog.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'ATLANTIC-HYDROBOX': [ // Atlantic Excelia AI Hydrobox
    '/pdf_templates/atlantic/excelia-ai-hydrobox/1_okladka.pdf',
    '/pdf_templates/atlantic/excelia-ai-hydrobox/3_katalog.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'ATLANTIC-M-DUO': [ // Atlantic M-Duo
    
    '/pdf_templates/atlantic/s-tri-duo/1_okladka.pdf',
    '/pdf_templates/atlantic/s-duo/3.1_atlantic_s_duo.pdf',
    '/pdf_templates/atlantic/s-duo/3.2_atlantic_s_duo.pdf',
     oNas,
     groupPage,
    groupPage2,
    commonContactPage,
  ],
  'ATLANTIC-EXCELIA': [ // Atlantic M-Duo
    
    '/pdf_templates/atlantic/excelia-tri/1_okladka.pdf',
    '/pdf_templates/atlantic/excelia-tri/3.1_atlantic_excelia_tri.pdf',
    '/pdf_templates/atlantic/excelia-tri/3.2_atlantic_excelia_tri.pdf',
     oNas,
     groupPage,
    groupPage2,
    commonContactPage,
  ],
  'ATLANTIC-S': [ // Atlantic M-Duo
   '/pdf_templates/atlantic/s-duo/1_okladka.pdf',
    '/pdf_templates/atlantic/s-tri-duo/3.1_atlantic_s_duo.pdf',
    '/pdf_templates/atlantic/s-tri-duo/3.2_atlantic_s_duo.pdf',
        oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],

  // --- VIESSMANN ---
  'VIESSMANN': [ // Viessmann Vitocal 150-A
    '/pdf_templates/viessmann/1_okladka.pdf',
        '/pdf_templates/viessmann/viessman.ds1.pdf',
    '/pdf_templates/viessmann/viessman.ds2.pdf',
    '/pdf_templates/viessmann/viessman.ds3.pdf',

     oNas,
    '/pdf_templates/viessmann/3_katalog.pdf',
      groupPage,
    groupPage2,
    commonContactPage,
  ],



  // --- NIBE ---
  'NIBE12': [ // NIBE F1245 (Gruntowa)
    '/pdf_templates/nibe/f1245-gruntowa/1_okladka.pdf',
    '/pdf_templates/nibe/f1245-gruntowa/3_katalog.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],

  // --- KOTŁY NA PELLET ---
  'LAZAR': [
    '/pdf_templates/kotly-pellet/lazar/1_okladka.pdf',
    
     '/pdf_templates/kotly-pellet/lazar/lazar.ds1.pdf',
     '/pdf_templates/kotly-pellet/lazar/lazar.ds2.pdf',
     '/pdf_templates/kotly-pellet/lazar/lazar.ds3.pdf',
     oNas,
          groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Kotlospaw Slimko Plus': [
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus/1_okladka.pdf',
  
    
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus/slimko_plus_karta_katalogowa_1.pdf',
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus/slimko_plus_karta_katalogowa_2.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Kotlospaw slimko plus niski': [
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus-niski/1_okladka.pdf',

 
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus-niski/slimko_plus_karta_katalogowa_1.pdf',
    '/pdf_templates/kotly-pellet/kotlospaw-slimko-plus-niski/slimko_plus_karta_katalogowa_2.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'QMPELL': [
    '/pdf_templates/kotly-pellet/qmpell-evo/1_okladka.pdf',
    
    '/pdf_templates/kotly-pellet/qmpell-evo/karta_katalogowa_qmpell1.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],

  // --- KOTŁY HYBRYDOWE ---
  'Kotlospaw drewko hybrid': [
    '/pdf_templates/kotly-pellet/kotlospaw-drewko-hybrid/1_okladka.pdf',


    '/pdf_templates/kotly-pellet/kotlospaw-drewko-hybrid/kotlospaw_drewko_plus_ds1.pdf',
    '/pdf_templates/kotly-pellet/kotlospaw-drewko-hybrid/kotlospaw_drewko_plus_ds2.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Kotlospaw drewko plus': [
    '/pdf_templates/kotly-pellet/kotlospaw-drewko-plus/1_okladka.pdf',

'/pdf_templates/kotly-pellet/kotlospaw-drewko-plus/kotlospaw_drewko_plus_ds1.pdf',
    '/pdf_templates/kotly-pellet/kotlospaw-drewko-plus/kotlospaw_drewko_plus_ds2.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  
  
  'Kaisai': [
    '/pdf_templates/kaisai/1_okladka.pdf',

    '/pdf_templates/kaisai/karta_produktu_kaisai_1.pdf',
    '/pdf_templates/kaisai/karta_produktu_kaisai_2.pdf',

     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],

};

export function getTemplatePathsForDevice(deviceType) {
  // Zwraca zdefiniowany zestaw ścieżek lub domyślny, jeśli klucz nie zostanie znaleziony
  return pdfTemplateSets[deviceType] || defaultTemplatePaths;
}