// sciezka: src/data/tables/nibeTables.js

// --- NIBE F2120 (Monoblok) ---

const nibeF2120BaseTable = [
  ['1', 'Pompa ciepla - monoblok 12 kW (NIBE F2120-12)', 'szt.', '1', 'NIBE F2120-12 | Monoblok | 12,0 kW, 400V | R410A. Wysokosprawna powietrzna pompa ciepla do ogrzewania i przygotowania CWU.'],
  ['2', 'Pompa obiegowa CO KAMAN PRO', 'szt.', '1', 'Zapewnia prawidlowy obieg czynnika grzewczego w instalacji.'],
  ['3', 'Komplet elementow hydraulicznych', 'kpl.', '1', 'Zawory kulowe, zawory zwrotne, odpowietrzniki automatyczne, filtry, trojniki, ksztaltki, nyple, redukcje oraz pozostala armatura niezbedna do wykonania instalacji wodnej.'],
  ['4', 'Komplet elementow elektrycznych', 'kpl.', '1', 'Okablowanie, bezpieczniki, zabezpieczenia roznicowopradowe i nadpradowe, rozdzielnia - wszystko zgodnie z wymaganiami producenta dla bezpiecznego dzialania ukladu.'],
  ['5', 'Grupa bezpieczenstwa C.O.', 'kpl.', '1', 'Zawiera zawor bezpieczenstwa, odpowietrznik automatyczny oraz manometr - do zabezpieczenia ukladu grzewczego przed nadcisnieniem.'],
  ['6', 'Grupa bezpieczenstwa CWU (6 bar)', 'szt.', '1', 'Zawiera zawor bezpieczenstwa 6 bar, zawor zwrotny oraz manometr - do zabezpieczenia zasobnika cieplej wody.'],
  ['7', 'Rury miedziane chlodnicze z izolacja', 'kpl.', '1', 'Polaczenia pomiedzy jednostka zewnetrzna a wewnetrzna, wykonane z rur miedzianych w trwalej izolacji odpornej na UV.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Otuliny z pianki technicznej chroniace przewody wodne przed wychladzaniem.'],
  ['9', 'Stojak lub wieszak pod jednostke zewnetrzna', 'szt.', '1', 'Konstrukcja wsporcza ze stali nierdzewnej, dobierana indywidualnie do miejsca montazu oraz modelu pompy ciepla.'],
  ['10', 'Podlaczenie do istniejacej instalacji C.O. i CWU', 'kpl.', '1', 'Wpiecie zgodnie z wytycznymi producenta i dokumentacja DTR, aby system pracowal bez zarzutu.'],
  ['11', 'Dokumentacja powykonawcza i protokoly odbioru', 'kpl.', '1', 'Komplet dokumentow do zgloszenia instalacji oraz rozliczenia dotacji.'],
  ['12', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie w przygotowaniu wniosku i dokumentow do programu "Czyste Powietrze".', 'common'],
  ['13', 'Gwarancja i serwis', 'kpl.', '1', 'Pompa ciepla objeta 5-letnia gwarancja przy rejestracji - zapewniamy wsparcie techniczne i serwisowe.'],
];

function createVariant(powerLabel, modelCode, voltage) {
  return nibeF2120BaseTable.map((row) => {
    if (row[0] !== '1') {
      return [...row];
    }

    return [
      '1',
      `Pompa ciepla - monoblok ${powerLabel} (NIBE F2120-${modelCode})`,
      'szt.',
      '1',
      `NIBE F2120-${modelCode} | Monoblok | ${powerLabel}, ${voltage} | R410A. Wysokosprawna powietrzna pompa ciepla do ogrzewania i przygotowania CWU.`,
    ];
  });
}

const nibeF2120Tables = {
  '8 kW': createVariant('8 kW', '8', '230V'),
  '12 kW': createVariant('12 kW', '12', '400V'),
  '16 kW': createVariant('16 kW', '16', '400V'),
  '20 kW': createVariant('20 kW', '20', '400V'),
};

export const nibeBaseTables = {
  'NIBE F2120': nibeF2120Tables,
};
