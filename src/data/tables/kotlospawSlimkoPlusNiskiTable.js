// --- Kotłospaw Slimko Plus 12 kW ---
const slimkoPlus_12kW_base = [
  ['1', 'Kocioł na pellet Kotłospaw Slimko Plus 12 kW z podajnikiem bocznym', 'szt.', '1', 'Automatyczny kocioł 5 klasy z palnikiem EASY ROT i zasobnikiem pelletu montowanym na boku.', 'common'],
  ['2', 'Pompa obiegowa CO IBO PRO', 'szt.', '1', 'Zapewnia prawidłowy obieg czynnika grzewczego w instalacji.', 'common'],
  ['3', 'Pompa obiegowa CWU IBO PRO', 'szt.', '1', 'Obsługuje wężownicę zasobnika CWU i umożliwia sterowanie pracą w trybie lato/zima.', 'common'],
  ['4', 'Pompa ochrony powrotu z zaworem termostatycznym (55°C)', 'szt.', '1', 'Chroni kocioł przed zbyt niską temperaturą powrotu, co wpływa na jego trwałość.', 'common'],
  ['5', 'Regulator pokojowy bezprzewodowy', 'szt.', '1', 'Umożliwia wygodne sterowanie temperaturą w pomieszczeniu bez prowadzenia przewodów.', 'common'],
  ['6', 'Podłączenie kominowe', 'kpl.', '1', 'Komplet elementów do odprowadzenia spalin: kolana, rury, czyszczak – zgodnie z wytycznymi producenta.', 'common'],
  ['7', 'Elementy hydrauliczne i elektryczne', 'kpl.', '1', 'Zawory, filtry, przewody i zabezpieczenia niezbędne do wykonania poprawnego podłączenia.', 'common'],
  ['8', 'Rury montażowe + izolacja', 'kpl.', '1', 'Rury (PEX, stal, Cu, PP) oraz otuliny techniczne, ograniczające straty ciepła.', 'common'],
  ['9', 'Montaż systemu grzewczego', 'kpl.', '1', 'Kompletny montaż kotła, zasobnika, pomp i wszystkich podłączeń instalacyjnych.', 'common'],
  ['10', 'Transport materiałów i urządzeń', 'kpl.', '1', 'Dostawa wszystkich elementów instalacji na miejsce montażu.', 'common'],
  ['11', 'Uruchomienie instalacji i regulacja parametrów', 'kpl.', '1', 'Napełnienie układu, odpowietrzenie, próba szczelności oraz ustawienie parametrów pracy.', 'common'],
  ['12', 'Grupa bezpieczeństwa CWU', 'kpl.', '1', 'Zawór bezpieczeństwa, zawór zwrotny i manometr – chroni zasobnik CWU przed nadciśnieniem.', 'common'],
  // Wariant A – układ zamknięty
  ['13', 'Grupa bezpieczeństwa C.O. (układ zamknięty)', 'kpl.', '1', 'Zawór bezpieczeństwa, manometr i odpowietrznik – zabezpiecza instalację przed wzrostem ciśnienia.', 'zamkniety'],
  ['14', 'Zawór schładzający', 'szt.', '1', 'Zabezpieczenie termiczne kotła – otwiera się przy zbyt wysokiej temperaturze, chroniąc wymiennik ciepła.', 'zamkniety'],
  // Wariant B – układ otwarty
  ['13', 'Grupa bezpieczeństwa C.O. (układ otwarty)', 'kpl.', '1', 'Prosty zawór zabezpieczający instalację przed nadciśnieniem w układzie otwartym.', 'otwarty'],
  ['14', 'Naczynie wzbiorcze otwarte', 'szt.', '1', 'Zbiornik kompensujący wzrost objętości wody w instalacji – montowany w najwyższym punkcie.', 'otwarty'],
  // Pozycje końcowe wspólne
  ['15', 'Szkolenie użytkownika', 'kpl.', '1', 'Przekazanie zasad obsługi systemu, omówienie trybów pracy, dokumentacja i instrukcje.', 'common'],
  ['16', 'Dokumentacja powykonawcza i protokoły odbioru', 'kpl.', '1', 'Komplet dokumentów do zgłoszenia instalacji oraz rozliczenia dotacji.', 'common'],
  ['17', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie w przygotowaniu wniosku i dokumentów do programu „Czyste Powietrze”.', 'common'],
  ['18', 'Gwarancja i serwis', 'kpl.', '1', 'Kocioł objęty 5-letnią gwarancją przy rejestracji – zapewniamy wsparcie techniczne i serwisowe.', 'common'],
];

// --- Kotłospaw Slimko Plus 16 kW ---
const slimkoPlus_16kW_base = slimkoPlus_12kW_base.map(row => 
  row[0] === '1'
    ? ['1', 'Kocioł na pellet Kotłospaw Slimko Plus 16 kW z podajnikiem bocznym', 'szt.', '1', 'Automatyczny kocioł 5 klasy z palnikiem EASY ROT i zasobnikiem pelletu montowanym na boku.', 'common']
    : [...row]
);

// --- Kotłospaw Slimko Plus 20 kW ---
const slimkoPlus_20kW_base = slimkoPlus_12kW_base.map(row => 
  row[0] === '1'
    ?['1', 'Kocioł na pellet Kotłospaw Slimko Plus 20 kW z podajnikiem bocznym', 'szt.', '1', 'Automatyczny kocioł 5 klasy z palnikiem EASY ROT i zasobnikiem pelletu montowanym na boku.', 'common']
    : [...row]
);

// --- Kotłospaw Slimko Plus 24 kW ---
const slimkoPlus_24kW_base = slimkoPlus_12kW_base.map(row => 
  row[0] === '1'
    ? ['1', 'Kocioł na pellet Kotłospaw Slimko Plus 24 kW z podajnikiem bocznym', 'szt.', '1', 'Automatyczny kocioł 5 klasy z palnikiem EASY ROT i zasobnikiem pelletu montowanym na boku.', 'common']
    : [...row]
);

// --- Kotłospaw Slimko Plus 30 kW ---
const slimkoPlus_30kW_base = slimkoPlus_12kW_base.map(row => 
  row[0] === '1'
    ? ['1', 'Kocioł na pellet Kotłospaw Slimko Plus 30 kW z podajnikiem bocznym', 'szt.', '1', 'Automatyczny kocioł 5 klasy z palnikiem EASY ROT i zasobnikiem pelletu montowanym na boku.', 'common']
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