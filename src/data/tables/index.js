// ścieżka: src/data/tables/index.js

import { mitsubishiBaseTables } from './mitsubishiTables';
import { toshiba1fBaseTables } from './toshiba1fTable';
import { atlanticBaseTables } from './atlanticTables';
import { lazarBaseTables } from './lazarTables';
import { viessmannBaseTables } from './viessmannTables';
import { kotlospawSlimkoPlusBaseTables } from './kotlospawSlimkoPlusTable';
import { kotlospawSlimkoPlusNiskiBaseTables } from './kotlospawSlimkoPlusNiskiTable';
import { qmpellBaseTables } from "./qmpellEvoTables"; 
import { kotlospawDrewkoPlusBaseTables } from "./kotlospawDrewkoPlusTable";
import { kotlospawDrewkoHybridBaseTables } from "./kotlospawDrewkoHybridTable";
import { kaisaiHydroboxBaseTables } from './kaisaiTable';

const allDeviceTables = {
    ...mitsubishiBaseTables, ...atlanticBaseTables, ...lazarBaseTables,
    ...viessmannBaseTables, ...kotlospawSlimkoPlusBaseTables,...kotlospawSlimkoPlusNiskiBaseTables,
    ...qmpellBaseTables, ...kotlospawDrewkoPlusBaseTables, ...kotlospawDrewkoHybridBaseTables,...toshiba1fBaseTables,
    ...kaisaiHydroboxBaseTables,
};

function getTankRowData(tankCapacity) {
  if (!tankCapacity || ['none', 'integrated', 'Brak zasobnika CWU', 'Brak zasobnika CWU / Zintegrowany'].includes(tankCapacity)) {
    return null;
  }
  const tankDescriptions = {
    '140L': { name: 'Zasobnik CWU 140L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 140L.' },
    '200L': { name: 'Zasobnik CWU 200L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 200L wyposażony w wysokiej klasy izolację termiczną.' },
    '300L': { name: 'Zasobnik CWU 300L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 300L wyposażony w wysokiej klasy izolację termiczną.' },
    '400L': { name: 'Zasobnik CWU 400L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 400L wyposażony w wysokiej klasy izolację termiczną' },
    '200 L STAL NIERDZEWNA': { name: 'Zasobnik CWU 200L (Stal Nierdzewna)', description: 'Zasobnik ciepłej wody użytkowej ze stali nierdzewnej o poj. 200L. Charakteryzuje się najwyższą trwałością i odpornością na korozję.' },
    '250 L STAL NIERDZEWNA': { name: 'Zasobnik CWU 250L (Stal Nierdzewna)', description: 'Zasobnik ciepłej wody użytkowej ze stali nierdzewnej o poj. 250L. Gwarancja najwyższej jakości i trwałości.' },
    '300 L STAL NIERDZEWNA': { name: 'Zasobnik CWU 300L (Stal Nierdzewna)', description: 'Zasobnik ciepłej wody użytkowej ze stali nierdzewnej o poj. 300L. Gwarancja najwyższej jakości i trwałości, idealny do nowoczesnych systemów grzewczych.' },
  };
  const data = tankDescriptions[tankCapacity];
  if (!data) return null;
  return [' ', data.name, 'szt.', '1', data.description, 'common'];
}

