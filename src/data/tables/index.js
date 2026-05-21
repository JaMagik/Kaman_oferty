// ścieżka: src/data/tables/index.js

import { mitsubishiBaseTables } from './mitsubishiTables';
import { toshiba1fBaseTables } from './toshiba1fTable';
import { atlanticBaseTables } from './atlanticTables';
import { lazarBaseTables } from './lazarTables';
import { viessmannBaseTables } from './viessmannTables';
import { nibeBaseTables } from './nibeTables';
import { kotlospawSlimkoPlusBaseTables } from './kotlospawSlimkoPlusTable';
import { kotlospawSlimkoPlusNiskiBaseTables } from './kotlospawSlimkoPlusNiskiTable';
import { qmpellBaseTables } from "./qmpellEvoTables"; 
import { kotlospawDrewkoPlusBaseTables } from "./kotlospawDrewkoPlusTable";
import { kotlospawDrewkoHybridBaseTables } from "./kotlospawDrewkoHybridTable";
import { kaisaiHydroboxBaseTables } from './kaisaiTable';
import { opcjeDlaPompCiepla, opcjeDlaKotlow } from './opcjeDodatkowe.js';
import { acModels, acScopeTemplate, acBaseTables } from './acData';
import { panasonicBaseTables } from './panasonicTables';   
import { kotlospawduOKOBaseTables } from './kotlospawDuoko.js';
import { viessmannEasypellBaseTables } from './viessmannEasypellTables.js';

const allDeviceTables = {
    ...mitsubishiBaseTables, ...atlanticBaseTables, ...lazarBaseTables,
    ...viessmannBaseTables, ...nibeBaseTables, ...kotlospawSlimkoPlusBaseTables,...kotlospawSlimkoPlusNiskiBaseTables,
    ...qmpellBaseTables, ...kotlospawDrewkoPlusBaseTables, ...kotlospawDrewkoHybridBaseTables,...toshiba1fBaseTables,
    ...kaisaiHydroboxBaseTables,
    ...acBaseTables,
     ...panasonicBaseTables, 
    ...kotlospawduOKOBaseTables,
    ...viessmannEasypellBaseTables,
};

const replaceLegacyPumpNames = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  return value.replace(/\bIBO\s*PRO\b/gi, 'KAMAN PRO');
};

const sanitizeRow = (row = []) => row.map(replaceLegacyPumpNames);

function getTankRowData(tankCapacity) {
    if (!tankCapacity || ['none', 'integrated', 'Brak zasobnika CWU', 'Brak zasobnika CWU / Zintegrowany'].includes(tankCapacity)) return null;
    const tankDescriptions = {
      '140L': { name: 'Zasobnik CWU 140L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 140L.' },
      '200L': { name: 'Zasobnik CWU 200L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 200L.' },
      '300L': { name: 'Zasobnik CWU 300L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 300L.' },
      '400L': { name: 'Zasobnik CWU 400L', description: 'Emaliowany zasobnik ciepłej wody użytkowej o poj. 400L.' },
      '200 L STAL NIERDZEWNA': { name: 'Zasobnik CWU 200L (Stal Nierdzewna)', description: 'Zasobnik ze stali nierdzewnej o poj. 200L.' },
      '250 L STAL NIERDZEWNA': { name: 'Zasobnik CWU 250L (Stal Nierdzewna)', description: 'Zasobnik ze stali nierdzewnej o poj. 250L.' },
      '300 L STAL NIERDZEWNA': { name: 'Zasobnik CWU 300L (Stal Nierdzewna)', description: 'Zasobnik ze stali nierdzewnej o poj. 300L.' },
    };
    const data = tankDescriptions[tankCapacity];
    if (!data) return null;
    return [' ', data.name, 'szt.', '1', data.description, 'common'];
}
  
