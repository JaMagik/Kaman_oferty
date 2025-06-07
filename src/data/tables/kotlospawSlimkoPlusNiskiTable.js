// --- Kotłospaw Slimko Plus 12 kW ---
const slimkoPlus_12kW_base = [
  ['1', 'Kocioł na pellet – Kotłospaw Slimko Plus z podajnikiem bocznym 12 kW', 'szt.', '1', 'Automatyczny kocioł 5 klasy z podajnikiem, zasobnikiem na pellet 150 litrów i palnikiem z funkcją automatycznego czyszczenia.'],
  ['2', 'Grupa bezpieczeństwa CWU', 'kpl.', '1', 'Zawór bezpieczeństwa, zawór zwrotny i manometr zabezpieczający zasobnik ciepłej wody.'],
  ['3', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Komplet: zawór bezpieczeństwa, manometr i odpowietrznik automatyczny dla ochrony obiegu grzewczego.'],
  ['4', 'Elementy podłączeniowe hydrauliczne i elektryczne', 'kpl.', '1', 'Komplet: zawory, złączki, kształtki, filtry, odpowietrzniki, przewody i zabezpieczenia do wykonania przyłącza.'],
  ['5', 'Podłączenie kominowe', 'kpl.', '1', 'Przyłącze kominowe, kolana, czyszczak i elementy odprowadzające spaliny zgodnie z zaleceniami producenta.'],
  ['6', 'Regulator temperatury bezprzewodowy', 'szt.', '1', 'Termostat pokojowy do ustawiania temperatury wewnętrznej.'],
  ['7', 'Rury przyłączeniowe i montażowe', 'kpl.', '1', 'Stosowane są rury typu PP, PEX-AL-PEX, STEEL PRESS oraz miedziane, odpowiednio dobrane do funkcji i temperatur pracy.'],
  ['8', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Otuliny z pianki technicznej zabezpieczające przewody przed stratami ciepła.'],
  ['9', 'Montaż systemu grzewczego', 'kpl.', '1', 'Kompletny montaż kotła, sprzęgła, grup bezpieczeństwa oraz połączenie z instalacją C.O. i CWU.'],
  ['10', 'Transport kotła i materiałów', 'kpl.', '1', 'Dowóz urządzenia oraz osprzętu na miejsce montażu.'],
  ['11', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Napełnienie, odpowietrzenie, próba szczelności i ustawienie parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['12', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Instruktaż z obsługi systemu, przekazanie kart gwarancyjnych, protokołów i instrukcji użytkowania.'],
];

// --- Kotłospaw Slimko Plus 16 kW ---
const slimkoPlus_16kW_base = slimkoPlus_12kW_base.map(row => 
  row[0] === '1'
    ? ['1', 'Kocioł na pellet – Kotłospaw Slimko Plus 16 kW z podajnikiem bocznym', 'szt.', '1', 'Automatyczny kocioł 5 klasy z podajnikiem, zasobnikiem na pellet 150 litrów i palnikiem z funkcją automatycznego czyszczenia.']
    : [...row]
);

// --- Kotłospaw Slimko Plus 20 kW ---
const slimkoPlus_20kW_base = slimkoPlus_12kW_base.map(row => 
  row[0] === '1'
    ? ['1', 'Kocioł na pellet – Kotłospaw Slimko Plus 20 kW z podajnikiem bocznym', 'szt.', '1', 'Automatyczny kocioł 5 klasy z podajnikiem, zasobnikiem na pellet 150 litrów i palnikiem z funkcją automatycznego czyszczenia.']
    : [...row]
);

// --- Kotłospaw Slimko Plus 24 kW ---
const slimkoPlus_24kW_base = slimkoPlus_12kW_base.map(row => 
  row[0] === '1'
    ? ['1', 'Kocioł na pellet – Kotłospaw Slimko Plus 24 kW z podajnikiem bocznym', 'szt.', '1', 'Automatyczny kocioł 5 klasy z podajnikiem, zasobnikiem na pellet 150 litrów i palnikiem z funkcją automatycznego czyszczenia.']
    : [...row]
);

// --- Kotłospaw Slimko Plus 30 kW ---
const slimkoPlus_30kW_base = slimkoPlus_12kW_base.map(row => 
  row[0] === '1'
    ? ['1', 'Kocioł na pellet – Kotłospaw Slimko Plus 30 kW z podajnikiem bocznym', 'szt.', '1', 'Automatyczny kocioł 5 klasy z podajnikiem, zasobnikiem na pellet 150 litrów i palnikiem z funkcją automatycznego czyszczenia.']
    : [...row]
);


export const kotlospawSlimkoPlusNiskiBaseTables = {
  // ... (ewentualne inne wpisy dla Atlantic, np. 'ATLANTIC' dla Extensa AI Duo, jeśli nadal potrzebne)
  'Kotlospaw slimko plus niski': { // Klucz odpowiadający 'deviceType' dla M-Duo
     '12 kW': slimkoPlus_12kW_base,
'16 kW': slimkoPlus_16kW_base,
'20 kW': slimkoPlus_20kW_base,
'24 kW': slimkoPlus_24kW_base,
'30 kW': slimkoPlus_30kW_base,
    // W 'script.js' nie było innych mocy dla M-Duo, w razie potrzeby dodaj tutaj.
  },
  
};