function getBufferRowData(bufferCapacity) {
  if (!bufferCapacity || bufferCapacity === 'none' || bufferCapacity === 'Brak bufora') {
    return null;
  }
  const bufferDescriptions = {
    'sprzeglo': { name: 'Sprzęgło hydrauliczne z osprzętem', description: 'Kompaktowe sprzęgło hydrauliczne zapewniające separację obiegu źródła ciepła od obiegów grzewczych, stabilizując pracę i ciśnienie w całej instalacji.' },
    'zawor-4d': { name: 'Zawór czterodrożny z siłownikiem', description: 'Zawór mieszający czterodrogowy z siłownikiem, chroni powrót kotła i reguluje temperaturę zasilania instalacji grzewczej.'},
    
    // --- POCZĄTEK ZMIANY: DODAJ TĘ LINIĘ ---
    '40-100L': { name: 'Bufor 40-100 L z osprzętem', description: 'Zbiornik buforowy zwiększający zład wody w instalacji. Optymalizuje pracę pompy ciepła, redukując liczbę jej uruchomień. Komplet z niezbędnym osprzętem.' },
    // --- KONIEC ZMIANY ---

    '40L': { name: 'Bufor 40 L z osprzętem', description: 'Kompaktowy zbiornik buforowy 40L, który zwiększa zład wody w instalacji, optymalizuje pracę pompy ciepła i zapewnia jej dłuższą żywotność. Komplet z niezbędnym osprzętem.' },
    '60L': { name: 'Bufor 60 L z osprzętem', description: 'Zbiornik buforowy 60L, zwiększający zład wody w instalacji. Optymalizuje pracę pompy ciepła, redukując liczbę jej uruchomień. Komplet z niezbędnym osprzętem.' },
    '80L': { name: 'Bufor 80 L z osprzętem', description: 'Zbiornik buforowy 80L, zwiększający zład wody w instalacji. Optymalizuje pracę pompy ciepła, redukując liczbę jej uruchomień. Komplet z niezbędnym osprzętem.' },
    '100L': { name: 'Bufor 100 L z osprzętem', description: 'Zbiornik buforowy 100L, który magazynuje energię cieplną, zwiększa zład wody, optymalizuje pracę źródła ciepła i zapewnia jego dłuższą żywotność. Komplet z niezbędnym osprzętem.' },
    '120L': { name: 'Bufor 120 L z osprzętem', description: 'Zbiornik buforowy 120L, który zwiększa zład wody w instalacji, optymalizuje pracę pompy ciepła/kotła i zapewnia dłuższą żywotność urządzenia. Komplet z niezbędnym osprzętem.' },
    '140L': { name: 'Bufor 140 L z osprzętem', description: 'Zbiornik buforowy 140L, który zwiększa zład wody w instalacji, optymalizuje pracę pompy ciepła/kotła i zapewnia dłuższą żywotność urządzenia. Komplet z niezbędnym osprzętem.' },
    '200L': { name: 'Bufor 200 L z osprzętem', description: 'Zbiornik buforowy 200L, zalecany dla bardziej rozbudowanych instalacji, magazynuje nadmiar ciepła, zapewniając stabilną pracę i oszczędności.' },
    '300L': { name: 'Bufor 300 L z osprzętem', description: 'Zbiornik buforowy 300L do magazynowania nadmiaru ciepła, zapewniając stabilną pracę i oszczędności.'},
  };
  const bufferKey = bufferCapacity.includes('Sprzęgło') ? 'sprzeglo' : bufferCapacity;
  const data = bufferDescriptions[bufferKey];
  if (!data) return null;
  return [' ', data.name, 'szt.', '1', data.description, 'common'];
}
// ścieżka: src/data/tables/index.js

export function getTableData(deviceType, model, tankCapacity, bufferCapacity, systemType) {
  const boilerDeviceTypes = ["LAZAR", "Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "QMPELL", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid"];
  const isBoiler = boilerDeviceTypes.includes(deviceType);
  
  const returnPumpBoilers = ["Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "QMPELL", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid"];

  if (!allDeviceTables[deviceType] || !allDeviceTables[deviceType][model]) {
    console.warn(`Brak danych bazowych dla ${deviceType} i ${model}.`);
    return [];
  }

  let baseTableData = JSON.parse(JSON.stringify(allDeviceTables[deviceType][model]));
  
  if (isBoiler) {
    const showReturnPump = returnPumpBoilers.includes(deviceType) && 
                             bufferCapacity !== 'none' &&              
                             bufferCapacity !== 'zawor-4d';            

    if (!showReturnPump) {
      baseTableData = baseTableData.filter(row => !row[1].includes('Pompa ochrony powrotu'));
    }
  }
  
  let workingTable;

  // --- POCZĄTEK ZMIANY: NOWA LOGIKA DLA TYPÓW UKŁADU ---
  if (isBoiler) {
    const safeSystemType = systemType || 'zamkniety';

    // Logika filtrowania w zależności od typu układu
    if (safeSystemType === 'otwarty' || safeSystemType === 'brak') {
        // Dla "otwarty" i "brak" bierzemy na start wszystkie komponenty otwarte
        workingTable = baseTableData.filter(row => row[5] === 'common' || row[5] === 'otwarty');
    } else {
        // Dla "zamknięty" (i jako domyślny)
        workingTable = baseTableData.filter(row => row[5] === 'common' || row[5] === 'zamkniety');
    }

    // Jeśli wybrano opcję "Brak", dodatkowo usuwamy pozycję z naczyniem wzbiorczym
    if (safeSystemType === 'brak') {
        workingTable = workingTable.filter(row => !row[1].includes('Naczynie wzbiorcze otwarte'));
    }
    // --- KONIEC ZMIANY ---

  } else {
    workingTable = baseTableData;
  }
  
  const tankRow = getTankRowData(tankCapacity);
  const bufferRow = getBufferRowData(bufferCapacity);
  
  let insertIndex = 1;
  if(workingTable.some(row => row[1].includes("Kocioł") || row[1].includes("Pompa ciepła"))) {
    insertIndex = workingTable.findIndex(row => row[1].includes("Kocioł") || row[1].includes("Pompa ciepła")) + 1;
  }
  
  if (tankRow) {
      workingTable.splice(insertIndex, 0, tankRow);
      insertIndex++;
  }
  if (bufferRow) {
    workingTable.splice(insertIndex, 0, bufferRow);
  }

  const finalTable = workingTable.map((row, index) => {
    const newRow = [...row];
    newRow[0] = String(index + 1);
    return newRow;
  });

  return finalTable;
}