function getBufferRowData(bufferCapacity) {
    if (!bufferCapacity || bufferCapacity === 'none' || bufferCapacity === 'Brak bufora') return null;
    const bufferDescriptions = {
      'sprzeglo': { name: 'Sprzęgło hydrauliczne z osprzętem', description: 'Kompaktowe sprzęgło hydrauliczne zapewniające separację obiegu źródła ciepła od obiegów grzewczych.' },
      'zawor-4d': { name: 'Zawór czterodrożny z siłownikiem', description: 'Zawór mieszający czterodrogowy z siłownikiem, chroni powrót kotła i reguluje temperaturę zasilania.'},
      '40-100L': { name: 'Bufor 40-100 L z osprzętem', description: 'Zbiornik buforowy zwiększający zład wody w instalacji.' },
      '40L': { name: 'Bufor 40 L z osprzętem', description: 'Kompaktowy zbiornik buforowy 40L, który zwiększa zład wody w instalacji.' },
      '60L': { name: 'Bufor 60 L z osprzętem', description: 'Zbiornik buforowy 60L, zwiększający zład wody w instalacji.' },
      '80L': { name: 'Bufor 80 L z osprzętem', description: 'Zbiornik buforowy 80L, zwiększający zład wody w instalacji.' },
      '100L': { name: 'Bufor 100 L z osprzętem', description: 'Zbiornik buforowy 100L, który magazynuje energię cieplną.' },
      '120L': { name: 'Bufor 120 L z osprzętem', description: 'Zbiornik buforowy 120L, który zwiększa zład wody w instalacji.' },
      '140L': { name: 'Bufor 140 L z osprzętem', description: 'Zbiornik buforowy 140L, który zwiększa zład wody w instalacji.' },
      '200L': { name: 'Bufor 200 L z osprzętem', description: 'Zbiornik buforowy 200L, zalecany dla bardziej rozbudowanych instalacji.' },
      '300L': { name: 'Bufor 300 L z osprzętem', description: 'Zbiornik buforowy 300L do magazynowania nadmiaru ciepła.'},
      '500L': { name: 'Bufor 500 L z osprzętem', description: 'Zbiornik buforowy 500L do magazynowania nadmiaru ciepła.'},
      '800L': { name: 'Bufor 800 L z osprzętem', description: 'Zbiornik buforowy 800L do magazynowania nadmiaru ciepła.'},
      '1000L': { name: 'Bufor 1000 L z osprzętem', description: 'Zbiornik buforowy 1000L do magazynowania nadmiaru ciepła.' },
    };
    const bufferKey = bufferCapacity.includes('Sprzęgło') ? 'sprzeglo' : bufferCapacity;
    const data = bufferDescriptions[bufferKey];
    if (!data) return null;
    return [' ', data.name, 'szt.', '1', data.description, 'common'];
}

