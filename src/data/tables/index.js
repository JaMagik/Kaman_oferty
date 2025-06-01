// ścieżka: src/data/tables/index.js

import { mitsubishiBaseTables } from './mitsubishiTables';
import toshiba3FTable from './toshiba-3f'; // Załóżmy, że to na razie pojedyncza tabela
// import { toshiba1FTable } from './toshiba-1f'; // Jeśli masz osobną dla 1F, odkomentuj i stwórz plik
import { atlanticBaseTables } from './atlanticTables';
import { lazarBaseTables } from './lazarTables';
import { viessmannBaseTables } from './viessmannTables'; // Poprawnie zaimportowane

// Funkcje pomocnicze do opisu zasobnika i bufora (bez zmian)
function getTankDescription(tankCapacity) {
  if (!tankCapacity || tankCapacity === 'none' || tankCapacity === 'Brak zasobnika CWU' || tankCapacity === 'Brak zasobnika CWU / Zintegrowany') {
    return 'Brak zasobnika ciepłej wody użytkowej';
  }
  const cleanCapacity = String(tankCapacity).replace('-L', 'L').replace(' STAL NIERDZEWNA', '');
  return `ZASOBNIK CIEPŁEJ WODY UŻYTKOWEJ ${cleanCapacity} ZE STALI NIERDZEWNEJ`;
}

function getBufferDescription(bufferCapacity) {
  if (!bufferCapacity || bufferCapacity === 'none' || bufferCapacity === 'Brak bufora') {
    return 'Brak bufora';
  }
  if (bufferCapacity === 'sprzeglo' || bufferCapacity === 'Sprzęgło hydrauliczne z osprzętem') {
    return 'Sprzęgło hydrauliczne z osprzętem';
  }
  const cleanCapacity = String(bufferCapacity).replace('-L', 'L');
  return `Bufor (sprzęgło hydrauliczne) ${cleanCapacity} + osprzęt`;
}

