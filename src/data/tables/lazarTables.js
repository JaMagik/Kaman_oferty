// ścieżka: src/data/tables/lazarTables.js

// --- BAZOWA TABELA DLA KOTŁÓW LAZAR ---
// Jest to szablon, z którego generowane są tabele dla konkretnych mocy/pojemności.
const lazar_base_template = [
  // Lp. 1 jest dynamicznie podmieniane dla każdego modelu
  ['1', 'Kocioł na pellet – Lazar SmartFire', 'szt.', '1', 'Automatyczny kocioł 5 klasy z zasobnikiem na pellet i palnikiem z funkcją automatycznego czyszczenia.', 'common'],
  // Pozycje na zasobnik CWU i bufor/sprzęgło są dodawane dynamicznie z pliku index.js
  ['2', 'Grupa bezpieczeństwa CWU', 'szt.', '1', 'Zawór bezpieczeństwa 6 bar, zawór zwrotny, manometr – zabezpieczenie zasobnika ciepłej wody.', 'common'],
  ['3', 'Elementy podłączeniowe hydrauliczne i elektryczne', 'kpl.', '1', 'Zawory, złączki, kształtki, filtry, odpowietrzniki, przewody i zabezpieczenia do wykonania przyłącza.', 'common'],
  ['4', 'Podłączenie kominowe', 'szt.', '1', 'Przyłącze kominowe, kolana, czyszczak i elementy odprowadzające spaliny zgodnie z zaleceniami producenta.', 'common'],
  ['5', 'Regulator temperatury bezprzewodowy', 'szt.', '1', 'Termostat pokojowy bezprzewodowy umożliwiający zdalne ustawianie temperatury w budynku.', 'common'],
  ['6', 'Rury przyłączeniowe i montażowe', 'kpl.', '1', 'Rury PP, PEX-AL-PEX, STEEL PRESS lub miedziane, odpowiednio dobrane do funkcji i temperatur pracy.', 'common'],
  ['7', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Otuliny z pianki technicznej zabezpieczające przewody przed stratami ciepła.', 'common'],
  ['8', 'Montaż systemu grzewczego', 'kpl.', '1', 'Kompletny montaż kotła oraz połączenie z instalacją C.O. i CWU.', 'common'],
  ['9', 'Transport kotła i materiałów', 'kpl.', '1', 'Dowóz urządzenia oraz niezbędnego osprzętu na miejsce inwestycji.', 'common'],
  ['10', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Napełnienie, odpowietrzenie, próba szczelności i ustawienie parametrów roboczych.', 'common'],
  ['11', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Instruktaż obsługi, przekazanie kart gwarancyjnych, protokołów i instrukcji użytkowania.', 'common'],
  
  // Wariant dla UKŁADU ZAMKNIĘTEGO
  ['12', 'Grupa bezpieczeństwa C.O. (układ zamknięty)', 'kpl.', '1', 'Zawór bezpieczeństwa, manometr i odpowietrznik – zabezpiecza instalację przed wzrostem ciśnienia.', 'zamkniety'],
  ['13', 'Zawór schładzający', 'szt.', '1', 'Zabezpieczenie termiczne kotła – otwiera się przy zbyt wysokiej temperaturze, chroniąc wymiennik ciepła.', 'zamkniety'],

  // Wariant dla UKŁADU OTWARTEGO
  ['12', 'Grupa bezpieczeństwa C.O. (układ otwarty)', 'kpl.', '1', 'Prosty zawór zabezpieczający instalację przed nadciśnieniem w układzie otwartym.', 'otwarty'],
  ['13', 'Naczynie wzbiorcze otwarte', 'szt.', '1', 'Zbiornik kompensujący wzrost objętości wody w instalacji – montowany w najwyższym punkcie.', 'otwarty'],
  ['14', 'Szkolenie użytkownika', 'kpl.', '1', 'Przekazanie zasad obsługi systemu, omówienie trybów pracy, dokumentacja i instrukcje.', 'common'],
  ['15', 'Dokumentacja powykonawcza i protokoły odbioru', 'kpl.', '1', 'Komplet dokumentów do zgłoszenia instalacji oraz rozliczenia dotacji.', 'common'],
  ['16', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie w przygotowaniu wniosku i dokumentów do programu „Czyste Powietrze”.', 'common'],
  ['17', 'Gwarancja i serwis', 'kpl.', '1', 'Kocioł objęty 10-letnią gwarancją przy rejestracji – zapewniamy wsparcie techniczne i serwisowe.', 'common'],
];

// --- GENEROWANIE TABEL DLA KONKRETNYCH MODELI ---
const createLazarTable = (name) => {
  const table = JSON.parse(JSON.stringify(lazar_base_template));
  table[0][1] = name; // Zastąp nazwę kotła w pierwszym wierszu
  return table;
};

const lazar_11kW_150L_base = createLazarTable('Kocioł na pellet – Lazar SmartFire 11 kW / 150L');
const lazar_11kW_240L_base = createLazarTable('Kocioł na pellet – Lazar SmartFire 11 kW / 240L');
const lazar_11kW_440L_base = createLazarTable('Kocioł na pellet – Lazar SmartFire 11 kW / 440L');

const lazar_15kW_150L_base = createLazarTable('Kocioł na pellet – Lazar SmartFire 15 kW / 150L');
const lazar_15kW_240L_base = createLazarTable('Kocioł na pellet – Lazar SmartFire 15 kW / 240L');
const lazar_15kW_440L_base = createLazarTable('Kocioł na pellet – Lazar SmartFire 15 kW / 440L');

const lazar_22kW_150L_base = createLazarTable('Kocioł na pellet – Lazar SmartFire 22 kW / 150L');
const lazar_22kW_240L_base = createLazarTable('Kocioł na pellet – Lazar SmartFire 22 kW / 240L');
const lazar_22kW_440L_base = createLazarTable('Kocioł na pellet – Lazar SmartFire 22 kW / 440L');


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
  }
};