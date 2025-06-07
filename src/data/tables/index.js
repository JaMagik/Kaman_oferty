// ścieżka: src/data/tables/index.js

import { mitsubishiBaseTables } from './mitsubishiTables';
import {toshiba1fBaseTables} from './toshiba1fTable';
import { atlanticBaseTables } from './atlanticTables';
import { lazarBaseTables } from './lazarTables';
import { viessmannBaseTables } from './viessmannTables';
import { kotlospawSlimkoPlusBaseTables } from './kotlospawSlimkoPlusTable';
import { kotlospawSlimkoPlusNiskiBaseTables } from './kotlospawSlimkoPlusNiskiTable';
import { qmpellBaseTables } from "./qmpellEvoTables"; 
import { kotlospawDrewkoPlusBaseTables } from "./kotlospawDrewkoPlusTable"; // <-- POPRAWIONY IMPORT
import { kotlospawDrewkoHybridBaseTables } from "./kotlospawDrewkoHybridTable"; // <-- POPRAWIONY IMPORT






// --- Funkcje generujące wiersze (pozostają bez zmian) ---

function getTankRowData(tankCapacity) {
  if (!tankCapacity || ['none', 'integrated', 'Brak zasobnika CWU', 'Brak zasobnika CWU / Zintegrowany'].includes(tankCapacity)) {
    return null;
  }
  const tankDescriptions = {
    '200L': { name: 'Zasobnik CWU 200L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 200L wyposażony w wysokiej klasy izolację termiczną.' },
    '300L': { name: 'Zasobnik CWU 300L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 300L wyposażony w wysokiej klasy izolację termiczną.' },
    '400L': { name: 'Zasobnik CWU 400L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 400L wyposażony w wysokiej klasy izolację termiczną' },
    '200 L STAL NIERDZEWNA': { name: 'Zasobnik CWU 200L (Stal Nierdzewna)', description: 'Zasobnik ciepłej wody użytkowej ze stali nierdzewnej o poj. 200L. Charakteryzuje się najwyższą trwałością i odpornością na korozję.' },
    '250 L STAL NIERDZEWNA': { name: 'Zasobnik CWU 250L (Stal Nierdzewna)', description: 'Zasobnik ciepłej wody użytkowej ze stali nierdzewnej o poj. 250L. Gwarancja najwyższej jakości i trwałości.' },
    '300 L STAL NIERDZEWNA': { name: 'Zasobnik CWU 300L (Stal Nierdzewna)', description: 'Zasobnik ciepłej wody użytkowej ze stali nierdzewnej o poj. 300L. Gwarancja najwyższej jakości i trwałości, idealny do nowoczesnych systemów grzewczych.' },
  };
  const data = tankDescriptions[tankCapacity];
  if (!data) return null;
  return [' ', data.name, 'szt.', '1', data.description];
}

function getBufferRowData(bufferCapacity) {
  if (!bufferCapacity || bufferCapacity === 'none' || bufferCapacity === 'Brak bufora') {
    return null;
  }
  const bufferDescriptions = {
    'sprzeglo': { name: 'Sprzęgło hydrauliczne z osprzętem', description: 'Kompaktowe sprzęgło hydrauliczne zapewniające separację obiegu źródła ciepła od obiegów grzewczych, stabilizując pracę i ciśnienie w całej instalacji.' },
    '40L': { name: 'Bufor 40 L z osprzętem', description: 'Kompaktowy zbiornik buforowy 40L, który zwiększa zład wody w instalacji, optymalizuje pracę pompy ciepła i zapewnia jej dłuższą żywotność. Komplet z niezbędnym osprzętem.' },
    '60L': { name: 'Bufor 60 L z osprzętem', description: 'Zbiornik buforowy 60L, zwiększający zład wody w instalacji. Optymalizuje pracę pompy ciepła, redukując liczbę jej uruchomień. Komplet z niezbędnym osprzętem.' },
    '80L': { name: 'Bufor 80 L z osprzętem', description: 'Zbiornik buforowy 80L, zwiększający zład wody w instalacji. Optymalizuje pracę pompy ciepła, redukując liczbę jej uruchomień. Komplet z niezbędnym osprzętem.' },
    '100L': { name: 'Bufor 100 L z osprzętem', description: 'Zbiornik buforowy 100L, który magazynuje energię cieplną, zwiększa zład wody, optymalizuje pracę źródła ciepła i zapewnia jego dłuższą żywotność. Komplet z niezbędnym osprzętem.' },
    '120L': { name: 'Bufor 120 L z osprzętem', description: 'Zbiornik buforowy 120L, który zwiększa zład wody w instalacji, optymalizuje pracę pompy ciepła/kotła i zapewnia dłuższą żywotność urządzenia. Komplet z niezbędnym osprzętem.' },
    '140L': { name: 'Bufor 140 L z osprzętem', description: 'Zbiornik buforowy 140L, który zwiększa zład wody w instalacji, optymalizuje pracę pompy ciepła/kotła i zapewnia dłuższą żywotność urządzenia. Komplet z niezbędnym osprzętem.' },
    '200L': { name: 'Bufor 200 L z osprzętem', description: 'Zbiornik buforowy 200L, zalecany dla bardziej rozbudowanych instalacji, magazynuje nadmiar ciepła, zapewniając stabilną pracę i oszczędności.' },
  };
  const bufferKey = bufferCapacity.includes('Sprzęgło') ? 'sprzeglo' : bufferCapacity;
  const data = bufferDescriptions[bufferKey];
  if (!data) return null;
  return [' ', data.name, 'szt.', '1', data.description];
}


