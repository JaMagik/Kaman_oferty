// sciezka: src/data/tables/lazarTables.js

// --- BAZOWA TABELA DLA KOTLOW LAZAR ---
const lazar_base_template = [
  // Lp. 1 jest dynamicznie podmieniane dla kazdego modelu
  ['1', 'Kociol na pellet - Lazar SmartFire', 'szt.', '1', 'Automatyczny kociol 5 klasy z zasobnikiem na pellet i palnikiem z funkcja automatycznego czyszczenia.', 'common'],
  // Pozycje na zasobnik CWU i bufor/sprzeglo sa dodawane dynamicznie z pliku index.js
  ['2', 'Grupa bezpieczenstwa CWU', 'szt.', '1', 'Zawor bezpieczenstwa 6 bar, zawor zwrotny i manometr - zabezpieczenie zasobnika cieplej wody.', 'common'],
  ['3', 'Grupa bezpieczenstwa CO (uklad zamkniety)', 'kpl.', '1', 'Zawor bezpieczenstwa, manometr i odpowietrznik - zabezpiecza instalacje przed wzrostem cisnienia.', 'zamkniety'],
  ['4', 'Zawor schladzajacy', 'szt.', '1', 'Zabezpieczenie termiczne kotla - otwiera sie przy zbyt wysokiej temperaturze, chroniac wymiennik ciepla.', 'zamkniety'],
  ['3', 'Grupa bezpieczenstwa CO (uklad otwarty)', 'kpl.', '1', 'Zawor zabezpieczajacy instalacje przed nadcisnieniem w ukladzie otwartym.', 'otwarty'],
  ['4', 'Naczynie wzbiorcze otwarte', 'szt.', '1', 'Zbiornik kompensujacy wzrost objetosci wody w instalacji - montowany w najwyzszym punkcie.', 'otwarty'],
  ['5', 'Podlaczenie kominowe', 'szt.', '1', 'Przylacze kominowe, kolana, czyszczak i elementy odprowadzajace spaliny zgodnie z zaleceniami producenta.', 'common'],
  ['6', 'Regulator temperatury bezprzewodowy', 'szt.', '1', 'Termostat pokojowy bezprzewodowy umozliwiajacy zdalne ustawianie temperatury w budynku.', 'common'],
  ['7', 'Pompa obiegowa CO KAMAN PRO', 'szt.', '1', 'Zapewnia prawidlowy obieg czynnika grzewczego w instalacji.', 'common'],
  ['8', 'Rury przylaczeniowe i montazowe', 'kpl.', '1', 'Rury PP, PEX-AL-PEX, STEEL PRESS lub miedziane, dobrane do funkcji i temperatur pracy.', 'common'],
  ['9', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Otuliny z pianki technicznej zabezpieczajace przewody przed stratami ciepla.', 'common'],
  ['10', 'Montaz systemu grzewczego', 'kpl.', '1', 'Kompletny montaz kotla oraz polaczenie z instalacja CO i CWU.', 'common'],
  ['11', 'Konfiguracja obiegow grzewczych', 'kpl.', '1', 'Przygotowanie i uruchomienie wskazanej liczby obiegow grzewczych wraz z niezbedna armatura i regulacja.', 'common'],
  ['12', 'Transport kotla i materialow', 'kpl.', '1', 'Dowoz urzadzenia oraz niezbednego osprzetu na miejsce inwestycji.', 'common'],
  ['13', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Napelnienie, odpowietrzenie, proba szczelnosci i ustawienie parametrow roboczych.', 'common'],

  ['14', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie w przygotowaniu wniosku i dokumentow do programu Czyste Powietrze.', 'common'],
  ['15', 'Gwarancja i serwis', 'kpl.', '1', 'Kociol objety 10-letnia gwarancja przy rejestracji - zapewniamy wsparcie techniczne i serwisowe.', 'common'],
];

const createLazarTable = (name) => {
  const table = JSON.parse(JSON.stringify(lazar_base_template));
  table[0][1] = name;
  return table;
};

const lazar_11kW_150L_base = createLazarTable('Kociol na pellet - Lazar SmartFire 11 kW / 150L');
const lazar_11kW_240L_base = createLazarTable('Kociol na pellet - Lazar SmartFire 11 kW / 240L');
const lazar_11kW_440L_base = createLazarTable('Kociol na pellet - Lazar SmartFire 11 kW / 440L');

const lazar_15kW_150L_base = createLazarTable('Kociol na pellet - Lazar SmartFire 15 kW / 150L');
const lazar_15kW_240L_base = createLazarTable('Kociol na pellet - Lazar SmartFire 15 kW / 240L');
const lazar_15kW_440L_base = createLazarTable('Kociol na pellet - Lazar SmartFire 15 kW / 440L');

const lazar_22kW_150L_base = createLazarTable('Kociol na pellet - Lazar SmartFire 22 kW / 150L');
const lazar_22kW_240L_base = createLazarTable('Kociol na pellet - Lazar SmartFire 22 kW / 240L');
const lazar_22kW_440L_base = createLazarTable('Kociol na pellet - Lazar SmartFire 22 kW / 440L');

export const lazarBaseTables = {
  'LAZAR': {
    '11 kW/150': lazar_11kW_150L_base,
    '11 kW/240': lazar_11kW_240L_base,
    '11 kW/440': lazar_11kW_440L_base,
    '15 kW/150': lazar_15kW_150L_base,
    '15 kW/240': lazar_15kW_240L_base,
    '15 kW/440': lazar_15kW_440L_base,
    '22 kW/150': lazar_22kW_150L_base,
    '22 kW/240': lazar_22kW_240L_base,
    '22 kW/440': lazar_22kW_440L_base,
  },
};



