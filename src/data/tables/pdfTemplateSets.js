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
const groupPage = '/pdf_templates/common/8_grupa_kaman_uslugi_pdf.pdf';
const groupPage2 = '/pdf_templates/common/7_grupa_kaman_pdf.pdf';
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

  'DIAMOND': [
    '/pdf_templates/diamond/1_okladka_grzejniki.pdf',
    '/pdf_templates/diamond/2_katalog_diamond_stalowe.pdf',
    '/pdf_templates/diamond/3_katalog_diamond_aluminiowe.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
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
    '/pdf_templates/mitsubishi/zubadan-hydrobox/1_okladka.pdf',
      

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
       
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/3.1_ecoinverter_zewnetrzna.pdf',
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/3.2_ecoinverter_zewnetrzna.pdf',
        '/pdf_templates/mitsubishi/ecoinverter-hydrobox/3.3_ecoinverter_wewnetrzna.pdf',

     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'Mitsubishi-hp': [
    '/pdf_templates/mitsubishi/ecoinverter-hydrobox/1_okladka.pdf',
    '/pdf_templates/mitsubishi/hyper-heating/2_hyper_heating_ds.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'MITSUBISHI AY': [
        '/pdf_templates/mitsubishi/ay/1_okladka.pdf',
    '/pdf_templates/mitsubishi/ay/ay_datasheet_1.pdf',
    '/pdf_templates/mitsubishi/ay/ay_datasheet_2.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'MITSUBISHI HR': [
    '/pdf_templates/mitsubishi/hr/1_okladka.pdf',
    '/pdf_templates/mitsubishi/hr/karta-katalogowa-mitsubishi-hr.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  
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

  'ATLANTIC': [ 
    '/pdf_templates/atlantic/extensa-ai-duo/1_okladka.pdf',
    '/pdf_templates/atlantic/extensa-ai-duo/3_katalog.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'ATLANTIC-HYDROBOX': [ 
    '/pdf_templates/atlantic/excelia-ai-hydrobox/1_okladka.pdf',
    '/pdf_templates/atlantic/excelia-ai-hydrobox/3_katalog.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'ATLANTIC-EXTENSA': [ 
    '/pdf_templates/atlantic/extensa-hydrobox/1_okladka.pdf',
    '/pdf_templates/atlantic/extensa-hydrobox/atlantic_extensa_hydrobox.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'ATLANTIC-EXTENSA-S': [
    '/pdf_templates/atlantic/extensa-s/1_okladka.pdf',
    '/pdf_templates/atlantic/extensa-s/atlantic_extensa_s_katalog.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'ATLANTIC-EXTENSA-S-DUO': [
    '/pdf_templates/atlantic/extensa-s-duo/1_okladka.pdf',
    '/pdf_templates/atlantic/extensa-s-duo/atlantic_extensa_s_duo_katalog.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
   'ATLANTIC-EXTENSA-CYLINDER': [ 
    '/pdf_templates/atlantic/extensa-cylinder/1_okladka.pdf',
    '/pdf_templates/atlantic/extensa-cylinder/EXTENSA-AI-DUO-R32-KARTA-KATALOGOWA-1.pdf',
    '/pdf_templates/atlantic/extensa-cylinder/EXTENSA-AI-DUO-R32-KARTA-KATALOGOWA-2.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],
  'ATLANTIC-M-DUO': [ 
    
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
  'NIBE F2120': [
    '/pdf_templates/nibe/f2120/1_okladka.pdf',
    '/pdf_templates/nibe/f2120/3_katalog_f2120.pdf',
  
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'NIBE12': [ // NIBE F1245 (Gruntowa)
    '/pdf_templates/nibe/f1245-gruntowa/1_okladka.pdf',
    '/pdf_templates/nibe/f1245-gruntowa/3_katalog.pdf',
     oNas,
      groupPage,
    groupPage2,
    commonContactPage,
  ],

  // --- KOTŁY NA PELLET ---
  'LAZAR SmartFire': [
    '/pdf_templates/kotly-pellet/lazar/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/lazar/lazar.ds1.pdf',
    '/pdf_templates/kotly-pellet/lazar/lazar.ds2.pdf',
    '/pdf_templates/kotly-pellet/lazar/lazar.ds3.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'LAZAR-EXCLUSIVE': [
    '/pdf_templates/kotly-pellet/lazar/lazar.exclusive.1.pdf',
    '/pdf_templates/kotly-pellet/lazar/lazar.ds1.pdf',
    '/pdf_templates/kotly-pellet/lazar/lazar.ds2.pdf',
    '/pdf_templates/kotly-pellet/lazar/lazar.ds3.pdf',
    '/pdf_templates/kotly-pellet/lazar/lazar.exclusive.2.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'LAZAR DSPELL': [
    '/pdf_templates/kotly-pellet/lazar-dspell/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/lazar-dspell/lazar_dspell_ds.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'LAZAR DS': [
    '/pdf_templates/kotly-pellet/lazar-ds/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/lazar-ds/lazar_ds_karta_katalogowa.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'LAZAR PelletFOCUS': [
    '/pdf_templates/kotly-pellet/lazar-pelletfocus/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/lazar-pelletfocus/lazar_pelletfocus_ds.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'Viessmann Easypell': [
    '/pdf_templates/kotly-pellet/viessmann-easypell/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/viessmann-easypell/2_katalog.pdf',
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
  'Kotlospaw In-pell': [
    '/pdf_templates/kotly-pellet/kotlospaw-in-pell/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/kotlospaw-in-pell/ulotka_in_pell.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
   'Kotlospaw duoko': [
    '/pdf_templates/kotly-pellet/kotlospaw-duoko/1_okladka.pdf',
    '/pdf_templates/kotly-pellet/kotlospaw-duoko/kotlospaw_duoko_ds1.pdf',
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
 'QMPELL': {
    // Definicja dla konkretnej mocy 8 kW
    '8 kW': [
      '/pdf_templates/kotly-pellet/qmpell-evo/1_okladka_standard.pdf', // <- Nowa, dedykowana okładka
      '/pdf_templates/kotly-pellet/qmpell-evo/karta_katalogowa_qmpell1.pdf',
            '/pdf_templates/kotly-pellet/qmpell-evo/karta_katalogowa_qmpell2.pdf',

      oNas,
      groupPage,
      groupPage2,
      commonContactPage,
    ],
    // Domyślny zestaw dla pozostałych mocy (12 kW, 18 kW itd.)
    'default': [
      '/pdf_templates/kotly-pellet/qmpell-evo/1_okladka_8kW.pdf', // <- Okładka dla reszty
      '/pdf_templates/kotly-pellet/qmpell-evo/karta_katalogowa_qmpell1.pdf',
            '/pdf_templates/kotly-pellet/qmpell-evo/karta_katalogowa_qmpell2.pdf',

      oNas,
      groupPage,
      groupPage2,
      commonContactPage,
    ]
},

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

  'Panasonic-HP-cylinder-1f': [
    '/pdf_templates/Panasonic/Seria-HP-cylinder-1f/1_okladka.pdf',
    '/pdf_templates/Panasonic/Seria-HP-cylinder-1f/Ulotka Panasonic Aquarea serii K-1.pdf',
    '/pdf_templates/Panasonic/Seria-HP-cylinder-1f/Ulotka Panasonic Aquarea serii K-2.pdf',
    '/pdf_templates/Panasonic/Seria-HP-cylinder-1f/Ulotka Panasonic Aquarea serii K-3.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'Panasonic-HP-cylinder-3f': [
    '/pdf_templates/Panasonic/Seria-HP-cylinder-3f/1_okladka.pdf',
    '/pdf_templates/Panasonic/Seria-HP-cylinder-3f/Ulotka Panasonic Aquarea serii K-1.pdf',
    '/pdf_templates/Panasonic/Seria-HP-cylinder-3f/Ulotka Panasonic Aquarea serii K-2.pdf',
    '/pdf_templates/Panasonic/Seria-HP-cylinder-3f/Ulotka Panasonic Aquarea serii K-3.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'Panasonic-HP-hydrobox-1f': [
    '/pdf_templates/Panasonic/Seria-HP-hydrobox-1f/1_okladka.pdf',
    '/pdf_templates/Panasonic/Seria-HP-hydrobox-1f/Ulotka Panasonic Aquarea serii K-1.pdf',
    '/pdf_templates/Panasonic/Seria-HP-hydrobox-1f/Ulotka Panasonic Aquarea serii K-2.pdf',
    '/pdf_templates/Panasonic/Seria-HP-hydrobox-1f/Ulotka Panasonic Aquarea serii K-3.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'Panasonic-HP-hydrobox-3f': [
    '/pdf_templates/Panasonic/Seria-HP-hydrobox-3f/1_okladka.pdf',
    '/pdf_templates/Panasonic/Seria-HP-hydrobox-3f/Ulotka Panasonic Aquarea serii K-1.pdf',
    '/pdf_templates/Panasonic/Seria-HP-hydrobox-3f/Ulotka Panasonic Aquarea serii K-2.pdf',
    '/pdf_templates/Panasonic/Seria-HP-hydrobox-3f/Ulotka Panasonic Aquarea serii K-3.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'Panasonic-K-cylinder-1f': [
    '/pdf_templates/Panasonic/Seria-K-cylinder-1f/1_okladka.pdf',
    '/pdf_templates/Panasonic/Seria-K-cylinder-1f/Ulotka Panasonic Aquarea serii K-1.pdf',
    '/pdf_templates/Panasonic/Seria-K-cylinder-1f/Ulotka Panasonic Aquarea serii K-2.pdf',
    '/pdf_templates/Panasonic/Seria-K-cylinder-1f/Ulotka Panasonic Aquarea serii K-3.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'Panasonic-K-cylinder-3f': [
    '/pdf_templates/Panasonic/Seria-K-cylinder-3f/1_okladka.pdf',
    '/pdf_templates/Panasonic/Seria-K-cylinder-3f/Ulotka Panasonic Aquarea serii K-1.pdf',
    '/pdf_templates/Panasonic/Seria-K-cylinder-3f/Ulotka Panasonic Aquarea serii K-2.pdf',
    '/pdf_templates/Panasonic/Seria-K-cylinder-3f/Ulotka Panasonic Aquarea serii K-3.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'Panasonic-K-hydrobox-1f': [
    '/pdf_templates/Panasonic/Seria-K-hydrobox-1f/1_okladka.pdf',
    '/pdf_templates/Panasonic/Seria-K-hydrobox-1f/Ulotka Panasonic Aquarea serii K-1.pdf',
    '/pdf_templates/Panasonic/Seria-K-hydrobox-1f/Ulotka Panasonic Aquarea serii K-2.pdf',
    '/pdf_templates/Panasonic/Seria-K-hydrobox-1f/Ulotka Panasonic Aquarea serii K-3.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

  'Panasonic-K-hydrobox-3f': [
    '/pdf_templates/Panasonic/Seria-K-hydrobox-3f/1_okladka.pdf',
    '/pdf_templates/Panasonic/Seria-K-hydrobox-3f/Ulotka Panasonic Aquarea serii K-1.pdf',
    '/pdf_templates/Panasonic/Seria-K-hydrobox-3f/Ulotka Panasonic Aquarea serii K-2.pdf',
    '/pdf_templates/Panasonic/Seria-K-hydrobox-3f/Ulotka Panasonic Aquarea serii K-3.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],

   'VIVAX Y-Design': [
    '/pdf_templates/vivax/1_okladka_y_design.pdf',
    '/pdf_templates/vivax/Karta katalogowa Y-Design-1.pdf', // Twoja karta 
        '/pdf_templates/vivax/Karta katalogowa Y-Design-1.pdf', // Twoja karta

    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'VIVAX H-Design': [
    '/pdf_templates/vivax/1_okladka_h_design.pdf',
    '/pdf_templates/vivax/Karta katalogowa H-Design-1.pdf',
        '/pdf_templates/vivax/Karta katalogowa H-Design-2.pdf',

    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'VIVAX Q-Design': [
    '/pdf_templates/vivax/1_okladka_q_design.pdf',
    '/pdf_templates/vivax/Karta katalogowa Q-Design-1.pdf',
        '/pdf_templates/vivax/Karta katalogowa Q-Design-2.pdf',

    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'VIVAX M-Design': [
    '/pdf_templates/vivax/1_okladka_M_design.pdf',
    '/pdf_templates/vivax/Karta katalogowa M-Design.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'AERIS_350': [
    '/pdf_templates/recuperation/aeris/1_okladka.pdf',
        '/pdf_templates/recuperation/aeris/Aeris_ds1.pdf',
    '/pdf_templates/recuperation/aeris/Aeris_ds2.pdf',
      oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'AERIS_450': [
     '/pdf_templates/recuperation/aeris/1_okladka.pdf',
        '/pdf_templates/recuperation/aeris/Aeris_ds1.pdf',
    '/pdf_templates/recuperation/aeris/Aeris_ds2.pdf',
      oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'AERIS_600': [
    '/pdf_templates/recuperation/aeris/1_okladka.pdf',
        '/pdf_templates/recuperation/aeris/Aeris_ds1.pdf',
    '/pdf_templates/recuperation/aeris/Aeris_ds2.pdf',

    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'EXPRE_XV_300': [
    '/pdf_templates/recuperation/expre-xv/1_okladka.pdf', // Okladka
    '/pdf_templates/recuperation/expre-xv/expre_xv_ds1.pdf', // Karta katalogowa
    '/pdf_templates/recuperation/expre-xv/expre_xv_ds2.pdf', // Karta katalogowa
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'EXPRE_XV_450': [
    '/pdf_templates/recuperation/expre-xv/1_okladka.pdf',
    '/pdf_templates/recuperation/expre-xv/expre_xv_ds1.pdf',
    '/pdf_templates/recuperation/expre-xv/expre_xv_ds2.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'EXPRE_XV_600': [
    '/pdf_templates/recuperation/expre-xv/1_okladka.pdf',
    '/pdf_templates/recuperation/expre-xv/expre_xv_ds1.pdf',
    '/pdf_templates/recuperation/expre-xv/expre_xv_ds2.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'THESSLAGREEN_AIRPACK_500V': [
    '/pdf_templates/recuperation/thesslagreen/1_okladka.pdf', // Okladka
    '/pdf_templates/recuperation/thesslagreen/airpack_500v_ds1.pdf', // Karta katalogowa
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'DOMEKT_R450VC6M': [
    '/pdf_templates/recuperation/domekt/1_okladka.pdf', // Okladka
    '/pdf_templates/recuperation/domekt/r450vc6m_ds1.pdf', // Karta katalogowa
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'DOMEKT_R350': [
    '/pdf_templates/recuperation/domekt/1_okladka.pdf',
    '/pdf_templates/recuperation/domekt/r350_ds1.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'DOMEKT_R400': [
    '/pdf_templates/recuperation/domekt/1_okladka.pdf',
    '/pdf_templates/recuperation/domekt/r400_ds1.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'DOMEKT_R600': [
    '/pdf_templates/recuperation/domekt/1_okladka.pdf',
    '/pdf_templates/recuperation/domekt/r600_ds1.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'VUTR_VEC_280_V_EC': [
    '/pdf_templates/recuperation/vutr-vec/1_okladka.pdf', // Okladka
    '/pdf_templates/recuperation/vutr-vec/vutr_vec_ds1.pdf', // Karta katalogowa
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'VUTR_VEC_280_VE_EC': [
    '/pdf_templates/recuperation/vutr-vec/1_okladka.pdf',
    '/pdf_templates/recuperation/vutr-vec/vutr_vec_ds1.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'VUTR_VEC_400_V_EC': [
    '/pdf_templates/recuperation/vutr-vec/1_okladka.pdf',
    '/pdf_templates/recuperation/vutr-vec/vutr_vec_ds1.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'VUTR_VEC_400_VE_EC': [
    '/pdf_templates/recuperation/vutr-vec/1_okladka.pdf',
    '/pdf_templates/recuperation/vutr-vec/vutr_vec_ds1.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'VUTR_VEC_600_V_EC': [
    '/pdf_templates/recuperation/vutr-vec/1_okladka.pdf',
    '/pdf_templates/recuperation/vutr-vec/vutr_vec_ds1.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'VUTR_VEC_600_VE_EC': [
    '/pdf_templates/recuperation/vutr-vec/1_okladka.pdf',
    '/pdf_templates/recuperation/vutr-vec/vutr_vec_ds1.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'DRAFTON_PRO_225': [
   '/pdf_templates/recuperation/drafton/1_okladka.pdf',
    '/pdf_templates/recuperation/drafton/ds_drafton_1.pdf',
    '/pdf_templates/recuperation/drafton/ds_drafton_2.pdf',
   oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'DRAFTON_PRO_325': [
    '/pdf_templates/recuperation/drafton/1_okladka.pdf',
    '/pdf_templates/recuperation/drafton/ds_drafton_1.pdf',
    '/pdf_templates/recuperation/drafton/ds_drafton_2.pdf',
   oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'DRAFTON_PRO_450': [
    '/pdf_templates/recuperation/drafton/1_okladka.pdf',
    '/pdf_templates/recuperation/drafton/ds_drafton_1.pdf',
    '/pdf_templates/recuperation/drafton/ds_drafton_2.pdf',
   oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'DRAFTON_PRO_600': [
    '/pdf_templates/recuperation/drafton/1_okladka.pdf',
    '/pdf_templates/recuperation/drafton/ds_drafton_1.pdf',
    '/pdf_templates/recuperation/drafton/ds_drafton_2.pdf',
   oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
   'PRANA_ORIGAMI_150': [
    '/pdf_templates/recuperation/prana/1_okladka.pdf', // Można podmienić na dedykowaną okładkę Prana
    '/pdf_templates/recuperation/prana/Katalog-produktow-prana-1.pdf',
        '/pdf_templates/recuperation/prana/Katalog-produktow-prana-2.pdf', // Przykładowa karta
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'PRANA_ORIGAMI_200G': [
    '/pdf_templates/recuperation/prana/1_okladka.pdf', // Można podmienić na dedykowaną okładkę Prana
    '/pdf_templates/recuperation/prana/Katalog-produktow-prana-1.pdf',
        '/pdf_templates/recuperation/prana/Katalog-produktow-prana-2.pdf', // Przykładowa karta
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  'PRANA_ORIGAMI_200C': [
    '/pdf_templates/recuperation/prana/1_okladka.pdf', // Można podmienić na dedykowaną okładkę Prana
    '/pdf_templates/recuperation/prana/Katalog-produktow-prana-1.pdf',
        '/pdf_templates/recuperation/prana/Katalog-produktow-prana-2.pdf', // Przykładowa karta
 // Przykładowa karta
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  
  'VIVAX N-Design': [
    '/pdf_templates/vivax/1_okladka_n_design.pdf',
    '/pdf_templates/vivax/Karta katalogowa N-Design-1.pdf',
    '/pdf_templates/vivax/Karta katalogowa N-Design-2.pdf',

    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
  custom: [
    '/pdf_templates/recuperation/ogolny_rekuperacja.pdf',
    oNas,
    groupPage,
    groupPage2,
    commonContactPage,
  ],
};


export function getTemplatePathsForDevice(deviceType, model) {
  const templateSet = pdfTemplateSets[deviceType];

  // Jeśli dla danego urządzenia zdefiniowano zestawy zależne od modelu (jest to obiekt)
  if (templateSet && typeof templateSet === 'object' && !Array.isArray(templateSet)) {
    // Zwróć zestaw dla konkretnego modelu lub zestaw domyślny ('default')
    return templateSet[model] || templateSet['default'] || defaultTemplatePaths;
  }

  // W przeciwnym razie zwróć standardowy zestaw (który jest tablicą) lub ogólny domyślny
  return templateSet || defaultTemplatePaths;
}