export function getTableData(deviceType, model, tankCapacity, bufferCapacity) {
  let baseTableData = [];
  const deviceTypeKey = deviceType;

  const allDeviceTables = {
    ...mitsubishiBaseTables, ...atlanticBaseTables, ...lazarBaseTables,
    ...viessmannBaseTables, ...kotlospawSlimkoPlusBaseTables,...kotlospawSlimkoPlusNiskiBaseTables,
    ...qmpellBaseTables, ...kotlospawDrewkoPlusBaseTables, ...kotlospawDrewkoHybridBaseTables,...toshiba1fBaseTables
  };

  if (allDeviceTables[deviceTypeKey] && allDeviceTables[deviceTypeKey][model]) {
    baseTableData = JSON.parse(JSON.stringify(allDeviceTables[deviceTypeKey][model]));
  } else if (['Toshiba 3F', 'Toshiba 1F'].includes(deviceTypeKey)) {
    baseTableData = JSON.parse(JSON.stringify(toshiba3FTable));
  }
  
  if (!baseTableData || baseTableData.length === 0) {
    console.warn(`Brak danych bazowych dla ${deviceTypeKey} i ${model}.`);
    return [];
  }

  let finalTable = [...baseTableData.map(row => [...row])];

  // --- POPRAWIONA LOGIKA v2 ---

  // 1. Zdecyduj, czy pominąć dynamiczny ZASOBNIK na podstawie typu urządzenia.
  // Urządzenia ze zintegrowanym zasobnikiem lub takie, gdzie zasobnik jest stałym elementem tabeli bazowej.
  let skipDynamicTank = false;
  if (['LAZAR', 'ATLANTIC-M-DUO'].includes(deviceTypeKey)) {
    skipDynamicTank = true;
  }
  
  // 2. Zdecyduj, czy pominąć dynamiczny BUFOR, sprawdzając, czy już istnieje w tabeli bazowej.
  const baseTableHasBuffer = baseTableData.some(row =>
    row[1] && (row[1].toLowerCase().includes('bufor') || row[1].toLowerCase().includes('sprzęgło'))
  );

  // 3. Pobierz dane dla dynamicznych wierszy.
  const tankRowData = getTankRowData(tankCapacity);
  const bufferRowData = getBufferRowData(bufferCapacity);

  // 4. Ustal, czy wstawić wiersze.
  const shouldAddTankRow = !skipDynamicTank && tankRowData;
  const shouldAddBufferRow = !baseTableHasBuffer && bufferRowData;

  // 5. Wstaw wiersze do tabeli
  let insertAfterIndex = 0;
  if (deviceTypeKey.startsWith('Mitsubishi-') && !deviceTypeKey.includes('AY') && !deviceTypeKey.includes('HR')) {
    insertAfterIndex = 1;
  } else if (['ATLANTIC-M-DUO', 'LAZAR','Toshiba 1F', 'VIESSMANN', 'Kotlospaw Slimko Plus', 'Kotlospaw Slimko Plus Niski', 'QMPELL', 'Kotlospaw Drewko Plus', 'Kotlospaw Drewko Hybrid',].includes(deviceTypeKey)) {
    insertAfterIndex = 0;
  } else if (['Toshiba 3F', 'Toshiba 1F'].includes(deviceTypeKey)) {
    insertAfterIndex = 1;
  }

  let itemsInsertedCount = 0;
  if (shouldAddTankRow) {
    finalTable.splice(insertAfterIndex + 1, 0, tankRowData);
    itemsInsertedCount++;
  }
  if (shouldAddBufferRow) {
    finalTable.splice(insertAfterIndex + 1 + itemsInsertedCount, 0, bufferRowData);
  }

  // Renumeracja
  let currentNumber = 1;
  const renumberedFinalTable = finalTable.map(row => {
    const newRow = [...row];
    if (newRow[1] && String(newRow[1]).trim() !== '') {
        if (String(newRow[0]).trim() === '' || !isNaN(parseInt(newRow[0]))) {
            newRow[0] = String(currentNumber++);
        }
    } else {
        newRow[0] = ' ';
    }
    return newRow;
  });

  return renumberedFinalTable;
}