export function getTableData(deviceType, model, tankCapacity, bufferCapacity, systemType, isAc = false, acScopeSelection = null) {
  const acDeviceTypes = Object.keys(acModels);

  if (acDeviceTypes.includes(deviceType)) {
    const modelInfo = acModels[deviceType]?.[model];
    if (!modelInfo) return [];

    const indoorRow = ['1', modelInfo.indoor, 'szt.', '1', 'Ścienna jednostka klimatyzacyjna o wysokiej wydajności, z funkcją filtracji i jonizacji powietrza.',];
    const outdoorRow = ['2', modelInfo.outdoor, 'szt.', '1','Jednostka sprężarkowa inwerterowa przystosowana do pracy całorocznej.', ];

    const resolveAcScope = () => {
      if (!acScopeSelection) return acScopeTemplate;

      // Obsługa tablicy booleanów (true = zostaw, false = usuń)
      if (Array.isArray(acScopeSelection) && acScopeSelection.every((entry) => typeof entry === 'boolean')) {
        if (acScopeSelection.length !== acScopeTemplate.length) {
          return acScopeTemplate;
        }
        return acScopeTemplate.filter((_, index) => acScopeSelection[index]);
      }

      // Obsługa tablicy indeksów (0-based) do pozostawienia
      if (Array.isArray(acScopeSelection) && acScopeSelection.every((entry) => Number.isInteger(entry))) {
        const allowed = new Set(acScopeSelection);
        return acScopeTemplate.filter((_, index) => allowed.has(index));
      }

      // Obsługa struktury obiektu { includedIndexes: [...] }
      if (acScopeSelection?.includedIndexes && Array.isArray(acScopeSelection.includedIndexes)) {
        const allowed = new Set(acScopeSelection.includedIndexes);
        return acScopeTemplate.filter((_, index) => allowed.has(index));
      }

      return acScopeTemplate;
    };

    const filteredScope = resolveAcScope();
    const fullAcScope = [indoorRow, outdoorRow, ...filteredScope];
    
    return fullAcScope.map((row, index) => {
        const newRow = [...row];
        newRow[0] = String(index + 1);
        return newRow;
    });
  }

  // Logika dla pomp ciepła i kotłów
  const boilerDeviceTypes = ["LAZAR SmartFire", "LAZAR DSPELL", "LAZAR PelletFOCUS", "Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "QMPELL", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid", "Kotlospaw duoko", "Viessmann Easypell"];
  const isBoiler = boilerDeviceTypes.includes(deviceType);
  const returnPumpBoilers = ["Kotlospaw Slimko Plus", "Kotlospaw slimko plus niski", "QMPELL", "Kotlospaw drewko plus", "Kotlospaw drewko hybrid", "Kotlospaw duoko", "Viessmann Easypell"];

  if (!allDeviceTables[deviceType] || !allDeviceTables[deviceType][model]) {
    return [];
  }
  let baseTableData = JSON.parse(JSON.stringify(allDeviceTables[deviceType][model]));
  baseTableData = baseTableData.map(sanitizeRow);
  const normalizeName = (value) => {
    if (!value) return '';
    return value.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };
  
  if (isBoiler) {
    const showReturnPump = returnPumpBoilers.includes(deviceType) && bufferCapacity !== 'none' && bufferCapacity !== 'zawor-4d';            
    if (!showReturnPump) {
      baseTableData = baseTableData.filter(row => !normalizeName(row[1]).includes('pompa ochrony powrotu'));
    }
  }
  
let workingTable = isBoiler
    ? baseTableData.filter(row => row[5] === 'common' || row[5] === (systemType || 'zamkniety'))
    : baseTableData;

  const tankRow = getTankRowData(tankCapacity);
  const bufferRow = getBufferRowData(bufferCapacity);
  let insertIndex = 1;
  if (isBoiler) {
    const boilerIndex = workingTable.findIndex(row => normalizeName(row[1]).includes('kociol'));
    if (boilerIndex !== -1) insertIndex = boilerIndex + 1;
  } else { 
    const indoorUnitKeywords = ['modul wewnetrzny', 'hydrobox', 'jednostka wewnetrzna'];
    const indoorUnitIndex = workingTable.findIndex(row => {
      const name = normalizeName(row[1]);
      return indoorUnitKeywords.some(keyword => name.includes(keyword));
    });
    if (indoorUnitIndex !== -1) insertIndex = indoorUnitIndex + 1;
    else {
      const outdoorUnitIndex = workingTable.findIndex(row => normalizeName(row[1]).includes('pompa ciepla'));
      if (outdoorUnitIndex !== -1) insertIndex = outdoorUnitIndex + 1;
    }
  }

  if (tankRow) workingTable.splice(insertIndex++, 0, sanitizeRow(tankRow));
  if (bufferRow) workingTable.splice(insertIndex, 0, sanitizeRow(bufferRow));
  
  return workingTable.map(row => sanitizeRow(row)).map((row, index) => {
    const newRow = [...row];
    if (newRow.length > 0) newRow[0] = String(index + 1);
    return newRow;
  });
}
