// ścieżka: src/data/tables/kotlospawSlimkoPlusTable.js

// 12 kW
const slimkoPlus_12kW_base = [
  ['1', 'Kocioł na pellet Kotłospaw Slimko Plus 12 kW', 'szt.', '1', 'Automatyczny kocioł 5 klasy z palnikiem EASY ROT i zasobnikiem pelletu montowanym na górze.', 'common'],
  ['4', 'Pompa obiegowa CO IBO PRO', 'szt.', '1', 'Zapewnia prawidłowy obieg czynnika grzewczego w instalacji.'],
  ['5', 'Pompa obiegowa CWU IBO PRO', 'szt.', '1', 'Obsługuje wężownicę zasobnika CWU i umożliwia sterowanie pracą w trybie lato/zima.'],
  ['6', 'Pompa ochrony powrotu z zaworem termostatycznym (55°C)', 'szt.', '1', 'Chroni kocioł przed zbyt niską temperaturą powrotu, co wpływa na jego trwałość.'],
  ['7', 'Regulator pokojowy bezprzewodowy', 'szt.', '1', 'Umożliwia wygodne sterowanie temperaturą w pomieszczeniu bez prowadzenia przewodów.'],
  ['8', 'Podłączenie kominowe', 'kpl.', '1', 'Komplet elementów do odprowadzenia spalin: kolana, rury, czyszczak – zgodnie z wytycznymi producenta.'],
  ['9', 'Elementy hydrauliczne i elektryczne', 'kpl.', '1', 'Zawory, filtry, przewody i zabezpieczenia niezbędne do wykonania poprawnego podłączenia.'],
  ['10', 'Rury montażowe + izolacja', 'kpl.', '1', 'Rury (PEX, stal, Cu) oraz otuliny techniczne, ograniczające straty ciepła.'],
  ['11', 'Montaż systemu grzewczego', 'kpl.', '1', 'Kompletny montaż kotła, zasobnika, pomp i wszystkich podłączeń instalacyjnych.'],
  ['12', 'Transport materiałów i urządzeń', 'kpl.', '1', 'Dostawa wszystkich elementów instalacji na miejsce montażu.'],

  // Część wspólna dla obu wariantów
  ['13', 'Uruchomienie instalacji i regulacja parametrów', 'kpl.', '1', 'Napełnienie układu, odpowietrzenie, próba szczelności oraz ustawienie parametrów pracy.'],
  ['14', 'Grupa bezpieczeństwa CWU', 'kpl.', '1', 'Zawór bezpieczeństwa, zawór zwrotny i manometr – chroni zasobnik CWU przed nadciśnieniem.'],

  // Wariant A – układ zamknięty
  ['15', 'Grupa bezpieczeństwa C.O. (zamknięty układ)', 'kpl.', '1', 'Zawór bezpieczeństwa, manometr i odpowietrznik – zabezpiecza instalację przed wzrostem ciśnienia.'],
  ['16', 'Zawór schładzający', 'szt.', '1', 'Zabezpieczenie termiczne kotła – otwiera się przy zbyt wysokiej temperaturze, chroniąc wymiennik ciepła.'],

  // Wariant B – układ otwarty
  // (jeśli stosujesz dynamicznie, to odkomentuj/wykorzystaj odpowiednią sekcję)
   ['15', 'Zawór bezpieczeństwa C.O. (otwarty układ)', 'kpl.', '1', 'Prosty zawór zabezpieczający instalację przed nadciśnieniem w układzie otwartym.'],
   ['16', 'Naczynie wzbiorcze otwarte', 'szt.', '1', 'Zbiornik kompensujący wzrost objętości wody w instalacji – montowany w najwyższym punkcie.'],

  // Pozycje końcowe wspólne
  ['17', 'Szkolenie użytkownika', 'kpl.', '1', 'Przekazanie zasad obsługi systemu, omówienie trybów pracy, dokumentacja i instrukcje.'],
  ['18', 'Dokumentacja powykonawcza i protokoły odbioru', 'kpl.', '1', 'Komplet dokumentów do zgłoszenia instalacji oraz rozliczenia dotacji.'],
  ['19', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie w przygotowaniu wniosku i dokumentów do programu „Czyste Powietrze”.'],
  ['20', 'Gwarancja i serwis', 'kpl.', '1', 'Kocioł objęty 5-letnią gwarancją przy rejestracji – zapewniamy wsparcie techniczne i serwisowe.'],
  // ...reszta jak poniżej
];

// 16 kW
const slimkoPlus_16kW_base = [
  ['1', 'Kocioł na pellet Kotłospaw Slimko Plus 16 kW', 'szt.', '1', 'Automatyczny kocioł 5 klasy z palnikiem EASY ROT i zasobnikiem pelletu montowanym na górze.', 'common'],
  ['4', 'Pompa obiegowa CO IBO PRO', 'szt.', '1', 'Zapewnia prawidłowy obieg czynnika grzewczego w instalacji.'],
  ['5', 'Pompa obiegowa CWU IBO PRO', 'szt.', '1', 'Obsługuje wężownicę zasobnika CWU i umożliwia sterowanie pracą w trybie lato/zima.'],
  ['6', 'Pompa ochrony powrotu z zaworem termostatycznym (55°C)', 'szt.', '1', 'Chroni kocioł przed zbyt niską temperaturą powrotu, co wpływa na jego trwałość.'],
  ['7', 'Regulator pokojowy bezprzewodowy', 'szt.', '1', 'Umożliwia wygodne sterowanie temperaturą w pomieszczeniu bez prowadzenia przewodów.'],
  ['8', 'Podłączenie kominowe', 'kpl.', '1', 'Komplet elementów do odprowadzenia spalin: kolana, rury, czyszczak – zgodnie z wytycznymi producenta.'],
  ['9', 'Elementy hydrauliczne i elektryczne', 'kpl.', '1', 'Zawory, filtry, przewody i zabezpieczenia niezbędne do wykonania poprawnego podłączenia.'],
  ['10', 'Rury montażowe + izolacja', 'kpl.', '1', 'Rury (PEX, stal, Cu) oraz otuliny techniczne, ograniczające straty ciepła.'],
  ['11', 'Montaż systemu grzewczego', 'kpl.', '1', 'Kompletny montaż kotła, zasobnika, pomp i wszystkich podłączeń instalacyjnych.'],
  ['12', 'Transport materiałów i urządzeń', 'kpl.', '1', 'Dostawa wszystkich elementów instalacji na miejsce montażu.'],

  // Część wspólna dla obu wariantów
  ['13', 'Uruchomienie instalacji i regulacja parametrów', 'kpl.', '1', 'Napełnienie układu, odpowietrzenie, próba szczelności oraz ustawienie parametrów pracy.'],
  ['14', 'Grupa bezpieczeństwa CWU', 'kpl.', '1', 'Zawór bezpieczeństwa, zawór zwrotny i manometr – chroni zasobnik CWU przed nadciśnieniem.'],

  // Wariant A – układ zamknięty
  ['15', 'Grupa bezpieczeństwa C.O. (zamknięty układ)', 'kpl.', '1', 'Zawór bezpieczeństwa, manometr i odpowietrznik – zabezpiecza instalację przed wzrostem ciśnienia.'],
  ['16', 'Zawór schładzający', 'szt.', '1', 'Zabezpieczenie termiczne kotła – otwiera się przy zbyt wysokiej temperaturze, chroniąc wymiennik ciepła.'],

  // Wariant B – układ otwarty
  // (jeśli stosujesz dynamicznie, to odkomentuj/wykorzystaj odpowiednią sekcję)
   ['15', 'Zawór bezpieczeństwa C.O. (otwarty układ)', 'kpl.', '1', 'Prosty zawór zabezpieczający instalację przed nadciśnieniem w układzie otwartym.'],
   ['16', 'Naczynie wzbiorcze otwarte', 'szt.', '1', 'Zbiornik kompensujący wzrost objętości wody w instalacji – montowany w najwyższym punkcie.'],

  // Pozycje końcowe wspólne
  ['17', 'Szkolenie użytkownika', 'kpl.', '1', 'Przekazanie zasad obsługi systemu, omówienie trybów pracy, dokumentacja i instrukcje.'],
  ['18', 'Dokumentacja powykonawcza i protokoły odbioru', 'kpl.', '1', 'Komplet dokumentów do zgłoszenia instalacji oraz rozliczenia dotacji.'],
  ['19', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie w przygotowaniu wniosku i dokumentów do programu „Czyste Powietrze”.'],
  ['20', 'Gwarancja i serwis', 'kpl.', '1', 'Kocioł objęty 5-letnią gwarancją przy rejestracji – zapewniamy wsparcie techniczne i serwisowe.'],
  // ...reszta jak poniżej
];

// 20 kW
const slimkoPlus_20kW_base = [
  ['1', 'Kocioł na pellet Kotłospaw Slimko Plus 20 kW', 'szt.', '1', 'Automatyczny kocioł 5 klasy z palnikiem EASY ROT i zasobnikiem pelletu montowanym na górze.', 'common'],
   ['4', 'Pompa obiegowa CO IBO PRO', 'szt.', '1', 'Zapewnia prawidłowy obieg czynnika grzewczego w instalacji.'],
  ['5', 'Pompa obiegowa CWU IBO PRO', 'szt.', '1', 'Obsługuje wężownicę zasobnika CWU i umożliwia sterowanie pracą w trybie lato/zima.'],
  ['6', 'Pompa ochrony powrotu z zaworem termostatycznym (55°C)', 'szt.', '1', 'Chroni kocioł przed zbyt niską temperaturą powrotu, co wpływa na jego trwałość.'],
  ['7', 'Regulator pokojowy bezprzewodowy', 'szt.', '1', 'Umożliwia wygodne sterowanie temperaturą w pomieszczeniu bez prowadzenia przewodów.'],
  ['8', 'Podłączenie kominowe', 'kpl.', '1', 'Komplet elementów do odprowadzenia spalin: kolana, rury, czyszczak – zgodnie z wytycznymi producenta.'],
  ['9', 'Elementy hydrauliczne i elektryczne', 'kpl.', '1', 'Zawory, filtry, przewody i zabezpieczenia niezbędne do wykonania poprawnego podłączenia.'],
  ['10', 'Rury montażowe + izolacja', 'kpl.', '1', 'Rury (PEX, stal, Cu) oraz otuliny techniczne, ograniczające straty ciepła.'],
  ['11', 'Montaż systemu grzewczego', 'kpl.', '1', 'Kompletny montaż kotła, zasobnika, pomp i wszystkich podłączeń instalacyjnych.'],
  ['12', 'Transport materiałów i urządzeń', 'kpl.', '1', 'Dostawa wszystkich elementów instalacji na miejsce montażu.'],

  // Część wspólna dla obu wariantów
  ['13', 'Uruchomienie instalacji i regulacja parametrów', 'kpl.', '1', 'Napełnienie układu, odpowietrzenie, próba szczelności oraz ustawienie parametrów pracy.'],
  ['14', 'Grupa bezpieczeństwa CWU', 'kpl.', '1', 'Zawór bezpieczeństwa, zawór zwrotny i manometr – chroni zasobnik CWU przed nadciśnieniem.'],

  // Wariant A – układ zamknięty
  ['15', 'Grupa bezpieczeństwa C.O. (zamknięty układ)', 'kpl.', '1', 'Zawór bezpieczeństwa, manometr i odpowietrznik – zabezpiecza instalację przed wzrostem ciśnienia.'],
  ['16', 'Zawór schładzający', 'szt.', '1', 'Zabezpieczenie termiczne kotła – otwiera się przy zbyt wysokiej temperaturze, chroniąc wymiennik ciepła.'],

  // Wariant B – układ otwarty
  // (jeśli stosujesz dynamicznie, to odkomentuj/wykorzystaj odpowiednią sekcję)
   ['15', 'Zawór bezpieczeństwa C.O. (otwarty układ)', 'kpl.', '1', 'Prosty zawór zabezpieczający instalację przed nadciśnieniem w układzie otwartym.'],
   ['16', 'Naczynie wzbiorcze otwarte', 'szt.', '1', 'Zbiornik kompensujący wzrost objętości wody w instalacji – montowany w najwyższym punkcie.'],

  // Pozycje końcowe wspólne
  ['17', 'Szkolenie użytkownika', 'kpl.', '1', 'Przekazanie zasad obsługi systemu, omówienie trybów pracy, dokumentacja i instrukcje.'],
  ['18', 'Dokumentacja powykonawcza i protokoły odbioru', 'kpl.', '1', 'Komplet dokumentów do zgłoszenia instalacji oraz rozliczenia dotacji.'],
  ['19', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie w przygotowaniu wniosku i dokumentów do programu „Czyste Powietrze”.'],
  ['20', 'Gwarancja i serwis', 'kpl.', '1', 'Kocioł objęty 5-letnią gwarancją przy rejestracji – zapewniamy wsparcie techniczne i serwisowe.'],
  // ...reszta jak poniżej
];

// 24 kW
const slimkoPlus_24kW_base = [
  ['1', 'Kocioł na pellet Kotłospaw Slimko Plus 24 kW', 'szt.', '1', 'Automatyczny kocioł 5 klasy z palnikiem EASY ROT i zasobnikiem pelletu montowanym na górze.', 'common'],
   ['4', 'Pompa obiegowa CO IBO PRO', 'szt.', '1', 'Zapewnia prawidłowy obieg czynnika grzewczego w instalacji.'],
  ['5', 'Pompa obiegowa CWU IBO PRO', 'szt.', '1', 'Obsługuje wężownicę zasobnika CWU i umożliwia sterowanie pracą w trybie lato/zima.'],
  ['6', 'Pompa ochrony powrotu z zaworem termostatycznym (55°C)', 'szt.', '1', 'Chroni kocioł przed zbyt niską temperaturą powrotu, co wpływa na jego trwałość.'],
  ['7', 'Regulator pokojowy bezprzewodowy', 'szt.', '1', 'Umożliwia wygodne sterowanie temperaturą w pomieszczeniu bez prowadzenia przewodów.'],
  ['8', 'Podłączenie kominowe', 'kpl.', '1', 'Komplet elementów do odprowadzenia spalin: kolana, rury, czyszczak – zgodnie z wytycznymi producenta.'],
  ['9', 'Elementy hydrauliczne i elektryczne', 'kpl.', '1', 'Zawory, filtry, przewody i zabezpieczenia niezbędne do wykonania poprawnego podłączenia.'],
  ['10', 'Rury montażowe + izolacja', 'kpl.', '1', 'Rury (PEX, stal, Cu) oraz otuliny techniczne, ograniczające straty ciepła.'],
  ['11', 'Montaż systemu grzewczego', 'kpl.', '1', 'Kompletny montaż kotła, zasobnika, pomp i wszystkich podłączeń instalacyjnych.'],
  ['12', 'Transport materiałów i urządzeń', 'kpl.', '1', 'Dostawa wszystkich elementów instalacji na miejsce montażu.'],

  // Część wspólna dla obu wariantów
  ['13', 'Uruchomienie instalacji i regulacja parametrów', 'kpl.', '1', 'Napełnienie układu, odpowietrzenie, próba szczelności oraz ustawienie parametrów pracy.'],
  ['14', 'Grupa bezpieczeństwa CWU', 'kpl.', '1', 'Zawór bezpieczeństwa, zawór zwrotny i manometr – chroni zasobnik CWU przed nadciśnieniem.'],

  // Wariant A – układ zamknięty
  ['15', 'Grupa bezpieczeństwa C.O. (zamknięty układ)', 'kpl.', '1', 'Zawór bezpieczeństwa, manometr i odpowietrznik – zabezpiecza instalację przed wzrostem ciśnienia.'],
  ['16', 'Zawór schładzający', 'szt.', '1', 'Zabezpieczenie termiczne kotła – otwiera się przy zbyt wysokiej temperaturze, chroniąc wymiennik ciepła.'],

  // Wariant B – układ otwarty
  // (jeśli stosujesz dynamicznie, to odkomentuj/wykorzystaj odpowiednią sekcję)
   ['15', 'Zawór bezpieczeństwa C.O. (otwarty układ)', 'kpl.', '1', 'Prosty zawór zabezpieczający instalację przed nadciśnieniem w układzie otwartym.'],
   ['16', 'Naczynie wzbiorcze otwarte', 'szt.', '1', 'Zbiornik kompensujący wzrost objętości wody w instalacji – montowany w najwyższym punkcie.'],

  // Pozycje końcowe wspólne
  ['17', 'Szkolenie użytkownika', 'kpl.', '1', 'Przekazanie zasad obsługi systemu, omówienie trybów pracy, dokumentacja i instrukcje.'],
  ['18', 'Dokumentacja powykonawcza i protokoły odbioru', 'kpl.', '1', 'Komplet dokumentów do zgłoszenia instalacji oraz rozliczenia dotacji.'],
  ['19', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie w przygotowaniu wniosku i dokumentów do programu „Czyste Powietrze”.'],
  ['20', 'Gwarancja i serwis', 'kpl.', '1', 'Kocioł objęty 5-letnią gwarancją przy rejestracji – zapewniamy wsparcie techniczne i serwisowe.'],
  // ...reszta jak poniżej
];

// 30 kW
const slimkoPlus_30kW_base = [
  ['1', 'Kocioł na pellet Kotłospaw Slimko Plus 30 kW', 'szt.', '1', 'Automatyczny kocioł 5 klasy z palnikiem EASY ROT i zasobnikiem pelletu montowanym na górze.', 'common'],
   ['4', 'Pompa obiegowa CO IBO PRO', 'szt.', '1', 'Zapewnia prawidłowy obieg czynnika grzewczego w instalacji.'],
  ['5', 'Pompa obiegowa CWU IBO PRO', 'szt.', '1', 'Obsługuje wężownicę zasobnika CWU i umożliwia sterowanie pracą w trybie lato/zima.'],
  ['6', 'Pompa ochrony powrotu z zaworem termostatycznym (55°C)', 'szt.', '1', 'Chroni kocioł przed zbyt niską temperaturą powrotu, co wpływa na jego trwałość.'],
  ['7', 'Regulator pokojowy bezprzewodowy', 'szt.', '1', 'Umożliwia wygodne sterowanie temperaturą w pomieszczeniu bez prowadzenia przewodów.'],
  ['8', 'Podłączenie kominowe', 'kpl.', '1', 'Komplet elementów do odprowadzenia spalin: kolana, rury, czyszczak – zgodnie z wytycznymi producenta.'],
  ['9', 'Elementy hydrauliczne i elektryczne', 'kpl.', '1', 'Zawory, filtry, przewody i zabezpieczenia niezbędne do wykonania poprawnego podłączenia.'],
  ['10', 'Rury montażowe + izolacja', 'kpl.', '1', 'Rury (PEX, stal, Cu) oraz otuliny techniczne, ograniczające straty ciepła.'],
  ['11', 'Montaż systemu grzewczego', 'kpl.', '1', 'Kompletny montaż kotła, zasobnika, pomp i wszystkich podłączeń instalacyjnych.'],
  ['12', 'Transport materiałów i urządzeń', 'kpl.', '1', 'Dostawa wszystkich elementów instalacji na miejsce montażu.'],

  // Część wspólna dla obu wariantów
  ['13', 'Uruchomienie instalacji i regulacja parametrów', 'kpl.', '1', 'Napełnienie układu, odpowietrzenie, próba szczelności oraz ustawienie parametrów pracy.'],
  ['14', 'Grupa bezpieczeństwa CWU', 'kpl.', '1', 'Zawór bezpieczeństwa, zawór zwrotny i manometr – chroni zasobnik CWU przed nadciśnieniem.'],

  // Wariant A – układ zamknięty
  ['15', 'Grupa bezpieczeństwa C.O. (zamknięty układ)', 'kpl.', '1', 'Zawór bezpieczeństwa, manometr i odpowietrznik – zabezpiecza instalację przed wzrostem ciśnienia.'],
  ['16', 'Zawór schładzający', 'szt.', '1', 'Zabezpieczenie termiczne kotła – otwiera się przy zbyt wysokiej temperaturze, chroniąc wymiennik ciepła.'],

  // Wariant B – układ otwarty
  // (jeśli stosujesz dynamicznie, to odkomentuj/wykorzystaj odpowiednią sekcję)
   ['15', 'Zawór bezpieczeństwa C.O. (otwarty układ)', 'kpl.', '1', 'Prosty zawór zabezpieczający instalację przed nadciśnieniem w układzie otwartym.'],
   ['16', 'Naczynie wzbiorcze otwarte', 'szt.', '1', 'Zbiornik kompensujący wzrost objętości wody w instalacji – montowany w najwyższym punkcie.'],

  // Pozycje końcowe wspólne
  ['17', 'Szkolenie użytkownika', 'kpl.', '1', 'Przekazanie zasad obsługi systemu, omówienie trybów pracy, dokumentacja i instrukcje.'],
  ['18', 'Dokumentacja powykonawcza i protokoły odbioru', 'kpl.', '1', 'Komplet dokumentów do zgłoszenia instalacji oraz rozliczenia dotacji.'],
  ['19', 'Pomoc w uzyskaniu dotacji', 'kpl.', '1', 'Wsparcie w przygotowaniu wniosku i dokumentów do programu „Czyste Powietrze”.'],
  ['20', 'Gwarancja i serwis', 'kpl.', '1', 'Kocioł objęty 5-letnią gwarancją przy rejestracji – zapewniamy wsparcie techniczne i serwisowe.'],
  // ...reszta jak poniżej
];

// Eksport mapy
export const kotlospawSlimkoPlusBaseTables = {
  'Kotlospaw Slimko Plus': {
    '12 kW': slimkoPlus_12kW_base,
    '16 kW': slimkoPlus_16kW_base,
    '20 kW': slimkoPlus_20kW_base,
    '24 kW': slimkoPlus_24kW_base,
    '30 kW': slimkoPlus_30kW_base,
  },
};