export function getTableData(deviceType, model, tankCapacity, bufferCapacity) {
  console.log('[getTableData] OTRZYMANO PARAMETRY:', { deviceType, model, tankCapacity, bufferCapacity });

  let baseTableData = [];
  const deviceTypeKey = deviceType;

  // Agregacja wszystkich tabel bazowych
  const allDeviceTables = {
    ...mitsubishiBaseTables,
    ...atlanticBaseTables,
    ...lazarBaseTables,
    ...viessmannBaseTables,
    // Przykładowe opakowanie dla Toshiba, jeśli chcesz ujednolicić dostęp
    // (wymagałoby to zmiany sposobu odwoływania się w formularzu lub tutaj)
    // 'Toshiba 3F': { 'default': toshiba3FTable },
    // 'Toshiba 1F': { 'default': toshiba1FTable }, // Jeśli masz osobną tabelę
  };

  // Pobieranie danych bazowych
  if (allDeviceTables[deviceTypeKey] && allDeviceTables[deviceTypeKey][model]) {
    baseTableData = JSON.parse(JSON.stringify(allDeviceTables[deviceTypeKey][model]));
    console.log(`[getTableData] Dla ${deviceTypeKey} (${model}), ZNALEZIONO tabelę bazową.`);
  } else if (deviceTypeKey === 'Toshiba 3F' || deviceTypeKey === 'Toshiba 1F') {
    // Zachowujemy specjalną obsługę dla Toshiba, jeśli struktura danych nie została zmieniona
    baseTableData = JSON.parse(JSON.stringify(toshiba3FTable));
    console.log(`[getTableData] Dla Toshiba (${deviceTypeKey}), załadowano domyślną toshiba3FTable.`);
  } else {
    console.warn(`[getTableData] Dla ${deviceTypeKey} (${model}), NIE ZNALEZIONO tabeli bazowej. Sprawdź klucze w odpowiednich plikach tabel i w 'allDeviceTables'.`);
  }

  if (!baseTableData || baseTableData.length === 0) {
    console.warn(`[getTableData] Brak danych bazowych dla ${deviceTypeKey} i modelu ${model}. Zwracam pustą tablicę.`);
    return [];
  }

  let finalTable = [...baseTableData.map(row => [...row])]; // Skopiuj bazowe wiersze na start

  // Logika dodawania zasobnika i bufora
  let skipDynamicTank = false;
  if (deviceTypeKey === 'LAZAR' || deviceTypeKey === 'ATLANTIC-M-DUO') {
    skipDynamicTank = true;
  }
  // Dla Viessmann, na podstawie Twojego starego kodu, zasobnik jest dodawany dynamicznie,
  // więc nie ustawiamy skipDynamicTank = true, chyba że specyficzny model Viessmann tego wymaga.

  const shouldAddTankRow = !skipDynamicTank && tankCapacity && tankCapacity !== 'none' && tankCapacity !== 'Brak zasobnika CWU' && tankCapacity !== 'Brak zasobnika CWU / Zintegrowany';
  const shouldAddBufferRow = bufferCapacity && bufferCapacity !== 'none' && bufferCapacity !== 'Brak bufora';

  const tankRowString = getTankDescription(tankCapacity);
  const bufferRowString = getBufferDescription(bufferCapacity);

  const tankRowData = [' ', tankRowString, 'szt.', '1'];
  const bufferRowData = [' ', bufferRowString, 'szt.', (bufferCapacity === 'sprzeglo' ? '1' : '1')];

  // Określenie indeksu, *po którym* wstawić dynamiczne elementy (liczone od 0 dla splice)
  let insertAfterIndex = 0; // Domyślnie po pierwszym elemencie

  if (deviceTypeKey.startsWith('Mitsubishi-') && !deviceTypeKey.includes('AY') && !deviceTypeKey.includes('HR')) {
    insertAfterIndex = 1; // Po drugim elemencie (indeks 1)
  } else if (deviceTypeKey === 'ATLANTIC-M-DUO' || deviceTypeKey === 'LAZAR' || deviceTypeKey === 'VIESSMANN') {
    insertAfterIndex = 0; // Po pierwszym elemencie (indeks 0)
  } else if (deviceTypeKey === 'Toshiba 3F' || deviceTypeKey === 'Toshiba 1F') {
    insertAfterIndex = 1; // Przykładowo, po drugim elemencie (indeks 1), dostosuj
  }

  // Wstawianie dynamicznych wierszy
  // Kolejność wstawiania: najpierw zasobnik, potem bufor, jeśli oba są dodawane po tym samym elemencie
  let itemsInsertedCount = 0;
  if (shouldAddTankRow) {
    // Wstawiamy na pozycji tuż po elemencie o indeksie `insertAfterIndex`
    finalTable.splice(insertAfterIndex + 1, 0, [...tankRowData]);
    itemsInsertedCount++;
    console.log('[getTableData] Dodano wiersz zasobnika CWU.');
  }
  if (shouldAddBufferRow) {
    // Bufor wstawiamy po zasobniku (jeśli był dodany) lub po elemencie `insertAfterIndex`
    finalTable.splice(insertAfterIndex + 1 + itemsInsertedCount, 0, [...bufferRowData]);
    console.log('[getTableData] Dodano wiersz bufora.');
  }

  // Renumeracja całości na końcu, aby zapewnić ciągłość LP
  let currentNumber = 1;
  const renumberedFinalTable = finalTable.map(row => {
    const newRow = [...row];
    // Numeruj tylko wiersze, które mają treść w drugiej kolumnie (nazwa towaru)
    // i nie są to "puste" separatory wprowadzone w danych bazowych
    if (newRow[1] && String(newRow[1]).trim() !== '') {
        // Jeśli pierwszy element jest pusty, spacją, lub już jest numerem (który chcemy nadpisać)
        if (String(newRow[0]).trim() === '' || !isNaN(parseInt(newRow[0]))) {
            newRow[0] = String(currentNumber++);
        }
        // Jeśli newRow[0] to np. litera lub inny tekstowy identyfikator, zachowaj go
    } else {
        // Dla wierszy, które są separatorami (np. [' ', 'ELEMENTY...']) lub całkowicie pustych,
        // zachowaj lub ustaw puste LP
        newRow[0] = ' ';
    }
    return newRow;
  });

  console.log('[getTableData] Finalna tabela przekazana do PDF:', JSON.stringify(renumberedFinalTable, null, 2));
  return renumberedFinalTable;
}