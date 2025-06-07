// --- Kotłospaw Drewko Plus 12 kW ---
const drewkoPlus_12kW_base = [
  ['1', 'Kocioł na drewno i pellet – Kotłospaw Drewko Hybrid 12 kW', 'szt.', '1', 'Automatyczny kocioł 5 klasy na pellet i drewno, wyposażony w duży zasyp, wysoką sprawność, spełniający wymagania Ekoprojektu.'],
  ['4', 'Grupa bezpieczeństwa CWU', 'kpl.', '1', 'Zawór bezpieczeństwa, zawór zwrotny i manometr zabezpieczający zasobnik ciepłej wody.'],
  ['5', 'Grupa bezpieczeństwa C.O.', 'kpl.', '1', 'Komplet: zawór bezpieczeństwa, manometr i odpowietrznik automatyczny dla ochrony obiegu grzewczego.'],
  ['6', 'Elementy podłączeniowe hydrauliczne i elektryczne', 'kpl.', '1', 'Komplet: zawory, złączki, kształtki, filtry, odpowietrzniki, przewody i zabezpieczenia do wykonania przyłącza.'],
  ['7', 'Podłączenie kominowe', 'kpl.', '1', 'Przyłącze kominowe, kolana, czyszczak i elementy odprowadzające spaliny zgodnie z zaleceniami producenta.'],
  ['8', 'Regulator temperatury bezprzewodowy', 'szt.', '1', 'Termostat pokojowy do ustawiania temperatury wewnętrznej.'],
  ['9', 'Rury przyłączeniowe i montażowe', 'kpl.', '1', 'Stosowane są rury typu PP, PEX-AL-PEX, STEEL PRESS oraz miedziane, odpowiednio dobrane do funkcji i temperatur pracy.'],
  ['10', 'Izolacja termiczna rur wodnych', 'kpl.', '1', 'Otuliny z pianki technicznej zabezpieczające przewody przed stratami ciepła.'],
  ['11', 'Montaż systemu grzewczego', 'kpl.', '1', 'Kompletny montaż kotła, sprzęgła, grup bezpieczeństwa oraz połączenie z instalacją C.O. i CWU.'],
  ['12', 'Transport kotła i materiałów', 'kpl.', '1', 'Dowóz urządzenia oraz osprzętu na miejsce montażu.'],
  ['13', 'Uruchomienie systemu i testy', 'kpl.', '1', 'Napełnienie, odpowietrzenie, próba szczelności i ustawienie parametrów roboczych zgodnie z zaleceniami producenta.'],
  ['14', 'Szkolenie użytkownika + dokumentacja', 'kpl.', '1', 'Instruktaż z obsługi systemu, przekazanie kart gwarancyjnych, protokołów i instrukcji użytkowania.'],
];

// --- Kotłospaw Drewko Plus 18 kW ---
const drewkoPlus_18kW_base = drewkoPlus_12kW_base.map(row =>
  row[0] === '1'
    ? ['1', 'Kocioł na drewno i pellet – Kotłospaw Drewko Hybrid 18 kW', 'szt.', '1', 'Automatyczny kocioł 5 klasy na pellet i drewno, wyposażony w duży zasyp, wysoką sprawność, spełniający wymagania Ekoprojektu.']
    : [...row]
);

// --- Kotłospaw Drewko Plus 24 kW ---
const drewkoPlus_24kW_base = drewkoPlus_12kW_base.map(row =>
  row[0] === '1'
    ? ['1', 'Kocioł na drewno i pellet – Kotłospaw Drewko Hybrid 24 kW', 'szt.', '1', 'Automatyczny kocioł 5 klasy na pellet i drewno, wyposażony w duży zasyp, wysoką sprawność, spełniający wymagania Ekoprojektu.']
    : [...row]
);

// --- Mapping nazw ---
export const kotlospawDrewkoHybridBaseTables = {
    'Kotlospaw drewko hybrid': { // Klucz odpowiadający 'deviceType' dla Kotłospaw Drewko Plus
  '12 kW': drewkoPlus_12kW_base,
  '18 kW': drewkoPlus_18kW_base,
  '24 kW': drewkoPlus_24kW_base,
    }
};
